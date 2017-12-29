import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
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

const pushActionSubscribe = (state = true, action) => {
  switch (action.type) {
    case APP_PUSH_ACTION_SUBSCRIBE__SET:
      return action.payload;
    case DEALER__SUCCESS:
      return true;
    default:
      return state;
  }
};

const coreReducer = combineReducers({
  fcmToken,
  previousFcmToken,
  pushGranted,
  pushActionSubscribe,
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
