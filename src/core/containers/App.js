import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import _ from 'lodash';
import { store } from '../store';
import getRouter from '../router';

export default class App extends Component {
  state = { rehydrated: false }

  componentWillMount() {
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

    const isDealerSelected = _.get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isDealerSelected ? 'InfoScreen' : 'IntroScreen');

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
