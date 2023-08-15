import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get} from 'lodash';
import {
  INFO_LIST__REQUEST,
  INFO_LIST__SUCCESS,
  INFO_LIST__SUCCESS_DEALER,
  INFO_LIST__FAIL,
  INFO_LIST__FAIL_DEALER,
  INFO_POST__REQUEST,
  INFO_LIST__REQUEST_DEALER,
  INFO_POST__SUCCESS,
  INFO_POST__FAIL,
  INFO_LIST__RESET,
  INFO_LIST__RESET_DEALER,
  CALL_ME_INFO__REQUEST,
  CALL_ME_INFO__SUCCESS,
  CALL_ME_INFO__FAIL,
} from './actionTypes';

import {DEALER__SUCCESS} from '../dealer/actionTypes';

function visited(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.info.visited', []);
    case INFO_POST__SUCCESS:
      return [...state, action.payload.id];
    case DEALER__SUCCESS:
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

function isFetchInfoListDealer(state = false, action) {
  switch (action.type) {
    case INFO_LIST__REQUEST_DEALER:
      return true;
    case INFO_LIST__SUCCESS_DEALER:
    case INFO_LIST__FAIL_DEALER:
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

function isCallMeRequest(state = false, action) {
  switch (action.type) {
    case CALL_ME_INFO__REQUEST:
      return true;
    case CALL_ME_INFO__SUCCESS:
    case CALL_ME_INFO__FAIL:
      return false;
    default:
      return state;
  }
}

function list(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'info.list', []);
    case INFO_LIST__SUCCESS:
      return action.payload?.data;
    case INFO_LIST__RESET:
      return [];
    default:
      return state;
  }
}

function listDealer(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'info.listDealer', []);
    case INFO_LIST__SUCCESS_DEALER:
      return action.payload?.data;
    case DEALER__SUCCESS:
    case INFO_LIST__RESET_DEALER:
      return [];
    default:
      return state;
  }
}

function filters(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'info.filters', []);
    case INFO_LIST__SUCCESS:
      return action.payload?.filters;
    case INFO_LIST__RESET:
      return [];
    default:
      return state;
  }
}

function filtersDealer(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'info.filtersDealer', []);
    case INFO_LIST__SUCCESS_DEALER:
      return action.payload?.filters;
    case DEALER__SUCCESS:
    case INFO_LIST__RESET_DEALER:
      return [];
    default:
      return state;
  }
}

function posts(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case INFO_POST__SUCCESS:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  visited,
  list,
  listDealer,
  posts,
  filters,
  filtersDealer,
  meta: combineReducers({
    isFetchInfoList,
    isFetchInfoListDealer,
    isFetchInfoPost,
    isCallMeRequest,
  }),
});
