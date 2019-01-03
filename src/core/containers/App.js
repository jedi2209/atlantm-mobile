import React, { Component } from 'react';
import { StyleSheet, View, NativeModules } from 'react-native';

// redux
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
} from '../actions';

// helpers
import { get } from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../components/PushNotifications';
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
  };
};

const mapDispatchToProps = {
  navigationChange,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
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
      pushActionSubscribeState,
      actionSetPushGranted,
      actionSetPushActionSubscribe,
      menuOpenedCount
    } = this.props;

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    setTimeout(() => {

        OneSignal.init('2094a3e1-3c9a-479d-90ae-93adfcd15dab', {
            kOSSettingsKeyAutoPrompt: true,
            kOSSettingsKeyInFocusDisplayOption: 2
        });

        OneSignal.promptForPushNotificationsWithUserResponse((status) => {
            if (status) {

                actionSetPushGranted(true);

                if (Number(menuOpenedCount) <= 1 || menuOpenedCount == '' || !menuOpenedCount) { // при первичном ините всегда подписываем насильно на акции
                    actionSetPushActionSubscribe(true);
                    const currentDealer = get(dealerSelected, 'id', false);
                    if (currentDealer) {
                        PushNotifications.subscribeToTopic('actions', currentDealer);
                        PushNotifications.addTag('dealer', currentDealer);
                    }
                } else {
                    if (currentDealer) {
                        if (pushActionSubscribeState) {
                            PushNotifications.subscribeToTopic('actions', currentDealer);
                        } else {
                            PushNotifications.unsubscribeFromTopic('actions');
                        }
                        PushNotifications.addTag('dealer', currentDealer);
                    }
                }

                OneSignal.setSubscription(true);

            } else {
                actionSetPushGranted(false);
                actionSetPushActionSubscribe(false);
                PushNotifications.unsubscribeFromTopic('actions');
                OneSignal.setSubscription(false);
            }
        });

        OneSignal.setLogLevel(6, 0);
        OneSignal.enableSound(true);
        OneSignal.enableVibrate(true);

      PushNotifications.init();
    }, 1000);
  }

  shouldComponentUpdate() { return false; }

  componentWillUnmount() {
    // PushNotification.notificationListener.remove();
    // PushNotification.refreshTokenListener.remove();
  }

  // onPushPermissionGranted = () => {
  //   this.props.actionSetPushGranted(true);
  // }
  // onPushPermissionRejected = () => {
  //   const { actionSetPushActionSubscribe, actionSetPushGranted } = this.props;
  //   actionSetPushActionSubscribe(false);
  //   this.props.actionSetPushGranted(false);
  // }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({ prevState, newState });
  };

  render() {
    const isTablet = DeviceInfo.isTablet();
    const mainScreen = isTablet ? 'ContactsScreen' : 'MenuScreen';
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isDealerSelected ? mainScreen : 'IntroScreen');

    const defaultGetStateForAction = Router.router.getStateForAction;
    Router.router.getStateForAction = (action, state) => {
      // console.log('ROUTER action', action);
      // console.log('ROUTER state', state);
      return defaultGetStateForAction(action, state);
    };

    if (isTablet) {
      return (
        <View style={styles.container}>
          <Sidebar />
          <View style={styles.app}>
            <Router onNavigationStateChange={this.onNavigationStateChange}
            />
          </View>
        </View>
      );
    }

    return (
      <Router onNavigationStateChange={this.onNavigationStateChange}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
