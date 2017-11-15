import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {
  TVA__REQUEST,
  TVA__SUCCESS,
  TVA__FAIL,

  TVA_SEND_MESSAGE__REQUEST,
  TVA_SEND_MESSAGE__SUCCESS,
  TVA_SEND_MESSAGE__FAIL,
  TVA_MESSAGE__FILL,

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

// TODO: разобраться, почему не удается удалить поле, падает redux
function carNumber(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
      return null;
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
  carNumber,
  results,
  message,
  activeOrderId,
  meta: combineReducers({
    isRequest,
    isMessageSending,
  }),
});
