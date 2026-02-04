import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  ar: { translation: ar },
};

// Detect the language code safely
const getLocale = () => {
    try {
        const locales = Localization.getLocales();
        if (locales && locales.length > 0) {
            return locales[0].languageCode ?? 'en';
        }
    } catch (e) {
        console.warn('Error getting locale', e);
    }
    return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocale(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    compatibilityJSON: 'v4', 
  });

export default i18n;
