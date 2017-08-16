import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import info from '../info/reducers';
import profile from '../profile/reducers';

const rootReducer = combineReducers({
  form: formReducer,
  dealer,
  info,
  profile,
});

export default rootReducer;
