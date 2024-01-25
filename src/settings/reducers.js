import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get} from 'lodash';
import {
  NOTIFICATIONS__REQUEST,
  NOTIFICATIONS__SUCCESS,
  NOTIFICATIONS__FAIL,
} from './actionTypes';

function notificationsData(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'settings.notifications.data', []);
    case NOTIFICATIONS__SUCCESS:
      return action.payload?.data;
    case NOTIFICATIONS__FAIL:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  notifications: combineReducers({
    data: notificationsData,
  }),
});
