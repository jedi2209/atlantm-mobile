import {
  DEALER__SET,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,

  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__FAIL,

} from './actionTypes';

import API from '../utils/api';

export const setDealer = dealer => {
  return dispatch => {
    return dispatch({
      type: DEALER__SET,
      payload: dealer,
    });
  };
};

export const fetchDealers = () => {
  return dispatch => {
    dispatch({ type: DEALERS__REQUEST });

    return API.fetchDealers()
      .then(response => {
        const { data, error } = response;

        if (error) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            }
          });
        }

        if (data.length === 0) {
          dispatch({
            type: DEALERS__SUCCESS,
            payload: [],
          });
        }

        Promise.all(data.map(dealer => {
          return API.fetchDealer(dealer.id);
        }))
        .then(dealersResponse => {
          dispatch({
            type: DEALERS__SUCCESS,
            payload: dealersResponse.map(dealer => dealer.data),
          });
        })
        .catch(error => {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              error: error.message,
            },
          });
        });
      })
      .catch(error => {
        return dispatch({
          type: DEALERS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
