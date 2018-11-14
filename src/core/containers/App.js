import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

// redux
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import {
  actionSetFCMToken,
  actionSetPushGranted,
  actionSetPreviousFCMToken,
  actionSetPushActionSubscribe,
} from '../actions';

// helpers
import { get } from 'lodash';
import PushNotification from '../components/PushNotifications';
import RateThisApp from '../components/RateThisApp';

// components
import Sidebar from '../../menu/containers/Sidebar';
import DeviceInfo from 'react-native-device-info';

// routes
import getRouter from '../router';

const mapStateToProps = ({ core, dealer, profile }) => {
  return {
    fcmToken: core.fcmToken,
    pushActionSubscribe: core.pushActionSubscribe,
    dealerSelected: dealer.selected,
    auth: profile.auth,
  };
};

const mapDispatchToProps = {
  navigationChange,
  actionSetFCMToken,
  actionSetPushGranted,
  actionSetPreviousFCMToken,
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
      fcmToken,
      actionSetFCMToken,
      dealerSelected,
      pushActionSubscribe,
      actionSetPreviousFCMToken,
    } = this.props;

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    setTimeout(() => {
      PushNotification.init({
        fcmToken,
        actionSetFCMToken,
        actionSetPreviousFCMToken,
        onPushPermissionGranted: this.onPushPermissionGranted,
        onPushPermissionRejected: this.onPushPermissionRejected,
      });
    }, 1000);

    const id = dealerSelected.id;

    // автоцентр выбран
    if (id) {
      pushActionSubscribe ?
        PushNotification.subscribeToTopic({ id }) :
        PushNotification.unsubscribeFromTopic({ id });
    }
  }

  shouldComponentUpdate() { return false; }

  componentWillUnmount() {
    PushNotification.notificationListener.remove();
    PushNotification.refreshTokenListener.remove();
  }

  onPushPermissionGranted = () => {
    this.props.actionSetPushGranted(true);
  }
  onPushPermissionRejected = () => {
    const { actionSetPushActionSubscribe, actionSetPushGranted } = this.props;
    actionSetPushActionSubscribe(false);
    this.props.actionSetPushGranted(false);
  }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({ prevState, newState });
  }

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
