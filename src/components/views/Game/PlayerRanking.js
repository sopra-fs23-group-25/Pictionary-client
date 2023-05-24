import "styles/views/Game/PlayerRanking.scss";

import trophy from "images/trophy.png";
import brush from "images/paintbrush.png";
import textbox from "images/textbox.png";

const PlayerRanking = ({ players, t }) => {
  const userId = parseInt(sessionStorage.getItem("userId"));

  // Calculate the ranks
  let currentRank = 0;
  let previousScore = -1;
  const scoresWithRank = players.map((user, index) => {
    if (user.totalScore !== previousScore) {
      currentRank = currentRank + 1;
    }
    previousScore = user.totalScore;
    return { ...user, rank: currentRank };
  });

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h1> {t("gamePage.ranking.ranking")}</h1>
        <img src={trophy} className="ranking-header" alt="trophy"></img>
      </div>
      <div className="ranking-table">
        {scoresWithRank.map((player, index) => (
          <div className="ranking-row" key={index}>
            <div className="ranking-element rank">#{player.rank}</div>
            <div
              className={
                "ranking-element name" +
                (player.userId === userId ? "-personal" : "")
              }
            >
              {player.username}
            </div>
            <div className="ranking-element role">
              {player.currentRole === "PAINTER" ? (
                <img src={brush} alt="brush"></img>
              ) : null}
              {player.currentRole === "GUESSER" ? (
                <img src={textbox} alt="textbox"></img>
              ) : null}
            </div>
            <div className="ranking-element points">{player.totalScore}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerRanking;
