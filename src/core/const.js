import DeviceInfo from 'react-native-device-info';

const bundle = DeviceInfo.getBundleId();

let appRegion,
  errorNetwork,
  appleID,
  googleID,
  appName,
  sentryDSN,
  oneSignalKey,
  fbAppID = null;

export const RUSSIA = 'ru';
export const BELARUSSIA = 'by';
export const UKRAINE = 'ua';

switch (bundle) {
  case 'com.atlantm.app': // iOS BY
  case 'com.atlantm': // Android BY
    appRegion = BELARUSSIA;
    errorNetwork = 'Отсутствует интернет соединение';
    appleID = 'XXXX';
    googleID = 'com.atlantm';
    appName = 'Atlant-M';
    sentryDSN = 'https://XXXX@sentry.io/219899';
    oneSignalKey = 'XXXX';
    fbAppID = 'XXXX';
    break;
  case 'ua.atlantm.app': // iOS UA + Android UA
    appRegion = UKRAINE;
    errorNetwork = "Відсутнє інтернет з'єднання";
    appleID = '1619839155';
    googleID = 'ua.atlantm.app';
    appName = 'Автодім Атлант';
    sentryDSN =
      'https://XXXX@o76005.ingest.sentry.io/6367469';
    oneSignalKey = 'XXXX';
    fbAppID = 'XXXX';
    break;
}

export const APP_REGION = appRegion;

export const ERROR_NETWORK = errorNetwork;

export const AppleAppID = appleID;
export const GooglePackageName = googleID;

export const STORE_LINK = {
  ios: `itms-apps://itunes.apple.com/app/id${AppleAppID}?action=update`,
  android: `market://details?id=${GooglePackageName}`,
};

export const API_MAIN_URL = 'https://api.atlantm.com/v1';
export const CHAT_MAIN_SOCKET = 'wss://livechat.atlantm.com/v1';

export const SENTRY_DSN = sentryDSN;

export const APP_NAME = appName;

export const APP_EMAIL = 'atlant-m.corp@atlantm.com';

export const ONESIGNAL = oneSignalKey;

export const VK_APP_ID = 'XXXX';

export const FB_APP_ID = fbAppID;

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

export const API_MAIN_KEY = {
  by: {
    Android: 'XXXX',
    iOS: 'XXXX',
  },
  ua: {
    Android: 'XXXX',
    iOS: 'XXXX',
  },
};
