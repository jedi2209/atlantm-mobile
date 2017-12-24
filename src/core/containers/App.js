import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

// redux
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import { actionSetFCMToken, actionSetPushGranted } from '../actions';

// helpers
import { get } from 'lodash';

// components
import Sidebar from '../../menu/containers/Sidebar';
import DeviceInfo from 'react-native-device-info';
import FCM, { FCMEvent, NotificationType, RemoteNotificationResult } from 'react-native-fcm';

// routes
import getRouter from '../router';

const mapStateToProps = ({ core }) => {
  return {
    fcmToken: core.fcmToken,
  };
};

const mapDispatchToProps = {
  navigationChange,
  actionSetFCMToken,
  actionSetPushGranted,
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
    FCM.requestPermissions()
      .then(this.onPushPermissionGranted)
      .catch(this.onPushPermissionRejected);
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshUnsubscribe();
  }

  onPushPermissionRejected = () => {
    this.props.actionSetPushGranted(false);
    console.log('notification permission rejected');
  }

  onPushPermissionGranted = () => {
    const { actionSetFCMToken, actionSetPushGranted } = this.props;

    actionSetPushGranted(true);

    FCM.getFCMToken().then(token => {
      // console.log('getFCMToken', token);
      actionSetFCMToken(token || null);
    });

    FCM.subscribeToTopic('/topics/foo-bar');

    this.refreshUnsubscribe = FCM.on(FCMEvent.RefreshToken, token => {
      console.log('refresh FCM token', token);
      actionSetFCMToken(token || null);
    });

    FCM.getInitialNotification().then(notif => {
      console.log('getInitialNotification', notif);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (Platform.OS === 'android' && !notif.local_notification) {
        this.sendLocalNotification(notif);
      }

      if (Platform.OS ==='ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
        }
      }
    });
  }

  sendLocalNotification = notif => {
    FCM.presentLocalNotification({
      title: 'My Notification Title',  // as FCM payload
      body: 'My Notification Message', // as FCM payload (required)
      sound: 'default',                // as FCM payload
      priority: 'high',                // as FCM payload
      click_action: 'ACTION',          // as FCM payload
      badge: 0,                        // as FCM payload IOS only, set 0 to clear badges
      number: 1,                       // Android only
      large_icon: 'ic_launcher',       // Android only
      icon: 'ic_launcher',             // as FCM payload, you can relace this with custom icon you put in mipmap
      lights: true,                    // Android only, LED blinking (default false)
      show_in_foreground: true,        // notification when app is in foreground (local & remote)
    });
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
      console.log('ROUTER action', action);
      console.log('ROUTER state', state);

      //   // if (state && action && action.routeName === 'UsedCarCityScreen') {
      //   //   console.log('state.routes[1].routes', state.routes[1].routes);
      //   //   state.routes[1].routes = state.routes[1].routes.filter(route => {
      //   //     console.log('route', route);
      //   //     // return route.routeName !== 'UsedCarListScreen';
      //   //     return true;
      //   //   });
      //   // }

      //   if (state) {
      //     console.log('before', state);
      //     let newState = { ...state };
      //     newState = removeDuplicateRoutes(state);
      //     console.log('after', newState);
      //   }

      //   // this.props.navigationChange(action.routeName ? action.routeName : mainScreen);
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

    return <Router onNavigationStateChange={this.onNavigationStateChange}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
