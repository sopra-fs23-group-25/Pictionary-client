import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "styles/views/Game/CountDownTimer.scss";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { fetchGame, updateGame } from "helpers/gameAPI";
import { createTurn, deleteTurn } from "helpers/turnAPI";
import { sendGameStateMessage } from "components/socket/socketAPI";
import { useHistory } from "react-router-dom";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">0</div>;
  }

  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
};

const CountDownTimer = forwardRef((props, ref) => {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState(0);

  const { lobbyId } = props;
  const clientRef = props.clientRef;
  const { gameState, isHost } = props;

  const history = useHistory();

  function navigateToLobbies() {
    sessionStorage.removeItem("lobbyId");
    history.push("/lobbies");
  }

  async function handleTimerComplete() {
    if (isHost) {
      if (gameState === "start game") {
        try {
          await createTurn(lobbyId);
          sendGameStateMessage(clientRef, lobbyId, "start round");
        } catch (error) {
          console.log(error);
          navigateToLobbies();
        }
      } else if (gameState === "start round") {
        console.log("befor put game");
        try {
          await updateGame(lobbyId);
          const response = await fetchGame(lobbyId);
          if (response.data.gameOver === false) {
            sendGameStateMessage(clientRef, lobbyId, "end round");
          } else {
            sendGameStateMessage(clientRef, lobbyId, "end last round");
          }
        } catch (error) {
          console.log(error);
          navigateToLobbies();
        }
      } else if (gameState === "end round") {
        try {
          await deleteTurn(lobbyId);
          await createTurn(lobbyId);
          sendGameStateMessage(clientRef, lobbyId, "start round");
        } catch (error) {
          console.log(error);
          navigateToLobbies();
        }
      } else if (gameState === "end last round") {
        sendGameStateMessage(clientRef, lobbyId, "end game");
      }
      console.log("Timer Ended");
    }
  }

  function startTimer(duration) {
    setDuration(duration);
    setIsRunning(true);
    setKey((prevKey) => prevKey + 1);
    console.log("Timer Started");
  }

  function startGame(duration) {
    startTimer(duration);
  }

  function startRound(duration) {
    startTimer(duration);
  }

  function endRound(duration) {
    startTimer(duration);
  }

  // to be able to call function from parent
  useImperativeHandle(ref, () => ({
    startGame(duration) {
      startGame(duration);
    },
    startRound(duration) {
      startRound(duration);
    },
    endRound(duration) {
      endRound(duration);
    },
    startTimer(duration) {
      startTimer(duration);
    },
  }));

  return (
    <div className="countdown-timer">
      <CountdownCircleTimer
        isPlaying={isRunning}
        key={key}
        duration={duration}
        size={83}
        strokeWidth={16}
        strokeLinecap="butt"
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[10, 6, 3, 0]}
        onComplete={() => handleTimerComplete()}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
});

export default CountDownTimer;
