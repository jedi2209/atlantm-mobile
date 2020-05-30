import API from '../utils/api';

import {get} from 'lodash';

import {
  PROFILE_BONUS_LEVEL1__SET,
  PROFILE_BONUS_LEVEL2__SET,
  PROFILE_BONUS_INFO__REQUEST,
  PROFILE_BONUS_INFO__SUCCESS,
  PROFILE_BONUS_INFO__FAIL,
  LOGOUT,
  LOGIN__SUCCESS,
  LOGIN__FAIL,
  LOGIN__REQUEST,
  CAR_HISTORY__REQUEST,
  CAR_HISTORY__SUCCESS,
  CAR_HISTORY__FAIL,
  CAR_HISTORY_LEVEL1__SET,
  CAR_HISTORY_LEVEL2__SET,
  CAR_HISTORY_DETAILS__REQUEST,
  CAR_HISTORY_DETAILS__SUCCESS,
  CAR_HISTORY_DETAILS__FAIL,
  SAVE_PROFILE__UPDATE,
  SAVE_PROFILE__REQUEST,
  SAVE_PROFILE__FAIL,
  FORGOT_PASS_MODE_CODE__SET,
  FORGOT_PASS_REQUEST__REQUEST,
  FORGOT_PASS_REQUEST__SUCCESS,
  FORGOT_PASS_REQUEST__FAIL,
} from './actionTypes';

import PushNotifications from '@core/components/PushNotifications';

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

export const actionRequestForgotPass = login => {
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
      payload: login,
    });

    try {
      const res = await API.forgotPassRequest(login);
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
    console.log('user ==>', user);
    const userInfo = profileDataAdapter(user);
    let cars = [],
      bonus = {};

    const userSAP = user.SAP || {};

    const result = await getProfileData({
      token: userSAP.TOKEN || userSAP.token,
      userid: userSAP.ID || userSAP.id,
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
        SAP: user.SAP && user.SAP.ID ? user.SAP : {},
        IM: user.IM || [],
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
  const {
    email,
    phone,
    id,
    last_name,
    first_name,
    second_name,
    name,
    carNumber,
    car,
  } = props;

  const dataToSend = {
    userID: id,
    EMAIL: [email],
    NAME: first_name,
    SECOND_NAME: second_name,
    LAST_NAME: last_name,
    PHONE: [phone],
  };

  if (props.isReestablish) {
    dataToSend.UF_CUSTOMER_NUMBER = props.SAP.ID;
    dataToSend.UF_CRM_1576136240 = props.SAP.ID;

    delete dataToSend.isReestablish;
    delete dataToSend.SAP;

    PushNotifications.addTag('sapID', props.SAP.ID);
    PushNotifications.setExternalUserId(props.SAP.ID);
  }

  for (let key in dataToSend) {
    if (!dataToSend[key]) {
      delete dataToSend[key];
    }

  }

  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: dataToSend,
    });

    console.log('dataToSend', dataToSend);

    return API.saveProfile(dataToSend)
      .then(async data => {
        console.log('data form saveProfile >>>', data);
        dispatch({
          type: SAVE_PROFILE__UPDATE,
          payload: {
            ...props,
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

export const connectSicoalMedia = ({profile, im}) => {
  const {email, phone, id, last_name, first_name, second_name} = profile;

  const dataToSend = {
    userID: id,
    EMAIL: [email],
    NAME: first_name,
    SECOND_NAME: second_name,
    LAST_NAME: last_name,
    PHONE: [phone],
    IM: [im],
  };

  if (profile.isReestablish) {
    dataToSend.UF_CUSTOMER_NUMBER = profile.SAP.ID;
    dataToSend.UF_CRM_1576136240 = profile.SAP.ID;

    delete dataToSend.isReestablish;
    delete dataToSend.SAP;

    PushNotifications.addTag('sapID', profile.SAP.ID);
    PushNotifications.setExternalUserId(profile.SAP.ID);
  }

  for (let key in dataToSend) {
    if (!dataToSend[key]) {
      delete dataToSend[key];
    }
  }

  return (dispatch) => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: dataToSend,
    });

    console.log('dataToSend ==>', dataToSend);

    return API.saveProfile(dataToSend)
      .then(async (data) => {
        console.log('data form saveProfile >>>', data);
        dispatch({
          type: SAVE_PROFILE__UPDATE,
          payload: {
            ...profile,
          },
        });

        return profile;
      })
      .catch((error) => {
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
  console.log('user ======>', user);
  const {NAME, SECOND_NAME, LAST_NAME, EMAIL, PHONE} = user;

  const userInfo = {
    first_name: NAME,
    second_name: SECOND_NAME,
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
    second_name: userInfo.second_name || '',
    last_name: userInfo.last_name || '',
    email,
    phone,
  };
}

export const actionLogin = props => {
  const id = props.id;

  return async dispatch => {
    dispatch({
      type: 'LOGIN__REQUEST_OLD_LKK',
      payload: {...props},
    });

    function onError(error) {
      console.log('error', error);

      return dispatch({
        type: 'LOGIN__FAIL_OLD_LKK',
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    try {
      const authResponse = await API.loginRequest(props);
      const {error, status, data} = authResponse;

      if (status !== 'success') {
        __DEV__ && console.log('error auth', authResponse);
        return onError(error);
      }

      const {user, token} = data;

      const payload = {
        id: id,
        SAP: {
          TOKEN: token.id,
          ID: user.login,
        },
        first_name: user.name.name,
        last_name: user.name.surname,
        email: user.email,
        phone: user.phone,
      };

      return dispatch({
        type: 'LOGIN__SUCCESS_OLD_LKK',
        payload,
      });
    } catch (e) {
      return onError(e);
    }
  };
};
