import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "styles/views/Game/CountDownTimer.scss";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";

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

  const { gameState, isHost } = props;
  const { sendGameStateMessage } = props;
  const { updateGame, deleteTurn, createTurn, fetchGame } = props;

  async function handleTimerComplete() {
    if (isHost) {
      if (gameState === "start game") {
        await createTurn();
        sendGameStateMessage("start round");
      } else if (gameState === "start round") {
        console.log("befor put game");
        await updateGame();
        const response = await fetchGame();
        if (response.data.gameOver === false) {
          sendGameStateMessage("end round");
        } else {
          sendGameStateMessage("end last round");
        }
      } else if (gameState === "end round") {
        await deleteTurn();
        await createTurn();
        sendGameStateMessage("start round");
      } else if (gameState === "end last round") {
        sendGameStateMessage("end game");
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
    console.log("end round");
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
        size={90}
        strokeWidth={20}
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
