// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import mr from "./locales/mr.json";
import hi from "./locales/hi.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loadLanguagePreference = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("language");
    return savedLanguage || "en"; // Return saved language or default to 'en'
  } catch (error) {
    console.error("Error loading language preference:", error);
    return "en"; // Default to 'en' in case of error
  }
};

const initializeI18n = async () => {
  const initialLanguage = await loadLanguagePreference();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: en,
        },
        mr: {
          translation: mr,
        },
        hi: { 
          translation: hi,
        },
      },
      lng: initialLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

initializeI18n();

export default i18n;