import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get, findIndex} from 'lodash';
import {
  DEALERS_REGION__SELECT,
  DEALERS_BY_CITIES__SET,
  DEALER__REQUEST,
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  CLEAR_LOCAL_DEALER,
  DEALER__FAIL,
  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  ALL_DEALERS__SUCCESS,
  DEALERS__FAIL,
  BRANDS__REQUEST,
  BRANDS__SUCCESS,
  BRANDS__FAIL,
  CITIES__REQUEST,
  CITIES__SUCCESS,
  CITIES__FAIL,
} from './actionTypes';

import {CALL_ME__SUCCESS} from '../contacts/actionTypes';
import {
  PARTS_ORDER__SUCCESS,
  SERVICE_ORDER__SUCCESS,
} from '../service/actionTypes';

import {TVA__SUCCESS} from '../tva/actionTypes';

import {CAR_COST__SUCCESS} from '../catalog/actionTypes';

import {APP_STORE_UPDATED} from '../core/actionTypes';

import {APP_REGION, RUSSIA, BELARUSSIA, UKRAINE} from '../core/const';

function selected(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.selected', {});
    case DEALER__SUCCESS:
      return {...action.payload.newDealer};
    case APP_STORE_UPDATED:
      return {};
    default:
      return state;
  }
}

function selectedLocal(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.selectedLocal', null);
    case DEALER__SUCCESS__LOCAL:
      return {...action.payload.newDealer};
    case APP_STORE_UPDATED:
    case DEALER__SUCCESS:
    case CALL_ME__SUCCESS:
    case PARTS_ORDER__SUCCESS:
    case SERVICE_ORDER__SUCCESS:
    case TVA__SUCCESS:
    case CAR_COST__SUCCESS:
    case CLEAR_LOCAL_DEALER:
      return null;
    default:
      return state;
  }
}

function region(state = APP_REGION, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.region', APP_REGION);
    case DEALERS_REGION__SELECT:
      return action.payload;
    case DEALER__SUCCESS:
      return action.payload.newDealer.region;
    case APP_STORE_UPDATED:
      return null;
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

function listBrands(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listBrands', []);
    case BRANDS__SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

function listCities(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listCities', {});
    case CITIES__SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

function listDealers(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'dealer.listDealers', {});
    case ALL_DEALERS__SUCCESS:
      return action.payload;
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
    case DEALER__SUCCESS__LOCAL:
    case DEALER__FAIL:
      return false;
    default:
      return state;
  }
}

function isFetchBrands(state = false, action) {
  switch (action.type) {
    case BRANDS__REQUEST:
      return true;
    case BRANDS__SUCCESS:
    case BRANDS__FAIL:
      return false;
    default:
      return state;
  }
}

// helper
const processListsByCities = (action, region) => {
  return [];
  const dealersByCities = get(action, `payload.${region}`, []).reduce(
    (result, dealer) => {
      let cityDataIndex = findIndex(result, {id: dealer.city.id}); // dealer.city.id БОЛЬШЕ НЕТ !!!!!

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
      return get(action, 'payload.dealer.listRussiaByCities', []);
    case DEALERS__SUCCESS: // устанавливается при выборе дилера
    case DEALERS_BY_CITIES__SET: // нужно для обновления 4.2.0
      return processListsByCities(action, RUSSIA);
    default:
      return state;
  }
};

const listBelarussiaByCities = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.dealer.listBelarussiaByCities', []);
    case DEALERS__SUCCESS:
    case DEALERS_BY_CITIES__SET:
      return processListsByCities(action, BELARUSSIA);
    default:
      return state;
  }
};

const listUkraineByCities = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.dealer.listUkraineByCities', []);
    case DEALERS__SUCCESS:
    case DEALERS_BY_CITIES__SET:
      return processListsByCities(action, BELARUSSIA);
    default:
      return state;
  }
};

export default combineReducers({
  selected,
  selectedLocal,
  region,
  listRussia,
  listRussiaByCities,
  listBelarussia,
  listBelarussiaByCities,
  listUkraine,
  listUkraineByCities,
  listDealers,
  listCities,
  listBrands,
  meta: combineReducers({
    isFetchDealersList,
    isFetchDealer,
  }),
});
