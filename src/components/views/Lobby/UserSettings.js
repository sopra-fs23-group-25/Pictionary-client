import React, { useEffect, useState } from "react";
import { apiWithAuth, handleError } from "helpers/api";
import { useHistory, useParams } from "react-router-dom";
import "styles/views//Lobby/UserSettings.scss";
import "styles/ui/DropDownMenu.scss";
import User from "../../../models/User";
import { useTranslation } from "react-i18next";
import "locales/index";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = ({ label, value, type, onChange }) => {
  return (
    <div className="form-field">
      <input
        className="form-field input"
        placeholder={label}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        maxLength={16}
      />
    </div>
  );
};

const DropDown = ({ label, value, options, onChange }) => {
  return (
    <div className="form-field">
      <label htmlFor="dropdown" className="form-field label">
        {label}{" "}
      </label>
      <select
        className="form-field input"
        id="dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingTop: "7px" }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const UserSettings = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const password = "";
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const token = sessionStorage.getItem("token");

  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  //const params = useParams();
  let { id } = useParams();
  const userId = id;

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
  ];

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (parseFloat(userId) !== parseFloat(storedUserId)) {
      history.push("/lobbies");
    }

    async function fetchData() {
      const response = await apiWithAuth(token).get(
        "/users/" + userId.toString()
      );
      const user = new User(response.data);
      setLanguage(user.language);
      setNewLanguage(user.language);
      setUsername(user.username);
      setNewUsername(user.username);
    }
    fetchData();
  }, [token, userId, history]);

  const save = async () => {
    try {
      const requestBody = JSON.stringify({
        username: newUsername,
        password: newPassword,
        language: newLanguage,
      });
      await apiWithAuth(token).put("/users/" + userId.toString(), requestBody);

      sessionStorage.setItem("language", newLanguage);
      i18n.changeLanguage(newLanguage);

      setUsername(newUsername);
      setLanguage(newLanguage);
      setNewPassword("");
      setNewPassword("");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const navigateToLobbyOverview = async () => {
    history.push("/lobbies");
  };

  function saveButtonDisabled() {
    return (
      (newUsername !== username && !userNameNotWhiteSpaceOrEmpty()) ||
      newPassword !== password ||
      newLanguage !== language
    );
  }

  function userNameNotWhiteSpaceOrEmpty() {
    return newUsername.trim() === "";
  }

  return (
    <div className="usersettings-main-container">
      <div className="usersettings-subcontainer header-container">
        <h1>{t("userSettings.userSettings")}</h1>
      </div>
      <div className="usersettings-subcontainer form-container">
        <FormField
          label={t("userSettings.newUsername")}
          value={newUsername}
          onChange={(u) => setNewUsername(u)}
        ></FormField>
        <FormField
          label={t("userSettings.newPassword")}
          value={newPassword}
          type="password"
          onChange={(p) => setNewPassword(p)}
        ></FormField>
        <DropDown
          label={t("userSettings.newPreferredLanguage")}
          value={newLanguage}
          options={languageOptions}
          onChange={(l) => setNewLanguage(l)}
        ></DropDown>
      </div>
      <div className="usersettings-subcontainer button-container">
        <button
          disabled={!saveButtonDisabled()}
          className="save-button"
          onClick={() => save()}
        >
          {t("userSettings.save")}
        </button>
        <button
          className="back-to-lobby-button"
          onClick={() => navigateToLobbyOverview()}
        >
          {t("userSettings.backToLobbyOverview")}
        </button>
      </div>
    </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UserSettings;
