import "styles/views/Game/BeforeGameStart.scss";
import { Spinner } from "components/ui/Spinner";

const Rejoining = ({ t }) => {
  return (
    <div className="before-game-container">
      <h1 style={{ textAlign: "center" }}>{t("rejoining.rejoining")}</h1>
      <Spinner></Spinner>
    </div>
  );
};

export default Rejoining;
