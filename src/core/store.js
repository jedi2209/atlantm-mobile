import thunkMiddleware from 'redux-thunk';
import {autoRehydrate} from 'redux-persist';
import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';

import rootReducer from './reducers';

const middleware = [thunkMiddleware, __DEV__ && createLogger({ collapsed: true })].filter(Boolean);

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(
    applyMiddleware(...middleware),
    autoRehydrate(),
  ),
);
