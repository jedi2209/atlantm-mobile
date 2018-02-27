import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

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

    PushNotification.init({
      fcmToken,
      actionSetFCMToken,
      actionSetPreviousFCMToken,
      onPushPermissionGranted: this.onPushPermissionGranted,
      onPushPermissionRejected: this.onPushPermissionRejected,
    });

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

    return (
        <Router onNavigationStateChange={this.onNavigationStateChange}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
