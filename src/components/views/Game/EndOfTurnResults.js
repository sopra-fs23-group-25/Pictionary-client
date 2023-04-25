import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game/EndOfTurnResults.scss";
import "styles/views/Login.scss";
import { handleError } from "../../../helpers/api";
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

class User {
  constructor(data = {}) {
    this.position = null;
    this.username = null;
    this.points = null;
    this.guess = null;
    Object.assign(this, data);
  }
}

const UserItem = ({ user }) => {
  return (
    <div className="sub-container-players sub-container-list list">
      <div className="sub-container-players sub-container-list list position">
        {user.position}
      </div>
      <div className="sub-container-players sub-container-list list name">
        {user.username}
      </div>
      <div className="sub-container-players sub-container-list list points">
        {user.points}
      </div>
      <div className="sub-container-players sub-container-list list guessed-word">
        {user.guess}
      </div>
    </div>
  );
};

const EndOfTurn = () => {
  // const history = useHistory();
  const [users, setUsers] = useState(null);

  const fetchData = async () => {
    try {
      //URL NOCH ANPASSEN
      //const response = await api.get("/lobbies/{lobbyId}/game/turnresult");
      //setUsers(response.data);
      //setGuesses(response.data);
      /*
MOCKS
 */
      var mockusers = [];
      const u1 = new User();
      u1.username = "Mionel Lessi";
      u1.position = "#1";
      u1.points = "+50";
      u1.guess = "duck";
      mockusers.push(u1);

      const u2 = new User();
      u2.username = "Foger Rederer";
      u2.position = "#2";
      u2.points = "+30";
      u2.guess = "duck";
      mockusers.push(u2);

      const u3 = new User();
      u3.username = "The Two";
      u3.position = "#3";
      u3.points = "+0";
      u3.guess = "";
      mockusers.push(u3);

      const u4 = new User();
      u4.username = "The Twasaso";
      u4.position = "#4";
      u4.points = "+0";
      u4.guess = "bird";
      mockusers.push(u4);

      const u5 = new User();
      u5.username = "LittleBigSmall";
      u5.position = "#5";
      u5.points = "+0";
      u5.guess = "dog";
      mockusers.push(u5);

      /*
MOCKS
 */
      setUsers(mockusers);
      //await sleep(1000);
      //document.getElementById("base-container").style.visibility = "hidden";
    } catch (error) {
      console.error(
        `Something went wrong while fetching the lobbies: \n${handleError(
          error
        )}`
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let userListContent = <Spinner></Spinner>;
  if (users) {
    userListContent = users.map((user) => (
      <UserItem
        user={user}
        //handleClick={handleClickOnLobby}
        key={user.username}
        //points={user.points}
      ></UserItem>
    ));
  }

  return (
    <div id="base-container-end-of-turn"
    className="base-container-end-of-turn">
      <div className="popup">
        <div className="sub-container-players">
          <div className="sub-container-players header-container">
            <h1>Results of Round 3</h1>
          </div>
          <div className="sub-container-players sub-container-list">
            <div className="sub-container-players sub-container-list header">
              <div className="sub-container-players sub-container-list header position">
                Position
              </div>
              <div className="sub-container-players sub-container-list header name">
                Username
              </div>
              <div className="sub-container-players sub-container-list header points">
                New Points
              </div>
              <div className="sub-container-players sub-container-list header guessed-word">
                Guessed Word
              </div>
            </div>
            {userListContent}
          </div>
          <div className="sub-container-players flag-container"></div>
          <div className="sub-container-players header-nextRound">
            Get ready for Round 4!!!
          </div>
          <div className="sub-container-players header-nextPainter">
            New Painter: Mionel Lessi.
          </div>
          <div className="sub-container-players header-correct-word">
            The word was: duck.
          </div>
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
