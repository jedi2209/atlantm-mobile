import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { REHYDRATE } from 'redux-persist';
import { get } from 'lodash';
import dealer from '../dealer/reducers';
import nav from '../navigation/reducers';
import tva from '../tva/reducers';
import eko from '../eko/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import service from '../service/reducers';
import contacts from '../contacts/reducers';
import catalog from '../catalog/reducers';
import indicators from '../indicators/reducers';

import {
    APP_FCM_TOKEN__SET,
    APP_PUSH_GRANTED__SET,
    APP_PREVIOUS_FCM_TOKEN__SET,
    APP_PUSH_ACTION_SUBSCRIBE__SET,
    APP_MENU_OPENED_COUNTER,
} from './actionTypes';

import { DEALER__SUCCESS } from '../dealer/actionTypes';

const fcmToken = (state = null, action) => {
  switch (action.type) {
    case APP_FCM_TOKEN__SET:
      return action.payload;
    default:
      return state;
  }
};

const previousFcmToken = (state = null, action) => {
  switch (action.type) {
    case APP_PREVIOUS_FCM_TOKEN__SET:
      return action.payload;
    default:
      return state;
  }
};

const pushGranted = (state = false, action) => {
  switch (action.type) {
    case APP_PUSH_GRANTED__SET:
      return action.payload;
    default:
      return state;
  }
};

const pushActionSubscribe = (state = false, action) => {
  switch (action.type) {
    case APP_PUSH_ACTION_SUBSCRIBE__SET:
      return action.payload;
    default:
      return state;
  }
};

const menuOpenedCount = (state = 0, action) => {
    switch (action.type) {
        case REHYDRATE:
            return get(action.payload, 'core.menuOpenedCount', '');
        case APP_MENU_OPENED_COUNTER:
            if (action.payload === 0) {
                return 0;
            }
            return ++state;
        default:
            return state;
    }
};

const coreReducer = combineReducers({
  fcmToken,
  previousFcmToken,
  pushGranted,
  pushActionSubscribe,
  menuOpenedCount,
});

const rootReducer = combineReducers({
  nav,
  tva,
  eko,
  info,
  dealer,
  service,
  profile,
  catalog,
  contacts,
  indicators,
  core: coreReducer,
  form: formReducer,
});

export default rootReducer;
