import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import {
  INFO_LIST__REQUEST,
  INFO_LIST__SUCCESS,
  INFO_LIST__FAIL,

  INFO_POST__REQUEST,
  INFO_POST__SUCCESS,
  INFO_POST__FAIL,
} from './actionTypes';

import { DEALER__SELECT } from '../dealer/actionTypes';

function visited(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return [];
    case INFO_POST__SUCCESS:
      return [
        ...state,
        action.payload,
      ];
    case DEALER__SELECT:
      return [];
    default:
      return state;
  }
}

function isFetchInfoList(state = false, action) {
  switch (action.type) {
    case INFO_LIST__REQUEST:
      return true;
    case INFO_LIST__SUCCESS:
    case INFO_LIST__FAIL:
      return false;
    default:
      return state;
  }
}

function isFetchInfoPost(state = false, action) {
  switch (action.type) {
    case INFO_POST__REQUEST:
      return true;
    case INFO_POST__SUCCESS:
    case INFO_POST__FAIL:
      return false;
    default:
      return state;
  }
}

function list(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'info.list', []);
    case INFO_LIST__SUCCESS:
      return action.payload;
    case DEALER__SELECT:
      return [];
    default:
      return state;
  }
}

function post(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case INFO_POST__SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  visited,
  list,
  post,
  meta: combineReducers({
    isFetchInfoList,
    isFetchInfoPost,
  }),
});
