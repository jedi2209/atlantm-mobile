import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import logger from 'redux-logger';

import rootReducer from './reducers';

const middleware = [thunkMiddleware, __DEV__ && logger].filter(Boolean);
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(...middleware)),
);
