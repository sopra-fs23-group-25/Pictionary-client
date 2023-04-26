import React from "react";
// import { useHistory } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game/EndOfTurnResults.scss";
import "styles/views/Login.scss";
//import { handleError } from "../../../helpers/api";
import { Spinner } from "../../ui/Spinner";
//import { setTimeout } from "timers/promises";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

/*
MOCKS
 */

const UserItem = ({ guess , index}) => {
  return (
    <div className="sub-container-players sub-container-list list">
      <div className="sub-container-players sub-container-list list position">
        #{index+1}
      </div>
      <div className="sub-container-players sub-container-list list name">
        {guess.username}
      </div>
      <div className="sub-container-players sub-container-list list points">
        {guess.score}
      </div>
      <div className="sub-container-players sub-container-list list guessed-word">
        {guess.guess}
      </div>
    </div>
  );
};

const EndOfTurn = ({players, roundResult, currentRound, word}) => {

    let users = <Spinner></Spinner>;
  if (roundResult.length > 0) {
    users = roundResult.map((guess, index) => (
      <UserItem
        guess={guess}
        index={index}
      ></UserItem>
    ));
  }




    const painter = players.find((user) => user.currentRole === "PAINTER").username;
    //const word = word;
    //const nextRound = currentRound + 1;

  return (
    <div id="base-container-end-of-turn"
    className="base-container-end-of-turn">
      <div className="popup">
        <div className="sub-container-players">
          <div className="sub-container-players header-container">
            <h1>Results of Round {currentRound+1}</h1>
          </div>
          <div className="sub-container-players sub-container-list">
            <div className="sub-container-players sub-container-list header">
              <div className="sub-container-players sub-container-list header position">
                Position
              </div>
              <div className="sub-container-players sub-container-list header name">
                Username
              </div>
              <div className="sub-container-players sub-container-list header points">
                New Points
              </div>
              <div className="sub-container-players sub-container-list header guessed-word">
                Guessed Word
              </div>
            </div>
              {users}
          </div>
          <div className="sub-container-players flag-container"></div>
          <div className="sub-container-players header-nextRound">
            Get ready for Round {currentRound+2}!!!
          </div>
          <div className="sub-container-players header-nextPainter">
            New Painter: {painter}
          </div>
          <div className="sub-container-players header-correct-word">
            The word was: {word}.
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default EndOfTurn;
