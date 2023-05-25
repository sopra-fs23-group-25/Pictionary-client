import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import "styles/views/Login.scss";
import "styles/ui/DropDownMenu.scss";
import BaseContainer from "components/ui/BaseContainer";
import { useTranslation } from "react-i18next";
import ErrorPopup from "components/ui/ErrorPopUp";
import logo from "images/pictionary_logo.png";

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

const Register = (props) => {
  const history = useHistory();
  const { i18n } = useTranslation(); // destructure i18n here

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
  ];

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState(languageOptions[0].value);
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

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password, language });
      await api.post("/users", requestBody);

      const requestBodyForLogin = JSON.stringify({ username, password });
      const responseFromLogin = await api.post(
        "/sessions",
        requestBodyForLogin
      );

      console.log(responseFromLogin);
      // Get the returned user and update a new object.
      const user = new User(responseFromLogin.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("userId", user.userId);
      sessionStorage.setItem("language", user.language);

      i18n.changeLanguage(user.language);

      // Login successfully worked --> navigate to the lobby overview
      history.push(`/lobbies`);
    } catch (error) {
      handleErrorMessage(
        `Something went wrong during the registration: \n  ${handleError(
          error
        )}`
      );
    }
  };

  const navigateToLogin = async () => {
    history.push("/login");
  };

  return (
    <BaseContainer>
      <div className="logo-container">
        <img src={logo} alt="" className="logo-icon"></img>
      </div>
      <div className="login">
        <div className="subcontainer header-container">
          <h1>Registration</h1>
          <h2>Already have an account?</h2>
          <p>
            continue to <span onClick={() => navigateToLogin()}>login</span>
          </p>
        </div>
        <div className="subcontainer form-container">
          <FormField
            label="username"
            value={username}
            onChange={(un) => setUsername(un)}
          ></FormField>
          <FormField
            label="password"
            value={password}
            type="password"
            onChange={(n) => setPassword(n)}
          ></FormField>
          <DropDown
            label={"Choose your prefered language"}
            value={language}
            options={languageOptions}
            onChange={(l) => setLanguage(l)}
          ></DropDown>
        </div>
        <div className="subcontainer button-container">
          <button
            disabled={!username || !password}
            className="login-button"
            onClick={() => doRegister()}
          >
            Register
          </button>
        </div>
      </div>
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;
