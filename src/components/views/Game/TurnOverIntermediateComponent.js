import "styles/views/Game/BeforeGameStart.scss";

const TurnOverIntermediateComponent = ({ endTurnReason, t }) => {
  return (
    <div className="before-game-container">
      <h1>{t("turnOverReason.turnOver")}</h1>
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
