import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";

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
      />
    </div>
  );
};

const Login = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/sessions", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("userId", user.userId);

      // Login successfully worked --> navigate to the lobby overview
      history.push(`/lobbies`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };
  const navigateToRegister = async () => {
    history.push("/register");
  };

  return (
    <BaseContainer>
      <div className="login">
        <div className="subcontainer header-container">
          <h1>Login</h1>
          <h2>Sign in to your account</h2>
          <p>
            or <span onClick={() => navigateToRegister()}>register</span> a new
            account
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
        </div>
        <div className="subcontainer button-container">
          <button
            disabled={!username || !password}
            className="login-button"
            onClick={() => doLogin()}
          >
            Login
          </button>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
