import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, apiWithAuth, handleError } from "helpers/api";

import "styles/views/Lobby/LobbyOverview.scss";
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
        {lobby.players.length}/{lobby.maxNrOfPlayers}
      </div>
    </div>
  );
};

const LobbyOverview = () => {
  const history = useHistory();
  const [lobbies, setLobbies] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/lobbies");
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function refreshLobby() {
    await fetchData();
    console.log(lobbies);
  }

  async function joinLobby(lobbyId) {
    try {
      const userId = sessionStorage.getItem("userId");

      const requestBody = JSON.stringify({
        userId: userId,
      });
      await api.put(`/lobbies/${lobbyId}`, requestBody);
      navigateToGamePage(lobbyId);
    } catch (error) {
      alert(`Could not join Lobby`);
    }
  }

  function handleClickOnLobby(lobby) {
    joinLobby(lobby.lobbyId);
  }

  const navigateToGamePage = (lobbyId) => {
    history.push({
      pathname: `/game/${lobbyId}`,
      state: { isHost: false, lobbyId: lobbyId },
    });
  };

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

  const logout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await apiWithAuth(token).delete("/sessions");
      sessionStorage.clear();
      history.push("/login");
    } catch (error) {
      alert("Something went wrong while logging out!");
    }
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
