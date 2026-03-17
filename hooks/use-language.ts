import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export type SupportedLanguage = 'ru' | 'kz' | 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'kz', 'en'];

export function useLanguage() {
  const { i18n: i18nInstance } = useTranslation();

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  }, []);

  return {
    activeLanguage: i18nInstance.language as SupportedLanguage,
    changeLanguage,
  };
}
