import API from '../utils/api';

import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR__CITY,

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
        const { data, error, total, pages } = res;

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

export const actionSetUsedCarCity = (city) => {
  return dispatch => {
    dispatch({
      type: USED_CAR__CITY,
      payload: city,
    });
  };
};
