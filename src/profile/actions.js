import API from '../utils/api';

import {get, find} from 'lodash';

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
  PROFILE_BONUS_INFO__REQUEST,
  PROFILE_BONUS_INFO__SUCCESS,
  PROFILE_BONUS_INFO__FAIL,
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

import {DEALER__SUCCESS} from '../dealer/actionTypes';

export const nameFill = name => {
  if (name && name.length <= 3) {
    name = typeof name === 'string' ? name.trim() : name || '';
  }

  return dispatch => {
    dispatch({
      type: PROFILE_NAME__FILL,
      payload: name,
    });
  };
};

export const phoneFill = phone => {
  return dispatch => {
    dispatch({
      type: PROFILE_PHONE__FILL,
      payload: typeof phone === 'string' ? phone.trim() : phone || '',
    });
  };
};

export const emailFill = email => {
  return dispatch => {
    dispatch({
      type: PROFILE_EMAIL__FILL,
      payload: typeof email === 'string' ? email.trim() : email || '',
    });
  };
};

export const carNumberFill = carNumber => {
  const result = (carNumber = carNumber
    .replace(/\s/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, ''));

  return dispatch => {
    dispatch({
      type: PROFILE_CAR_NUMBER__FILL,
      payload: result,
    });
  };
};

export const carFill = car => {
  if (car && car.length <= 3) {
    car = car && typeof car === 'string' ? car.trim() : car || '';
  }

  return dispatch => {
    dispatch({
      type: PROFILE_CAR__FILL,
      payload: car,
    });
  };
};

export const carVINFill = carVIN => {
  return dispatch => {
    dispatch({
      type: PROFILE_CAR_VIN__FILL,
      payload: carVIN,
    });
  };
};

export const loginFill = login => {
  const result = login.replace(/\s/g, '');

  return dispatch => {
    dispatch({
      type: PROFILE_LOGIN__FILL,
      payload: result,
    });
  };
};

export const passwordFill = password => {
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
    dispatch({type: LOGOUT});
  };
};

async function getProfileData({token, userid}) {
  // 1. Получаем автомобили пользователя
  let cars = [];
  const carsResponse = await API.fetchCars({token, userid});
  const carsResponseCode = get(carsResponse, 'error.code', 404);
  if (carsResponseCode === 200 && carsResponse.data) {
    cars = carsResponse.data;
  } else {
    //__DEV__ && console.log('error get profile cars', carsResponse);
  }

  let bonus = {};
  try {
    // 2. Получаем бонусы и скидки пользователя
    const bonusResponse = await API.fetchBonus({token, userid});
    const bonusResponseCode = get(bonusResponse, 'error.code', 404);
    if (bonusResponseCode === 200 && bonusResponse.data) {
      bonus = bonusResponse.data;
    } else {
      //__DEV__ && console.log('error get profile bonus', bonusResponse);
    }
  } catch (err) {
    //__DEV__ && console.log('error get profile bonus', err);
  }

  let discounts = [];
  try {
    const discountsResponse = await API.fetchDiscounts({token, userid});
    const discountsResponseCode = get(discountsResponse, 'error.code', 404);
    if (discountsResponseCode === 200 && discountsResponse.data) {
      discounts = discountsResponse.data;
    } else {
      //__DEV__ && console.log('error get profile discounts', discountsResponse);
    }
  } catch (err) {
    console.log('error get profile discounts', err);
  }

  return {
    cars,
    bonus,
    discounts,
  };
}

export const actionSetBonusLevel1 = hash => {
  return dispatch => {
    dispatch({
      type: PROFILE_BONUS_LEVEL1__SET,
      payload: hash,
    });
  };
};

export const actionSetBonusLevel2 = hash => {
  return dispatch => {
    dispatch({
      type: PROFILE_BONUS_LEVEL2__SET,
      payload: hash,
    });
  };
};

export const actionSetCarHistoryLevel1 = hash => {
  return dispatch => {
    dispatch({
      type: CAR_HISTORY_LEVEL1__SET,
      payload: hash,
    });
  };
};

export const actionSetCarHistoryLevel2 = hash => {
  return dispatch => {
    dispatch({
      type: CAR_HISTORY_LEVEL2__SET,
      payload: hash,
    });
  };
};

export const actionFetchCarHistory = props => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: CAR_HISTORY__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: CAR_HISTORY__REQUEST,
      payload: {...props},
    });

    try {
      const res = await API.fetchCarHistory(props);
      const {error, status, data} = res;

      if (status !== 'success') {
        //__DEV__ && console.log('error fetch car history', res);
        return onError(error);
      }

      return dispatch({
        type: CAR_HISTORY__SUCCESS,
        payload: {
          ...data,
        },
      });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionFetchCarHistoryDetails = props => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: CAR_HISTORY_DETAILS__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: CAR_HISTORY_DETAILS__REQUEST,
      payload: {...props},
    });

    try {
      const res = await API.fetchCarHistoryDetails(props);
      const {error, data} = res;

      if (get(error, 'code') !== 200) {
        //__DEV__ && console.log('error fetch car history details', res);
        return onError(error);
      }

      const items = get(data, 'items', {});

      return dispatch({
        type: CAR_HISTORY_DETAILS__SUCCESS,
        payload: {
          ...items,
        },
      });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionFetchBonusInfo = props => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: PROFILE_BONUS_INFO__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: PROFILE_BONUS_INFO__REQUEST,
      payload: {...props},
    });

    try {
      const res = await API.fetchBonusInfo(props);
      const {status, data} = res;

      // TODO: запросить у API данные по принятой структуре данных
      // if (get(error, 'code') !== 200) {
      if (status !== 'success') {
        //__DEV__ && console.log('error fetch car bonus info', res);
        return onError({
          code: 404,
          message: 'Ошибка при получении информации о бонусной программе',
        });
      }

      // TODO: присылать данные вместе с body как на других экранах
      return dispatch({
        type: PROFILE_BONUS_INFO__SUCCESS,
        payload: `<body>${data}</body>`,
      });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionFillForgotLogin = login => {
  return dispatch => {
    dispatch({
      type: FORGOT_PASS_LOGIN__FILL,
      payload: login,
    });
  };
};

export const actionFillForgotCode = code => {
  return dispatch => {
    dispatch({
      type: FORGOT_PASS_CODE__FILL,
      payload: code,
    });
  };
};

export const actionRequestForgotPass = props => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: FORGOT_PASS_REQUEST__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: FORGOT_PASS_REQUEST__REQUEST,
      payload: {...props},
    });

    try {
      const res = await API.forgotPassRequest(props);
      const {status, error} = res;

      if (status !== 'success') {
        return onError(error);
      }

      const code = Number(get(error, 'code'));
      const isCodeMode = [119, 127].indexOf(code) !== -1;

      isCodeMode &&
        dispatch({
          type: FORGOT_PASS_MODE_CODE__SET,
          payload: code === 119 ? 'phone' : 'email',
        });

      return dispatch({
        type: FORGOT_PASS_REQUEST__SUCCESS,
        payload: {
          ...error,
          isCodeMode,
        },
      });
    } catch (e) {
      return onError(e);
    }
  };
};

export const actionSetForgotPassCodeMode = mode => {
  return dispatch => {
    return dispatch({
      type: FORGOT_PASS_MODE_CODE__SET,
      payload: mode,
    });
  };
};

export const actionSubmitForgotPassCode = props => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: FORGOT_PASS_SUBMIT_CODE__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: FORGOT_PASS_SUBMIT_CODE__REQUEST,
      payload: {...props},
    });

    try {
      const res = await API.forgotPassSubmitCode(props);
      const {status, error} = res;

      if (status !== 'success') {
        //__DEV__ && console.log('error forgotPassSubmitCode', res);
        return onError({
          code: 404,
          message: 'Ошибка при проверке кода подтверждения',
        });
      }

      return dispatch({
        type: FORGOT_PASS_SUBMIT_CODE__SUCCESS,
        payload: error,
      });
    } catch (e) {
      console.log('forgot pass forgot', e);
      return onError(e);
    }
  };
};

export const actionSavePofileWithPhone = props => {
  return dispatch => {
    dispatch({
      type: 'SAVE_PROFILE__REQUEST_WITH_PHONE',
      payload: props,
    });

    return API.loginWithPhone(props).then(response => {
      if (response.data.error) {
        return response.data.error;
      }
      return response.data.data;
    });
  };
};

export const getProfileSapData = ({id, sap}) => {
  return async dispatch => {
    const user = await API.getProfile(id);
    const userInfo = profileDataAdapter(user);
    let cars = [], bonus = {};

    const userSAP = user.SAP || {};

    const result = await getProfileData({
      token: userSAP.TOKEN,
      userid: userSAP.ID,
    });

    result.cars && (cars = result.cars);
    result.bonus && (bonus = result.bonus);

    dispatch({
      type: SAVE_PROFILE__UPDATE,
      payload: {
        id,
        ...userInfo,
        cars,
        bonus,
        SAP: (user.SAP && user.SAP.ID) ? user.SAP : {},
      },
    });
  };
};

export const actionSavePofile = props => {
  if (props.ID) {
    const userInfo = profileDataAdapter(props);
    return dispatch => {
      dispatch({
        type: SAVE_PROFILE__UPDATE,
        payload: {
          id: props.ID,
          SAP: props.SAP,
          ...userInfo,
        },
      });
    };
  }

  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: props,
    });

    return API.loginWith(props)
      .then(data => {
        const {status, error} = data;

        if (status !== 'success') {
          dispatch({
            type: SAVE_PROFILE__FAIL,
            payload: {
              code: error.code,
              message: error.message,
            },
          });
        }

        const user = data.data.data.user;
        const userInfo = profileDataAdapter(user);

        dispatch({
          type: SAVE_PROFILE__UPDATE,
          payload: {
            ...userInfo,
            id: user.ID,
            SAP: user.SAP,
          },
        });
      })
      .catch(error => {
        dispatch({
          type: SAVE_PROFILE__FAIL,
          payload: {
            message: error,
          },
        });
      });
  };
};

export const actionSaveProfileByUser = props => {
  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: props,
    });

    return API.saveProfile(props)
      .then(async data => {
        const profile = data.profile;

        console.log('actionSaveProfileByUser', data);

        dispatch({
          type: SAVE_PROFILE__UPDATE,
          payload: {
            ...profile,
          },
        });

        return props;
      })
      .catch(error => {
        dispatch({
          type: SAVE_PROFILE__FAIL,
          payload: {
            message: error,
          },
        });
      });
  };
};

function profileDataAdapter(user) {
  const {NAME, LAST_NAME, EMAIL, PHONE, ID} = user;
  const userInfo = {
    first_name: NAME,
    last_name: LAST_NAME,
    email: EMAIL,
    phone: PHONE,
  };

  const email =
    userInfo.email && userInfo.email.length > 0
      ? {
          id: userInfo.email[0].ID,
          type: userInfo.email[0].VALUE_TYPE,
          value: userInfo.email[0].VALUE,
        }
      : {};

  const phone =
    userInfo.phone && userInfo.phone.length > 0
      ? {
          id: userInfo.phone[0].ID,
          type: userInfo.phone[0].VALUE_TYPE,
          value: userInfo.phone[0].VALUE,
        }
      : {};

  return {
    first_name: userInfo.first_name || '',
    last_name: userInfo.last_name || '',
    email,
    phone,
  };
}
