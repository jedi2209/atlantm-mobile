import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {REHYDRATE} from 'redux-persist/constants';
import {get} from 'lodash';
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
import language from './lang/reducers';

import {
  APP_PUSH_GRANTED__SET,
  APP_PUSH_ACTION_SUBSCRIBE__SET,
  APP_MENU_OPENED_COUNTER,
  APP_ACTION_RATED,
  APP_STORE_UPDATED,
} from './actionTypes';

import {DEALER__SUCCESS} from '../dealer/actionTypes';

const pushGranted = (state = false, action) => {
  switch (action.type) {
    case APP_PUSH_GRANTED__SET:
      return action.payload;
    case APP_STORE_UPDATED:
      return state;
    default:
      return state;
  }
};

const pushActionSubscribeState = (state = true, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.pushActionSubscribeState', true);
    case APP_PUSH_ACTION_SUBSCRIBE__SET:
      return action.payload;
    case APP_STORE_UPDATED:
      return state;
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
    case APP_STORE_UPDATED:
      return 0;
    default:
      return state;
  }
};

const isAppRated = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.isAppRated', '');
    case APP_ACTION_RATED:
      return true;
    default:
      return state;
  }
};

const isStoreUpdated = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      const coreIsStoreUpdated = get(action.payload, 'core.isStoreUpdated');
      return coreIsStoreUpdated ? coreIsStoreUpdated : false;
    case APP_STORE_UPDATED:
      return action.payload;
    default:
      return state;
  }
};

const modal = (state = {application: false}, action) => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };
    default:
      return state;
  }
};

const coreReducer = combineReducers({
  pushGranted,
  pushActionSubscribeState,
  menuOpenedCount,
  isAppRated,
  isStoreUpdated,
  language,
});

const rootReducer = combineReducers({
  modal,
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
