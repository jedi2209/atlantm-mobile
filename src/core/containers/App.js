/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {ActivityIndicator} from 'react-native';
import {Root} from 'native-base';
import {createAppContainer, NavigationActions} from 'react-navigation';
import NavigationService from './NavigationService';

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

import strings from '../lang/const';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../components/PushNotifications';
import styleConst from '../../core/style-const';

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
    currentLanguage: core.language.selected,
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
    this.state = {
      isloading: false,
    };

    this.mainScreen = 'BottomTabNavigation';
    this.storeVersion = '2020-06-16';

    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(
      isDealerSelected ? this.mainScreen : 'IntroScreen',
    );
    this.AppContainer = createAppContainer(Router);
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

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    const currentDealer = get(dealerSelected, 'id', false);

    const currentLanguage = get(this.props, 'currentLanguage', 'ru');
    strings.setLanguage(currentLanguage);

    if (
      currentDealer &&
      typeof isStoreUpdated !== 'undefined' &&
      isStoreUpdated !== false &&
      isStoreUpdated !== this.storeVersion
    ) {
      this.setState({
        isloading: true,
      });
      // если мы ещё не очищали стор
      actionMenuOpenedCount(0);
      actionStoreUpdated(this.storeVersion);
      setTimeout(() => {
        this.setState({
          isloading: false,
        });
      }, 500);
    }

    const currentVersion = DeviceInfo.getVersion();
    if (currentVersion) {
      API.fetchVersion(currentVersion);
    }

    OneSignal.init('2094a3e1-3c9a-479d-90ae-93adfcd15dab', {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });

    OneSignal.promptForPushNotificationsWithUserResponse((status) => {
      if (status) {
        actionSetPushGranted(true);

        if (
          Number(menuOpenedCount) <= 1 ||
          menuOpenedCount === 0 ||
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
    if (this.state.isloading) {
      return <ActivityIndicator color={styleConst.color.blue} />;
    }
    return (
      <Root style={{flex: 1}}>
        <this.AppContainer
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </Root>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
