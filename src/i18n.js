import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './translations/en/admin.json'
import ro from './translations/ro/admin.json'
import ru from './translations/ru/admin.json'

const resources = {
  en: {
    translation: en
  },
  ro: {
    translation: ro
  },
  ru: {
    translation: ru
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources,
    // lng: 'ro',
    supportedLngs: ['ro', 'en', 'ru'],
    fallbackLng: 'ro',
    detection: {
        order: ['cookie', 'localStorage', 'htmlTag', 'sessionStorage', 'path', 'subdomain'],
        caches: ['cookie', 'localStorage']
    },
    interpolation: {
        escapeValue: false // react already safes from xss
    },
    react: { useSuspense: false }
  })

export default i18n