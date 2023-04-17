import "styles/views/Game/PlayerRanking.scss";

import trophy from "images/trophy.png";
import brush from "images/paintbrush.png";
import textbox from "images/textbox.png";

const PlayerRanking = () => {
  // get players as props from Game component
  const players = [
    { name: "Player 1", score: 100, role: "guesser" },
    { name: "Player 2", score: 90, role: "guesser" },
    { name: "Player 3", score: 80, role: "painter" },
    { name: "Player 4", score: 70, role: "guesser" },
  ];

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
            <div className="ranking-element name">{player.name}</div>
            <div className="ranking-element role">
              {player.role === "painter" ? (
                <img src={brush} alt="brush"></img>
              ) : null}
              {player.role === "guesser" ? (
                <img src={textbox} alt="textbox"></img>
              ) : null}
            </div>
            <div className="ranking-element points">{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerRanking;
