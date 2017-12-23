import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

// redux
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import { setAppVersion } from '../actions';

// helpers
import { get } from 'lodash';

// components
import Sidebar from '../../menu/containers/Sidebar';
import DeviceInfo from 'react-native-device-info';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType,
} from 'react-native-fcm';

// routes
import getRouter from '../router';

const mapStateToProps = ({ core }) => {
  return {
    appVersion: core.version,
  };
};

const mapDispatchToProps = {
  setAppVersion,
  navigationChange,
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

// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
  // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
  if (notif.opened_from_tray) {
    //iOS: app is open/resumed because user clicked banner
    //Android: app is open/resumed because user clicked banner or tapped app icon
    console.log('opened_from_tray', notif);
  }
});

FCM.on(FCMEvent.RefreshToken, (token) => {
  console.log('RefreshToken', token);
});

class App extends Component {
  componentDidMount() {
    // iOS: show permission prompt for the first call. later just check permission in user settings
    // Android: check permission in user settings
    FCM.requestPermissions()
      .then(() => console.log('granted'))
      .catch(() => console.log('notification permission rejected'));

    FCM.getFCMToken().then(token => {
        console.log('getFCMToken', token);
        // store fcm token in your server
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      console.log('notificationListener', notif);
        // optional, do some component related stuff

        if (Platform.OS === 'android' && !notif.local_notification) {
          FCM.presentLocalNotification({
            title: "My Notification Title",                     // as FCM payload
            body: "My Notification Message",                    // as FCM payload (required)
            sound: "default",                                   // as FCM payload
            priority: "high",                                   // as FCM payload
            click_action: "ACTION",                             // as FCM payload
            badge: 0,                                          // as FCM payload IOS only, set 0 to clear badges
            number: 1,                                         // Android only
            ticker: "My Notification Ticker",                   // Android only
            auto_cancel: true,                                  // Android only (default true)
            large_icon: "ic_launcher",                           // Android only
            icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
            big_text: "Show when notification is expanded",     // Android only
            sub_text: "This is a subText",                                 // Android only
            vibrate: 300,                                       // Android only default: 300, no vibration if you pass 0
            group: "group",                                     // Android only
            ongoing: true,                                      // Android only
            my_custom_data:'my_custom_field_value',             // extra data you want to throw
            lights: true,                                       // Android only, LED blinking (default false)
            show_in_foreground: true                                  // notification when app is in foreground (local & remote)
          });
        }
    });

    // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
    // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
    // initial notification will be triggered all the time even when open app by icon so send some action identifier when you send notification
    FCM.getInitialNotification().then(notif => {
        console.log('getInitialNotification', notif);
    });
  }

  componentWillUnmount() {
    this.notificationListener.remove();
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
