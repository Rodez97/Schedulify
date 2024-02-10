import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import spanish from "./i18n/es.json";
import english from "./i18n/en.json";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const fallbackLng = ["en"];
const availableLanguages = ["en", "es"];

void i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init(
    {
      resources: {
        en: {translation: english},
        es: {translation: spanish},
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },
      preload: ["en", "es"],
      fallbackLng,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      supportedLngs: availableLanguages,
    },
    err => {
      if (err != null) {
        console.log(err);
      }
      dayjs.locale(i18n.language);
    },
  );

export default i18n;
