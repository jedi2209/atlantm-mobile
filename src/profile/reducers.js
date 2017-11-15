import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { get } from 'lodash';
import {
  PROFILE_CAR__FILL,
  PROFILE_NAME__FILL,
  PROFILE_PHONE__FILL,
  PROFILE_EMAIL__FILL,
  PROFILE_CAR_NUMBER__FILL,
} from './actionTypes';

function name(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.name', '');
    case PROFILE_NAME__FILL:
      return action.payload;
    default:
      return state;
  }
}

function phone(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.phone', '');
    case PROFILE_PHONE__FILL:
      return action.payload;
    default:
      return state;
  }
}

function email(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.email', '');
    case PROFILE_EMAIL__FILL:
      return action.payload;
    default:
      return state;
  }
}

function car(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.car', '');
    case PROFILE_CAR__FILL:
      return action.payload;
    default:
      return state;
  }
}

function carNumber(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.carNumber', '');
    case PROFILE_CAR_NUMBER__FILL:
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  name,
  phone,
  email,
  car,
  carNumber,
});
