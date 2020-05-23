/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
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
// import RNRestart from 'react-native-restart';

// components
import DeviceInfo from 'react-native-device-info';

// routes
import {getRouter} from '../router';

const mapStateToProps = ({core, dealer, profile, modal}) => {
  return {
    //     pushActionSubscribeState: core.pushActionSubscribeState,
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

    console.log('this.props-APP.js', this.props);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    const currentDealer = get(dealerSelected, 'id', false);
    API.fetchVersion(DeviceInfo.getVersion());

    if (
      currentDealer &&
      (isStoreUpdated !== undefined && isStoreUpdated !== '2020-03-10')
    ) {
      this.setState({
        isloading: true,
      });
      // если мы ещё не очищали стор
      actionMenuOpenedCount(0);
      actionStoreUpdated('2020-03-10');
      setTimeout(() => {
        this.setState({
          isloading: false,
        });
      }, 500);
    }

    setTimeout(() => {
      OneSignal.init('2094a3e1-3c9a-479d-90ae-93adfcd15dab', {
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
      <View style={{flex: 1}}>
        <AppContainer
          ref={this.navigatorRef}
          onNavigationStateChange={this.onNavigationStateChange}
        />
        <View>
          <Modal
            hideModalContentWhileAnimating
            useNativeDriver
            isVisible={this.props.modal.application}
            onBackdropPress={() => {
              this.props.actionToggleModal('application');
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 14,
                paddingVertical: 24,
                borderRadius: 4,
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', marginBottom: 14}}>
                Отправить заявку
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props
                    .actionToggleModal('application')
                    .then(() => this.navigate('CallMeBackScreen'));
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 14,
                    paddingVertical: 10,
                  }}>
                  На обратный звонок
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props
                    .actionToggleModal('application')
                    .then(() => this.navigate('ServiceScreen'));
                }}>
                <Text style={{fontSize: 18, paddingVertical: 10}}>На СТО</Text>
              </TouchableOpacity>
            </View>
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
