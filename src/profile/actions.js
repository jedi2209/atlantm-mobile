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
  const result = carVIN.replace(/\s/g, '');

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
      return dispatch({
        type: LOGIN__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    try {
      const authResponse = await API.loginRequest(props);
      const { error, status, data } = authResponse;

      if (status !== 'success') {
        __DEV__ && console.log('error auth', authResponse);
        return onError(error);
      }

      const { user, token } = data;

      let cars = [];
      const carsResponse = await API.fetchCars({ token });
      const { status: carsStatus } = carsResponse;

      if (carsStatus === 'success') {
        cars = carsResponse.data;
      }

      return dispatch({
        type: LOGIN__SUCCESS,
        payload: {
          token,
          ...user,
          cars,
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
