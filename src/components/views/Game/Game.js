import {
  websocket_endpoints,
  websocket_topics,
} from "components/socket/Socket";
import Socket from "components/socket/Socket";

import DrawingBoard, { drawOnBoard } from "./DrawingBoard";
import PaintToolbar from "./PaintToolBar";
import logo from "images/pictionary_logo.png";
import "styles/views/Game/Game.scss";
import { api, apiWithUserId } from "helpers/api";
import { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PlayerRanking from "./PlayerRanking";
import CountDownTimer from "./CountDownTimer";
import BeforeGameStart from "./BeforeGameStart";
import EndOfGame from "./EndOfGame";
import EndOfTurn from "./EndOfTurnResults";
import LobbyClosedComponent from "./LobbyClosedComponent";

const GameView = (props) => {
  //Refs
  const canvasRef = useRef(null); //reference of Drawing Canvas
  const clientRef = useRef(null); //reference of Socket Client
  const timerRef = useRef(null); // reference of CountDown Timer

  //Drawing Board
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  //Word
  const [currentWord, setCurrentWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessSubmitted, setGuessSubmitted] = useState(false);

  //Roles
  const [isPainter, setIsPainter] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [disconnectedType, setDisconnectedType] = useState(null);

  const location = useLocation();
  const history = useHistory();

  //Lobby-Information
  const userId = sessionStorage.getItem("userId");
  const [lobbyId, setLobbyId] = useState(1);
  const [players, setPlayers] = useState([]);
  const [nrOfRounds, setNrOfRounds] = useState(null);
  const [timePerRound, setTimePerRound] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);

  const [roundResult, setRoundResult] = useState([]);
  const [word, setWord] = useState("");

  useEffect(() => {
    // this information was passed while creating/joining lobby
    const isHost = location?.state?.isHost || false;
    const lobbyId = location?.state?.lobbyId || 1;
    console.log("HOST: ", isHost);
    setLobbyId(lobbyId);
    setIsHost(isHost);

    async function fetchLobbyInformation() {
      try {
        const response = await api.get(`/lobbies/${lobbyId}`);
        console.log(response);
        setTimePerRound(response.data.timePerRound);
        setNrOfRounds(response.data.nrOfRounds);
        setPlayers(response.data.players);
      } catch (error) {
        alert(`Could not fetch Lobby`);
      }
    }

    fetchLobbyInformation();
  }, [props, location]);

  //Game Logic - Timer
  const [gameState, setGameState] = useState("before game");

  // Information Needed on render page:
  //setting Default Values on Render
  useEffect(() => {
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
      websocket_endpoints(lobbyId).users,
      requestBody
    );
  };

  const sendLeaveGameMessage = () => {
    const requestBody = JSON.stringify({ task: "left Game" });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).users,
      requestBody
    );
  };

  const sendCloseLobbyMessage = () => {
    const requestBody = JSON.stringify({ task: "lobby closed" });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).lobby_closed,
      requestBody
    );
  };

  const sendGameStateMessage = (message) => {
    const requestBody = JSON.stringify({ task: message });
    clientRef.current.sendMessage(
      websocket_endpoints(lobbyId).game_state,
      requestBody
    );
  };

  // handle websocket (incoming) messages
  const onMessage = (msg, topic) => {
    console.log(msg);
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
      console.log("users updated", msg);
      setPlayers(msg);
    } else if (topic === websocket_topics(lobbyId).start) {
      //startGame();
      console.log(msg);
    } else if (topic === websocket_topics(lobbyId).lobby_closed) {
      console.log("lobby closed from host");
      setDisconnectedType(DisconnectionType.HOST_CLOSED_LOBBY);
    } else if (topic === websocket_topics(lobbyId).game_state) {
      if (msg.task === "start game") {
        setGameState(msg.task);
      } else if (msg.task === "start round") {
        setGameState(msg.task);
      } else if (msg.task === "end round") {
        setGameState(msg.task);
      } else if (msg.task === "end last round") {
        setGameState(msg.task);
      } else if (msg.task === "end game") {
        setGameState(msg.task);
      }
    } else if (topic === websocket_topics(lobbyId).host_disconnected) {
      console.log("host disconnected");
      setDisconnectedType(DisconnectionType.HOST_DISCONNECTED);
    }
  };

  async function createGame() {
    const response = await api.post(`/lobbies/${lobbyId}/game`);
    return response;
  }

  async function fetchGame() {
    const response = await api.get(`/lobbies/${lobbyId}/game`);
    return response;
  }

  async function updateGame() {
    await api.put(`/lobbies/${lobbyId}/game`);
  }

  async function deleteTurn() {
    await api.delete(`/lobbies/${lobbyId}/game/turn`);
  }

  async function createTurn() {
    const response = await api.post(`/lobbies/${lobbyId}/game/turn`);
    return response;
  }

  async function fetchTurn() {
    const userId = sessionStorage.getItem("userId");

    const response = await apiWithUserId(userId).get(
      `/lobbies/${lobbyId}/game/turn`
    );
    return response;
  }

  function configurePainter() {
    const userId = parseInt(sessionStorage.getItem("userId"));
    if (
      players.find((user) => user.currentRole === "PAINTER").userId === userId
    ) {
      console.log("set painter to true");
      setIsPainter(true);
    } else {
      console.log("set painter to false");
      setIsPainter(false);
    }
  }

  useEffect(() => {
    console.log(gameState);
    if (gameState === "start game") {
      startGame();
    } else if (gameState === "start round") {
      startRound();
    } else if (gameState === "end round") {
      endRound();
    } else if (gameState === "end last round") {
      endRound();
    } else if (gameState === "end game") {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState /* intentionally excluding startGame, startRound, endRound */]);
  // these functions will never change

  useEffect(() => {
    console.log(gameState);
    if (players.length > 0 && gameState !== "before game") {
      configurePainter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  //Game Logic - Sequence - Timer
  async function handleClickStartGame() {
    // POST game
    await createGame();
    //send start game over WS
    sendGameStateMessage("start game");
    //set started: true -> to hide button for host
    // timerRef.current.endRound();
  }

  const startGame = async () => {
    // show startGame Component
    timerRef.current.startGame(10);
    //timerRef.current.startGame(5);
    // GET Roles
    const gameResponse = await fetchGame();
    console.log("fetch game", gameResponse);
    setPlayers(gameResponse.data.players);
    setCurrentRound(gameResponse.data.currentRound);
    //configurePainter();
    // setPlayers & setIsPainter
    // update is Painter
  };

  async function startRound() {
    timerRef.current.startRound(timePerRound);
    //  timerRef.current.startRound(5);
    if (isPainter) {
      const response = await fetchTurn(); // to get word
      console.log("turn response", response);
      setCurrentWord(response.data.word);
    }
    setGuessSubmitted(false);
    setCurrentGuess("");
    // show Drawing Board
  }

  async function endRound() {
    // isEndOfRound: true
    //setIsEndOfRound(true);
    timerRef.current.endRound(10);
    //  timerRef.current.endRound(30);
    // show Round Result
    // GET ROUND RESULT (roles, word)
    const turnResponse = await fetchTurn(); // to get Result
    const gameResponse = await fetchGame(); // to get new Roles
    console.log("turn response:", turnResponse);
    console.log("game response:", gameResponse);
    //setRoundResult(turnResponse.data);
    setRoundResult(turnResponse.data.guesses.sort((a, b) => b.score - a.score));
    setPlayers(gameResponse.data.players.sort((a, b) => b.score - a.score));
    setCurrentRound(gameResponse.data.currentRound);
    setWord(turnResponse.data.word);
    //.sort((a, b) => b.score - a.score);
    //configurePainter();
    // setWord, setPlayers
    // isPainter check
  }

  function endGame() {
    // render End Of Game
  }

  function enoughPlayersInLobby() {
    return players.length >= 2;
  }

  async function handleClickCloseLobby() {
    //DELETE LOBBY
    try {
      await api.delete(`/lobbies/${lobbyId}`);

      // sendOverWebsocket to all players that lobby closed
      console.log("close lobby");
      sendCloseLobbyMessage();
    } catch (error) {
      alert("could not delete lobby");
    }
  }

  async function handleClickLeaveLobby() {
    try {
      // REMOVE PLAYER FROM LOBBY
      const userId = sessionStorage.getItem("userId");
      const requestBody = JSON.stringify({ userId: userId });
      await api.put(`/lobbies/${lobbyId}/leave`, requestBody);

      // sendOverWebsocket to all players that user left lobby
      sendLeaveGameMessage();
    } catch (error) {
      alert("could not leave lobby");
    }
    history.push("/lobbies");
  }

  useEffect(() => {
    // Wait for 2.5 seconds before redirecting to the overview page
    if (disconnectedType) {
      const timer = setTimeout(() => {
        history.push("/lobbies");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [disconnectedType, history]);

  return disconnectedType ? (
    <LobbyClosedComponent
      disconnectedType={disconnectedType}
    ></LobbyClosedComponent>
  ) : gameState !== "end game" ? (
    <div className="game">
      <div className="game big-container">
        <div className="board container">
          <div className="board header-container">
            {gameState === "start round" || gameState === "before game" ? (
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
            ) : (
              <div className="board header-container sub-container1" />
            )}
            <div className="board header-container sub-container2">
              {(() => {
                switch (gameState) {
                  case "before game":
                    return "Waiting Room";
                  case "start game":
                    return "GET READY";
                  case "end round":
                    return "Round Result";
                  case "end last round":
                    return "Round Result";
                  default:
                    return "Drawing Board";
                }
              })()}
            </div>
            <div className="board header-container sub-container3">
              <div className="clock-container">
                {gameState !== "before game" ? (
                  <CountDownTimer
                    gameState={gameState}
                    isHost={isHost}
                    sendGameStateMessage={sendGameStateMessage}
                    fetchGame={fetchGame}
                    updateGame={updateGame}
                    deleteTurn={deleteTurn}
                    createTurn={createTurn}
                    ref={timerRef}
                  ></CountDownTimer>
                ) : null}
              </div>
              <div className="rounds-container">
                Round {currentRound}/{nrOfRounds}
              </div>
            </div>
          </div>
          {(() => {
            switch (gameState) {
              case "start game":
                return (
                  <BeforeGameStart
                    timePerRound={timePerRound}
                    nrOfRounds={nrOfRounds}
                    players={players}
                  ></BeforeGameStart>
                );
              case "end round":
                return (
                  <EndOfTurn
                    roundResult={roundResult}
                    players={players}
                    currentRound={currentRound}
                    word={word}
                  ></EndOfTurn>
                );
              case "end last round":
                return (
                  <EndOfTurn
                    roundResult={roundResult}
                    players={players}
                    currentRound={currentRound}
                    word={word}
                  ></EndOfTurn>
                );
              default:
                return (
                  <DrawingBoard
                    color={color}
                    lineWidth={lineWidth}
                    ref={canvasRef}
                    isPainter={isPainter}
                    sendDrawingMessage={sendDrawingMessage}
                  ></DrawingBoard>
                );
            }
          })()}
        </div>
      </div>

      <div className="game small-container">
        <div className="game small-container sub-container1">
          {/*CHECK IF AT LEAST 2 PLAYERS IN LOBBY*/}
          {isHost && gameState === "before game" ? (
            <div className="host-button-container">
              <button
                disabled={!enoughPlayersInLobby()}
                className="start-game-button"
                onClick={handleClickStartGame}
              >
                Start Game
              </button>
              <button
                className="start-game-button"
                onClick={handleClickCloseLobby}
              >
                Close Lobby
              </button>
            </div>
          ) : null}
          {!isHost && gameState === "before game" ? (
            <div className="host-button-container">
              <button
                className="start-game-button"
                onClick={handleClickLeaveLobby}
              >
                Leave Lobby
              </button>
            </div>
          ) : null}
          <img className="logo" src={logo} alt="Pictionary Logo"></img>
        </div>
        {gameState === "start round" ? (
          <div className="game small-container sub-container2">
            {isPainter ? (
              <WordToDrawContainer
                currentWord={currentWord}
              ></WordToDrawContainer>
            ) : (
              <GuessingContainer
                currentGuess={currentGuess}
                setCurrentGuess={setCurrentGuess}
                guessSubmitted={guessSubmitted}
                setGuessSubmitted={setGuessSubmitted}
                lobbyId={lobbyId}
              ></GuessingContainer>
            )}
          </div>
        ) : (
          <div className="game small-container sub-container2" />
        )}
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
  ) : (
    <EndOfGame players={players}></EndOfGame>
  );
};

export default GameView;

const WordToDrawContainer = ({ currentWord }) => {
  return (
    <div className="guessing-container">
      <h1>Word to paint</h1>
      <div className="guessing-container word">{currentWord}</div>
    </div>
  );
};

const GuessingContainer = ({
  currentGuess,
  setCurrentGuess,
  guessSubmitted,
  setGuessSubmitted,
  lobbyId,
}) => {
  async function submitGuess() {
    console.log("submit guess", currentGuess);
    const userId = sessionStorage.getItem("userId");
    const guess = currentGuess;
    const requestBody = JSON.stringify({ userId: userId, guess: guess });
    try {
      //console.log(us)
      console.log(requestBody);
      await api.put(`/lobbies/${lobbyId}/game/turn`, requestBody);
      console.log("here");
    } catch (error) {
      console.log(error);
    }
    setGuessSubmitted(true);
  }

  return (
    <div className="guessing-container">
      <h1>
        {!guessSubmitted ? "Type in your guess " : "Your submitted guess"}
      </h1>
      <div className="word-input-container">
        <input
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          disabled={guessSubmitted}
          className="word-input"
        ></input>
        {!guessSubmitted ? (
          <button
            disabled={!currentGuess || guessSubmitted}
            onClick={() => submitGuess()}
            className="word-input-button"
          >
            Submit
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const DisconnectionType = {
  HOST_DISCONNECTED: "host-disconnected",
  HOST_CLOSED_LOBBY: "host-closed-lobby",
};
