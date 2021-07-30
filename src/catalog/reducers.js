import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_DETAILS__REQUEST,
  USED_CAR_DETAILS__SUCCESS,
  USED_CAR_DETAILS__FAIL,
  USED_CAR_DETAILS_PHOTO_VIEWER__OPEN,
  USED_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
  USED_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
  USED_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
  NEW_CAR_CITY__SELECT,
  NEW_CAR_BY_FILTER__REQUEST,
  NEW_CAR_BY_FILTER__SUCCESS,
  NEW_CAR_BY_FILTER__FAIL,
  NEW_CAR_DETAILS__REQUEST,
  NEW_CAR_DETAILS__SUCCESS,
  NEW_CAR_DETAILS__FAIL,
  TD_CAR_DETAILS__REQUEST,
  TD_CAR_DETAILS__SUCCESS,
  TD_CAR_DETAILS__FAIL,
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

  // filtlers
  SAVE_USEDCAR_FILTERS,
  SAVE_NEWCAR_FILTERS,
  SAVE_BRANDMODEL_FILTERS_NEW,
  SAVE_BRANDMODEL_FILTERS_USED,
} from './actionTypes';

import {EVENT_LOAD_MORE} from '../core/actionTypes';
import {DEALER__SUCCESS} from '../dealer/actionTypes';

const usedCarItems = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
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

const saveBrandModelNew = (state, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case SAVE_BRANDMODEL_FILTERS_NEW:
      return {
        brand: action?.payload?.brandFilter || {},
        model: action?.payload?.modelFilter || {},
      };
    default:
      return state ? state : {};
  }
};

const saveBrandModelUsed = (state, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {};
    case SAVE_BRANDMODEL_FILTERS_USED:
      return {
        brand: action?.payload?.brandFilter || {},
        model: action?.payload?.modelFilter || {},
      };
    default:
      return state ? state : {};
  }
};

// newCar

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

const newCarByFilter = (state = {}, action) => {
  switch (action.type) {
    case DEALER__SUCCESS:
      return {};
    case NEW_CAR_CITY__SELECT:
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

const isFetchingTDCarDetails = (state = false, action) => {
  switch (action.type) {
    case TD_CAR_DETAILS__REQUEST:
      return true;
    case TD_CAR_DETAILS__SUCCESS:
    case TD_CAR_DETAILS__FAIL:
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

const TDCarDetails = (state = [], action) => {
  switch (action.type) {
    case TD_CAR_DETAILS__REQUEST:
      return [];
    case TD_CAR_DETAILS__SUCCESS:
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

const usedCarFiltersData = (state = {}, action) => {
  const def = {
    filters: null,
    sorting: {
      sortBy: 'price',
      sortDirection: 'asc',
    },
    url: '',
  };
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
      return def;
    case SAVE_USEDCAR_FILTERS:
      return {
        filters: action?.payload?.filters || def.filters,
        sorting: action?.payload?.sorting || def.sorting,
        url: action?.payload?.url || state.url || def.url,
      };
    default:
      return state;
  }
};

const newCarFiltersData = (state = {}, action) => {
  const def = {
    filters: null,
    sorting: {
      sortBy: 'price',
      sortDirection: 'asc',
    },
    url: '',
  };
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
      return def;
    case SAVE_NEWCAR_FILTERS:
      return {
        filters: action?.payload?.filters || def.filters,
        sorting: action?.payload?.sorting || def.sorting,
        url: action?.payload?.url || state.url || def.url,
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
    total: usedCarTotal,
    pages: usedCarPages,
    items: usedCarItems,
    prices: usedCarPrices,
    meta: combineReducers({
      isFetchItems: isFetchUsedCarItems,
      isFetchingCarDetails: isFetchingUsedCarDetails,
    }),
    filters: usedCarFiltersData,
    brandModelFilter: saveBrandModelUsed,
  }),

  newCar: combineReducers({
    carDetails: combineReducers({
      data: newCarDetails,
      tdcars: TDCarDetails,
      photoViewerItems: newCarPhotoViewerItems,
      photoViewerVisible: newCarPhotoViewerVisible,
      photoViewerIndex: newCarPhotoViewerIndex,
    }),
    items: newCarByFilter,
    city: newCarCity,
    meta: combineReducers({
      isFetchingNewCarByFilter,
      isFetchingCarDetails: isFetchingNewCarDetails,
      isFetchingTDCarDetails: isFetchingTDCarDetails,
    }),
    filters: newCarFiltersData,
    brandModelFilter: saveBrandModelNew,
  }),

  carCost: combineReducers({
    meta: combineReducers({
      isCarCostRequest,
    }),
  }),
});
