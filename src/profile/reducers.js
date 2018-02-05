import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { get } from 'lodash';
import {
  PROFILE_CAR__FILL,
  PROFILE_NAME__FILL,
  PROFILE_PHONE__FILL,
  PROFILE_EMAIL__FILL,
  PROFILE_CAR_NUMBER__FILL,
  PROFILE_CAR_VIN__FILL,

  PROFILE_LOGIN__FILL,
  PROFILE_PASSWORD__FILL,
  PROFILE_BONUS_LEVEL1__SET,
  PROFILE_BONUS_LEVEL2__SET,

  PROFILE_DATA__REQUEST,
  PROFILE_DATA__SUCCESS,
  PROFILE_DATA__FAIL,

  LOGOUT,
  LOGIN__SUCCESS,
  LOGIN__FAIL,
  LOGIN__REQUEST,
  REGISTER__SUCCESS,
  REGISTER__FAIL,
  REGISTER__REQUEST,

  CAR_HISTORY__REQUEST,
  CAR_HISTORY__SUCCESS,
  CAR_HISTORY__FAIL,
  CAR_HISTORY_LEVEL1__SET,
  CAR_HISTORY_LEVEL2__SET,
} from './actionTypes';

function name(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.name', '');
    case PROFILE_NAME__FILL:
      return action.payload;
    case LOGIN__SUCCESS:
      return get(action, 'payload.name.full');
    default:
      return state;
  }
}

function phone(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.phone', '');
    case PROFILE_PHONE__FILL:
      return action.payload;
    case LOGIN__SUCCESS:
      return get(action, 'payload.phone');
    default:
      return state;
  }
}

function email(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.email', '');
    case PROFILE_EMAIL__FILL:
      return action.payload;
    case LOGIN__SUCCESS:
      return get(action, 'payload.email');
    default:
      return state;
  }
}

// используется в случае, если пользователь авторизован
function cars(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.cars', []);
    case LOGIN__SUCCESS:
    case PROFILE_DATA__SUCCESS:
      return action.payload.cars;
    case LOGOUT:
      return [];
    default:
      return state;
  }
}

// используется в случае, если пользователь неавторизован
function car(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.car', '');
    case PROFILE_CAR__FILL:
      return action.payload;
    default:
      return state;
  }
}

function carNumber(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.carNumber', '');
    case PROFILE_CAR_NUMBER__FILL:
      return action.payload;
    default:
      return state;
  }
}

function carVIN(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.carVIN', '');
    case PROFILE_CAR_VIN__FILL:
      return action.payload;
    case REGISTER__SUCCESS:
      return '';
    default:
      return state;
  }
}

function login(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.login', '');
    case PROFILE_LOGIN__FILL:
      return action.payload;
    case LOGIN__SUCCESS:
      return '';
    default:
      return state;
  }
}

function password(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.password', '');
    case PROFILE_PASSWORD__FILL:
      return action.payload;
    case LOGIN__SUCCESS:
      return '';
    default:
      return state;
  }
}

function auth(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.auth', {});
    case LOGIN__REQUEST:
    case LOGIN__FAIL:
    case LOGOUT:
      return {};
    case LOGIN__SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

function isLoginRequest(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case LOGIN__SUCCESS:
    case LOGIN__FAIL:
      return false;
    case LOGIN__REQUEST:
      return true;
    default:
      return state;
  }
}

function isRegisterRequest(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case REGISTER__SUCCESS:
    case REGISTER__FAIL:
      return false;
    case REGISTER__REQUEST:
      return true;
    default:
      return state;
  }
}

function isFetchProfileData(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case PROFILE_DATA__SUCCESS:
    case PROFILE_DATA__FAIL:
      return false;
    case PROFILE_DATA__REQUEST:
      return true;
    default:
      return state;
  }
}

function bonusData(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.bonus.data', {});
    case LOGIN__SUCCESS:
    case PROFILE_DATA__SUCCESS:
      return action.payload.bonus;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

function discounts(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.discounts', []);
    case LOGIN__SUCCESS:
    case PROFILE_DATA__SUCCESS:
      return action.payload.discounts;
    case LOGOUT:
      return [];
    default:
      return state;
  }
}

function level1Hash(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
    case LOGIN__SUCCESS:
    case LOGOUT:
      return null;
    case PROFILE_BONUS_LEVEL1__SET:
      return action.payload;
    default:
      return state;
  }
}

function level2Hash(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
    case LOGIN__SUCCESS:
    case LOGOUT:
      return null;
    case PROFILE_BONUS_LEVEL2__SET:
      return action.payload;
    default:
      return state;
  }
}

// car history
function isFetchCarHistory(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case CAR_HISTORY__SUCCESS:
    case CAR_HISTORY__FAIL:
      return false;
    case CAR_HISTORY__REQUEST:
      return true;
    default:
      return state;
  }
}

function carHistoryData(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.carHistory.data', {});
    case CAR_HISTORY__SUCCESS:
      return action.payload;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

function carHistorylevel1Hash(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
    case CAR_HISTORY__SUCCESS:
    case LOGOUT:
      return null;
    case CAR_HISTORY_LEVEL1__SET:
      return action.payload;
    default:
      return state;
  }
}

function carHistorylevel2Hash(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
    case CAR_HISTORY__SUCCESS:
    case LOGOUT:
      return null;
    case CAR_HISTORY_LEVEL2__SET:
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

  auth,
  login,
  password,
  cars,
  carVIN,
  discounts,

  bonus: combineReducers({
    data: bonusData,
    level1Hash,
    level2Hash,
  }),

  carHistory: combineReducers({
    data: carHistoryData,
    level1Hash: carHistorylevel1Hash,
    level2Hash: carHistorylevel2Hash,
    meta: combineReducers({
      isFetchCarHistory,
    }),
  }),

  meta: combineReducers({
    isFetchProfileData,
    isLoginRequest,
    isRegisterRequest,
  }),
});
