import {combineReducers} from 'redux';
import notificationsReducer from './actions';

export default combineReducers({
  notifications: notificationsReducer,
});
