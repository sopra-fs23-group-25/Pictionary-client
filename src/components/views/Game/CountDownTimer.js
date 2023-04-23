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

  const { isEndOfRound, gameOver, isHost } = props;
  const { sendGameStateMessage } = props;

  function handleTimerComplete() {
    if (isHost) {
      if (!gameOver) {
        if (isEndOfRound) {
          sendGameStateMessage("start round");
        } else {
          sendGameStateMessage("end round");
        }
      } else {
        sendGameStateMessage("end game");
      }
    }
    console.log("Timer Ended");
  }

  function startTimer(duration) {
    setDuration(duration);
    setIsRunning(true);
    setKey((prevKey) => prevKey + 1);
    console.log("Timer Started");
  }

  function startGame() {
    startTimer(5);
  }

  function startRound() {
    startTimer(15);
  }

  function endRound() {
    startTimer(5);
  }

  // to be able to call function from parent
  useImperativeHandle(ref, () => ({
    startGame() {
      startGame();
    },
    startRound() {
      startRound();
    },
    endRound() {
      endRound();
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
