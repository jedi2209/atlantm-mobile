import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';
import contacts from '../contacts/reducers';

const rootReducer = combineReducers({
  form: formReducer,
  dealer,
  info,
  profile,
  contacts,
});

export default rootReducer;
