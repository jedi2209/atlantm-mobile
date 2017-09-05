import API from '../utils/api';

import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
} from './actionTypes';

export const callMe = (props) => {
  return dispatch => {
    dispatch({
      type: CALL_ME__REQUEST,
      payload: { ...props },
    });

    return API.callMe(props)
      .then(res => {
        const { error, status } = res;

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
