import {
  DEALERS_REGION__SELECT,
  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,
  DEALERS_BY_CITIES__SET,
  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  DEALER__FAIL,
} from './actionTypes';

import API from '../utils/api';

import {RUSSIA, BELARUSSIA, UKRAINE} from '../core/const';

export const selectRegion = (region) => {
  return (dispatch) => {
    return dispatch({
      type: DEALERS_REGION__SELECT,
      payload: region,
    });
  };
};

export const selectDealer = ({dealerBaseData, dealerSelected, isLocal}) => {
  return (dispatch) => {
    dispatch({
      type: DEALER__REQUEST,
      payload: {
        dealerBaseData,
        dealerSelected,
      },
    });

    return API.fetchDealer(dealerBaseData.id)
      .then((response) => {
        if (response.error) {
          return dispatch({
            type: DEALER__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        const dealer = {...response.data};

        dealer.id = dealerBaseData.id;
        dealer.region = dealerBaseData.region;
        dealer.brands = dealerBaseData.brands;

        if (!isLocal) {
          // обновляем дилера глобально
          return dispatch({
            type: DEALER__SUCCESS,
            payload: {
              newDealer: dealer,
              prevDealer: dealerSelected,
            },
          });
        } else {
          // обновляем дилера локально
          return dispatch({
            type: DEALER__SUCCESS__LOCAL,
            payload: {
              newDealer: dealer,
              prevDealer: dealerSelected,
            },
          });
        }
      })
      .catch((error) => {
        return dispatch({
          type: DEALER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const fetchDealers = (isLocal) => {
  return (dispatch) => {
    dispatch({type: DEALERS__REQUEST});

    return API.fetchDealers(isLocal)
      .then((response) => {
        const {data: dealers, error} = response;

        if (error) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        const dealersByRegions = dealers.reduce(
          (result, dealer) => {
            result[dealer.region].push(dealer);
            return result;
          },
          {
            [RUSSIA]: [],
            [BELARUSSIA]: [],
            [UKRAINE]: [],
          },
        );

        if (!isLocal) {
          return dispatch({
            type: DEALERS__SUCCESS,
            payload: dealersByRegions,
          });
        } else {
          return dispatch({
            type: DEALER__SUCCESS__LOCAL,
            payload: dealersByRegions,
          });
        }
      })
      .catch((error) => {
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
  return (dispatch) => {
    return dispatch({
      type: DEALERS_BY_CITIES__SET,
      payload: dealersByRegions,
    });
  };
};
