import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, apiWithAuth, handleError } from "helpers/api";

import "styles/views/Lobby/LobbyOverview.scss";
import refreshIcon from "images/refresh-icon.png";
import { Spinner } from "components/ui/Spinner";
import { useTranslation } from "react-i18next";
import "locales/index";
import ErrorPopup from "components/ui/ErrorPopUp";

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
  const { t } = useTranslation();
  const [lobbies, setLobbies] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // Function to handle error occurrence
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  // Function to handle closing the error pop-up
  const handleCloseError = () => {
    setShowError(false);
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/lobbies");
      setLobbies(response.data);
      sessionStorage.removeItem("lobbyId");
      //console.log("lobbyID in Session Storage", sessionStorage.getItem("lobbyId"));
    } catch (error) {
      handleErrorMessage(
        `Something went wrong while fetching the lobbies: \n  ${handleError(
          error
        )}`
      );
    }
  };

  useEffect(
    () => {
      fetchData();
      const interval = setInterval(() => {
        console.log("refreshed");
        fetchData();
      }, 3000);
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line
    []
  );

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
      sessionStorage.setItem("lobbyId", lobbyId);
      console.log("lobbyid joining player", sessionStorage.getItem("lobbyId"));
      //sessionStorage.removeItem("lobbyId");
      navigateToGamePage(lobbyId);
    } catch (error) {
      handleErrorMessage(
        `Something went wrong during joining the lobby: \n  ${handleError(
          error
        )}`
      );
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
    const token = sessionStorage.getItem("token");
    await apiWithAuth(token).delete("/sessions");
    sessionStorage.clear();
    history.push("/login");
  };

  const navigateToUserSettings = () => {
    const userId = sessionStorage.getItem("userId");
    //console.log("sessionStorage ID", userId);
    history.push("/users/" + userId.toString());
  };

  return (
    <div className="main-container">
      <div className="sub-container sub-container-header">
        <h1>{t("lobbyOverview.lobbyOverview")}</h1>
        <h2>{t("lobbyOverview.joinLobby")}</h2>
      </div>
      <div className="sub-container sub-container-list">
        <div className="sub-container sub-container-list header">
          <div className="sub-container sub-container-list header name">
            Lobbies
          </div>
          <div className="sub-container sub-container-list header size">
            {t("lobbyOverview.lobbySize")}
          </div>
        </div>
        {lobbyListContent}
      </div>
      <div className="sub-container sub-container-buttons">
        <button
          onClick={() => refreshLobby()}
          className="sub-container sub-container-buttons button one"
        >
          <img src={refreshIcon} alt="refresh"></img>
        </button>
        <button
          onClick={navigateToLobbySettings}
          className="sub-container sub-container-buttons button two"
        >
          {t("lobbyOverview.createLobby")}
        </button>
        <button
          onClick={navigateToUserSettings}
          className="sub-container sub-container-buttons button three"
        >
          {t("lobbyOverview.userSettings")}
        </button>
        <button
          onClick={() => logout()}
          className="sub-container sub-container-buttons button four"
        >
          {t("lobbyOverview.logout")}
        </button>
      </div>
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </div>
  );
};

export default LobbyOverview;
