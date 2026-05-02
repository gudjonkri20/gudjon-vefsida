import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import is from './locales/is.json';

export const SUPPORTED_LANGUAGES = ['en', 'is'] as const;

const urlPathDetector = {
  name: 'urlPath',
  lookup() {
    if (typeof window === 'undefined') return undefined;
    const path = window.location.pathname;
    if (path === '/is' || path.startsWith('/is/')) {
      return 'is';
    }
    return 'en';
  },
  cacheUserLanguage() {
    /* no-op — URL is the source of truth */
  },
};

const detector = new LanguageDetector();
detector.addDetector(urlPathDetector);

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      is: { translation: is },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['urlPath', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    returnObjects: false,
  });

export default i18n;
