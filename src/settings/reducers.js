import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get} from 'lodash';
import {
  NOTIFICATIONS__SUCCESS,
  NOTIFICATIONS__FAIL,
  NOTIFICATIONS__LOCAL__ADD,
  NOTIFICATIONS__LOCAL__FAIL,
  NOTIFICATIONS__LOCAL__REMOVE,
} from './actionTypes';
import {LOGOUT} from '../profile/actionTypes';

function notificationsData(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'settings.notifications.remote.data', []);
    case NOTIFICATIONS__SUCCESS:
      return get(action.payload, 'data', []);
    case NOTIFICATIONS__FAIL:
    case LOGOUT:
      return [];
    default:
      return state;
  }
}

function notificationsDataLocal(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'settings.notifications.local.data', []);
    case NOTIFICATIONS__LOCAL__ADD:
      return [...state, action.payload?.data];
    case NOTIFICATIONS__LOCAL__REMOVE:
      return state.filter(val => val?.id !== action.payload);
    case NOTIFICATIONS__LOCAL__FAIL:
      return [];
    default:
      return state;
  }
}

export default combineReducers({
  notifications: combineReducers({
    remote: combineReducers({
      data: notificationsData,
    }),
    local: combineReducers({
      data: notificationsDataLocal,
    }),
  }),
});
