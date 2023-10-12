import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Fetch from 'i18next-fetch-backend';

i18n.use(Fetch)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        ns: ['translation'],
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            init: {
                mode: 'no-cors',
                credentials: 'include',
                cache: 'default'
            }
        }
    })
