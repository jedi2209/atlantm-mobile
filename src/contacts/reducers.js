import {combineReducers} from 'redux';
import {REHYDRATE} from 'redux-persist/es/constants';
import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
  CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE,

  CONTACTS_CHAT_SEND__SUCCESS,
  CONTACTS_CHAT_SEND__FAIL,
} from './actionTypes';
import {get} from 'lodash';

const isСallMeRequest = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
    case CALL_ME__SUCCESS:
    case CALL_ME__FAIL:
      return false;
    case CALL_ME__REQUEST:
      return true;
    default:
      return state;
  }
};

const isRequestCheckAvailableNaviApps = (state = false, action) => {
  switch (action.type) {
    case CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST:
      return true;
    case REHYDRATE:
    case CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE:
      return false;
    default:
      return state;
  }
};

const availableNaviApps = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return [];
    case CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET:
      return action.payload;
    default:
      return state;
  }
};

const chatID = (state = null, action) => {
  switch (action.type) {
    case CONTACTS_CHAT_SEND__SUCCESS:
      return action.payload.session;
    case REHYDRATE:
      return get(action.payload, 'contacts.chat.id');
    default:
      return state;
  }
};

export default combineReducers({
  isСallMeRequest,
  map: combineReducers({
    availableNaviApps,
    isRequestCheckAvailableNaviApps,
  }),
  chat: combineReducers({
    id: chatID,
  }),
});
