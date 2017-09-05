import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import service from '../service/reducers';
import contacts from '../contacts/reducers';

const rootReducer = combineReducers({
  info,
  dealer,
  service,
  profile,
  contacts,
  form: formReducer,
});

export default rootReducer;
