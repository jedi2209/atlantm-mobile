import API from '../utils/api';

import {
  TVA__REQUEST,
  TVA__SUCCESS,
  TVA__FAIL,
  TVA_CAR_NUMBER__FILL,

  TVA_SEND_MESSAGE__REQUEST,
  TVA_SEND_MESSAGE__SUCCESS,
  TVA_SEND_MESSAGE__FAIL,
  TVA_MESSAGE__FILL,

  TVA_ORDER_ID__SET,
} from './actionTypes';

export const carNumberFill = (carNumber) => {
  if (carNumber && carNumber.length <= 5) {
    carNumber = carNumber.trim();
  }

  return dispatch => {
    dispatch({
      type: TVA_CAR_NUMBER__FILL,
      payload: carNumber,
    });
  };
};

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

export const actionTvaMessageSend = (props) => {
  return dispatch => {
    dispatch({
      type: TVA_SEND_MESSAGE__REQUEST,
      payload: { ...props },
    });

    return API.tvaMessageSend(props)
      .then(res => {
        const { error, status } = res;

        if (status !== 'success') {
          return dispatch({
            type: TVA_SEND_MESSAGE__FAIL,
            payload: {
              code: error.code,
              message: error.message,
            },
          });
        }

        return dispatch({ type: TVA_SEND_MESSAGE__SUCCESS });
      })
      .catch(error => {
        return dispatch({
          type: TVA_SEND_MESSAGE__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
