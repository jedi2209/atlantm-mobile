import {store} from '../core/store';
import {get} from 'lodash';

const amplitude = require('amplitude-js');

export default class Amplitude {
  static logEvent(category, action, params) {
    const SAPID = get(store.getState(), 'profile.login.SAP.ID');
    const UserID = get(store.getState(), 'profile.login.id');
    if (!__DEV__) {
      amplitude.getInstance().init('XXXX');
      if (SAPID || UserID) {
        amplitude.getInstance().setUserId(SAPID ? SAPID : UserID);
      }
      amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
