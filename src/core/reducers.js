import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import nav from '../navigation/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import service from '../service/reducers';
import contacts from '../contacts/reducers';
import catalog from '../catalog/reducers';

import { APP_VERSION__SET } from './actionTypes';
import { REHYDRATE } from 'redux-persist/constants';
import { get } from 'lodash';

const version = (state = '', action) => {
  switch (action.type) {
    case REHYDRATE:
      return get(action, 'payload.core.version', '');
    case APP_VERSION__SET:
      return action.payload;
    default:
      return state;
  }
};

const coreReducer = combineReducers({
  version,
});

const rootReducer = combineReducers({
  nav,
  info,
  dealer,
  service,
  profile,
  catalog,
  contacts,
  core: coreReducer,
  form: formReducer,
});

export default rootReducer;
