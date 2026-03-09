import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kz from './locales/kz.json';

const SUPPORTED_LOCALES = ['en', 'ru', 'kz'] as const;
const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
const detectedLanguage = SUPPORTED_LOCALES.includes(deviceLocale as any)
  ? deviceLocale
  : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kz: { translation: kz },
  },
  lng: detectedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
