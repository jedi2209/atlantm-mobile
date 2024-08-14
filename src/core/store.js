import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createLogger} from 'redux-logger';
import LogRocket from '@logrocket/react-native';

import {configureStore} from '@reduxjs/toolkit';

import rootReducer from './reducers';

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
    middleware: [
      thunk,
      createLogger({collapsed: true, diff: true}),
      LogRocket.reduxMiddleware(),
    ],
  });
} else {
  store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, LogRocket.reduxMiddleware()],
  });
}

const storePersist = persistStore(store, () => {
  console.info('Store initial status', store.getState());
});

export {store, storePersist};
