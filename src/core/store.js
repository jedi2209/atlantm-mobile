import thunkMiddleware from 'redux-thunk';
import {autoRehydrate} from 'redux-persist';
import {createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';

import rootReducer from './reducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
  thunkMiddleware,
  __DEV__ && createLogger({collapsed: true, diff: true}),
];

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(...middleware), autoRehydrate()),
);
