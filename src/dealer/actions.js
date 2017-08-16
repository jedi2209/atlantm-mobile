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
  ru: RUSSIA,
  by: BELARUSSIA,
  ua: UKRAINE,
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

    return Promise.all([
      API.fetchDealers(),
      API.fetchBrands(),
    ])
      .then(response => {
        const { data: dealers, error: errorDealers } = response[0];
        const { data: brands, error: errorBrands } = response[1];

        console.log('dealers', dealers);

        if (errorDealers) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: errorDealers.code,
              error: errorDealers.message,
              errorSource: 'fetchDealers',
            },
          });
        }

        if (errorBrands) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: errorBrands.code,
              error: errorBrands.message,
              errorSource: 'fetchBrands',
            },
          });
        }

        if (dealers.length === 0) {
          dispatch({
            type: DEALERS__SUCCESS,
            payload: [],
          });
        }

        Promise.all(dealers.map(dealer => {
          // получаем подробную информацию
          return API.fetchDealer(dealer.id)
            .then(dealerDetailsResponse => {

              if (dealerDetailsResponse.error) {
                return dispatch({
                  type: DEALERS__FAIL,
                  payload: {
                    error: error.message,
                    errorSource: 'fetchDealer',
                  },
                });
              }

              const result = { ...dealerDetailsResponse.data };

              result.brand = Object.keys(result.brand).map(brandId => {
                return _.find(brands, (item) => {
                  return item.id === +brandId;
                });
              });

              return result;
            });
        }))
        .then(response => {
          const dealersByCountries = response.reduce((result, responseItem, index) => {
            const baseData = dealers[index] || {};

            const country = dealersCountries[baseData.region];

            responseItem.id = baseData.id;
            responseItem.country = baseData.region;
            result[country].push(responseItem);

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
