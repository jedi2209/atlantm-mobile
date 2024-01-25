import API from '../utils/api';
import {
  NOTIFICATIONS__REQUEST,
  NOTIFICATIONS__SUCCESS,
  NOTIFICATIONS__FAIL,
} from './actionTypes';

export const actionGetNotifications = props => {
  return async dispatch => {
    dispatch({
      type: NOTIFICATIONS__REQUEST,
      payload: props,
    });

    function onError(error) {
      console.error('actionGetNotifications error', error);

      return dispatch({
        type: NOTIFICATIONS__FAIL,
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    }

    try {
      const apiResponse = await API.fetchNotifications(props);
      const {error, status, data} = apiResponse;

      if (status !== 'success') {
        console.error('actionGetNotifications error apiResponse', apiResponse);
        return onError(error);
      }

      const payload = {data};

      return dispatch({
        type: NOTIFICATIONS__SUCCESS,
        payload,
      });
    } catch (e) {
      return onError(e);
    }
  };
};