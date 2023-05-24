import { useHistory } from "react-router-dom";
import "styles/views/Rules.scss";
import { useTranslation } from "react-i18next";

const Rules = () => {
  const history = useHistory();
  const { t } = useTranslation();

  function handleClick() {
    history.push("/lobbies");
  }
  return (
    <div className="rules">
      <h1>{t("rules.rules")}</h1>
      <div className="rules-text">
        <h3>{t("rules.description.title")}</h3>
        <ul className="rules-list">
          <li>
            {t("rules.description.game.part1.1")}
            <span>{t("rules.description.language")}</span>
            {t("rules.description.game.part1.2")}
            <span>{t("rules.description.API")}</span>
            {t("rules.description.game.part1.3")}
          </li>
          <li>
            {t("rules.description.game.part2")}
            <span>{t("rules.description.players")}</span>
          </li>
          <li>
            {t("rules.description.game.part3.1")}
            <span> {t("rules.description.rounds")}</span>.{" "}
            {t("rules.description.game.part3.2")}
          </li>
          <li>
            {t("rules.description.game.part4")}

            <span> {t("rules.description.seconds")}</span>
          </li>
          <li>
            {t("rules.description.game.part5.1")}
            <span> {t("rules.description.game.part5.2")}</span>
          </li>
          <li>
            {t("rules.description.game.part6")}
            <span> {t("rules.description.language")}</span>
            {t("rules.description.game.part6-1")}
            {t("rules.description.game.part6-2")}
            <span> {t("rules.description.english")}</span>
            {t("rules.description.game.part6-4")}
          </li>
        </ul>
        <h3>{t("rules.gameRules.title")}</h3>
        <ul className="rules-list">
          <li> {t("rules.gameRules.rules.part1")}</li>
          <li> {t("rules.gameRules.rules.part2")}</li>
          <li>
            <span>{t("rules.gameRules.rules.part3.1")}</span>{" "}
            {t("rules.gameRules.rules.part3.2")}
          </li>
        </ul>
        <h3>{t("rules.scoringRules.title")}</h3>
        <ul className="rules-list">
          <li>
            {t("rules.scoringRules.rules.part1.1")}
            <span> {t("rules.scoringRules.5_points")}</span>
            {t("rules.scoringRules.rules.part1.2")}
          </li>
          <li>
            {" "}
            {t("rules.scoringRules.rules.part2")}
            <span> {t("rules.scoringRules.0_points")}</span>
          </li>
          <li>{t("rules.scoringRules.rules.part3")}</li>
        </ul>
      </div>
      <button className="back-button" onClick={handleClick}>
        {t("rules.back")}
      </button>
    </div>
  );
};

export default Rules;
