import { useState, useCallback } from 'react';
import i18n from '@/i18n';

export type SupportedLanguage = 'ru' | 'kz' | 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'kz', 'en'];

export function useLanguage() {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) ?? 'en'
  );

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    setActiveLanguage(lang);
  }, []);

  return { activeLanguage, changeLanguage };
}
