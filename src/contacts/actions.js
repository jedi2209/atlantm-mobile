import API from '../utils/api';

import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,

  CONTACTS_MAP_USER_LOCATION__REQUEST,
  CONTACTS_MAP_USER_LOCATION__DONE,
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

export const actionRequestUserLocation = () => {
  return dispatch => {
    return dispatch({
      type: CONTACTS_MAP_USER_LOCATION__REQUEST,
    });
  };
};

export const actionDoneUserLocation = () => {
  return dispatch => {
    return dispatch({
      type: CONTACTS_MAP_USER_LOCATION__DONE,
    });
  };
};
