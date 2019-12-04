import {combineReducers} from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {get, findIndex} from 'lodash';
import {
  DEALERS_REGION__SELECT,
  DEALERS_BY_CITIES__SET,
  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__FAIL,
  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,
} from './actionTypes';

import {RUSSIA, BELARUSSIA, UKRAINE} from '../core/const';

function selected(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.selected', {});
    case DEALER__SUCCESS:
      return {...action.payload.newDealer};
    default:
      return state;
  }
}

function region(state = RUSSIA, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.region', RUSSIA);
    case DEALERS_REGION__SELECT:
      return action.payload;
    default:
      return state;
  }
}

function listRussia(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listRussia', []);
    case DEALERS__SUCCESS:
      return [...action.payload[RUSSIA]];
    default:
      return state;
  }
}

function listBelarussia(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listBelarussia', []);
    case DEALERS__SUCCESS:
      return [...action.payload[BELARUSSIA]];
    default:
      return state;
  }
}

function listUkraine(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listUkraine', []);
    case DEALERS__SUCCESS:
      return [...action.payload[UKRAINE]];
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

// helper
const processListsByCities = (action, region) => {
  const dealersByCities = get(action, `payload.${region}`, []).reduce(
    (result, dealer) => {
      let cityDataIndex = findIndex(result, {id: dealer.city.id});

      if (cityDataIndex !== -1) {
        result[cityDataIndex].dealers.push(dealer);
      } else {
        result.push({
          id: dealer.city.id,
          name: dealer.city.name,
          dealers: [].concat(dealer),
        });
      }

      return result;
    },
    [],
  );

  return dealersByCities;
};

const listRussiaByCities = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.catalog.listRussia', []);
    case DEALERS__SUCCESS: // устанавливается при выборе дилера
    case DEALERS_BY_CITIES__SET: // нужно для обновления 4.2.0
      return processListsByCities(action, RUSSIA);
    default:
      return state;
  }
};

const listUkraineByCities = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.catalog.listUkraine', []);
    case DEALERS__SUCCESS:
    case DEALERS_BY_CITIES__SET:
      return processListsByCities(action, UKRAINE);
    default:
      return state;
  }
};

const listBelarussiaByCities = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.catalog.listBelarussia', []);
    case DEALERS__SUCCESS:
    case DEALERS_BY_CITIES__SET:
      return processListsByCities(action, BELARUSSIA);
    default:
      return state;
  }
};

export default combineReducers({
  selected,
  region,
  listRussia,
  listUkraine,
  listBelarussia,
  listRussiaByCities,
  listUkraineByCities,
  listBelarussiaByCities,
  meta: combineReducers({
    isFetchDealersList,
    isFetchDealer,
  }),
});
