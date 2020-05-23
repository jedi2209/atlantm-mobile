import {store} from '@core/store';
import {get} from 'lodash';

const amplitude = require('amplitude-js');

export default class Amplitude {
  static logEvent(category, action, params) {
    const SAPID = get(store.getState(), 'profile.login.SAP.ID');
    const UserID = get(store.getState(), 'profile.login.id');
    if (!__DEV__) {
      amplitude.getInstance().init('2716d7eebc63593e80e4fd172fc8b6f3');
      if (SAPID || UserID) {
        amplitude.getInstance().setUserId(SAPID ? SAPID : UserID);
      }
      amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
