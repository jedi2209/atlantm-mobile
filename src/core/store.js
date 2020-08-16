import thunkMiddleware from 'redux-thunk';
import thunk from 'redux-thunk';
import {autoRehydrate} from 'redux-persist';
import {createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';

import rootReducer from './reducers';

const middleware = [
  thunkMiddleware,
  __DEV__ && createLogger({collapsed: true}),
].filter(Boolean);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const store = createStore(
//   rootReducer,
//   compose(applyMiddleware(...middleware), ),
// );

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunk), autoRehydrate()),
);
