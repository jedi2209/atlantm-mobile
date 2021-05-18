import thunkMiddleware from 'redux-thunk';
import {autoRehydrate} from 'redux-persist';
import {createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import Reactotron from './containers/ReactotronConfig';

import rootReducer from './reducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
  thunkMiddleware,
  __DEV__ && createLogger({collapsed: true, diff: true}),
].filter(Boolean);

let store;

if (__DEV__) {
  store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(...middleware), autoRehydrate(), Reactotron.createEnhancer())
  );
} else {
  store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(...middleware), autoRehydrate()),
  );
}

export default store;

