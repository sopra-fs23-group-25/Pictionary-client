import {
  websocket_endpoints,
  websocket_topics,
} from "components/socket/Socket";
import Socket from "components/socket/Socket";

import DrawingBoard, { drawOnBoard } from "./DrawingBoard";
import PaintToolbar from "./PaintToolBar";
import logo from "images/pictionary_logo.png";
import "styles/views/Game/Game.scss";
import { api } from "helpers/api";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlayerRanking from "./PlayerRanking";
import CountDownTimer from "./CountDownTimer";

const GameView = (props) => {
  //Refs
  const canvasRef = useRef(null);
  const clientRef = useRef(null);
  const timerRef = useRef(null);

  //Drawing Board
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  //Roles
  const [isPainter, setIsPainter] = useState(true);
  const [isHost, setIsHost] = useState(false);

  const location = useLocation();

  //Lobby-Information
  const [lobbyId, setLobbyId] = useState(1);
  const [players, setPlayers] = useState(
    [
      { name: "Player 2", score: 90, role: "guesser" },
      { name: "Player 1", score: 100, role: "guesser" },
      { name: "Player 3", score: 80, role: "painter" },
      { name: "Player 4", score: 70, role: "guesser" },
    ].sort((a, b) => b.score - a.score)
  );
  const [nrOfRounds, setNrOfRounds] = useState(null);
  const [timePerRound, setTimePerRound] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);

  useEffect(() => {
    // this information was passed while creating/joining lobby
    const isHost = location?.state?.isHost || false;
    const lobbyId = location?.state?.lobbyId || 1;
    console.log("HOST: ", isHost);
    setLobbyId(lobbyId);
    setIsHost(isHost);
  }, [props, location]);

  useEffect(() => {
    async function fetchLobbyInformation() {
      try {
        const response = await api.get(`/lobbies/${lobbyId}`);
        setTimePerRound(response.data.timePerRound);
        setNrOfRounds(response.data.nrOfRounds);
        setPlayers(response.data.players);
      } catch (error) {
        alert(`Could not fetch Lobby`);
      }
    }

    fetchLobbyInformation();
  }, [lobbyId]);

  // get players from Server and Sort
  const players_mock = [
    { name: "Player 2", score: 90, role: "guesser" },
    { name: "Player 1", score: 100, role: "guesser" },
    { name: "Player 3", score: 80, role: "painter" },
    { name: "Player 4", score: 70, role: "guesser" },
  ].sort((a, b) => b.score - a.score);

  //Game Logic - Timer
  const [isEndOfRound, setIsEndOfRound] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  // const [isGameOver, setIsGameOver] = useState(false);
  const [round, setRound] = useState(0);

  // Information Needed on render page:
  // lobbysettings(time, rounds, ), lobbyId, userId,

  const userId = sessionStorage.getItem("userId");
  // const timePerRound = 5;

  //setting Default Values on Render
  useEffect(() => {
    setGameOver(false);
    setRound(0);
    setIsEndOfRound(true);
    setIsPainter(true);
    console.log("default value");
  }, []);

  // ClearCanvas
  function clearCanvas() {
    setColor("black");
    setLineWidth(5);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  // WebSocket functions - TODO: refactor and extract

  /*
  const sendStartGameMessage = () => {
    const requestBody = JSON.stringify({ task: "start game" });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).start_game,
      requestBody
    );
  };

  */

  const sendDrawingMessage = (x1, y1, x2, y2, color, lineWidth) => {
    const requestBody = JSON.stringify({
      prevX: x1,
      prevY: y1,
      currX: x2,
      currY: y2,
      color: color,
      lineWidth: lineWidth,
    });
    console.log(requestBody, websocket_endpoints(lobbyId).drawing_all);
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).drawing_all,
      requestBody
    );
  };

  const sendClearMessage = () => {
    const requestBody = JSON.stringify({ task: "clear drawing board" });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).drawing_clear,
      requestBody
    );
  };

  const sendJoinGameMessage = () => {
    const requestBody = JSON.stringify({ task: "joined Game" });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).user_join,
      requestBody
    );
  };

  // handle websocket (incoming) messages
  const onMessage = (msg, topic) => {
    if (topic === websocket_topics(lobbyId).drawing) {
      drawOnBoard(
        canvasRef,
        msg.prevX,
        msg.prevY,
        msg.currX,
        msg.currY,
        msg.color,
        msg.lineWidth
      );
      console.log("received changes on drawing", msg);
    } else if (topic === websocket_topics(lobbyId).clear) {
      clearCanvas(canvasRef.current);
    } else if (topic === websocket_topics(lobbyId).users) {
      console.log(msg);
    } else if (topic === websocket_topics(lobbyId).start) {
      //startGame();
      console.log(msg);
    } else if (topic === websocket_topics(lobbyId).game_state) {
      if (msg === "start game") {
        startGame();
      } else if (msg === "start round") {
        startRound();
      } else if (msg === "end round") {
        endRound();
      } else if (msg === "end game") {
        endGame();
      }
    }
  };

  async function createGame() {
    await api.post(`/lobbies/${lobbyId}/game`);
  }

  async function fetchGame() {
    const response = await api.get(`/lobbies/${lobbyId}/game`);
    return response;
  }

  async function updateGame() {
    const response = await api.put(`/lobbies/${lobbyId}/game`);
    return response;
  }

  async function deleteTurn() {
    await api.delete(`/lobbies/${lobbyId}/game/turn`);
  }

  async function createTurn() {
    await api.post(`/lobbies/${lobbyId}/game/turn`);
  }

  async function fetchTurn() {
    const response = await api.get(`/lobbies/${lobbyId}/game/turn`);
    return response;
  }

  function configurePainter() {
    const userId = sessionStorage.get("userId");
    if (players.find((x) => x.userId === userId).role === "PAINTER") {
      setIsPainter(true);
    } else {
      setIsPainter(false);
    }
  }

  //Game Logic - Sequence - Timer
  function handleClickStartGame() {
    // POST game
    createGame();
    //send start game over WS
    sendGameStateMessage("start game");
    // sendGameStateMessage("start game");
    //set started: true -> to hide button for host
    // timerRef.current.endRound();
  }

  async function startGame() {
    // show startGame Component
    setIsEndOfRound(true);
    timerRef.current.startGame();
    // GET Roles
    const response = await fetchGame();
    setPlayers(response.data.players);
    configurePainter();
    // setPlayers & setIsPainter
    // update is Painter
  }

  function startRound() {
    // isEndOfRound: false
    setIsEndOfRound(false);
    timerRef.current.startRound();
    // show Drawing Board
  }

  async function endRound() {
    // isEndOfRound: true
    setIsEndOfRound(true);
    timerRef.current.endRound();
    // show Round Result
    // GET ROUND RESULT (roles, word)
    const turnResponse = await fetchTurn();

    const gameResponse = await fetchGame();
    setPlayers(gameResponse.data.players);
    configurePainter();
    // setWord, setPlayers
    // isPainter check
  }

  function endGame() {
    // render End Of Game
  }

  //Websocket Sending Message
  const sendGameStateMessage = (message) => {
    const requestBody = JSON.stringify({ task: message });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).game_state,
      requestBody
    );
  };

  return (
    <div className="game">
      <div className="game big-container">
        <div className="board container">
          <div className="board header-container">
            <div className="board header-container sub-container1">
              {isPainter ? (
                <PaintToolbar
                  selectedColor={color}
                  setColor={setColor}
                  lineWidth={lineWidth}
                  setLineWidth={setLineWidth}
                  sendClearMessage={sendClearMessage}
                ></PaintToolbar>
              ) : null}
            </div>
            <div className="board header-container sub-container2">
              Drawing Board
            </div>
            <div className="board header-container sub-container3">
              <div className="clock-container">
                <CountDownTimer
                  isEndOfRound={isEndOfRound}
                  gameOver={gameOver}
                  isHost={isHost}
                  sendGameStateMessage={sendGameStateMessage}
                  updateGame={updateGame}
                  deleteTurn={deleteTurn}
                  createTurn={createTurn}
                  ref={timerRef}
                ></CountDownTimer>
              </div>
              <div className="rounds-container">
                Round {round}/{nrOfRounds}
                {isEndOfRound ? " Round Result" : " Drawing"}
              </div>
            </div>
          </div>
          <DrawingBoard
            color={color}
            lineWidth={lineWidth}
            ref={canvasRef}
            isPainter={isPainter}
            sendDrawingMessage={sendDrawingMessage}
          ></DrawingBoard>
        </div>
      </div>

      <div className="game small-container">
        <div className="game small-container sub-container1">
          {/*CHECK IF AT LEAST 2 PLAYERS IN LOBBY*/}
          {!isHost ? (
            <button onClick={handleClickStartGame}>Start Game</button>
          ) : null}
          <img className="logo" src={logo} alt="Pictionary Logo"></img>
        </div>
        <div className="game small-container sub-container2">
          {isPainter ? (
            <WordToDrawContainer></WordToDrawContainer>
          ) : (
            <GuessingContainer></GuessingContainer>
          )}
        </div>
        <div className="game small-container sub-container3">
          <PlayerRanking players={players}></PlayerRanking>
        </div>
      </div>
      <Socket
        clientRef={clientRef}
        lobbyId={lobbyId}
        userId={userId}
        sendJoinGameMessage={sendJoinGameMessage}
        topics={Object.values(websocket_topics(lobbyId))}
        onMessage={onMessage}
      />
    </div>
  );
};

export default GameView;

const WordToDrawContainer = () => {
  return (
    <div className="guessing-container">
      <h1>Word to paint</h1>
      <div className="guessing-container word">duck</div>
    </div>
  );
};

const GuessingContainer = () => {
  return (
    <div className="guessing-container">
      <h1>Type in your guess</h1>
      <div className="word-input-container">
        <input className="word-input"></input>
        <button className="word-input-button">Submit</button>
      </div>
    </div>
  );
};
