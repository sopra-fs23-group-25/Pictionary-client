import "styles/views/Game/BeforeGameStart.scss";
import sleep from "images/painter-inactive.png";
import guessed from "images/all-guessed.png";
import clock from "images/alarm-clock.png";

const TurnOverIntermediateComponent = ({ endTurnReason, t }) => {
  return (
    <div className="before-game-container">
      <h1>
        {t("turnOverReason.turnOver")}
        <img
          src={
            endTurnReason === "all guessed"
              ? guessed
              : endTurnReason === "inactive"
              ? sleep
              : clock
          }
          alt="turn over"
        ></img>
      </h1>
      <h2>
        <span className="before-game-span">
          {endTurnReason === "all guessed"
            ? t("turnOverReason.allPlayersGuessed")
            : endTurnReason === "inactive"
            ? t("turnOverReason.painterInactive")
            : t("turnOverReason.timeOver")}
        </span>
      </h2>
    </div>
  );
};

export default TurnOverIntermediateComponent;
