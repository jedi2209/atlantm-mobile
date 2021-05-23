import {store} from '../core/store';
import {get} from 'lodash';
import {Amplitude} from '@amplitude/react-native';

export default class Analytics {
  static logEvent(category, action, params) {
    if (__DEV__) {
      return true;
    }
    if (typeof params === 'string') {
      params = {params};
    }
    const ampInstance = Amplitude.getInstance();
    const SAPID = get(store.getState(), 'profile.login.SAP.ID');
    const UserID = get(store.getState(), 'profile.login.id');
    ampInstance.init('XXXX');
    if (SAPID || UserID) {
      ampInstance.setUserId(SAPID ? SAPID : UserID);
    }
    ampInstance.logEvent(`${category}:${action}`, params);
  }
}
