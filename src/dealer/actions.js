import _ from 'lodash';

import {
  COUNTRY__SELECT,

  DEALER__SELECT,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,

  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__FAIL,

} from './actionTypes';

import API from '../utils/api';

import {
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from './countryConst';

const dealersCountries = {
  113: RUSSIA,
  117: RUSSIA,
  174: RUSSIA,
  181: RUSSIA,
  107: RUSSIA,
  178: RUSSIA,
  102: BELARUSSIA,
  111: BELARUSSIA,
  112: BELARUSSIA,
  105: BELARUSSIA,
  120: BELARUSSIA,
  129: BELARUSSIA,
  137: BELARUSSIA,
  119: UKRAINE,
  116: UKRAINE,
  126: UKRAINE,
  822: UKRAINE,
  922: UKRAINE,
};

export const selectCountry = country => {
  return dispatch => {
    return dispatch({
      type: COUNTRY__SELECT,
      payload: country,
    });
  };
};

export const selectDealer = dealer => {
  return dispatch => {
    return dispatch({
      type: DEALER__SELECT,
      payload: dealer,
    });
  };
};

export const fetchDealers = () => {
  return dispatch => {
    dispatch({ type: DEALERS__REQUEST });

    return API.fetchDealers()
      .then(response => {
        const { data: dealerList, error } = response;

        if (error) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            }
          });
        }

        if (dealerList.length === 0) {
          dispatch({
            type: DEALERS__SUCCESS,
            payload: [],
          });
        }

        Promise.all(dealerList.map(dealer => {
          // получаем подробную информацию
          return API.fetchDealer(dealer.id);
        }))
        .then(dealersResponse => {
          const dealersByCountries = dealersResponse.reduce((result, responseItem, index) => {
            const dealer = responseItem.data;
            // порядок совпадает, поэтому мы можем сматчить дилера по id
            // TODO: уточнить у Саши насчет правильной структуры данных
            const country = dealersCountries[_.get(dealerList[index], 'id')];
            result[country].push(dealer);
            return result;
          }, {
            [RUSSIA]: [],
            [BELARUSSIA]: [],
            [UKRAINE]: [],
          });

          dispatch({
            type: DEALERS__SUCCESS,
            payload: dealersByCountries,
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
