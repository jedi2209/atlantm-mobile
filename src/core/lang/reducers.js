import {combineReducers} from 'redux';
import {
    APP_LANG_SET,
} from './actionTypes';
import {REHYDRATE} from 'redux-persist/constants';
import {get, findIndex} from 'lodash';

function language(state = {}, action) {
    switch (action.type) {
      case REHYDRATE:
        return get(action.payload, 'selected', {});
      case APP_LANG_SET:
        return {...action.payload};
      default:
        return state;
    }
}

export default combineReducers({
    selected: language,
});
