import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Registration from "components/views/Registration";
import LobbyOverview from "components/views/Lobby/LobbyOverview";
import LobbySettings from "components/views/Lobby/LobbySettings";
import Game from "components/views/Game/Game";
import UserSettings from "../../views/Lobby/UserSettings";
import { GameGuard } from "../routeProtectors/GameGuard";
import Rules from "components/views/Rules";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>

        <Route exact path="/register">
          <LoginGuard>
            <Registration />
          </LoginGuard>
        </Route>

        <Route exact path="/lobbies">
          <LobbyGuard>
            <LobbyOverview />
          </LobbyGuard>
        </Route>

        <Route path="/game/:id">
          <GameGuard>
            <Game />
          </GameGuard>
        </Route>

        <Route exact path="/rules">
          <LobbyGuard>
            <Rules />
          </LobbyGuard>
        </Route>

        <Route exact path="/lobbysettings">
          <LobbyGuard>
            <LobbySettings />
          </LobbyGuard>
        </Route>

        <Route exact path="/users/:id">
          <LobbyGuard>
            <UserSettings />
          </LobbyGuard>
        </Route>

        <Route exact path="/">
          <Redirect to="/register" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
