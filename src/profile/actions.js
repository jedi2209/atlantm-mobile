import API from '../utils/api';

import {get, orderBy} from 'lodash';

import {
  PROFILE_BONUS_LEVEL1__SET,
  PROFILE_BONUS_LEVEL2__SET,
  PROFILE_BONUS_INFO__REQUEST,
  PROFILE_BONUS_INFO__SUCCESS,
  PROFILE_BONUS_INFO__FAIL,
  PROFILE_NAME__FILL,
  PROFILE_EMAIL__FILL,
  PROFILE_PHONE__FILL,
  PROFILE_CAR__FILL,
  PROFILE_CAR_VIN__FILL,
  PROFILE_CAR_NUMBER__FILL,
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
  CAR_HIDE__REQUEST,
  CAR_HIDE__SUCCESS,
  CAR_HIDE__FAIL,
  SAVE_PROFILE__UPDATE,
  SAVE_PROFILE__NOPHONE,
  SAVE_PROFILE__REQUEST,
  SAVE_PROFILE__FAIL,
  PROFILE_DATA__SUCCESS,
  FORGOT_PASS_MODE_CODE__SET,
  FORGOT_PASS_REQUEST__REQUEST,
  FORGOT_PASS_REQUEST__SUCCESS,
  FORGOT_PASS_REQUEST__FAIL,
  UPDATE_LOCAL_USER,
} from './actionTypes';

import PushNotifications from '../core/components/PushNotifications';

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

export const actionLogout = () => {
  return dispatch => {
    dispatch({type: LOGOUT});
  };
};

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
        console.error('actionFetchCarHistory error fetch', res);
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

export const actionToggleCar = (car, userSAP) => {
  return async dispatch => {
    function onError(error) {
      return dispatch({
        type: CAR_HIDE__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    dispatch({
      type: CAR_HIDE__REQUEST,
      payload: {...car},
    });

    try {
      const res = await API.toggleArchieveCar(car, userSAP);
      const {error, status, data} = res;

      if (status !== 'success') {
        console.error('actionToggleCar error', res);
        return onError(error);
      }

      const userCars = await getUserCars(userSAP.TOKEN, userSAP.ID);

      if (userCars) {
        return dispatch({
          type: CAR_HIDE__SUCCESS,
          payload: {
            cars: userCars || [],
          },
        });
      }
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
        console.error('actionFetchCarHistoryDetails error fetch', res);
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
        console.error('actionFetchBonusInfo error fetch', res);
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

export const actionGetPhoneCode = props => {
  return dispatch => {
    dispatch({
      type: 'SAVE_PROFILE__REQUEST_WITH_PHONE',
      payload: props,
    });

    return API.loginWithPhone(props).then(response => {
      if (response.error) {
        return response.error;
      }
      return response.data;
    });
  };
};

export const getProfileSapData = ({id, sap, curr}) => {
  return async dispatch => {
    const user = await API.getProfile(id);
    const userSAP = user.SAP || {};
    let result = {};

    if (userSAP) {
      result = await getProfileData({
        token: userSAP.TOKEN || userSAP.token,
        userid: userSAP.ID || userSAP.id,
        curr: curr || null,
      });
    }

    dispatch({
      type: SAVE_PROFILE__UPDATE,
      payload: user,
    });

    dispatch({
      type: PROFILE_DATA__SUCCESS,
      payload: {
        cars: result.cars || [],
        bonus: result.bonus || {},
        discounts: result.discounts || [],
        insurance: result.insurance || [],
        additionalPurchase: result.additionalPurchase || [],
      },
    });
  };
};

export const actionSavePofile = props => {
  // этот блок для авторизации через телефон
  if (props.ID) {
    return dispatch => {
      dispatch({
        type: SAVE_PROFILE__UPDATE,
        payload: {...props},
      });
    };
  }

  // а этот через соц сети
  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: props,
    });

    return API.loginWith(props)
      .then(response => {
        const {status, error} = response;

        if (status && status !== 'success') {
          return dispatch({
            type: SAVE_PROFILE__FAIL,
            payload: {
              code: error.code,
              message: error.message,
            },
          });
        }

        const user = response.data.user;
        let type = SAVE_PROFILE__UPDATE;
        if (
          typeof props.update !== undefined &&
          props.update === 0 &&
          user &&
          !user.PHONE
        ) {
          type = SAVE_PROFILE__NOPHONE;
        }
        return dispatch({
          type: type,
          payload: {
            ...user,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: SAVE_PROFILE__FAIL,
          payload: {
            message: error,
          },
        });
      });
  };
};

export const actionSaveProfileByUser = props => {
  const {SAP, isReestablish, user} = props;
  let dataToSend = props;
  if (isReestablish) {
    dataToSend.UF_CUSTOMER_NUMBER = SAP.ID;
    dataToSend.UF_CRM_1576136240 = SAP.ID;
    if (user.first_name) {
      dataToSend.NAME = user.first_name;
    }
    if (user.last_name) {
      dataToSend.LAST_NAME = user.last_name;
    }
    delete dataToSend.isReestablish;
  }

  if (dataToSend.user) {
    delete dataToSend.user;
  }

  if (SAP.ID) {
    PushNotifications.addTag('sapID', SAP.ID);
    PushNotifications.setExternalUserId(SAP.ID);
  }

  // for (let key in dataToSend) {
  //   if (!dataToSend[key]) {
  //     delete dataToSend[key];
  //   }
  // }

  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: dataToSend,
    });

    return API.updateProfile(dataToSend)
      .then(async data => {
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

export const actionSaveProfileToAPI = props => {
  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: props,
    });

    return API.updateProfile(props)
      .then(async data => {
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

export const nameFill = name => {
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

export const phoneFill = phone => {
  return dispatch => {
    dispatch({
      type: PROFILE_PHONE__FILL,
      payload: phone ? phone.trim() : '',
    });
  };
};

export const emailFill = email => {
  return dispatch => {
    dispatch({
      type: PROFILE_EMAIL__FILL,
      payload: email ? email.trim() : '',
    });
  };
};

export const localUserDataUpdate = userObject => dispatch => {
  dispatch({
    type: UPDATE_LOCAL_USER,
    payload: userObject,
  });
};

export const carNameFill = car => {
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

export const carVINFill = carVIN => {
  return dispatch => {
    dispatch({
      type: PROFILE_CAR_VIN__FILL,
      payload: carVIN,
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

export const connectSocialMedia = ({profile, im}) => {
  const dataToSend = {
    ...profile,
  };

  if (!dataToSend.IM) {
    dataToSend.IM = [im];
  } else {
    dataToSend.IM.push(im);
  }

  delete dataToSend.cars;
  delete dataToSend.bonus;
  delete dataToSend.discounts;
  delete dataToSend.insurance;
  delete dataToSend.additionalPurchase;

  return dispatch => {
    dispatch({
      type: SAVE_PROFILE__REQUEST,
      payload: dataToSend,
    });

    return API.updateProfile(dataToSend)
      .then(async response => {
        dispatch({
          type: SAVE_PROFILE__UPDATE,
          payload: response.data,
        });

        return response.data;
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

export const actionLogin = props => {
  const id = props.id;

  return async dispatch => {
    dispatch({
      type: 'LOGIN__REQUEST_OLD_LKK',
      payload: {...props},
    });

    function onError(error) {
      console.error('actionLogin error', error);

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
        console.error('actionLogin error authResponse', authResponse);
        return onError(error);
      }

      const {user, token} = data;

      const payload = {
        ID: id,
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

async function getUserCars(token, userid) {
  // 1. Получаем автомобили пользователя
  let cars = [];
  const carsResponse = await API.fetchCars({token, userid});
  const carsResponseCode = get(carsResponse, 'error.code', 404);
  if (carsResponseCode === 200 && carsResponse.data) {
    cars = orderBy(carsResponse.data, ['owner'], ['desc']);
  } else {
    console.error('getUserCars error get', carsResponse);
  }
  return cars;
}

async function getUserBonus(token, userid, curr) {
  let bonus = {};
  const bonusResponse = await API.fetchBonus({token, userid, curr});
  const bonusResponseCode = get(bonusResponse, 'error.code', 404);
  if (bonusResponseCode === 200 && bonusResponse.data) {
    bonus = bonusResponse.data;
  } else {
    console.error('getUserBonus error get profile bonus', bonusResponse);
  }
  return bonus;
}

async function getUserDiscounts(token, userid) {
  let discounts = [];
  const discountsResponse = await API.fetchDiscounts({token, userid});
  const discountsResponseCode = get(discountsResponse, 'error.code', 404);
  if (discountsResponseCode === 200 && discountsResponse.data) {
    discounts = discountsResponse.data;
  } else {
    console.info(
      'getUserDiscounts error get profile discounts',
      discountsResponse,
    );
  }
  return discounts;
}

async function getUserInsurance(token, userid) {
  let insurance = [];
  const insuranceResponse = await API.fetchInsurance({token, userid});
  const insuranceResponseCode = get(insuranceResponse, 'error.code', 404);
  if (insuranceResponseCode === 200 && insuranceResponse.data) {
    insurance = insuranceResponse.data;
  } else {
    console.info(
      'getUserInsurance error get profile discounts',
      insuranceResponse,
    );
  }
  return insurance;
}

async function getUserAdditionalPurchase(token, userid) {
  let purchase = [];
  const purchaseResponse = await API.fetchAdditionalPurchase({token, userid});
  const purchaseResponseCode = get(purchaseResponse, 'error.code', 404);
  if (purchaseResponseCode === 200 && purchaseResponse.data) {
    purchase = purchaseResponse.data;
  } else {
    console.error(
      'getUserAdditionalPurchase error get profile discounts',
      purchaseResponse,
    );
  }
  return purchase;
}

async function getProfileData({token, userid, curr}) {
  const cars = await getUserCars(token, userid);
  const bonus = await getUserBonus(token, userid, curr);
  const discounts = await getUserDiscounts(token, userid);
  const insurance = await getUserInsurance(token, userid);
  const additionalPurchase = await getUserAdditionalPurchase(token, userid);
  return {
    cars,
    bonus,
    discounts,
    insurance,
    additionalPurchase,
  };
}
