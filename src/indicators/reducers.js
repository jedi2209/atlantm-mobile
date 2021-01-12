import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/constants';
import {
  INDICATORS__REQUEST,
  INDICATORS__SUCCESS,
  INDICATORS__FAIL,
  INDICATOR_ACTIVE__SET,
} from './actionTypes';

function activeItem(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case INDICATOR_ACTIVE__SET:
      return action.payload;
    default:
      return state;
  }
}

function items(state = [], action) {
  switch (action.type) {
    // case REHYDRATE:
    //   return get(action, 'payload.indicators.items', []);
    case INDICATORS__REQUEST:
    case INDICATORS__FAIL:
      return [];
    case INDICATORS__SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

function isRequest(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case INDICATORS__SUCCESS:
    case INDICATORS__FAIL:
      return false;
    case INDICATORS__REQUEST:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  items,
  activeItem,
  meta: combineReducers({
    isRequest,
  }),
});
