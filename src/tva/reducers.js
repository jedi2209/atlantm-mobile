import {combineReducers} from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {
  TVA__REQUEST,
  TVA__SUCCESS,
  TVA__FAIL,
  TVA_SEND_MESSAGE__REQUEST,
  TVA_SEND_MESSAGE__SUCCESS,
  TVA_SEND_MESSAGE__FAIL,
  TVA_MESSAGE__FILL,
  TVA_PUSH_TRACKING__SET,
  TVA_ORDER_ID__SET,
} from './actionTypes';

function message(state = '', action) {
  switch (action.type) {
    case TVA_MESSAGE__FILL:
      return action.payload;
    default:
      return state;
  }
}

function pushTracking(state = false, action) {
  switch (action.type) {
    case TVA_PUSH_TRACKING__SET:
      return action.payload;
    default:
      return state;
  }
}

function activeOrderId(state = '', action) {
  switch (action.type) {
    case TVA_ORDER_ID__SET:
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

function results(state = {}, action) {
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

function isMessageSending(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case TVA_SEND_MESSAGE__SUCCESS:
    case TVA_SEND_MESSAGE__FAIL:
      return false;
    case TVA_SEND_MESSAGE__REQUEST:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  results,
  message,
  pushTracking,
  activeOrderId,
  meta: combineReducers({
    isRequest,
    isMessageSending,
  }),
});
