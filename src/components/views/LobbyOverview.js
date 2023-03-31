import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, apiWithAuth, handleError } from "helpers/api";

import "styles/views/LobbyOverview.scss";
import { Spinner } from "components/ui/Spinner";

const LobbyItem = ({ lobby, handleClick }) => {
  return (
    <div className="sub-container sub-container-list list">
      <div
        onClick={() => handleClick(lobby)}
        className="sub-container sub-container-list list name"
      >
        {lobby.lobbyName}
      </div>
      <div className="sub-container sub-container-list list size">
        {lobby.numberOfPlayers}
      </div>
    </div>
  );
};

const LobbyOverview = () => {
  const history = useHistory();
  const [lobbies, setLobbies] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/lobbies");
        console.log("render page");

        setLobbies(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the lobbies: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the lobbies! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  function handleClickOnLobby(lobby) {
    if (window.confirm(`join ${lobby.lobbyName} ?`)) {
      // Perform the action here
    }
  }

  const navigateToLobbySettings = () => {
    history.push("/lobbysettings");
  };

  let lobbyListContent = <Spinner></Spinner>;

  if (lobbies) {
    lobbyListContent = lobbies.map((lobby) => (
      <LobbyItem
        lobby={lobby}
        handleClick={handleClickOnLobby}
        key={lobby.lobbyName}
      ></LobbyItem>
    ));
  }

  async function refreshLobby() {
    const response = await api.get("/lobbies");
    setLobbies(response.data);
    console.log(lobbies);
  }

  const logout = () => {
    const token = localStorage.getItem("token");
    apiWithAuth(token).delete("/session");
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="main-container">
      <div className="sub-container sub-container-header">
        <h1>Lobby Overview</h1>
        <h2>Join a lobby by clicking on the name</h2>
      </div>
      <div className="sub-container sub-container-list">
        <div className="sub-container sub-container-list header">
          <div className="sub-container sub-container-list header name">
            Lobbies
          </div>
          <div className="sub-container sub-container-list header size">
            Group Size
          </div>
        </div>
        {lobbyListContent}
      </div>
      <div className="sub-container sub-container-buttons">
        <button
          onClick={() => refreshLobby()}
          className="sub-container sub-container-buttons button one"
        >
          REFRESH
        </button>
        <button
          onClick={navigateToLobbySettings}
          className="sub-container sub-container-buttons button two"
        >
          CREATE A NEW LOBBY
        </button>
        <button
          onClick={() => logout()}
          className="sub-container sub-container-buttons button three"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default LobbyOverview;
