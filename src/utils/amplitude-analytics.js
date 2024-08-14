import {store} from '../core/store';
import {get} from 'lodash';
import {Amplitude} from '@amplitude/react-native';
// import AppMetrica from 'react-native-appmetrica';
import * as Sentry from '@sentry/react-native';
import appsFlyer from 'react-native-appsflyer';

import {AMPLITUDE_KEY} from '../core/const';

export default class Analytics {
  static logEvent(category, action, params) {
    if (__DEV__) {
      return true;
    }
    if (typeof params === 'string') {
      params = {params};
    }
    const ampInstance = Amplitude.getInstance();
    const storeData = store.getState();
    const UserID = get(
      storeData,
      'profile.login.SAP.ID',
      get(storeData, 'profile.login.id'),
    );
    const UserEmail = get(storeData, 'profile.login.EMAIL[0].VALUE');
    ampInstance.init(AMPLITUDE_KEY);
    if (UserID) {
      ampInstance.setUserId(UserID);
      Sentry.setUser({
        id: UserID,
        email: UserEmail,
      });
    }
    ampInstance.logEvent(`${category}:${action}`, params);

    appsFlyer.logEvent(
      `${category}:${action}`,
      params,
      res => {
        console.log('appsFlyer.logEvent', res);
      },
      err => {
        console.error('appsFlyer.logEvent error => ', err);
      },
    );
    // AppMetrica.reportEvent(`${category}:${action}`, params);
  }
}
