import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/constants';
import {get} from 'lodash';
import {
  PROFILE_CAR__FILL,
  PROFILE_NAME__FILL,
  PROFILE_PHONE__FILL,
  PROFILE_EMAIL__FILL,
  PROFILE_CAR_NUMBER__FILL,
  PROFILE_CAR_VIN__FILL,
  PROFILE_PASSWORD__FILL,
  PROFILE_BONUS_LEVEL1__SET,
  PROFILE_BONUS_LEVEL2__SET,
  PROFILE_BONUS_INFO__REQUEST,
  PROFILE_BONUS_INFO__SUCCESS,
  PROFILE_BONUS_INFO__FAIL,
  PROFILE_DATA__REQUEST,
  PROFILE_DATA__SUCCESS,
  PROFILE_DATA__FAIL,
  LOGOUT,
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
  CAR_HISTORY_DETAILS__REQUEST,
  CAR_HISTORY_DETAILS__SUCCESS,
  CAR_HISTORY_DETAILS__FAIL,
  FORGOT_PASS_LOGIN__FILL,
  FORGOT_PASS_CODE__FILL,
  FORGOT_PASS_MODE_CODE__SET,
  FORGOT_PASS_REQUEST__REQUEST,
  FORGOT_PASS_REQUEST__SUCCESS,
  FORGOT_PASS_REQUEST__FAIL,
  FORGOT_PASS_SUBMIT_CODE__REQUEST,
  FORGOT_PASS_SUBMIT_CODE__FAIL,
  FORGOT_PASS_SUBMIT_CODE__SUCCESS,
  SAVE_PROFILE__UPDATE,
  SAVE_PROFILE__REQUEST,
  SAVE_PROFILE__FAIL,
} from './actionTypes';

import {APP_STORE_UPDATED} from '../core/actionTypes';

import {DEALER__SUCCESS} from '@dealer/actionTypes';

function login(state = '', action) {
  console.log('login => state', {...state});
  console.log('login => action', action);
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.login', '');
    case SAVE_PROFILE__UPDATE:
      return {...state, ...action.payload};
    case SAVE_PROFILE__FAIL:
    case LOGOUT:
    case APP_STORE_UPDATED:
      return {};
    default:
      return state;
  }
}

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

function phone(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.phone', '');
    case PROFILE_PHONE__FILL:
      return action.payload;
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
    default:
      return state;
  }
}

// используется в случае, если пользователь авторизован
function cars(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.cars', []);
    case PROFILE_DATA__SUCCESS:
      return action.payload.cars;
    case LOGOUT:
    case APP_STORE_UPDATED:
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

function password(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.password', '');
    case PROFILE_PASSWORD__FILL:
      return action.payload;
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
    case PROFILE_DATA__SUCCESS:
      return action.payload.bonus;
    case LOGOUT:
    case APP_STORE_UPDATED:
      return {};
    default:
      return state;
  }
}

function bonusInfo(state = '', action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.bonus.info', '');
    case DEALER__SUCCESS:
    case PROFILE_BONUS_INFO__REQUEST:
      return '';
    case PROFILE_BONUS_INFO__SUCCESS:
      return action.payload;
    case LOGOUT:
    case APP_STORE_UPDATED:
      return '';
    default:
      return state;
  }
}

function isFetchBonusInfo(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case PROFILE_BONUS_INFO__FAIL:
    case PROFILE_BONUS_INFO__SUCCESS:
      return false;
    case PROFILE_BONUS_INFO__REQUEST:
      return true;
    default:
      return state;
  }
}

function discounts(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'profile.discounts', []);
    case PROFILE_DATA__SUCCESS:
      return action.payload.discounts;
    case LOGOUT:
    case APP_STORE_UPDATED:
      return [];
    default:
      return state;
  }
}

function level1Hash(state = null, action) {
  switch (action.type) {
    case REHYDRATE:
    case LOGOUT:
    case APP_STORE_UPDATED:
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
    case LOGOUT:
    case APP_STORE_UPDATED:
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
    case APP_STORE_UPDATED:
    case CAR_HISTORY__REQUEST:
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
    case APP_STORE_UPDATED:
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
    case APP_STORE_UPDATED:
      return null;
    case CAR_HISTORY_LEVEL2__SET:
      return action.payload;
    default:
      return state;
  }
}

function isFetchCarHistoryDetails(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case CAR_HISTORY_DETAILS__SUCCESS:
    case CAR_HISTORY_DETAILS__FAIL:
      return false;
    case CAR_HISTORY_DETAILS__REQUEST:
      return true;
    default:
      return state;
  }
}

function carHistoryDetailsData(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case CAR_HISTORY_DETAILS__SUCCESS:
      return action.payload;
    case CAR_HISTORY_DETAILS__REQUEST:
      return {};
    default:
      return state;
  }
}

const forgotPassLogin = (state = '', action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.profile.forgotPass.login', '');
    case FORGOT_PASS_LOGIN__FILL:
      return action.payload;
    default:
      return state;
  }
};

const forgotPassCode = (state = '', action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.profile.forgotPass.code', '');
    case FORGOT_PASS_CODE__FILL:
      return action.payload;
    default:
      return state;
  }
};

const forgotPassModeCode = (state = '', action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(
        action,
        'payload.profile.forgotPass.meta.forgotPassModeCode',
        '',
      );
    case FORGOT_PASS_MODE_CODE__SET:
      return action.payload;
    default:
      return state;
  }
};

const isForgotPassRequest = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
    case FORGOT_PASS_REQUEST__FAIL:
    case FORGOT_PASS_REQUEST__SUCCESS:
      return false;
    case FORGOT_PASS_REQUEST__REQUEST:
      return true;
    default:
      return state;
  }
};

const isForgotPassCodeSubmit = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
    case FORGOT_PASS_SUBMIT_CODE__FAIL:
    case FORGOT_PASS_SUBMIT_CODE__SUCCESS:
      return false;
    case FORGOT_PASS_SUBMIT_CODE__REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({
  name,
  phone,
  email,
  car,
  carNumber,

  login,
  password,
  cars,
  carVIN,
  discounts,

  bonus: combineReducers({
    data: bonusData,
    level1Hash,
    level2Hash,

    info: bonusInfo,
    isFetchBonusInfo,
  }),

  carHistory: combineReducers({
    details: carHistoryDetailsData,
    data: carHistoryData,
    level1Hash: carHistorylevel1Hash,
    level2Hash: carHistorylevel2Hash,
    meta: combineReducers({
      isFetchCarHistory,
      isFetchCarHistoryDetails,
    }),
  }),

  forgotPass: combineReducers({
    login: forgotPassLogin,
    code: forgotPassCode,

    meta: combineReducers({
      forgotPassModeCode,
      isForgotPassRequest,
      isForgotPassCodeSubmit,
    }),
  }),

  meta: combineReducers({
    isFetchProfileData,
    // isLoginRequest,
    // isRegisterRequest,
  }),
});
