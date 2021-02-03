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

import {APP_STORE_UPDATED} from '../../core/actionTypes';

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
      isloading: true,
    };

    this.mainScreen = 'BottomTabNavigation';
    this.storeVersion = '2021-02-02';

    const currentVersion = DeviceInfo.getVersion();
    if (currentVersion) {
      API.fetchVersion(currentVersion);
    }
  }

  _awaitStoreToUpdate = async () => {
    const storeData = store.getState();

    const currentDealer = get(storeData, 'dealer.selected.id', false);
    const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);

    if (currentDealer && isStoreUpdatedCurrent === this.storeVersion) {
      // уже всё обновлено, открываем экран автоцентра
      return this.mainScreen;
    }

    try {
      this.setState({
        isloading: true,
      });
      // если мы ещё не очищали стор
      this.props.actionMenuOpenedCount(0);
      const action = await this.props.actionStoreUpdated(this.storeVersion);
      if (action && action.type) {
        let result;
        if (action.type === APP_STORE_UPDATED) {
          result = 'IntroScreen';
        }
        return result;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  componentDidMount() {
    const {
      auth,
      actionSetPushGranted,
      actionSetPushActionSubscribe,
      menuOpenedCount,
      isStoreUpdated,
    } = this.props;

    this._awaitStoreToUpdate().then((res) => {
      if (typeof res === 'undefined' || !res) {
        res = 'IntroScreen';
      }
      const Router = getRouter(res);
      this.AppContainer = createAppContainer(Router);
      this.setState({
        isloading: false,
      });
    });

    const currentLanguage = get(this.props, 'currentLanguage', 'ru');
    strings.setLanguage(currentLanguage);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
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
    if (this.state.isloading || !this.AppContainer) {
      return (
        <Root style={{flex: 1}}>
          <ActivityIndicator
            style={{width: '100%', height: '100%'}}
            color={styleConst.color.blue}
            size="large"
          />
        </Root>
      );
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
