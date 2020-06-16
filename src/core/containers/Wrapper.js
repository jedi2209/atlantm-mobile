import React, {Component} from 'react';
import {Text} from 'react-native';

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
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

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
  ].forEach((methodName) => {
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
    console.log('Wrapper ====>', 'constructor');
  }

  componentDidMount() {
    console.log('Wrapper ====>', 'componentDidMount');
    // this.defaultHandler = ErrorUtils.getGlobalHandler();
    // ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this));

    //this.getPersistStore().purge();

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps.maxFontSizeMultiplier = 0;
    Text.defaultProps.selectable = true;
    this.getPersistStore();
  }

  async wrapGlobalHandler(error, isFatal) {
    console.log('Wrapper ====>', 'wrapGlobalHandler', error, isFatal);
    if (isFatal && !__DEV__) {
      this.getPersistStore().purge();
    }

    if (this.defaultHandler) {
      this.defaultHandler(error, isFatal);
    }
  }

  getPersistStore = () => {
    console.log('Wrapper ====>', 'getPersistStore');
    return persistStore(
      store,
      {
        storage: AsyncStorage,
        blacklist: ['form', 'nav', 'modal', 'catalog'],
        keyPrefix: 'atlantm',
      },
      () => {
        console.log('store in getPersistStore', store.getState());
        this.setState({rehydrated: true});
      },
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Wrapper ====>', 'shouldComponentUpdate');
    return this.state.rehydrated !== nextState.rehydrated;
  }

  render() {
    console.log('Wrapper ====>', 'render');
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
