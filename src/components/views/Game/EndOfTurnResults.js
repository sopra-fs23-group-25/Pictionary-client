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

const UserItem = ({ guess, index }) => {
  const scoreClass = guess.score > 0 ? "positive-score" : "negative-score";
  return (
    <div className="sub-container-players sub-container-list list">
      <div className="sub-container-players sub-container-list list position">
        #{guess.rank}
      </div>
      <div className="sub-container-players sub-container-list list name">
        {guess.username}
      </div>
      <div className="sub-container-players sub-container-list list points">
        {guess.score}
      </div>
      <div
        className={`sub-container-players sub-container-list list guessed-word ${scoreClass}`}
      >
        {guess.guess}
      </div>
    </div>
  );
};

const EndOfTurn = ({ players, roundResult, gameState, word, t }) => {
  // Calculate the ranks
  let currentRank = 0;
  let previousScore = -1;
  const scoresWithRank = roundResult.map((user, index) => {
    if (user.score !== previousScore) {
      currentRank = currentRank + 1;
    }
    previousScore = user.score;
    return { ...user, rank: currentRank };
  });

  let users = <Spinner></Spinner>;
  if (scoresWithRank.length > 0) {
    users = scoresWithRank.map((guess, index) => (
      <UserItem guess={guess} index={index} key={index}></UserItem>
    ));
  }

  const painter =
    players.length > 0
      ? players.find((user) => user.currentRole === "PAINTER")?.username
      : null;

  //const word = word;
  //const nextRound = currentRound + 1;

  return (
    <div id="base-container-end-of-turn" className="base-container-end-of-turn">
      <div className="sub-container-players">
        <div className="sub-container-players header-container">
          <h1>{t("endOfTurn.resultLastRound")}</h1>
        </div>
        <div className="sub-container-players sub-container-list">
          <div className="sub-container-players sub-container-list header">
            <div className="sub-container-players sub-container-list header position">
              {t("endOfTurn.rank")}
            </div>
            <div className="sub-container-players sub-container-list header name">
              {t("endOfTurn.userName")}
            </div>
            <div className="sub-container-players sub-container-list header points">
              {t("endOfTurn.newPoints")}
            </div>
            <div className="sub-container-players sub-container-list header guessed-word">
              {t("endOfTurn.guessedWord")}
            </div>
          </div>
          {users}
        </div>
        <div className="sub-container-players flag-container"></div>
        {gameState !== "end last round" ? (
          <>
            <div className="sub-container-players header-nextRound">
              {t("endOfTurn.getReadyForNextTurn")}
            </div>
            <div className="sub-container-players header-nextPainter">
              {t("endOfTurn.newPainter")} {painter}
            </div>
          </>
        ) : null}
        <div className="sub-container-players header-correct-word">
          {t("endOfTurn.lastWord")} {word}
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
