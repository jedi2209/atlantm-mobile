import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from 'redux-logger';
import LogRocket from '@logrocket/react-native';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['nav', 'modal', 'catalog'],
  keyPrefix: 'atlantm',
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(__DEV__ ? require('redux-immutable-state-invariant').default() : [])
      .concat(__DEV__ ? createLogger({ collapsed: true, diff: true }) : [])
      .concat(LogRocket.reduxMiddleware()),
  // ... other configurations
});

const storePersist = persistStore(store, null, () => {
  console.info('Store initial status', store.getState());
});

export { store, storePersist };
