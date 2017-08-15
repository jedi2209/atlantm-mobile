import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import {
  DEALER__SET,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,
} from './actionTypes';

function data(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.data', null);
    case DEALER__SET:
      return { ...action.payload };
    default:
      return state;
  }
}

function list(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return [];
    case DEALERS__SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
}

function isFetch(state = false, action) {
  switch (action.type) {
    case DEALERS__REQUEST:
      return true;
    case DEALERS__SUCCESS:
    case DEALERS__FAIL:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  data,
  list,
  meta: combineReducers({
    isFetch,
  }),
});
