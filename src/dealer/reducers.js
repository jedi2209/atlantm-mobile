import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import {
  REGION__SELECT,

  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__FAIL,

  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,

} from './actionTypes';

import {
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from './regionConst';

function selected(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.selected', {});
    case DEALER__SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

function region(state = RUSSIA, action) {
  switch (action.type) {
    case REHYDRATE:
      return _.get(action.payload, 'dealer.region', RUSSIA);
    case REGION__SELECT:
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
        ...action.payload[RUSSIA],
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
        ...action.payload[BELARUSSIA],
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
        ...action.payload[UKRAINE],
      };
    default:
      return state;
  }
}

function isFetchDealersList(state = false, action) {
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

function isFetchDealer(state = false, action) {
  switch (action.type) {
    case DEALER__REQUEST:
      return true;
    case DEALER__SUCCESS:
    case DEALER__FAIL:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  selected,
  region,
  listRussia,
  listBelarussia,
  listUkraine,
  meta: combineReducers({
    isFetchDealersList,
    isFetchDealer,
  }),
});
