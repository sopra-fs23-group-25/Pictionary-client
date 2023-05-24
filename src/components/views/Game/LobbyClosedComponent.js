import "styles/views/Login.scss";
import { DisconnectionType } from "./Game";

const LobbyClosedComponent = ({ disconnectedType, t }) => {
  console.log("type: ", disconnectedType);
  return (
    <div className="login" style={{ marginTop: "100px" }}>
      <div className="subcontainer header-container">
        {disconnectedType === DisconnectionType.HOST_CLOSED_LOBBY ? (
          <h1>{t("gamePage.lobbyClosed.lobbyClosed")}</h1>
        ) : (
          <h1>{t("gamePage.lobbyClosed.hostDisconnected")}</h1>
        )}
        <h2>{t("gamePage.lobbyClosed.redirect")}</h2>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};

export default LobbyClosedComponent;
