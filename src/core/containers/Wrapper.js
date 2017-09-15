import React, { Component } from 'react';

// storage
import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';

// redux
import { Provider } from 'react-redux';
import { store } from '../store';

// components
import SplashScreen from 'react-native-splash-screen';

// components
import App from './App';

// helpers
import { isFunction } from 'lodash';

if (!__DEV__) {
  // eslint-disable-line no-undef
  [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeStamp',
    'trace',
    'warn',
  ].forEach(methodName => {
    console[methodName] = () => {
      /* noop */
    };
  });
}

let persistor;

export const getPersistStore = (cb) => {
  if (persistor) return persistor;

  persistor = persistStore(store, {
    storage: AsyncStorage,
    blacklist: ['form', 'nav'],
    keyPrefix: 'atlantm',
  }, () => {
    console.log('persistStore sync complete');
    isFunction(cb) && cb();
  });

  return persistor;
};

export class Wrapper extends Component {
  constructor(props) {
    super(props);

    this.state = { rehydrated: false };
  }

  componentDidMount() {
    this.defaultHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this));

    // this.persistStore().purge();
    this.persistStore();
  }

  persistStore = () => {
    return getPersistStore(() => {
      this.setState({ rehydrated: true });
    });
  }

  async wrapGlobalHandler(error, isFatal) {
    if (isFatal && !__DEV__) {
      this.persistStore().purge();
    }

    if (this.defaultHandler) {
      this.defaultHandler(error, isFatal);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.rehydrated !== nextState.rehydrated;
  }

  render() {
    if (!this.state.rehydrated) {
      return null;
    }

    console.log('rehydrated');

    SplashScreen.hide();

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
