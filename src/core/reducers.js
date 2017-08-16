import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import dealer from '../dealer/reducers';
import info from '../info/reducers';

const rootReducer = combineReducers({
  form: formReducer,
  dealer,
  info,
});

export default rootReducer;
