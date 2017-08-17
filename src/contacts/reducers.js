import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
} from './actionTypes';

function isСallMeRequest(state = false, action) {
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
}

function isСallMeSuccess(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case CALL_ME__REQUEST:
    case CALL_ME__FAIL:
      return false;
    case CALL_ME__SUCCESS:
      return true;
    default:
      return state;
  }
}

function isСallMeFail(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case CALL_ME__REQUEST:
    case CALL_ME__SUCCESS:
      return false;
    case CALL_ME__FAIL:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  isСallMeRequest,
  isСallMeSuccess,
  isСallMeFail,
});
