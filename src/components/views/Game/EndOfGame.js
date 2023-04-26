import React from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game/EndOfGame.scss";
//import "styles/views/Login.scss"npm
import { Spinner } from "../../ui/Spinner";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */




const UserItem = ({ player , index}) => {
  return (
    <div className="sub-container-end-game sub-container-list list">
      <div className="sub-container-end-game sub-container-list list position">
        #{index+1}
      </div>
      <div className="sub-container-end-game sub-container-list list username">
        {player.username}
      </div>
      <div className="sub-container-end-game sub-container-list list points">
        {player.totalScore}
      </div>
    </div>
  );
};

const EndOfGame = ({players}) => {
  const history = useHistory();
  //const [users, setUsers] = useState(null);

  let userListContent = <Spinner></Spinner>;
  if (players.length  > 0) {
    userListContent = players.map((player, index) => (
      <UserItem
        player={player}
        index={index}
        key={player.userId}
      ></UserItem>
    ));
  }

  const startNewGame = () => {
    //api.delete("/lobbies/{lobbyId}/game");
    //api.post("/lobbies/{lobbyId}/game");
    history.push("/endofturn");
  };

  const exit = () => {
    //api.delete("/lobbies/{lobbyId}/game");
    //api.delete("/lobbies/{lobbyId}");
    history.push("/lobbies");
  };

  return (
    <BaseContainer>
      <div className="popup-endofgame">
        <div className="trophy"></div>
        <div className="sub-container-end-game">
          <div className="sub-container-end-game header-container">
            <h1>Final Scores</h1>
          </div>

          <div className="sub-container-end-game sub-container-list">
            <div className="sub-container-end-game sub-container-list header">
              <div className="sub-container-end-game sub-container-list header position">
                Position
              </div>
              <div className="sub-container-end-game sub-container-list header name">
                Username
              </div>
              <div className="sub-container-end-game sub-container-list header points">
                Final Points
              </div>
            </div>
            {userListContent}
          </div>
        </div>
        <div className="flag"></div>
        <div className="button-container-end-game">
          <div
            className="button-container-end-game button-game-again"
            onClick={() => startNewGame()}
          >
            Game again?
          </div>

          <div
            className="button-container-end-game button-exit"
            onClick={() => exit()}
          >
            Back to lobbies
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default EndOfGame;
