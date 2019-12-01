import React, {Component} from 'react';

// storage
import AsyncStorage from '@react-native-community/async-storage';
import {persistStore} from 'redux-persist';

// redux
import {Provider} from 'react-redux';
import {store} from '../store';

// components
import SplashScreen from 'react-native-splash-screen';

// components
import App from './App';

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

export default class Wrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rehydrated: false,
    };
  }

  componentDidMount() {
    this.defaultHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this));

    //this.getPersistStore().purge();
    this.getPersistStore();
  }

  async wrapGlobalHandler(error, isFatal) {
    if (isFatal && !__DEV__) {
      this.getPersistStore().purge();
    }

    if (this.defaultHandler) {
      this.defaultHandler(error, isFatal);
    }
  }

  getPersistStore = () =>
    persistStore(
      store,
      // {
      //   storage: AsyncStorage,
      //   blacklist: ['form', 'nav'],
      //   keyPrefix: 'atlantm',
      // },
      null,
      () => {
        store.getState();
      },
    );

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.rehydrated !== nextState.rehydrated;
  }

  render() {
    if (!this.state.rehydrated) {
      return null;
    }

    SplashScreen.hide();

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
