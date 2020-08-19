/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {ActivityIndicator} from 'react-native';
import {Root} from 'native-base';
import {createAppContainer, NavigationActions} from 'react-navigation';

// redux
import {connect} from 'react-redux';
import {store} from '../store';
import {navigationChange} from '../../navigation/actions';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionToggleModal,
} from '../actions';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../components/PushNotifications';

// components
import DeviceInfo from 'react-native-device-info';

// routes
import {getRouter} from '../router';

const mapStateToProps = ({core, dealer, modal}) => {
  return {
    dealerSelected: dealer.selected,
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    modal,
  };
};

const mapDispatchToProps = {
  navigationChange,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionToggleModal,
};

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.navigatorRef = React.createRef();
    this.state = {
      isloading: false,
    };
  }

  componentDidMount() {
    const {
      auth,
      dealerSelected,
      actionSetPushGranted,
      actionSetPushActionSubscribe,
      actionStoreUpdated,
      actionMenuOpenedCount,
      menuOpenedCount,
      isStoreUpdated,
    } = this.props;

    // console.log('this.props-APP.js', this.props);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    const currentDealer = get(dealerSelected, 'id', false);
    const storeVersion = '2020-06-16';

    if (
      currentDealer &&
      typeof isStoreUpdated !== 'undefined' &&
      isStoreUpdated !== false &&
      isStoreUpdated !== storeVersion
    ) {
      this.setState({
        isloading: true,
      });
      // если мы ещё не очищали стор
      actionMenuOpenedCount(0);
      actionStoreUpdated(storeVersion);
      setTimeout(() => {
        this.setState({
          isloading: false,
        });
      }, 500);
    }

    setTimeout(() => {
      OneSignal.init('XXXX', {
        kOSSettingsKeyAutoPrompt: true,
        kOSSettingsKeyInFocusDisplayOption: 2,
      });

      OneSignal.promptForPushNotificationsWithUserResponse((status) => {
        if (status) {
          actionSetPushGranted(true);

          if (
            Number(menuOpenedCount) <= 1 ||
            menuOpenedCount === '' ||
            isStoreUpdated === false
          ) {
            actionSetPushActionSubscribe(true);
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

      const currentVersion = DeviceInfo.getVersion();
      if (currentVersion) {
        API.fetchVersion(currentVersion);
      }
    }, 700);
  }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({
      prevState,
      newState,
    });
  };

  navigate(routeName) {
    if (this.navigatorRef.current !== null) {
      this.navigatorRef.current.dispatch(
        NavigationActions.navigate({routeName}),
      );
    }
  }

  render() {
    const mainScreen = 'BottomTabNavigation';
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isDealerSelected ? mainScreen : 'IntroScreen');
    const AppContainer = createAppContainer(Router);

    if (this.state.isloading) {
      return <ActivityIndicator color="#fff" />;
    }

    return (
      <Root style={{flex: 1}}>
        <AppContainer
          ref={this.navigatorRef}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </Root>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
