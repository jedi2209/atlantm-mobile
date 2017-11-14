import { combineReducers } from 'redux';
import { get } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import {
  TVA__REQUEST,
  TVA__SUCCESS,
  TVA__FAIL,

  TVA_CAR_NUMBER__FILL,
} from './actionTypes';

function carNumber(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'tva.carNumber', '');
    case TVA_CAR_NUMBER__FILL:
      return action.payload;
    default:
      return state;
  }
}

function isRequest(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case TVA__SUCCESS:
    case TVA__FAIL:
      return false;
    case TVA__REQUEST:
      return true;
    default:
      return state;
  }
}

function searchResults(state = {}, action) {
  switch (action.type) {
    case TVA__SUCCESS:
      return action.payload;
    case TVA__FAIL:
    case TVA__REQUEST:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  searchResults,
  carNumber,
  meta: combineReducers({
    isRequest,
  }),
});
