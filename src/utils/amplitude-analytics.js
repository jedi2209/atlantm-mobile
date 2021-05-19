import {store} from '../core/store';
import {get} from 'lodash';
import {Amplitude} from '@amplitude/react-native';

export default class Analytics {
  static logEvent(category, action, params) {
    const SAPID = get(store.getState(), 'profile.login.SAP.ID');
    const UserID = get(store.getState(), 'profile.login.id');
    if (!__DEV__) {
      Amplitude.getInstance().init('2716d7eebc63593e80e4fd172fc8b6f3');
      if (SAPID || UserID) {
        Amplitude.getInstance().setUserId(SAPID ? SAPID : UserID);
      }
      Amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
