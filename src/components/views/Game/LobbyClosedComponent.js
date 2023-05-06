import "styles/views/Login.scss";
import { DisconnectionType } from "./Game";

const LobbyClosedComponent = (disconnectedType) => {
  return (
    <div className="login">
      <div className="subcontainer header-container">
        {disconnectedType.disconnectedType ===
        DisconnectionType.HOST_CLOSED_LOBBY ? (
          <h1>Lobby Closed</h1>
        ) : (
          <h1>Host Disconnected</h1>
        )}
        <h2>you get redirected to lobby-overview page...</h2>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};

export default LobbyClosedComponent;
