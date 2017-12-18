import API from '../utils/api';

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

  LOGOUT,
  LOGIN__SUCCESS,
  LOGIN__FAIL,
  LOGIN__REQUEST,
  REGISTER__SUCCESS,
  REGISTER__FAIL,
  REGISTER__REQUEST,
} from './actionTypes';

export const nameFill = (name) => {
  if (name && name.length <= 3) {
    name = name.trim();
  }

  return dispatch => {
    dispatch({
      type: PROFILE_NAME__FILL,
      payload: name,
    });
  };
};

export const phoneFill = (phone) => {
  return dispatch => {
    dispatch({
      type: PROFILE_PHONE__FILL,
      payload: phone ? phone.trim() : '',
    });
  };
};

export const emailFill = (email) => {
  return dispatch => {
    dispatch({
      type: PROFILE_EMAIL__FILL,
      payload: email ? email.trim() : '',
    });
  };
};

export const carNumberFill = (carNumber) => {
  const result = carNumber = carNumber.replace(/\s/g, '');

  return dispatch => {
    dispatch({
      type: PROFILE_CAR_NUMBER__FILL,
      payload: result,
    });
  };
};

export const carFill = (car) => {
  if (car && car.length <= 3) {
    car = car.trim();
  }

  return dispatch => {
    dispatch({
      type: PROFILE_CAR__FILL,
      payload: car,
    });
  };
};

export const carVINFill = (carVIN) => {
  let result = carVIN.replace(/\s/g, '');
  result = result && result.toUpperCase();

  return dispatch => {
    dispatch({
      type: PROFILE_CAR_VIN__FILL,
      payload: result,
    });
  };
};

export const loginFill = (login) => {
  const result = login.replace(/\s/g, '');

  return dispatch => {
    dispatch({
      type: PROFILE_LOGIN__FILL,
      payload: result,
    });
  };
};

export const passwordFill = (password) => {
  const result = password.replace(/\s/g, '');

  return dispatch => {
    dispatch({
      type: PROFILE_PASSWORD__FILL,
      payload: result,
    });
  };
};

export const actionLogout = () => {
  return dispatch => {
    dispatch({ type: LOGOUT });
  };
};

export const actionLogin = (props) => {
  return async dispatch => {
    dispatch({
      type: LOGIN__REQUEST,
      payload: { ...props },
    });

    function onError(error) {
      console.log('error', error);

      return dispatch({
        type: LOGIN__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    try {
      // 1. Получаем данные пользователя
      const authResponse = await API.loginRequest(props);
      const { error, status, data } = authResponse;

      if (status !== 'success') {
        __DEV__ && console.log('error auth', authResponse);
        return onError(error);
      }

      const { user, token } = data;

      // 2. С помощью полученного токена, получаем автомобили пользователя
      let cars = [];
      const carsResponse = await API.fetchCars({ token: token.id });
      if (carsResponse.status === 'success') {
        cars = carsResponse.data;
      }

      // 3. С помощью полученного токена, получаем бонусы и скидки пользователя
      let bonus = {};
      const bonusResponse = await API.fetchBonus({ token: token.id });
      if (bonusResponse.status === 'success') {
        bonus = bonusResponse.data;
      }

      let discounts = [];
      const discountsResponse = await API.fetchDiscounts({ token: token.id });
      if (discountsResponse.status === 'success') {
        discounts = discountsResponse.data;
      }

      return dispatch({
        type: LOGIN__SUCCESS,
        payload: {
          token,
          cars,
          bonus,
          discounts,
          ...user,
        },
      });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionRegister = (props) => {
  return async dispatch => {
    dispatch({
      type: REGISTER__REQUEST,
      payload: { ...props },
    });

    function onError(error) {
      return dispatch({
        type: REGISTER__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    try {
      const res = await API.registerRequest(props);
      const { error, status } = res;

      if (status !== 'success') {
        __DEV__ && console.log('error register', res);
        return onError(error);
      }

      return dispatch({ type: REGISTER__SUCCESS });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionSetBonusLevel1 = (hash) => {
  return dispatch => {
    dispatch({
      type: PROFILE_BONUS_LEVEL1__SET,
      payload: hash,
    });
  };
};

export const actionSetBonusLevel2 = (hash) => {
  return dispatch => {
    dispatch({
      type: PROFILE_BONUS_LEVEL2__SET,
      payload: hash,
    });
  };
};
