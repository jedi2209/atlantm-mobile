import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createLogger} from 'redux-logger';

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
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(createLogger({collapsed: true, diff: true})),
    enhancers: getDefaultEnhancers =>
      __DEV__
        ? getDefaultEnhancers().concat(
            require('./containers/ReactotronConfig').default.createEnhancer(),
          )
        : getDefaultEnhancers(),
  });
} else {
  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

const storePersist = persistStore(store, () => {
  console.info('Store initial status', store.getState());
});

export {store, storePersist};
