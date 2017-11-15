import API from '../utils/api';

import {
  INDICATORS__REQUEST,
  INDICATORS__SUCCESS,
  INDICATORS__FAIL,

  INDICATOR_ACTIVE__SET,
} from './actionTypes';

export const actionSetActiveIndicator = (item) => {
  return dispatch => {
    dispatch({
      type: INDICATOR_ACTIVE__SET,
      payload: item,
    });
  };
};

export const actionFetchIndicators = () => {
  return dispatch => {
    dispatch({ type: INDICATORS__REQUEST });

    return API.fetchIndicators()
      .then(res => {
        const { error, status, data } = res;

        if (status !== 'success') {
          return dispatch({
            type: INDICATORS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({
          type: INDICATORS__SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        return dispatch({
          type: INDICATORS__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
