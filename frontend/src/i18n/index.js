import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr from './locales/fr.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
]

export const LOCALE_MAP = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-MA',
}

export const RTL_LOCALES = ['ar']

export const getDateLocale = () => LOCALE_MAP[i18n.language] || 'fr-FR'

const applyDocumentDirection = (lng) => {
  const dir = RTL_LOCALES.includes(lng) ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'ar'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'eduprim_lang',
    },
  })

applyDocumentDirection(i18n.language)

i18n.on('languageChanged', applyDocumentDirection)

export default i18n
