import {store} from '@core/store';
import {get} from 'lodash';

export default class UserData {
  static get(param) {
    let localData = get(store.getState(), 'profile.localUserData.' + param);
    let liveData = get(store.getState(), 'profile.login.' + param);
    if (typeof localData === 'object') {
      localData = localData[0];
    }
    if (typeof liveData === 'object') {
      liveData = liveData[0];
      if (liveData.VALUE) {
        liveData = liveData.VALUE;
      }
    }
    return liveData ? liveData : localData;
  }
}
