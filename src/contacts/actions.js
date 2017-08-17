import API from '../utils/api';

import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
} from './actionTypes';

export const callMe = (dealerID, name, phone) => {
  return dispatch => {
    dispatch({
      type: CALL_ME__REQUEST,
      payload: {
        dealerID,
        name,
        phone,
      },
    });

    return API.callMe(dealerID, name, phone)
      .then(response => {
        const { data, error, status } = response;

        if (status !== 'success') {
          return dispatch({
            type: CALL_ME__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({ type: CALL_ME__SUCCESS });
      })
      .catch(error => {
        return dispatch({
          type: CALL_ME__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
