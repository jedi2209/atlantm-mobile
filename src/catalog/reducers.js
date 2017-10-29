import { combineReducers } from 'redux';
import { get } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_LIST__RESET,
  USED_CAR_CITY__SELECT,
  USED_CAR_REGION__SELECT,
  USED_CAR_PRICE_FILTER__SHOW,
  USED_CAR_PRICE_FILTER__HIDE,
  EVENT_LOAD_MORE,
} from './actionTypes';

import { DEALER__SUCCESS } from '../dealer/actionTypes';

const usedCarItems = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
    case USED_CAR_LIST__RESET:
      return [];
    case USED_CAR_LIST__SUCCESS:
      if (action.payload.type === EVENT_LOAD_MORE) {
        return [
          ...state,
          ...action.payload.data,
        ];
      }
      return action.payload.data;
    default:
      return state;
  }
};

const usedCarTotal = (state = {}, action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
      return {};
    case USED_CAR_LIST__SUCCESS:
      return action.payload.total;
    default:
      return state;
  }
};

const usedCarPages = (state = {}, action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
      return {};
    case USED_CAR_LIST__SUCCESS:
      return action.payload.pages || {};
    default:
      return state;
  }
};

const usedCarPrices = (state = {}, action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
      return {};
    case USED_CAR_LIST__SUCCESS:
      return action.payload.prices;
    default:
      return state;
  }
};

const usedCarCity = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case USED_CAR_CITY__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const usedCarRegion = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case USED_CAR_REGION__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const isFetchUsedCarItems = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
    case USED_CAR_LIST__SUCCESS:
    case USED_CAR_LIST__FAIL:
      return false;
    case USED_CAR_LIST__REQUEST:
      return true;
    default:
      return state;
  }
};

const isUsedCarPriceFilterShow = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return false;
    case USED_CAR_PRICE_FILTER__HIDE:
      return false;
    case USED_CAR_PRICE_FILTER__SHOW:
      return true;
    default:
      return state;
  }
};

export default combineReducers({
  usedCar: combineReducers({
    city: usedCarCity,
    total: usedCarTotal,
    pages: usedCarPages,
    items: usedCarItems,
    prices: usedCarPrices,
    region: usedCarRegion,
    meta: combineReducers({
      isFetchItems: isFetchUsedCarItems,
      isPriceFilterShow: isUsedCarPriceFilterShow,
    }),
  }),
});
