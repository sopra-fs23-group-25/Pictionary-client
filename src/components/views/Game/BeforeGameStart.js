import "styles/views/Game/BeforeGameStart.scss";

const BeforeGameStart = ({ timePerRound, nrOfRounds, players, t }) => {
  const painter =
    players.length > 0
      ? players.find((user) => user.currentRole === "PAINTER")?.username
      : null;

  return (
    <div className="before-game-container">
      <h1>{t("gamePage.beforeGameStart.getReady")}</h1>
      <h2>
        {t("gamePage.beforeGameStart.gameConsists")}
        <span className="before-game-span">{nrOfRounds}</span>
        {t("gamePage.beforeGameStart.rounds")}
      </h2>
      <h2>{t("gamePage.beforeGameStart.roundOver")}</h2>
      <h2>
        {t("gamePage.beforeGameStart.youHave")}
        <span className="before-game-span">{timePerRound}</span>
        {t("gamePage.beforeGameStart.secondsToPaint")}
      </h2>
      <h1>
        {t("gamePage.beforeGameStart.firstPainter")}
        <span className="before-game-span">{painter}</span> !
      </h1>
    </div>
  );
};

export default BeforeGameStart;
