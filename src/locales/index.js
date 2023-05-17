import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";
import fr from "./fr.json";

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },

  fr: {
    translation: fr,
  },
};

const language = sessionStorage.getItem("language");

i18n.use(initReactI18next).init({
  resources,
  lng: language || "en",
  fallbackLng: "en",
  compatibilityJSON: "v3",
  interpolation: {
    escapeValue: false,
  },
});
