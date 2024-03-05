import thunk from 'redux-thunk';
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
import Reactotron from './containers/ReactotronConfig';

import {configureStore} from '@reduxjs/toolkit';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['nav', 'modal', 'catalog'],
  keyPrefix: 'atlantm',
};

let store;

const createdEnhancer = Reactotron.createEnhancer();
const persistedReducer = persistReducer(persistConfig, rootReducer);

if (__DEV__) {
  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(createLogger({collapsed: true, diff: true})),
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(createdEnhancer),
  });
} else {
  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    enhancers: getDefaultEnhancers => getDefaultEnhancers(),
  });
}

const storePersist = persistStore(store, () => {
  console.info('Store initial status', store.getState());
});

export {store, storePersist};
