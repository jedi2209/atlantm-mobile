import thunkMiddleware from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createLogger} from 'redux-logger';
import Reactotron from './containers/ReactotronConfig';

import {configureStore} from '@reduxjs/toolkit';

import rootReducer from './reducers';

const middleware = [
  thunkMiddleware,
  __DEV__ && createLogger({collapsed: true, diff: true}),
].filter(Boolean);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['nav', 'modal', 'catalog'],
  keyPrefix: 'atlantm',
};

let store;

const persistedReducer = persistReducer(persistConfig, rootReducer);

if (__DEV__) {
  store = configureStore({
    reducer: persistedReducer,
    middleware,
    enhancers: [Reactotron.createEnhancer()],
  });
} else {
  store = configureStore({
    reducer: persistedReducer,
    middleware,
  });
}

const storePersist = persistStore(store, () => {
  console.info('Store initial status', store.getState());
});

export {store, storePersist};
