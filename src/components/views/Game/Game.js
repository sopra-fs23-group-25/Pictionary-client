import { websocket_topics } from "components/socket/Socket";
import Socket from "components/socket/Socket";

import DrawingBoard, { drawOnBoard } from "./DrawingBoard";
import PaintToolbar from "./PaintToolBar";
import logo from "images/pictionary_logo.png";
import "styles/views/Game/Game.scss";

import { api } from "helpers/api";
import { createGame, fetchGame } from "helpers/gameAPI";
import { fetchTurn, updateTurn } from "helpers/turnAPI";
import {
  sendGameStateMessage,
  sendCloseLobbyMessage,
  sendLeaveGameMessage,
} from "components/socket/socketAPI";

import { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PlayerRanking from "./PlayerRanking";
import CountDownTimer from "./CountDownTimer";
import BeforeGameStart from "./BeforeGameStart";
import EndOfGame from "./EndOfGame";
import EndOfTurn from "./EndOfTurnResults";
import LobbyClosedComponent from "./LobbyClosedComponent";
import { useTranslation } from "react-i18next";
import "locales/index";

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
  const { t } = useTranslation();

  //Lobby-Information
  const userId = sessionStorage.getItem("userId");
  const [lobbyId, setLobbyId] = useState(1);
  const [players, setPlayers] = useState([]);
  const [nrOfRounds, setNrOfRounds] = useState(null);
  const [timePerRound, setTimePerRound] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);

  const [roundResult, setRoundResult] = useState([]);
  const [word, setWord] = useState("");

  //Game Logic - Timer
  const [gameState, setGameState] = useState("before game");

  useEffect(() => {
    // this information was passed while creating/joining lobby
    const isHost = location?.state?.isHost || false;
    const lobbyId = location?.state?.lobbyId || 1;
    setLobbyId(lobbyId);
    setIsHost(isHost);

    async function fetchLobbyInformation() {
      try {
        console.log(lobbyId);
        const response = await api.get(`/lobbies/${lobbyId}`);
        setTimePerRound(response.data.timePerRound);
        setNrOfRounds(response.data.nrOfRounds);
        setPlayers(response.data.players);
      } catch (error) {
        alert(`Could not fetch Lobby`);
        history.push("/lobbies");
      }
    }

    fetchLobbyInformation();
  }, [props, location, history]);

  // ClearCanvas
  function clearCanvas() {
    setColor("black");
    setLineWidth(5);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

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
      setGameState(msg.task);
    } else if (topic === websocket_topics(lobbyId).host_disconnected) {
      console.log("host disconnected");
      setDisconnectedType(DisconnectionType.HOST_DISCONNECTED);
    }
  };

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
    await createGame(lobbyId);
    sendGameStateMessage(clientRef, lobbyId, "start game");
  }

  const startGame = async () => {
    timerRef.current.startGame(10);

    const gameResponse = await fetchGame(lobbyId);

    setPlayers(gameResponse.data.players);
    setCurrentRound(gameResponse.data.currentRound);
  };

  async function startRound() {
    timerRef.current.startRound(timePerRound);

    if (isPainter) {
      const response = await fetchTurn(lobbyId); // to get word
      setCurrentWord(response.data.word);
    }
    setGuessSubmitted(false);
    setCurrentGuess("");
  }

  async function endRound() {
    timerRef.current.endRound(10);

    const turnResponse = await fetchTurn(lobbyId); // to get Result
    const gameResponse = await fetchGame(lobbyId); // to get new Roles

    setRoundResult(turnResponse.data.guesses.sort((a, b) => b.score - a.score));
    setPlayers(gameResponse.data.players.sort((a, b) => b.score - a.score));
    setCurrentRound(gameResponse.data.currentRound);
    setWord(turnResponse.data.word);
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
      sendCloseLobbyMessage(clientRef, lobbyId);
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
      sendLeaveGameMessage(clientRef, lobbyId);
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
      disconnectedType={(disconnectedType, t)}
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
                    t={t}
                    selectedColor={color}
                    setColor={setColor}
                    lineWidth={lineWidth}
                    setLineWidth={setLineWidth}
                    clientRef={clientRef}
                    lobbyId={lobbyId}
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
                    return t("gamePage.drawingBoardHeader.waitingRoom");
                  case "start game":
                    return t("gamePage.drawingBoardHeader.getReady");
                  case "end round":
                    return t("gamePage.drawingBoardHeader.roundResult");
                  case "end last round":
                    return t("gamePage.drawingBoardHeader.roundResult");
                  default:
                    return t("gamePage.drawingBoardHeader.drawingBoard");
                }
              })()}
            </div>
            <div className="board header-container sub-container3">
              <div className="clock-container">
                {gameState !== "before game" ? (
                  <CountDownTimer
                    gameState={gameState}
                    isHost={isHost}
                    clientRef={clientRef}
                    lobbyId={lobbyId}
                    ref={timerRef}
                  ></CountDownTimer>
                ) : null}
              </div>
              <div className="rounds-container">
                {t("gamePage.drawingBoardHeader.round")} {currentRound}/
                {nrOfRounds}
              </div>
            </div>
          </div>
          {(() => {
            switch (gameState) {
              case "start game":
                return (
                  <BeforeGameStart
                    t={t}
                    timePerRound={timePerRound}
                    nrOfRounds={nrOfRounds}
                    players={players}
                  ></BeforeGameStart>
                );
              case "end round":
                return (
                  <EndOfTurn
                    t={t}
                    roundResult={roundResult}
                    players={players}
                    currentRound={currentRound}
                    word={word}
                  ></EndOfTurn>
                );
              case "end last round":
                return (
                  <EndOfTurn
                    t={t}
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
                    clientRef={clientRef}
                    lobbyId={lobbyId}
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
                {t("gamePage.buttons.startGame")}
              </button>
              <button
                className="start-game-button"
                onClick={handleClickCloseLobby}
              >
                {t("gamePage.buttons.closeLobby")}
              </button>
            </div>
          ) : null}
          {!isHost && gameState === "before game" ? (
            <div className="host-button-container">
              <button
                className="start-game-button"
                onClick={handleClickLeaveLobby}
              >
                {t("gamePage.buttons.leaveLobby")}
              </button>
            </div>
          ) : null}
          <img className="logo" src={logo} alt="Pictionary Logo"></img>
        </div>
        {gameState === "start round" ? (
          <div className="game small-container sub-container2">
            {isPainter ? (
              <WordToDrawContainer
                t={t}
                currentWord={currentWord}
              ></WordToDrawContainer>
            ) : (
              <GuessingContainer
                t={t}
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
          <PlayerRanking t={t} players={players}></PlayerRanking>
        </div>
      </div>
      <Socket
        clientRef={clientRef}
        lobbyId={lobbyId}
        userId={userId}
        topics={Object.values(websocket_topics(lobbyId))}
        onMessage={onMessage}
      />
    </div>
  ) : (
    <EndOfGame t={t} players={players}></EndOfGame>
  );
};

export default GameView;

const WordToDrawContainer = ({ currentWord, t }) => {
  return (
    <div className="guessing-container">
      <h1>{t("gamePage.guessingContainer.wordToPaint")} </h1>
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
  t,
}) => {
  async function submitGuess() {
    const userId = sessionStorage.getItem("userId");
    const guess = currentGuess;
    const requestBody = JSON.stringify({ userId: userId, guess: guess });
    try {
      await updateTurn(lobbyId, requestBody);
    } catch (error) {
      console.log(error);
    }
    setGuessSubmitted(true);
  }

  return (
    <div className="guessing-container">
      <h1>
        {!guessSubmitted
          ? t("gamePage.guessingContainer.typeInGuess")
          : t("gamePage.guessingContainer.submittedGuess")}
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
            {t("gamePage.guessingContainer.submit")}
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
