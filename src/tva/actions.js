import API from '../utils/api';

import {
  TVA__REQUEST,
  TVA__SUCCESS,
  TVA__FAIL,

  TVA_CAR_NUMBER__FILL,
} from './actionTypes';

export const carNumberFill = (carNumber) => {
  // if (carNumber && carNumber.length <= 5) {
  //   carNumber = carNumber.trim();
  // }

  return dispatch => {
    dispatch({
      type: TVA_CAR_NUMBER__FILL,
      payload: carNumber,
    });
  };
};

export const actionFetchTva = (props) => {
  return dispatch => {
    dispatch({
      type: TVA__REQUEST,
      payload: { ...props },
    });

    return API.fetchTva(props)
      .then(res => {
        const {
          error,
          status,
          data,
        } = res;

        if (status !== 'success') {
          return dispatch({
            type: TVA__FAIL,
            payload: {
              code: error.code,
              message: error.message,
            },
          });
        }

        return dispatch({
          type: TVA__SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        return dispatch({
          type: TVA__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
