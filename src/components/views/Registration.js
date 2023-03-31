import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import 'styles/ui/DropDownMenu.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
            <div className="login field">
                <label className="login label">
                    {props.label}
                </label>
                <input
                        className="login input"
                        placeholder="enter here.."
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                />
            </div>
    );
};

const PasswordField = props => { //Class for Layout
    return (
            <div className="login field">
                <label className="login label">
                    {props.label}
                </label>
                <input
                        className="login input"
                        placeholder="enter here.."
                        type = {"password"}
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                />
            </div>
    );
};




FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Register = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null)
    const [username, setUsername] = useState(null);
    const [language, setLanguage] = useState(null);

    const doRegister = async () => {
        try {
            var select = document.getElementById('language');
            const language = select.options[select.selectedIndex].value;
            alert(`Language chosen: \n${language}`)
            const requestBody = JSON.stringify({username, password, language}); //creationDate
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            const requestBodyForLogin = JSON.stringify({username, password})
            const responseFromLogin = await api.post('/sessions', requestBodyForLogin)

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('id', user.id);


            // Login successfully worked --> navigate to the lobby overview
            history.push(`/lobbies`)
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
            history.push('/register')
        }
    };

    const doLogin = async () => {
        history.push('/login');
    }

    return (
            <BaseContainer>

                <div className="login container">
                    Welcome to Registration page
                    <div className="login form">

                        <FormField
                                label="Username"
                                value={username}
                                onChange={un => setUsername(un)}
                        />

                        <PasswordField
                                label="Password"
                                value={password}
                                onChange={n=>setPassword(n)}
                        />



                            <div className="dropdown">
                                <div>
                                    <label htmlFor="language">
                                        Select your preferred language:
                                        <select className="dropbtn" name="language" id="language">
                                            <option value="DE">DE</option>
                                            <option value="ENG">ENG</option>
                                            <option value="FR">FR</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                        <div className="login button-container">
                            <Button
                                    disabled={!username || !password}
                                    width="150px"
                                    onClick={() => doRegister()}
                            >
                                Register
                            </Button>

                            <Button
                                    width="150px"
                                    onClick={() => doLogin()}
                            >
                                Continue to login
                            </Button>


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
export default Register;

