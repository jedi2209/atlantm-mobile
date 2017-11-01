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
  USED_CAR_PRICE_RANGE__SELECT,
  USED_CAR_PRICE_FILTER__SHOW,
  USED_CAR_PRICE_FILTER__HIDE,
  USED_CAR_DETAILS__REQUEST,
  USED_CAR_DETAILS__SUCCESS,
  USED_CAR_DETAILS__FAIL,

  NEW_CAR_CITY__SELECT,
  NEW_CAR_REGION__SELECT,

  NEW_CAR_FILTER_DATA__REQUEST,
  NEW_CAR_FILTER_DATA__SUCCESS,
  NEW_CAR_FILTER_DATA__FAIL,
  NEW_CAR_BY_FILTER__REQUEST,
  NEW_CAR_BY_FILTER__SUCCESS,
  NEW_CAR_BY_FILTER__FAIL,

  NEW_CAR_FILTER_BRANDS__SELECT,
  NEW_CAR_FILTER_MODELS__SELECT,
  NEW_CAR_FILTER_BODY__SELECT,
  NEW_CAR_FILTER_GEARBOX__SELECT,
  NEW_CAR_FILTER_ENGINE_TYPE__SELECT,
  NEW_CAR_FILTER_DRIVE__SELECT,
  NEW_CAR_FILTER_PRICE__SELECT,

  EVENT_LOAD_MORE,

  CATALOG_DEALER__REQUEST,
  CATALOG_DEALER__SUCCESS,
  CATALOG_DEALER__FAIL,

  CATALOG_ORDER__REQUEST,
  CATALOG_ORDER__SUCCESS,
  CATALOG_ORDER__FAIL,

  CATALOG_ORDER_COMMENT__FILL,
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

const usedCarPriceRange = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case USED_CAR_PRICE_RANGE__SELECT:
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

const dealer = (state = null, action) => {
  switch (action.type) {
    case CATALOG_DEALER__REQUEST:
      return null;
    case CATALOG_DEALER__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const isFetchingDealer = (state = false, action) => {
  switch (action.type) {
    case CATALOG_DEALER__REQUEST:
      return true;
    case CATALOG_DEALER__SUCCESS:
    case CATALOG_DEALER__FAIL:
      return false;
    default:
      return state;
  }
};

const isOrderCarRequest = (state = false, action) => {
  switch (action.type) {
    case CATALOG_ORDER__REQUEST:
      return true;
    case CATALOG_ORDER__SUCCESS:
    case CATALOG_ORDER__FAIL:
      return false;
    default:
      return state;
  }
};

const orderComment = (state = '', action) => {
  switch (action.type) {
    case CATALOG_ORDER_COMMENT__FILL:
      return action.payload;
    default:
      return state;
  }
};

const isFetchingUsedCarDetails = (state = false, action) => {
  switch (action.type) {
    case USED_CAR_DETAILS__REQUEST:
      return true;
    case USED_CAR_DETAILS__SUCCESS:
    case USED_CAR_DETAILS__FAIL:
      return false;
    default:
      return state;
  }
};

const usedCarDetails = (state = null, action) => {
  switch (action.type) {
    case USED_CAR_DETAILS__REQUEST:
      return null;
    case USED_CAR_DETAILS__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

// newCar
const isFetchingFilterData = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_DATA__REQUEST:
      return true;
    case NEW_CAR_FILTER_DATA__SUCCESS:
    case NEW_CAR_FILTER_DATA__FAIL:
      return false;
    default:
      return state;
  }
};

const isFetchingNewCarByFilter = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_BY_FILTER__REQUEST:
      return true;
    case NEW_CAR_BY_FILTER__SUCCESS:
    case NEW_CAR_BY_FILTER__FAIL:
      return false;
    default:
      return state;
  }
};

const newCarFilterData = (state = null, action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_DATA__REQUEST:
      return null;
    case NEW_CAR_FILTER_DATA__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const newCarByFilter = (state = null, action) => {
  switch (action.type) {
    case NEW_CAR_BY_FILTER__REQUEST:
      return null;
    case NEW_CAR_BY_FILTER__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const newCarCity = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case NEW_CAR_CITY__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarRegion = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case NEW_CAR_REGION__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterBrands = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_BRANDS__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterModels = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_BRANDS__SELECT:
      return state.filter(item => {
        return action.payload.includes(item.brandId);
      });
    case NEW_CAR_FILTER_MODELS__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterBody = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_BODY__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterGearbox = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_GEARBOX__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterEngineType = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_ENGINE_TYPE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterDrive = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_DRIVE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterPrice = (state = null, action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_PRICE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const needFetchFilterData = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_FILTER_BRANDS__SELECT:
    case NEW_CAR_FILTER_MODELS__SELECT:
    case NEW_CAR_FILTER_BODY__SELECT:
    case NEW_CAR_FILTER_GEARBOX__SELECT:
    case NEW_CAR_FILTER_ENGINE_TYPE__SELECT:
    case NEW_CAR_FILTER_DRIVE__SELECT:
    case NEW_CAR_FILTER_PRICE__SELECT:
      return true;
    case NEW_CAR_FILTER_DATA__REQUEST:
    case NEW_CAR_BY_FILTER__REQUEST:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  dealer,
  orderComment,
  meta: combineReducers({
    isFetchingDealer,
    isOrderCarRequest,
  }),

  usedCar: combineReducers({
    carDetails: usedCarDetails,
    city: usedCarCity,
    total: usedCarTotal,
    pages: usedCarPages,
    items: usedCarItems,
    prices: usedCarPrices,
    region: usedCarRegion,
    priceRange: usedCarPriceRange,
    meta: combineReducers({
      isFetchItems: isFetchUsedCarItems,
      isPriceFilterShow: isUsedCarPriceFilterShow,
      isFetchingCarDetails: isFetchingUsedCarDetails,
    }),
  }),

  newCar: combineReducers({
    // carDetails: usedCarDetails,
    filterBrands: newCarFilterBrands,
    filterModels: newCarFilterModels,
    filterBody: newCarFilterBody,
    filterGearbox: newCarFilterGearbox,
    filterDrive: newCarFilterDrive,
    filterEngineType: newCarFilterEngineType,
    filterPrice: newCarFilterPrice,
    filterData: newCarFilterData,
    items: newCarByFilter,
    city: newCarCity,
    region: newCarRegion,
    meta: combineReducers({
      isFetchingFilterData,
      isFetchingNewCarByFilter,
      needFetchFilterData,
      // isFetchItems: isFetchNewCarItems,
      // isPriceFilterShow: isNewCarPriceFilterShow,
      // isFetchingCarDetails: isFetchingNewCarDetails,
    }),
  }),
});
