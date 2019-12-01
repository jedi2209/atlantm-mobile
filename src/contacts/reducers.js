import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist';
import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
  CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE,
} from './actionTypes';

const isСallMeRequest = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
    case CALL_ME__SUCCESS:
    case CALL_ME__FAIL:
      return false;
    case CALL_ME__REQUEST:
      return true;
    default:
      return state;
  }
};

const isRequestCheckAvailableNaviApps = (state = false, action) => {
  switch (action.type) {
    case CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST:
      return true;
    case REHYDRATE:
    case CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE:
      return false;
    default:
      return state;
  }
};

const availableNaviApps = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return [];
    case CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  isСallMeRequest,
  map: combineReducers({
    availableNaviApps,
    isRequestCheckAvailableNaviApps,
  }),
});
