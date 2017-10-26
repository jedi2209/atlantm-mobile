import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { get, uniqBy } from 'lodash';
import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR__CITY,
  EVENT_LOAD_MORE,
} from './actionTypes';

const usedCarItems = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return [];
    case USED_CAR_LIST__SUCCESS:
      if (action.payload.type === EVENT_LOAD_MORE) {
        return [
          ...state,
          ...action.payload.data,
        ];
        // return uniqBy(, item => { item.id.api; });
      }
      return action.payload.data;
    default:
      return state;
  }
};

const usedCarTotal = (state = {}, action) => {
  switch (action.type) {
    case REHYDRATE:
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
      return {};
    case USED_CAR_LIST__SUCCESS:
      return action.payload.pages;
    default:
      return state;
  }
};

const usedCarCity = (state = null, action) => {
  switch (action.type) {
    case REHYDRATE:
      return null;
    case USED_CAR__CITY:
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

export default combineReducers({
  usedCar: combineReducers({
    items: usedCarItems,
    total: usedCarTotal,
    pages: usedCarPages,
    city: usedCarCity,
    meta: combineReducers({
      isFetchItems: isFetchUsedCarItems,
    }),
  }),
});
