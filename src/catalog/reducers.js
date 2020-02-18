import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/constants';
import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_LIST__RESET,
  USED_CAR_LIST_UPDATE__SET,
  USED_CAR_LIST_STOP_UPDATE__SET,
  USED_CAR_CITY__SELECT,
  USED_CAR_REGION__SELECT,
  USED_CAR_PRICE_RANGE__SELECT,
  USED_CAR_PRICE_FILTER__SHOW,
  USED_CAR_PRICE_FILTER__HIDE,
  USED_CAR_DETAILS__REQUEST,
  USED_CAR_DETAILS__SUCCESS,
  USED_CAR_DETAILS__FAIL,
  USED_CAR_DETAILS_PHOTO_VIEWER__OPEN,
  USED_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
  USED_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
  USED_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
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
  NEW_CAR_FILTER_PRICE__SHOW,
  NEW_CAR_FILTER_PRICE__HIDE,
  NEW_CAR_FILTER_PRICE_SPECIAL__SET,
  NEW_CAR_DETAILS__REQUEST,
  NEW_CAR_DETAILS__SUCCESS,
  NEW_CAR_DETAILS__FAIL,
  NEW_CAR_DETAILS_PHOTO_VIEWER__OPEN,
  NEW_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
  NEW_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
  NEW_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
  CATALOG_DEALER__REQUEST,
  CATALOG_DEALER__SUCCESS,
  CATALOG_DEALER__FAIL,
  CATALOG_ORDER__REQUEST,
  CATALOG_ORDER__SUCCESS,
  CATALOG_ORDER__FAIL,
  CATALOG_ORDER_COMMENT__FILL,

  // car cost
  CAR_COST__REQUEST,
  CAR_COST__SUCCESS,
  CAR_COST__FAIL,
  CAR_COST_PHOTOS__FILL,
  CAR_COST_BRAND__FILL,
  CAR_COST_MODEL__FILL,
  CAR_COST_YEAR__SELECT,
  CAR_COST_MILEAGE__FILL,
  CAR_COST_MILEAGE_UNIT__SELECT,
  CAR_COST_ENGINE_VOLUME__FILL,
  CAR_COST_ENGINE_TYPE__SELECT,
  CAR_COST_GEARBOX__SELECT,
  CAR_COST_COLOR__FILL,
  CAR_COST_CAR_CONDITION__SELECT,
  CAR_COST_COMMENT__FILL,
  CAR_COST_VIN__FILL,

  // filtlers
  ACTION_SAVE_CAR_FILTERS__UPDATE,
} from './actionTypes';

import {EVENT_LOAD_MORE} from '../core/actionTypes';
import {DEALER__SUCCESS} from '../dealer/actionTypes';

import {MILEAGE_UNIT_KM} from './carcost/const';

const usedCarItems = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
    case USED_CAR_LIST__RESET:
    case 'ACTION_SAVE_CAR_FILTERS_USED__UPDATE':
      return [];
    case USED_CAR_LIST__SUCCESS:
      if (action.payload.type === EVENT_LOAD_MORE) {
        return [...state, ...action.payload.data];
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
      if (action.payload.type === EVENT_LOAD_MORE) {
        return {
          ...state,
          ...action.payload.total,
        };
      }
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
      if (action.payload.type === EVENT_LOAD_MORE) {
        return {
          ...state,
          ...action.payload.pages,
        };
      }
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
      if (action.payload.type === EVENT_LOAD_MORE) {
        return {
          ...state,
          ...action.payload.prices,
        };
      }
      return action.payload.prices;
    default:
      return state;
  }
};

const usedCarCity = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case DEALER__SUCCESS:
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
    case DEALER__SUCCESS:
    case USED_CAR_CITY__SELECT:
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
    case CATALOG_ORDER__SUCCESS:
      return '';
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

const usedCarPhotoViewerIndex = (state = 0, action) => {
  switch (action.type) {
    case USED_CAR_DETAILS__REQUEST:
      return 0;
    case USED_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE:
      return action.payload;
    default:
      return state;
  }
};

const usedCarPhotoViewerItems = (state = [], action) => {
  switch (action.type) {
    case USED_CAR_DETAILS__REQUEST:
      return [];
    case USED_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET:
      return action.payload;
    default:
      return state;
  }
};

const usedCarPhotoViewerVisible = (state = false, action) => {
  switch (action.type) {
    case USED_CAR_DETAILS__REQUEST:
    case USED_CAR_DETAILS_PHOTO_VIEWER__CLOSE:
      return false;
    case USED_CAR_DETAILS_PHOTO_VIEWER__OPEN:
      return true;
    default:
      return state;
  }
};

const needUpdateUsedCarList = (state = false, action) => {
  switch (action.type) {
    case USED_CAR_LIST_STOP_UPDATE__SET:
      return false;
    case USED_CAR_LIST_UPDATE__SET:
      return true;
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
    case DEALER__SUCCESS:
    case NEW_CAR_FILTER_DATA__REQUEST:
      return null;
    case NEW_CAR_FILTER_DATA__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const newCarByFilter = (state = {}, action) => {
  switch (action.type) {
    case DEALER__SUCCESS:
      return {};
    case NEW_CAR_CITY__SELECT:
      return {};
    case ACTION_SAVE_CAR_FILTERS__UPDATE:
      return {};
    case NEW_CAR_BY_FILTER__SUCCESS:
      if (action.payload.type === EVENT_LOAD_MORE) {
        const newState = {
          ...action.payload,
        };

        newState.data = [].concat(state.data, newState.data);

        return newState;
      }

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
    case NEW_CAR_CITY__SELECT:
      return [];
    case NEW_CAR_FILTER_BRANDS__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterModels = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return [];
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

const newCarFilterPriceSpecial = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return false;
    case NEW_CAR_FILTER_PRICE_SPECIAL__SET:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterBody = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return [];
    case NEW_CAR_FILTER_BODY__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterGearbox = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return [];
    case NEW_CAR_FILTER_GEARBOX__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterEngineType = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return [];
    case NEW_CAR_FILTER_ENGINE_TYPE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterDrive = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return [];
    case NEW_CAR_FILTER_DRIVE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilterPrice = (state = null, action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return null;
    case NEW_CAR_FILTER_PRICE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const isNewCarFilterPriceShow = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return false;
    case NEW_CAR_FILTER_PRICE__HIDE:
      return false;
    case NEW_CAR_FILTER_PRICE__SHOW:
      return true;
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
    case NEW_CAR_FILTER_PRICE_SPECIAL__SET:
    case ACTION_SAVE_CAR_FILTERS__UPDATE:
      return true;
    case NEW_CAR_FILTER_DATA__REQUEST:
    case NEW_CAR_BY_FILTER__REQUEST:
      return false;
    default:
      return state;
  }
};

const needFetchFilterDataAfterCity = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_CITY__SELECT:
      return true;
    case NEW_CAR_FILTER_DATA__REQUEST:
    case NEW_CAR_BY_FILTER__REQUEST:
      return false;
    default:
      return state;
  }
};

const isFetchingNewCarDetails = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_DETAILS__REQUEST:
      return true;
    case NEW_CAR_DETAILS__SUCCESS:
    case NEW_CAR_DETAILS__FAIL:
      return false;
    default:
      return state;
  }
};

const newCarDetails = (state = null, action) => {
  switch (action.type) {
    case NEW_CAR_DETAILS__REQUEST:
      return null;
    case NEW_CAR_DETAILS__SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const newCarPhotoViewerIndex = (state = 0, action) => {
  switch (action.type) {
    case NEW_CAR_DETAILS__REQUEST:
      return 0;
    case NEW_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE:
      return action.payload;
    default:
      return state;
  }
};

const newCarPhotoViewerItems = (state = [], action) => {
  switch (action.type) {
    case NEW_CAR_DETAILS__REQUEST:
      return [];
    case NEW_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET:
      return action.payload;
    default:
      return state;
  }
};

const newCarPhotoViewerVisible = (state = false, action) => {
  switch (action.type) {
    case NEW_CAR_DETAILS__REQUEST:
    case NEW_CAR_DETAILS_PHOTO_VIEWER__CLOSE:
      return false;
    case NEW_CAR_DETAILS_PHOTO_VIEWER__OPEN:
      return true;
    default:
      return state;
  }
};

// CarCost
const isCarCostRequest = (state = false, action) => {
  switch (action.type) {
    case CAR_COST__REQUEST:
      return true;
    case CAR_COST__SUCCESS:
    case CAR_COST__FAIL:
      return false;
    default:
      return state;
  }
};

const carCostPhotos = (state = {}, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return {};
    case CAR_COST_PHOTOS__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostBrand = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_BRAND__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostModel = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_MODEL__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostYear = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_YEAR__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const carCostMileage = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_MILEAGE__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostMileageUnit = (state = MILEAGE_UNIT_KM, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return MILEAGE_UNIT_KM;
    case CAR_COST_MILEAGE_UNIT__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const carCostEngineVolume = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_ENGINE_VOLUME__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostEngineType = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_ENGINE_TYPE__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const carCostGearbox = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_GEARBOX__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const carCostColor = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_COLOR__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostCarCondition = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_CAR_CONDITION__SELECT:
      return action.payload;
    default:
      return state;
  }
};

const carCostVin = (state = null, action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return null;
    case CAR_COST_VIN__FILL:
      return action.payload;
    default:
      return state;
  }
};

const carCostComment = (state = '', action) => {
  switch (action.type) {
    case CAR_COST__SUCCESS:
      return '';
    case CAR_COST_COMMENT__FILL:
      return action.payload;
    default:
      return state;
  }
};

const newCarFilters = (
  state = {
    brandFilters: [],
    bodyFilters: [],
    priceFilter: {},
  },
  action,
) => {
  switch (action.type) {
    case ACTION_SAVE_CAR_FILTERS__UPDATE:
      return action.payload;
    case DEALER__SUCCESS:
      return {
        brandFilters: [],
        bodyFilters: [],
        priceFilter: {},
      };
    default:
      return state;
  }
};

const usedCarFilters = (
  state = {
    priceFilter: {},
  },
  action,
) => {
  switch (action.type) {
    case 'ACTION_SAVE_CAR_FILTERS_USED__UPDATE':
      return action.payload;
    case DEALER__SUCCESS:
    case USED_CAR_CITY__SELECT:
      return {
        priceFilter: {},
      };
    default:
      return state;
  }
};

// End CarCost

export default combineReducers({
  dealer,
  orderComment,
  meta: combineReducers({
    isFetchingDealer,
    isOrderCarRequest,
  }),

  usedCar: combineReducers({
    carDetails: combineReducers({
      data: usedCarDetails,
      photoViewerItems: usedCarPhotoViewerItems,
      photoViewerVisible: usedCarPhotoViewerVisible,
      photoViewerIndex: usedCarPhotoViewerIndex,
    }),
    city: usedCarCity,
    total: usedCarTotal,
    pages: usedCarPages,
    items: usedCarItems,
    prices: usedCarPrices,
    region: usedCarRegion,
    priceRange: usedCarPriceRange,
    meta: combineReducers({
      needUpdate: needUpdateUsedCarList,
      isFetchItems: isFetchUsedCarItems,
      isPriceFilterShow: isUsedCarPriceFilterShow,
      isFetchingCarDetails: isFetchingUsedCarDetails,
    }),
    filters: usedCarFilters,
  }),

  newCar: combineReducers({
    carDetails: combineReducers({
      data: newCarDetails,
      photoViewerItems: newCarPhotoViewerItems,
      photoViewerVisible: newCarPhotoViewerVisible,
      photoViewerIndex: newCarPhotoViewerIndex,
    }),
    filterBrands: newCarFilterBrands,
    filterModels: newCarFilterModels,
    filterBody: newCarFilterBody,
    filterGearbox: newCarFilterGearbox,
    filterDrive: newCarFilterDrive,
    filterEngineType: newCarFilterEngineType,
    filterPrice: newCarFilterPrice,
    filterPriceSpecial: newCarFilterPriceSpecial,
    filterData: newCarFilterData,
    items: newCarByFilter,
    city: newCarCity,
    region: newCarRegion,
    meta: combineReducers({
      needFetchFilterData,
      needFetchFilterDataAfterCity,
      isFetchingFilterData,
      isNewCarFilterPriceShow,
      isFetchingNewCarByFilter,
      isFetchingCarDetails: isFetchingNewCarDetails,
    }),
    filters: newCarFilters,
  }),

  carCost: combineReducers({
    photos: carCostPhotos,
    brand: carCostBrand,
    model: carCostModel,
    year: carCostYear,
    mileage: carCostMileage,
    mileageUnit: carCostMileageUnit,
    engineVolume: carCostEngineVolume,
    engineType: carCostEngineType,
    gearbox: carCostGearbox,
    color: carCostColor,
    comment: carCostComment,
    vin: carCostVin,
    carCondition: carCostCarCondition,
    meta: combineReducers({
      isCarCostRequest,
    }),
  }),
});
