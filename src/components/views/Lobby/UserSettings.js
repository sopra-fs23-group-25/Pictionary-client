import React, { useEffect, useState } from "react";
import {apiWithAuth, handleError} from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import "styles/views//Lobby/UserSettings.scss";
import "styles/ui/DropDownMenu.scss";

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
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [language, setLanguage] = useState("");
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const languageOptions = [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "fr", label: "French" },
    ];

    useEffect(() => {
        async function fetchData() {

            try {
                const response = await apiWithAuth(token).get('/users/' + userId.toString());
                // Get the returned user and update a new object.
                const user = new User(response.data);

                if (user.token === sessionStorage.getItem("token")){
                    //token missing from backend
                    //console.log("usertoken:", user.token);
                    console.log("localstorage and user token:", sessionStorage.getItem("token"));
                }

                console.log("usertoken:", user.token);
                // Login successfully worked --> navigate to the route /game in the GameRouter
                // const requestBody = JSON.stringify({username, password, birthday});

            } catch (error) {
                alert(`Something went wrong during the profile loading: \n${handleError(error)}`);
                history.push('/lobbies')
            }
        }
        fetchData();
    }, [token, userId, history]);

    const save = async () => {
        try {
            const requestBody = JSON.stringify({ username, password, language });
            await apiWithAuth(token).put("/users/" + userId.toString(), requestBody);
            alert(`User settings saved.`);
            // Login successfully worked --> navigate to the lobby overview
            //history.push(`/lobbies`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
            history.push("/register");
        }
    };

    const navigateToLobbyOverview = async () => {
        history.push("/lobbies");
    };




    return (
            <div className="usersettings-main-container">
                    <div className="usersettings-subcontainer header-container">
                        <h1>User Settings</h1>
                    </div>
                    <div className="usersettings-subcontainer form-container">
                        <FormField
                                label="new username"
                                value={username}
                                onChange={(un) => setUsername(un)}
                        ></FormField>
                        <FormField
                                label="new password"
                                value={password}
                                type="password"
                                onChange={(n) => setPassword(n)}
                        ></FormField>
                        <DropDown
                                label={"New preferred language"}
                                value={language}
                                options={languageOptions}
                                onChange={(l) => setLanguage(l)}
                        ></DropDown>
                    </div>
                    <div className="usersettings-subcontainer button-container">
                        <button
                                //disabled={isDisabled}
                                className="save-button"
                                onClick={() => save()}
                        >
                            Save
                        </button>
                        <button
                                //disabled={isDisabled()}
                                className="back-to-lobby-button"
                                onClick={() => navigateToLobbyOverview()}
                        >
                            Back to Lobby Overview
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
