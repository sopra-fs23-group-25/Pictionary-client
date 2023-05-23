import { useHistory } from "react-router-dom";
import "styles/views/Rules.scss";

const Rules = () => {
  const history = useHistory();

  function handleClick() {
    history.push("/lobbies");
  }
  return (
    <div className="rules">
      <h1>Game Rules</h1>
      <div className="rules-text">
        <h3>Game Description</h3>
        <ul className="list">
          <li>
            Pictionary is a multiplayer drawing game, where a painter draws a
            word and the other players try to guess the word. The game can be
            played in a <span>users preferred language</span> due to the usage
            of the <span>Google Translate API</span>, which translates all words
            into the users preferred language.
          </li>
          <li>
            A game can be played with <span>2-5 players</span>
          </li>
          <li>
            A game consists of <span>1-5 rounds</span>. A round is over, when
            every player has drawn once. (number of turns per round = number of
            players in lobby)
          </li>
          <li>
            The duration of a turn can be choosen from{" "}
            <span>20-60 seconds</span>
          </li>
          <li>
            A turn is finished, either when the <span>time is over</span>,{" "}
            <span>all players have guessed</span> or the
            <span> painter was inactive.</span>
          </li>
          <li>
            A guess can be submitted in the{" "}
            <span>users preferred language</span>.
          </li>
        </ul>
        <h3>Rules</h3>
        <ul className="list">
          <li>One guess can be submitted per turn</li>
          <li>Behave respectfully</li>
          <li>
            <span>Don't</span> use letters in your drawings.
          </li>
        </ul>
        <h3>Scoring</h3>
        <ul className="list">
          <li>
            The painter gets <span>5 points</span> for every right guess
          </li>
          <li>If a players guesses the word wrong, the player gets 0 points</li>
          <li>
            The first player, that guesses correctly, gets 25 points. Each
            correct guess that was submitted later, gets 5 points less. For
            example: First correct guess 25 points, 2nd correct guess 20 points
            etc..{" "}
          </li>
        </ul>
      </div>
      <button className="back-button" onClick={handleClick}>
        BACK
      </button>
    </div>
  );
};

export default Rules;
