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

switch (bundle) {
  case 'com.atlantm.app': // iOS BY
  case 'com.atlantm': // Android BY
    appRegion = 'by';
    errorNetwork = 'Отсутствует интернет соединение';
    appleID = '1492492166';
    googleID = 'com.atlantm';
    appName = 'Atlant-M';
    sentryDSN = 'https://2e35f2a2455b4a3d97a1687270845d33@sentry.io/219899';
    oneSignalKey = '2094a3e1-3c9a-479d-90ae-93adfcd15dab';
    fbAppID = '423573815015675';
    break;
  case 'ua.atlantm.app': // iOS UA + Android UA
    appRegion = 'ua';
    errorNetwork = "Відсутнє інтернет з'єднання";
    appleID = '1619839155';
    googleID = 'ua.atlantm.app';
    appName = 'Автодім Атлант';
    sentryDSN =
      'https://3bf79e8300e2427ca03f48301da3a7d9@o76005.ingest.sentry.io/6367469';
    oneSignalKey = '23d97877-865c-41a5-ba26-2a569779716a';
    fbAppID = '700128474599615';
    break;
}

export const APP_REGION = appRegion;

export const RUSSIA = 'ru';
export const BELARUSSIA = 'by';
export const UKRAINE = 'ua';

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

export const VK_APP_ID = '7255802';

export const FB_APP_ID = fbAppID;

export const AWS_CONFIG = {
  accessKeyId: 'AKIAZDKV34JAX4U7TWK4',
  secretAccessKey: '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',
  region: 'eu-west-1',
};

export const AUTH_DATA = {
  by: {
    GoogleSignin: {
      webClientId:
        '53201529704-4fl35lhveh4lvcdj9o3nli0fpk8c942r.apps.googleusercontent.com',
      iosClientId:
        '53201529704-pofi5bbpvo7dtnuu521lo00f3bl6qiq2.apps.googleusercontent.com',
    },
  },
  ua: {
    GoogleSignin: {
      webClientId:
        '53201529704-ekmnngknqo6tdds5luqc795f39fk9e3v.apps.googleusercontent.com',
      iosClientId:
        '53201529704-si8a87cj8tto6rmrlkmv9bookjmvn36n.apps.googleusercontent.com',
    },
  },
};

export const API_MAIN_KEY = {
  by: {
    Android: 'M8ttryMRXs6aTqfH4zNFSPUC78eKoVr3bw5cRwDe',
    iOS: 'kZJt475LBU3B7aL82j43l7IBab165xbiuIqIqcv9',
  },
  ua: {
    Android: 'r8dz07065z5vyddYaPx2C8K4FuHQRbsM13hPlX1O',
    iOS: 'HzKtwpq5Nd1KL4jMUKS2K5lz6sSGTS8X1dLZ5tgR',
  },
};
