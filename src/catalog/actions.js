import API from '../utils/api';

import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_LIST__RESET,
  USED_CAR_CITY__SELECT,
  USED_CAR_REGION__SELECT,

  EVENT_LOAD_MORE,
} from './actionTypes';

export const actionFetchUsedCar = (type, city, nextPage) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_LIST__REQUEST,
      payload: {
        type,
        city,
      },
    });

    const nextPageUrl = type === EVENT_LOAD_MORE ? nextPage : null;

    return API.fetchUsedCar(city, nextPageUrl)
      .then(res => {
        const { data, error, total, pages, prices } = res;

        if (error) {
          return dispatch({
            type: USED_CAR_LIST__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({
          type: USED_CAR_LIST__SUCCESS,
          payload: {
            type,
            data,
            total,
            pages,
            prices,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: USED_CAR_LIST__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSelectUsedCarCity = (city) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_CITY__SELECT,
      payload: city,
    });
  };
};

export const actionSelectUsedCarRegion = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_REGION__SELECT,
      payload: region,
    });
  };
};

export const actionResetUsedCarList = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_LIST__RESET,
      payload: region,
    });
  };
};
