import { websocket_topics } from "components/socket/Socket";
import Socket from "components/socket/Socket";

import DrawingBoard, { drawOnBoard } from "./DrawingBoard";
import PaintToolbar from "./PaintToolBar";
import logo from "images/pictionary_logo.png";
import "styles/views/Game/Game.scss";

import { api } from "helpers/api";
import { createGame, fetchGame, updateGame } from "helpers/gameAPI";
import { fetchTurn, updateTurn } from "helpers/turnAPI";
import {
  sendGameStateMessage,
  sendCloseLobbyMessage,
  sendLeaveGameMessage,
} from "components/socket/socketAPI";

import { useState, useRef, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import PlayerRanking from "./PlayerRanking";
import CountDownTimer from "./CountDownTimer";
import BeforeGameStart from "./BeforeGameStart";
import EndOfGame from "./EndOfGame";
import EndOfTurn from "./EndOfTurnResults";
import LobbyClosedComponent from "./LobbyClosedComponent";
import { useTranslation } from "react-i18next";
import "locales/index";
import TurnOverIntermediateComponent from "./TurnOverIntermediateComponent";

import ErrorPopup from "components/ui/ErrorPopUp";
import { handleError } from "helpers/api";
import Rejoining from "./Rejoining";

const GameView = (props) => {
  //Refs
  const canvasRef = useRef(null); //reference of Drawing Canvas
  const clientRef = useRef(null); //reference of Socket Client
  const timerRef = useRef(null); // reference of CountDown Timer

  //Drawing Board
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserOn, setEraserOn] = useState(false);

  //Word
  const [currentWord, setCurrentWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");

  // Disconnections
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [painterActive, setPainterActive] = useState(false);
  const painterActiveRef = useRef(painterActive);
  painterActiveRef.current = painterActive;

  //Roles
  const [isPainter, setIsPainter] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [disconnectedType, setDisconnectedType] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  //Lobby-Information
  const userId = sessionStorage.getItem("userId");
  const [lobbyId, setLobbyId] = useState(sessionStorage.getItem("lobbyId"));
  const [lobbyName, setLobbyName] = useState(null);
  const [players, setPlayers] = useState([]);
  const [nrOfRounds, setNrOfRounds] = useState(null);
  const [timePerRound, setTimePerRound] = useState(null);
  const [lastRound, setLastRound] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [turn, setTurn] = useState(0);
  let { id } = useParams();

  const [roundResult, setRoundResult] = useState([]);
  const [word, setWord] = useState("");

  //Game Logic - Timer
  const [gameState, setGameState] = useState("before game");
  const [showTurnResult, setShowTurnResult] = useState(false);
  const [endTurnReason, setEndTurnReason] = useState("default");

  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // Function to handle error occurrence
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  // Function to handle closing the error pop-up
  const handleCloseError = () => {
    setShowError(false);
  };

  //warning when refreshing page (not customizable -> browser prevents)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isComponentMounted) {
        event.returnValue = "leave";
        return "";
      }
    };

    let isComponentMounted = true;
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isComponentMounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // this information was passed while creating/joining lobby
    const storedLobbyId = sessionStorage.getItem("lobbyId");

    const isHost = location?.state?.isHost || false;
    const lobbyId = location?.state?.lobbyId || storedLobbyId;
    setLobbyId(lobbyId);
    setIsHost(isHost);
    async function fetchLobbyInformation() {
      if (parseFloat(id) !== parseFloat(storedLobbyId)) {
        history.push("/lobbies");
      }

      try {
        console.log(lobbyId);
        const response = await api.get(`/lobbies/${lobbyId}`);
        console.log(response);
        setTimePerRound(response.data.timePerRound);
        setNrOfRounds(response.data.nrOfRounds);
        setPlayers(response.data.players);
        setLobbyName(response.data.lobbyName);

        if (response.data.running === true) {
          setGameState("rejoining");
        }
      } catch (error) {
        if (isHost) {
          history.push("/lobbies");
        } else {
          handleErrorMessage(
            `${t("errors.fetchLobby")} \n  ${handleError(error)}`
          );
        }
      }
    }

    fetchLobbyInformation();
  }, [props, location, history, id, t]);

  //Delay for RoundResult to show reason why turn was ended
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTurnResult(true);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showTurnResult]);

  // ClearCanvas
  function clearCanvas() {
    setColor("black");
    setLineWidth(5);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

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
      setPainterActive(true);
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
      if (msg.task.includes("end") && msg.task.includes("round")) {
        setShowTurnResult(false);
        if (msg.task.includes("last")) {
          setGameState("end last round");
        } else {
          setGameState("end round");
        }
        if (msg.task.includes("all guessed")) {
          setEndTurnReason("all guessed");
        } else if (msg.task.includes("inactive")) {
          setEndTurnReason("inactive");
        }
      } else {
        setGameState(msg.task);
      }
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
    } else if (gameState === "rejoining") {
      rejoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState /* intentionally excluding startGame, startRound, endRound */]);
  // these functions will never change

  //Time-Out to end round earlier, when painter (not-host) is NOT painting
  useEffect(() => {
    if (gameState === "start round") {
      if (isHost) {
        const timer = setTimeout(async () => {
          if (!painterActiveRef.current && !isPainter) {
            try {
              await updateGame(lobbyId);
              const response = await fetchGame(lobbyId);
              console.log(response.data);
              if (response.data.gameOver === false) {
                sendGameStateMessage(clientRef, lobbyId, "inactive end round");
              } else {
                sendGameStateMessage(
                  clientRef,
                  lobbyId,
                  "inactive end last round"
                );
              }
            } catch (error) {
              console.log(error);
              sessionStorage.removeItem("lobbyId");
              history.push("/lobbies");
            }
          }
        }, 12500);

        return () => clearTimeout(timer);
      }
    }
  }, [gameState, isPainter, isHost, lobbyId, history]);
  // these functions will never change

  useEffect(() => {
    console.log(gameState);
    if (players.length > 0 && gameState !== "before game") {
      try {
        configurePainter();
      } catch (error) {
        console.log("configure painter error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  //Game Logic - Sequence - Timer
  async function handleClickStartGame() {
    try {
      await createGame(lobbyId);
      sendGameStateMessage(clientRef, lobbyId, "start game");
    } catch (error) {
      handleErrorMessage(`${t("errors.startGame")} \n  ${handleError(error)}`);
    }
  }

  const startGame = async () => {
    timerRef.current.startGame(10);

    const gameResponse = await fetchGame(lobbyId);

    setPlayers(gameResponse.data.players);
    setCurrentRound(gameResponse.data.currentRound);
    setEraserOn(false);
  };

  async function startRound() {
    timerRef.current.startRound(timePerRound);

    if (isPainter) {
      const response = await fetchTurn(lobbyId); // to get word
      setCurrentWord(response.data.word);
    }
    setGuessSubmitted(false);
    setCurrentGuess("");
    setEndTurnReason("default");
    setLastRound(currentRound);
    setTurn((turn % players.length) + 1);
  }

  async function endRound() {
    timerRef.current.endRound(13);

    const turnResponse = await fetchTurn(lobbyId); // to get Result
    const gameResponse = await fetchGame(lobbyId); // to get new Roles
    console.log(gameResponse.data.players);

    setRoundResult(turnResponse.data.guesses.sort((a, b) => b.score - a.score));
    setPlayers(
      gameResponse.data.players.sort((a, b) => b.totalScore - a.totalScore)
    );
    setCurrentRound(gameResponse.data.currentRound);
    setWord(turnResponse.data.word);
    setPainterActive(false);
    setEraserOn(false);
  }

  function endGame() {
    // render End Of Game
  }

  async function rejoin() {
    try {
      const gameResponse = await fetchGame(lobbyId); // to get new Roles
      const players = gameResponse.data.players;
      setPlayers(players.sort((a, b) => b.totalScore - a.totalScore));

      if (
        players.find((user) => user.currentRole === "PAINTER").userId ===
        sessionStorage.getItem("userId")
      ) {
        const turnResponse = await fetchTurn(lobbyId); // to get Result
        setRoundResult(
          turnResponse.data.guesses.sort((a, b) => b.score - a.score)
        );
        setCurrentRound(gameResponse.data.currentRound);
        setWord(turnResponse.data.word);
      }
    } catch (error) {
      sessionStorage.removeItem("lobbyId");
      history.push("/lobbies");
    }
  }

  function enoughPlayersInLobby() {
    return players.length >= 2;
  }

  async function handleClickCloseLobby() {
    //DELETE LOBBY
    try {
      sessionStorage.removeItem("lobbyId");
      await api.delete(`/lobbies/${lobbyId}`);

      // sendOverWebsocket to all players that lobby closed
      console.log("close lobby");
      sendCloseLobbyMessage(clientRef, lobbyId);
    } catch (error) {
      handleErrorMessage(`${t("errors.closeLobby")} \n  ${handleError(error)}`);
    }
  }

  async function handleClickLeaveLobby() {
    try {
      // REMOVE PLAYER FROM LOBBY
      const userId = sessionStorage.getItem("userId");
      const requestBody = JSON.stringify({ userId: userId });
      await api.put(`/lobbies/${lobbyId}/leave`, requestBody);
      sessionStorage.removeItem("lobbyId");

      // sendOverWebsocket to all players that user left lobby
      sendLeaveGameMessage(clientRef, lobbyId);
    } catch (error) {
      handleErrorMessage(`${t("errors.leaveLobby")} \n  ${handleError(error)}`);
    }
    history.push("/lobbies");
  }

  useEffect(() => {
    // Wait for 2.5 seconds before redirecting to the overview page
    if (disconnectedType) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem("lobbyId");
        history.push("/lobbies");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [disconnectedType, history]);

  return disconnectedType ? (
    <LobbyClosedComponent
      disconnectedType={disconnectedType}
      t={t}
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
                    eraserOn={eraserOn}
                    setEraserOn={setEraserOn}
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
              <br></br>
              <div className="lobbyName">{lobbyName}</div>
            </div>
            <div className="board header-container sub-container3">
              <div className="clock-container">
                {(() => {
                  switch (gameState) {
                    case "before game":
                    case "rejoining":
                      return null;
                    default:
                      return (
                        <CountDownTimer
                          gameState={gameState}
                          isHost={isHost}
                          clientRef={clientRef}
                          lobbyId={lobbyId}
                          ref={timerRef}
                        ></CountDownTimer>
                      );
                  }
                })()}
              </div>
              <div className="rounds-container">
                {(() => {
                  switch (gameState) {
                    case "before game":
                      return isHost
                        ? enoughPlayersInLobby()
                          ? t("gamePage.roundsContainer.hostCanStart")
                          : t("gamePage.roundsContainer.hostMustWait")
                        : t("gamePage.roundsContainer.playerMustWait");
                    case "start game":
                      return t("gamePage.roundsContainer.firstRound");
                    case "end last round":
                      return t("gamePage.roundsContainer.lastRound");
                    case "rejoining":
                      return t("gamePage.roundsContainer.rejoining");
                    default:
                      return (
                        <>
                          {t("gamePage.roundsContainer.turn")}
                          {turn}/{players.length}
                          {t("gamePage.roundsContainer.of")}
                          {t("gamePage.roundsContainer.round")}
                          {lastRound}/{nrOfRounds}
                        </>
                      );
                  }
                })()}
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
              case "end last round":
                return !showTurnResult ? (
                  <TurnOverIntermediateComponent
                    t={t}
                    endTurnReason={endTurnReason}
                  ></TurnOverIntermediateComponent>
                ) : (
                  <EndOfTurn
                    t={t}
                    roundResult={roundResult}
                    players={players}
                    gameState={gameState}
                    word={word}
                  ></EndOfTurn>
                );
              case "rejoining":
                return <Rejoining t={t}></Rejoining>;
              default:
                return (
                  <DrawingBoard
                    color={color}
                    lineWidth={lineWidth}
                    ref={canvasRef}
                    isPainter={isPainter}
                    clientRef={clientRef}
                    lobbyId={lobbyId}
                    eraserOn={eraserOn}
                  ></DrawingBoard>
                );
            }
          })()}
        </div>
      </div>

      <div className="game small-container">
        <div className="game small-container sub-container1">
          <div className="host-button-container">
            {/*CHECK IF AT LEAST 2 PLAYERS IN LOBBY*/}
            {isHost && gameState === "before game" ? (
              <>
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
              </>
            ) : null}
            {!isHost && gameState === "before game" ? (
              <button
                className="start-game-button"
                onClick={handleClickLeaveLobby}
              >
                {t("gamePage.buttons.leaveLobby")}
              </button>
            ) : null}{" "}
          </div>
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
        gameState={gameState}
        lobbyId={lobbyId}
        userId={userId}
        topics={Object.values(websocket_topics(lobbyId))}
        onMessage={onMessage}
      />
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
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
