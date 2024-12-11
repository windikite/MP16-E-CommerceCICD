import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(initReactI18next) //Passes i18n instance to react-i18n
    .use(LanguageDetector) //Detects user language
    .use(HttpBackend) //Loads translations using xhr - here, from /public/locales
    //Init i18next
    .init({
        //The default language
        fallbackLng: 'en',
        debug: true, //Set to true to see logs in console
        //Options for language detector
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['cookie']
        },
        //Options for the backend
        backend: {
            loadPath: '/locales/{{lng}}/translation.json'
        },
        interpolation: {
            escapeValue: false, //Not needed for react as it escapes by default. This is for security to escape text in inputs so that code does not get submitted
        }
    })

export default i18n;