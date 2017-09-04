import React, { PureComponent } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import _ from 'lodash';
import SplashScreen from 'react-native-splash-screen';
import { store } from '../store';
import getRouter from '../router';

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

export default class App extends PureComponent {
  state = { rehydrated: false }

  componentDidMount() {
    this.defaultHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this));

    // this.getPersistStore().purge();
    this.getPersistStore();
  }

  getPersistStore() {
    return persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['form'],
      keyPrefix: 'atlantm',
    }, () => {
      this.setState({ rehydrated: true });
    });
  }

  async wrapGlobalHandler(error, isFatal) {
    if (isFatal && !__DEV__) {
      this.getPersistStore().purge();
    }

    if (this.defaultHandler) {
      this.defaultHandler(error, isFatal);
    }
  }

  render() {
    if (!this.state.rehydrated) {
      return null;
    }

    const isShowIntro = _.get(store.getState(), 'dealer.showIntro');
    const Router = getRouter(isShowIntro ? 'ContactsScreen' : 'IntroScreen');

    SplashScreen.hide();

    return (
      <Provider store={store}>
        <Router onNavigationStateChange={null} />
      </Provider>
    );
  }
}
