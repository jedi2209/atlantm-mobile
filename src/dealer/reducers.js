import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import {
  COUNTRY__SELECT,

  DEALER__SELECT,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,
} from './actionTypes';

import { RUSSIA } from './countryConst';

function selected(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.selected', {});
    case DEALER__SELECT:
      return { ...action.payload };
    default:
      return state;
  }
}

const initialState = RUSSIA;
function country(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.country', RUSSIA);
    case COUNTRY__SELECT:
      return action.payload;
    default:
      return state;
  }
}

function listRussia(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.listRussia', []);
    case DEALERS__SUCCESS:
      return {
        ...action.payload.russia,
      };
    default:
      return state;
  }
}

function listBelarussia(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.listBelarussia', []);
    case DEALERS__SUCCESS:
      return {
        ...action.payload.belarussia,
      };
    default:
      return state;
  }
}

function listUkraine(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.listUkraine', []);
    case DEALERS__SUCCESS:
      return {
        ...action.payload.ukraine,
      };
    default:
      return state;
  }
}

function isFetch(state = false, action) {
  switch (action.type) {
    case DEALERS__REQUEST:
      return true;
    case DEALERS__SUCCESS:
    case DEALERS__FAIL:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  selected,
  country,
  listRussia,
  listBelarussia,
  listUkraine,
  meta: combineReducers({
    isFetch,
  }),
});
