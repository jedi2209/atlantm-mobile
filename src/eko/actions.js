import API from '../utils/api';

import {

} from './actionTypes';

export const actionTvaMessageFill = (message) => {
  if (message && message.length <= 3) {
    message = message.trim();
  }

  return dispatch => {
    dispatch({
      type: TVA_MESSAGE__FILL,
      payload: message,
    });
  };
};

export const actionSetActiveTvaOrderId = (orderId) => {
  return dispatch => {
    dispatch({
      type: TVA_ORDER_ID__SET,
      payload: orderId,
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
        const { error, status, data } = res;
        // const { error, status, data } = dumpTvaAnswer;

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
