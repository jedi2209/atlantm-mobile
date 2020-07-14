import React, { Component } from 'react';
import { StyleSheet, View, NativeModules } from 'react-native';

// redux
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated
} from '../actions';

// helpers
import API from '../../utils/api';
import { get } from 'lodash';
import OneSignal from 'react-native-onesignal';
// import RateThisApp from '../components/RateThisApp';

// components
import Sidebar from '../../menu/containers/Sidebar';
import DeviceInfo from 'react-native-device-info';

// routes
import getRouter from '../router';

if (__DEV__) {
    NativeModules.DevSettings.setIsDebuggingRemotely(true)
}

const mapStateToProps = ({ core, dealer, profile }) => {
  return {
//     pushActionSubscribeState: core.pushActionSubscribeState,
    dealerSelected: dealer.selected,
    auth: profile.auth,
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
  };
};

const mapDispatchToProps = {
  navigationChange,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  app: {
    flex: 2,
    overflow: 'hidden',
  },
});

class App extends Component {
  componentDidMount() {
    const {
      auth,
      dealerSelected,
      actionStoreUpdated,
      actionMenuOpenedCount,
      menuOpenedCount,
      isStoreUpdated
    } = this.props;

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    const currentDealer = get(dealerSelected, 'id', false);
  
    if (currentDealer && (isStoreUpdated !== undefined && isStoreUpdated !== '2019-02-01')) { // если мы ещё не очищали стор
        actionMenuOpenedCount(0);
        actionStoreUpdated('2019-02-01');
        console.log('APP INIT INSIDE ====== currentDealer', currentDealer);
        console.log('APP INIT INSIDE ====== isStoreUpdated', isStoreUpdated);
    }

    setTimeout(() => {

        OneSignal.init('2094a3e1-3c9a-479d-90ae-93adfcd15dab', {
            kOSSettingsKeyAutoPrompt: true,
            kOSSettingsKeyInFocusDisplayOption: 2
        });

        console.log('APP INIT AFTER ====== menuOpenedCount', menuOpenedCount);
        console.log('APP INIT AFTER ====== isStoreUpdated', isStoreUpdated);

        OneSignal.setLogLevel(6, 0);
        OneSignal.enableSound(true);
        OneSignal.enableVibrate(true);
    }, 500);
  }

  // shouldComponentUpdate() { return false; }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({ prevState, newState });
  };

  render() {
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    let Router = getRouter(isDealerSelected ? 'MenuScreen' : 'IntroScreen');
    if (this.props.version === false) {
      Router = getRouter('AppIsDeprecated');
    }
    const defaultGetStateForAction = Router.router.getStateForAction;
    Router.router.getStateForAction = (action, state) => {
      return defaultGetStateForAction(action, state);
    };

    return (
      <Router onNavigationStateChange={this.onNavigationStateChange}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
