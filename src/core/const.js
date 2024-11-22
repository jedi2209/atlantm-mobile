import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

const bundle = DeviceInfo.getBundleId();

let appRegion,
  apiLang,
  errorNetwork,
  appleID,
  googleID,
  appName,
  dealersSettings,
  appEmail,
  appsFlyerSettings,
  sentryDSN,
  logrocketID,
  bugsnagID,
  oneSignalKey,
  amplitudeKey,
  appMetricaKey,
  appLang,
  countrySettings,
  countryList,
  phoneRestricted,
  fbAppID,
  jivoChat = null;

export const RUSSIA = 'ru';
export const BELARUSSIA = 'by';
export const UKRAINE = 'ua';

switch (bundle) {
  case 'com.atlantm.app': // iOS BY
  case 'com.atlantm': // Android BY
    appRegion = BELARUSSIA;
    appLang = 'ru';
    apiLang = 'ru';
    countrySettings = ['by', 'ru'];
    countryList = require('./const.countries_by.json');
    appEmail = 'atlant-m.corp@atlantm.com';
    phoneRestricted = 'ua';
    errorNetwork = 'Отсутствует интернет соединение';
    appleID = 'XXXX';
    googleID = 'com.atlantm';
    appName = 'Atlant-M';
    dealersSettings = {
      hideBrands: [220],
    };
    appsFlyerSettings = {
      devKey: 'XXXX',
      appId: appleID,
      onInstallConversionDataListener: false, //Optional
      onDeepLinkListener: true, //Optional
      timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
    };
    sentryDSN = 'https://XXXX@sentry.io/219899';
    logrocketID = 'XXXX/atlant-m';
    bugsnagID = 'XXXX';
    oneSignalKey = 'XXXX';
    amplitudeKey = 'XXXX';
    appMetricaKey = 'XXXX';
    fbAppID = 'XXXX';
    jivoChat = {
      chatPage: 'https://XXXX/v1/jivo/widget/XXXX/',
      chatID: 'XXXX',
      secret: 'XXXX$C&F)J@NcRfUj',
      socket: 'wss://livechat.atlantm.com/v1',
    };
    break;
  case 'ua.atlantm.app': // iOS UA + Android UA
    appRegion = UKRAINE;
    appLang = 'uk';
    apiLang = 'ua';
    countrySettings = ['ua'];
    phoneRestricted = ['ru', 'by'];
    countryList = require('./const.countries_ua.json');
    appEmail = 'info@vw-atlant.com.ua';
    errorNetwork = "Відсутнє інтернет з'єднання";
    appleID = '1619839155';
    googleID = 'ua.atlantm.app';
    appName = 'Автодім Атлант';
    dealersSettings = {
      hideBrands: [220, 137],
    };
    appsFlyerSettings = {
      devKey: 'XXXX',
      appId: appleID,
      onInstallConversionDataListener: false, //Optional
      onDeepLinkListener: true, //Optional
      timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
    };
    sentryDSN =
      'https://XXXX@o76005.ingest.sentry.io/6367469';
    logrocketID = 'XXXX/atlant-m';
    bugsnagID = 'XXXX';
    oneSignalKey = 'XXXX';
    amplitudeKey = 'XXXX';
    fbAppID = 'XXXX';
    jivoChat = {
      chatPage: 'https://XXXX/v1/jivo/widget/XXXX/',
      chatID: 'XXXX',
      secret: 'XXXX$C&F)J@NcRfUj',
      socket: 'wss://livechat.atlantm.com/v1',
    };
    break;
}

export const COORDS_DEFAULT = {
  by: {
    // Minsk
    lat: 53.893009,
    lon: 27.567444,
  },
  ru: {
    // Moscow
    lat: 55.751244,
    lon: 37.618423,
  },
  ua: {
    // Kiev
    lat: 50.450001,
    lon: 30.523333,
  },
};

export const APP_LOCALE = {
  ru: 'ru-RU',
  by: 'ru-RU',
  ua: 'uk-UK',
};

export const DEFAULT_CITY = {
  by: {
    id: 5,
    name: 'Минск',
  },
  ru: {
    id: 1,
    name: 'Москва',
  },
  ua: {
    id: 7,
    name: 'Київ',
  },
};

export const APP_LANG = appLang;

export const API_LANG = apiLang;
export const APP_REGION = appRegion;
export const APP_COUNTRY_SETTINGS = countrySettings;
export const APP_COUNTRY_LIST = countryList;
export const APP_PHONE_RESTRICTED = phoneRestricted;

export const ERROR_NETWORK = errorNetwork;

export const AppleAppID = appleID;
export const GooglePackageName = googleID;

export const STORE_LINK = {
  update: Platform.select({
    ios: `itms-apps://itunes.apple.com/app/id${AppleAppID}?action=update`,
    android: `market://details?id=${GooglePackageName}`,
  }),
  review: Platform.select({
    ios: `itms-apps://apps.apple.com/app/id${AppleAppID}?action=write-review`,
    android: `market://details?id=${GooglePackageName}`,
  }),
};

export const API_MAIN_URL = [
  'https://XXXX/v1',
  'https://XXXX/v1',
  'https://XXXX/v1',
];

export const SENTRY_DSN = sentryDSN;

export const LOG_ROCKET_ID = logrocketID;

export const BUGSNAG_ID = bugsnagID;

export const APPSFLYER_SETTINGS = appsFlyerSettings;

export const APP_NAME = appName;

export const DEALERS_SETTINGS = dealersSettings;

export const APP_EMAIL = appEmail;

export const ONESIGNAL = oneSignalKey;

export const AMPLITUDE_KEY = amplitudeKey;

export const APP_METRICA_API_KEY = appMetricaKey;

export const VK_APP_ID = 'XXXX';

export const FB_APP_ID = fbAppID;

export const JIVO_CHAT = jivoChat;

export const AWS_CONFIG = {
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX/XXXX',
  region: 'eu-west-1',
};

export const AUTH_DATA = {
  by: {
    GoogleSignin: {
      webClientId:
        'XXXX-XXXX.apps.googleusercontent.com',
      iosClientId:
        'XXXX-XXXX.apps.googleusercontent.com',
    },
  },
  ua: {
    GoogleSignin: {
      webClientId:
        'XXXX-ekmnngknqo6tdds5luqc795f39fk9e3v.apps.googleusercontent.com',
      iosClientId:
        'XXXX-si8a87cj8tto6rmrlkmv9bookjmvn36n.apps.googleusercontent.com',
    },
  },
};

const apiKey = {
  by: Platform.select({
    ios: 'XXXX',
    android: 'XXXX',
  }),
  ua: Platform.select({
    ios: 'XXXX',
    android: 'XXXX',
  }),
};

export const API_MAIN_KEY = apiKey[APP_REGION];
