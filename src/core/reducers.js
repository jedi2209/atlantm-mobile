import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import nav from '../navigation/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import service from '../service/reducers';
import contacts from '../contacts/reducers';

const rootReducer = combineReducers({
  nav,
  info,
  dealer,
  service,
  profile,
  contacts,
  form: formReducer,
});

export default rootReducer;
