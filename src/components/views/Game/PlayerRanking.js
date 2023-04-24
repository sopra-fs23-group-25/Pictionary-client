import "styles/views/Game/PlayerRanking.scss";

import trophy from "images/trophy.png";
import brush from "images/paintbrush.png";
import textbox from "images/textbox.png";

const PlayerRanking = ({ players }) => {
  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h1>Ranking</h1>
        <img src={trophy} className="ranking-header" alt="trophy"></img>
      </div>
      <div className="ranking-table">
        {players.map((player, index) => (
          <div className="ranking-row" key={index}>
            <div className="ranking-element rank">#{index + 1}</div>
            <div className="ranking-element name">{player.username}</div>
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
