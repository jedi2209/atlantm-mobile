import thunkMiddleware from 'redux-thunk';
import {persistStore as makeStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import Reactotron from './containers/ReactotronConfig';

import rootReducer from './reducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
  thunkMiddleware,
  __DEV__ && createLogger({collapsed: true, diff: true}),
].filter(Boolean);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['form', 'nav', 'modal', 'catalog'],
  keyPrefix: 'atlantm',
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;

if (__DEV__) {
  store = createStore(
    persistedReducer,
    composeEnhancer(applyMiddleware(...middleware), Reactotron.createEnhancer())
  );
} else {
  store = createStore(
    persistedReducer,
    composeEnhancer(applyMiddleware(...middleware))
  );
}

console.log('Wrapper ====>', 'getPersistStore');
const persistStore = makeStore(
    store,
    () => {
      console.log('store in getPersistStore', store.getState());
      this.setState({rehydrated: true});
    },
  );

export {store, persistStore};