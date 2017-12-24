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

import { APP_FCM_TOKEN__SET, APP_PUSH_GRANTED__SET } from './actionTypes';

const fcmToken = (state = null, action) => {
  switch (action.type) {
    case APP_FCM_TOKEN__SET:
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

const coreReducer = combineReducers({
  fcmToken,
  pushGranted,
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
