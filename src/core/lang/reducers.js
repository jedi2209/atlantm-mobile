import {combineReducers} from 'redux';
import {APP_LANG_SET} from './actionTypes';
import {REHYDRATE} from 'redux-persist/es/constants';
import {get} from 'lodash';

function language(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
      return get(action.payload, 'core.language.selected', 'ru');
    case APP_LANG_SET:
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  selected: language,
});
