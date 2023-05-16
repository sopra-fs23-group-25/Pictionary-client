import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import RangeSelection from "components/ui/RangeSelection";
import { apiWithAuth } from "helpers/api";
import "styles/views/Lobby/LobbySettings.scss";

import { useTranslation } from "react-i18next";
import "locales/index";

const LobbySettings = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const [lobbyName, setLobbyName] = useState("");
  const [selectedTime, setSelectedTime] = useState(30);
  const [selectedRounds, setSelectedRound] = useState(2);
  const [selectedNrOfPlayers, setSelectedNrOfPlayers] = useState(5);

  async function createLobby() {
    try {
      const userId = sessionStorage.getItem("userId");

      const requestBody = JSON.stringify({
        lobbyName: lobbyName,
        timePerRound: selectedTime,
        nrOfRounds: selectedRounds,
        maxNrOfPlayers: selectedNrOfPlayers,
        hostId: userId,
      });

      const token = sessionStorage.getItem("token");
      const response = await apiWithAuth(token).post("/lobbies", requestBody);
      sessionStorage.setItem("lobbyId", response.data.lobbyId);
      navigateToGamePage(response.data.lobbyId);
    } catch (error) {
      alert("Something went wrong while creating a new lobby! See console");
    }
  }
  const handleCancelClick = () => {
      // Remove the 'lobbyId' item from sessionStorage
      //sessionStorage.removeItem('lobbyId');

      // Redirect to '/lobbies' using history.push
      history.push('/lobbies');
    };

  const navigateToGamePage = (lobbyId) => {
    history.push({
      pathname: `/game/${lobbyId}`,
      state: { isHost: true, lobbyId: lobbyId },
    });
  };

  function lobbyNameNotWhiteSpaceOrEmpty() {
    return lobbyName.trim() === "";
  }

  return (
    <div className="lobbysettings">
      <h2>{t("lobbySettings.lobbySettings")}</h2>
      <EntryField
        t={t}
        type={"text"}
        label={"Lobby Name"}
        value={lobbyName}
        onChange={(ln) => setLobbyName(ln)}
      ></EntryField>
      <label>
        <RangeSelection
          setter={setSelectedTime}
          state={selectedTime}
          min={"10"}
          max={"60"}
          step={"5"}
        ></RangeSelection>
        {t("lobbySettings.secPerRound")}: <span>{selectedTime}</span>
      </label>
      <label>
        <RangeSelection
          setter={setSelectedRound}
          state={selectedRounds}
          min={"1"}
          max={"10"}
          step={"1"}
          disabled={false}
        ></RangeSelection>
        {t("lobbySettings.nrOfRounds")}: <span>{selectedRounds}</span>
      </label>
      <label>
        <RangeSelection
          setter={setSelectedNrOfPlayers}
          state={selectedNrOfPlayers}
          min={"2"}
          max={"5"}
          step={"1"}
        ></RangeSelection>
        {t("lobbySettings.nrOfPlayers")}: <span>{selectedNrOfPlayers}</span>
      </label>
      <div className="lobbysettings button-container">
        <button
          className="lobbysettings button-container button cancel"
          onClick={handleCancelClick}
        >
          {t("lobbySettings.cancel")}
        </button>
        <button
          onClick={() => createLobby()}
          className="lobbysettings button-container button confirm"
          disabled={!lobbyName || lobbyNameNotWhiteSpaceOrEmpty()}
        >
          {t("lobbySettings.confirm")}
        </button>
      </div>
    </div>
  );
};

export default LobbySettings;

const EntryField = ({ type, value, onChange, t }) => {
  return (
    <div className="lobbyname">
      <label className="lobbyname label">
        <span>{t("lobbySettings.lobbyName")}</span>
      </label>
      <input
        className="lobbyname input"
        placeholder={t("lobbySettings.placeHolder")}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={18}
      />
    </div>
  );
};
