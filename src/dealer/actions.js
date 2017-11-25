import {
  DEALERS_REGION__SELECT,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,

  DEALERS_BY_CITIES__SET,

  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__FAIL,

} from './actionTypes';

import API from '../utils/api';

import { RUSSIA, BELARUSSIA, UKRAINE } from '../core/const';

export const selectRegion = region => {
  return dispatch => {
    return dispatch({
      type: DEALERS_REGION__SELECT,
      payload: region,
    });
  };
};

export const selectDealer = dealerBaseData => {
  return dispatch => {
    dispatch({
      type: DEALER__REQUEST,
      payload: dealerBaseData,
    });

    return API.fetchDealer(dealerBaseData.id)
      .then(response => {

        if (response.error) {
          return dispatch({
            type: DEALER__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        const dealer = { ...response.data };

        dealer.id = dealerBaseData.id;
        dealer.region = dealerBaseData.region;
        dealer.brands = dealerBaseData.brands;

        return dispatch({
          type: DEALER__SUCCESS,
          payload: dealer,
        });
      })
      .catch(error => {
        return dispatch({
          type: DEALER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const fetchDealers = () => {
  return dispatch => {
    dispatch({ type: DEALERS__REQUEST });

    return API.fetchDealers()
      .then(response => {
        const { data: dealers, error } = response;

        console.log('dealers', dealers);

        if (error) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        const dealersByRegions = dealers.reduce((result, dealer) => {
          result[dealer.region].push(dealer);
          return result;
        }, {
          [RUSSIA]: [],
          [BELARUSSIA]: [],
          [UKRAINE]: [],
        });

        return dispatch({
          type: DEALERS__SUCCESS,
          payload: dealersByRegions,
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

export const actionSetDealersByCities = (dealersByRegions) => {
  return dispatch => {
    return dispatch({
      type: DEALERS_BY_CITIES__SET,
      payload: dealersByRegions,
    });
  };
};
