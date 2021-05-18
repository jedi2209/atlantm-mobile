import store from '../core/store';
import {get} from 'lodash';
import {Amplitude} from '@amplitude/react-native';

export default class Analytics {
  static logEvent(category, action, params) {
    const SAPID = get(store.getState(), 'profile.login.SAP.ID');
    const UserID = get(store.getState(), 'profile.login.id');
    if (!__DEV__) {
      Amplitude.getInstance().init('XXXX');
      if (SAPID || UserID) {
        Amplitude.getInstance().setUserId(SAPID ? SAPID : UserID);
      }
      Amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
