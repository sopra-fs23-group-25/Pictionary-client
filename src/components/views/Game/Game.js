import DrawingBoard from "./DrawingBoard";
import PaintToolbar from "./PaintToolBar";
import logo from "images/pictionary_logo.png";
import "styles/views/Game/Game.scss";

import { useState, useRef } from "react";
import PlayerRanking from "./PlayerRanking";

const GameView = () => {
  //Refs
  const canvasRef = useRef(null);
  // const clientRef = useRef(null);

  //Drawing Board
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  //Roles
  const [isPainter, setIsPainter] = useState(true);
  // const isHost = true;

  //Game Logic - Timer
  // const [remainingTime, setRemainingTime] = useState(0);
  // const [isRunning, setIsRunning] = useState(false);
  const [isEndOfRound, setIsEndOfRound] = useState(true);
  // const [isGameOver, setIsGameOver] = useState(false);
  const nrOfRounds = 3;
  const [round, setRound] = useState(0);

  // Information Needed on render page:
  // lobbysettings(time, rounds, ), lobbyId, userId,

  // const lobbyId = 1;
  // const userId = 10;
  // const timePerRound = 5;

  function clearCanvas() {
    setColor("black");
    setLineWidth(5);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

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
                  sendClearMessage={clearCanvas}
                ></PaintToolbar>
              ) : null}
            </div>
            <div className="board header-container sub-container2">
              Drawing Board
            </div>
            <div className="board header-container sub-container3">
              <div className="clock-container"></div>
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
          ></DrawingBoard>
        </div>
      </div>

      <div className="game small-container">
        <div className="game small-container sub-container1">
          <img className="logo" src={logo} alt="Pictionary Logo"></img>
        </div>
        <div className="game small-container sub-container2">
          {isPainter ? (
            <WordToDrawBoard></WordToDrawBoard>
          ) : (
            <GuessingBoard></GuessingBoard>
          )}
        </div>
        <div className="game small-container sub-container3">
          <PlayerRanking></PlayerRanking>
        </div>
      </div>
    </div>
  );
};

export default GameView;

const WordToDrawBoard = () => {
  return (
    <div className="guessing-container">
      <h1>Word to paint</h1>
      <div className="guessing-container word">duck</div>
    </div>
  );
};

const GuessingBoard = () => {
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
