/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Modal, {ModalContent} from 'react-native-modals';
import {TouchableWithoutFeedback} from 'react-native';

import {View, Text, NativeModules} from 'react-native';
import {createAppContainer, NavigationActions} from 'react-navigation';
import {enableScreens} from 'react-native-screens';

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

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

enableScreens();

const mapStateToProps = ({core, dealer, profile, modal}) => {
  return {
    //     pushActionSubscribeState: core.pushActionSubscribeState,
    dealerSelected: dealer.selected,
    auth: profile.auth,
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

class App extends Component {
  constructor(props) {
    super(props);
    this.navigatorRef = React.createRef();
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

    API.fetchVersion('5.1.4');

    if (
      currentDealer &&
      (isStoreUpdated !== undefined && isStoreUpdated !== '2019-02-01')
    ) {
      // если мы ещё не очищали стор
      actionMenuOpenedCount(0);
      actionStoreUpdated('2019-02-01');
    }

    setTimeout(() => {
      OneSignal.init('XXXX', {
        kOSSettingsKeyAutoPrompt: true,
        kOSSettingsKeyInFocusDisplayOption: 2,
      });

      OneSignal.promptForPushNotificationsWithUserResponse(status => {
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
    }, 500);
  }

  shouldComponentUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal) {
      return true;
    }
    return false;
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
    const isTablet = DeviceInfo.isTablet();
    const mainScreen = isTablet ? 'ContactsScreen' : 'BottomTabNavigation';
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');

    const Router = getRouter(isDealerSelected ? mainScreen : 'IntroScreen');
    const AppContainer = createAppContainer(Router);

    return (
      <View style={{flex: 1}}>
        <AppContainer
          ref={this.navigatorRef}
          onNavigationStateChange={this.onNavigationStateChange}
        />
        <View>
          <Modal
            visible={this.props.modal.application}
            onTouchOutside={() => {
              this.props.actionToggleModal('application');
            }}>
            <ModalContent>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', paddingVertical: 10}}>
                Отправить заявку
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props
                    .actionToggleModal('application')
                    .then(() => this.navigate('CallMeBackScreen'));
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 15,
                    paddingVertical: 10,
                  }}>
                  На обратный звонок
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  this.props
                    .actionToggleModal('application')
                    .then(() => this.navigate('ServiceScreen'));
                }}>
                <Text style={{fontSize: 18}}>На СТО</Text>
              </TouchableWithoutFeedback>
            </ModalContent>
          </Modal>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
