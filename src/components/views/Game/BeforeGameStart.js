import "styles/views/Game/BeforeGameStart.scss";

const BeforeGameStart = ({ timePerRound, nrOfRounds, players }) => {
  const painter =
    players.length > 0
      ? players.find((user) => user.currentRole === "PAINTER")?.username
      : null;

  return (
    <div className="before-game-container">
      <h1>Get ready for the game</h1>
      <h2>
        The game consists of{" "}
        <span className="before-game-span">{nrOfRounds}</span> rounds
      </h2>
      <h2>A round is over when each player painted one time</h2>
      <h2>
        You have <span className="before-game-span">{timePerRound}</span>{" "}
        seconds to paint/guess the word
      </h2>
      <h1>
        The first painter is <span className="before-game-span">{painter}</span>{" "}
        !
      </h1>
    </div>
  );
};

export default BeforeGameStart;
