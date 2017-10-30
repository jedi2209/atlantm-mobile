import API from '../utils/api';

import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_LIST__RESET,
  USED_CAR_CITY__SELECT,
  USED_CAR_PRICE_RANGE__SELECT,
  USED_CAR_REGION__SELECT,
  USED_CAR_PRICE_FILTER__SHOW,
  USED_CAR_PRICE_FILTER__HIDE,

  CATALOG_DEALER__REQUEST,
  CATALOG_DEALER__SUCCESS,
  CATALOG_DEALER__FAIL,

  CATALOG_ORDER__REQUEST,
  CATALOG_ORDER__SUCCESS,
  CATALOG_ORDER__FAIL,

  CATALOG_ORDER_COMMENT__FILL,

  EVENT_LOAD_MORE,
} from './actionTypes';

export const actionFetchUsedCar = ({ type, city, nextPage, priceRange }) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_LIST__REQUEST,
      payload: {
        type,
        city,
        nextPage,
        priceRange,
      },
    });

    const nextPageUrl = type === EVENT_LOAD_MORE ? nextPage : null;

    return API.fetchUsedCar({
      city,
      priceRange,
      nextPageUrl,
    })
      .then(res => {
        const { data, error, total, pages, prices } = res;

        if (error) {
          return dispatch({
            type: USED_CAR_LIST__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({
          type: USED_CAR_LIST__SUCCESS,
          payload: {
            type,
            data,
            total,
            pages,
            prices,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: USED_CAR_LIST__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSelectUsedCarPriceRange = (prices) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_PRICE_RANGE__SELECT,
      payload: prices,
    });
  };
};

export const actionSelectUsedCarCity = (city) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_CITY__SELECT,
      payload: city,
    });
  };
};

export const actionSelectUsedCarRegion = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_REGION__SELECT,
      payload: region,
    });
  };
};

export const actionResetUsedCarList = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_LIST__RESET,
      payload: region,
    });
  };
};

export const actionShowPriceFilter = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_PRICE_FILTER__SHOW,
      payload: region,
    });
  };
};

export const actionHidePriceFilter = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_PRICE_FILTER__HIDE,
      payload: region,
    });
  };
};

export const actionFetchDealer = dealerBaseData => {
  return dispatch => {
    dispatch({
      type: CATALOG_DEALER__REQUEST,
      payload: dealerBaseData,
    });

    return API.fetchDealer(dealerBaseData.id)
      .then(response => {

        if (response.error) {
          return dispatch({
            type: CATALOG_DEALER__FAIL,
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
          type: CATALOG_DEALER__SUCCESS,
          payload: dealer,
        });
      })
      .catch(error => {
        return dispatch({
          type: CATALOG_DEALER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionCommentOrderCarFill = (comment) => {
  return dispatch => {
    return dispatch({
      type: CATALOG_ORDER_COMMENT__FILL,
      payload: comment,
    });
  };
};

export const actionOrderCar = (props) => {
  return dispatch => {
    dispatch({
      type: CATALOG_ORDER__REQUEST,
      payload: { ...props },
    });

    return API.orderCar(props)
      .then(res => {
        const { error, status } = res;

        if (status !== 'success') {
          return dispatch({
            type: CATALOG_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({ type: CATALOG_ORDER__SUCCESS });
      })
      .catch(error => {
        return dispatch({
          type: CATALOG_ORDER__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
