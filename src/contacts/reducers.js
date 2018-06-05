import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,

  CONTACTS_MAP_USER_LOCATION__REQUEST,
  CONTACTS_MAP_USER_LOCATION__DONE,
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

const isRequestUserLocation = (state = false, action) => {
  switch (action.type) {
  case CONTACTS_MAP_USER_LOCATION__REQUEST:
    return true;
  case CONTACTS_MAP_USER_LOCATION__DONE:
    return false;
  default:
    return state;
  }
};

export default combineReducers({
  isСallMeRequest,
  map: combineReducers({
    isRequestUserLocation,
  }),
});
