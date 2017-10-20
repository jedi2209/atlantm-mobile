import { combineReducers } from 'redux';
import { get } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import {
  SERVICE_ORDER__REQUEST,
  SERVICE_ORDER__SUCCESS,
  SERVICE_ORDER__FAIL,

  SERVICE_CAR__FILL,
  SERVICE_DATE__FILL,
} from './actionTypes';

function car(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'service.car', '');
    case SERVICE_CAR__FILL:
      return action.payload;
    default:
      return state;
  }
}

function date(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case SERVICE_DATE__FILL:
      return action.payload;
    default:
      return state;
  }
}

function isOrderServiceRequest(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case SERVICE_ORDER__SUCCESS:
    case SERVICE_ORDER__FAIL:
      return false;
    case SERVICE_ORDER__REQUEST:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  car,
  date,
  meta: combineReducers({
    isOrderServiceRequest,
  }),
});
