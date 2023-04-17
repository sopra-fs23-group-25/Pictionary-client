import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/EndOfGame.scss"
//import "styles/views/Login.scss"
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";

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
        Object.assign(this, data);
    }
}


const UserItem = ({user}) => {
    return (
            <div className="sub-container sub-container-list list">
                <div
                        className="sub-container sub-container-list list position"
                >
                    {user.position}
                </div>
                <div
                        className="sub-container sub-container-list list username"
                >
                    {user.username}
                </div>
                <div className="sub-container sub-container-list list points">
                    {user.points}
                </div>
            </div>
    );
};

const EndOfGame = (props) => {

    /*
MOCKS
 */
    var mockusers = [];
    const u1 = new User();
    u1.username = "Mionel Lessi";
    u1.position = "#1";
    u1.points = "210";
    mockusers.push(u1);

    const u2 = new User();
    u2.username = "Foger Rederer";
    u2.position = "#2";
    u2.points = "160";
    mockusers.push(u2);

    const u3 = new User();
    u3.username = "The Two";
    u3.position = "#3";
    u3.points = "120";
    mockusers.push(u3);

    const u4 = new User();
    u4.username = "The Two";
    u4.position = "#4";
    u4.points = "120";
    mockusers.push(u4);

    const u5 = new User();
    u5.username = "LittleBigSmall";
    u5.position = "#5";
    u5.points = "90";
    mockusers.push(u5);

    /*
MOCKS
 */

  const history = useHistory();
  const [users, setUsers] = useState(null);

    const fetchData = async () => {
        try {
            //URL NOCH ANPASSEN
            //const response = await api.get("/lobbies/{lobbyId}/end");
            //setUsers(response.data);
            setUsers(mockusers);
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

    const startNewGame = () => {
        history.push("/endofturn");
    };

    const exit = () => {
        history.push("/endofturn");
    };

  return (
    <BaseContainer>
        <div className="popup">
            <div className="sub-container">
                <div className="sub-container header-container">
                    <h1>
                        Final Scores
                    </h1>
                </div>
                <div className="sub-container sub-container-list">
                    <div className="sub-container sub-container-list header">
                        <div className="sub-container sub-container-list header position">
                            Position
                        </div>
                        <div className="sub-container sub-container-list header name">
                            Username
                        </div>
                        <div className="sub-container sub-container-list header points">
                            Final Points
                        </div>
                    </div>
                    {userListContent}
                </div>
                <div className="sub-container button-container">
                    <div className="sub-container button-container button-game-again"
                         onClick={() => startNewGame()}>
                        Game again?
                    </div>

                    <div className="sub-container button-container button-exit"
                         onClick={() => exit()}>
                        Exit
                    </div>
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
