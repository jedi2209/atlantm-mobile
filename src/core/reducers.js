import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get} from 'lodash';
import dealer from '../dealer/reducers';
import tva from '../tva/reducers';
import eko from '../eko/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import service from '../service/reducers';
import contacts from '../contacts/reducers';
import catalog from '../catalog/reducers';
import language from './lang/reducers';
import settings from '../settings/reducers';

import {
  APP_PUSH_ACTION_SUBSCRIBE__SET,
  APP_MENU_OPENED_COUNTER,
  APP_WALKTROUGH_SHOWN,
  APP_ACTION_RATED,
  APP_STORE_UPDATED,
  APP_SETTINGS_LOADED,
  APP_LOADED,
  MAIN_SCREEN__SUCCESS,
  MAIN_SCREEN__FAIL,
} from './actionTypes';

const pushActionSubscribeState = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      console.log(
        '\r\n\r\n\t\tpushActionSubscribeState REHYDRATE',
        state,
        action,
        get(action, 'payload.core.pushActionSubscribeState'),
      );
      return get(action, 'payload.core.pushActionSubscribeState', false);
    case APP_PUSH_ACTION_SUBSCRIBE__SET:
      console.log(
        '\r\n\r\n\t\tpushActionSubscribeState APP_PUSH_ACTION_SUBSCRIBE__SET',
        state,
        action,
        get(action, 'payload.core.pushActionSubscribeState'),
      );
      return action.payload;
    case APP_STORE_UPDATED:
      console.log(
        '\r\n\r\n\t\tpushActionSubscribeState APP_STORE_UPDATED',
        state,
        action,
        get(action, 'payload.core.pushActionSubscribeState'),
      );
      return state;
    default:
      return state;
  }
};

const menuOpenedCount = (state = 0, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.core.menuOpenedCount', 0);
    case APP_MENU_OPENED_COUNTER:
      if ([0, 999].includes(parseInt(action.payload))) {
        return action.payload;
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
      return get(action.payload, 'core.isAppRated', false);
    case APP_ACTION_RATED:
      if (action.payload === false) {
        return false;
      }
      return true;
    case APP_STORE_UPDATED:
      return false;
    default:
      return state;
  }
};

const isAppLoaded = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return false;
    case APP_LOADED:
      return action.payload;
    default:
      return state;
  }
};

const isWalkthroughShown = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.isWalkthroughShown', false);
    case APP_STORE_UPDATED:
      return false;
    case APP_WALKTROUGH_SHOWN:
      return action.payload;
    default:
      return state;
  }
};

const isStoreUpdated = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.isStoreUpdated', false);
    case APP_STORE_UPDATED:
      return action.payload;
    default:
      return state;
  }
};

const settingsCore = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.settings', false);
    case APP_SETTINGS_LOADED:
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

const mainScreenSettings = (state = {}, action) => {
  switch (action.type) {
    case MAIN_SCREEN__SUCCESS:
      return action.payload;
    case MAIN_SCREEN__FAIL:
      return state;
    default:
      return state;
  }
};

const coreReducer = combineReducers({
  pushActionSubscribeState,
  menuOpenedCount,
  isAppRated,
  isAppLoaded,
  isWalkthroughShown,
  isStoreUpdated,
  language,
  settings: settingsCore,
  mainScreenSettings,
});

const rootReducer = combineReducers({
  modal,
  tva,
  eko,
  info,
  dealer,
  service,
  profile,
  catalog,
  contacts,
  core: coreReducer,
  settings,
});

export default rootReducer;
