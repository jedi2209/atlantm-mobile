import API from '../utils/api';

import {
  SERVICE_ORDER__REQUEST,
  SERVICE_ORDER__SUCCESS,
  SERVICE_ORDER__FAIL,
  SERVICE_DATE__FILL,
  PARTS_ORDER__REQUEST,
  PARTS_ORDER__FAIL,
  PARTS_ORDER__SUCCESS,
} from './actionTypes';

export const dateFill = date => {
  return dispatch => {
    dispatch({
      type: SERVICE_DATE__FILL,
      payload: date,
    });
  };
};

export const orderParts = props => {
  return dispatch => {
    dispatch({
      type: PARTS_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderParts(props)
      .then(res => {
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: PARTS_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: PARTS_ORDER__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: PARTS_ORDER__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};

export const orderService = props => {
  return dispatch => {
    dispatch({
      type: SERVICE_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderService(props)
      .then(res => {
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: SERVICE_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: SERVICE_ORDER__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: SERVICE_ORDER__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
