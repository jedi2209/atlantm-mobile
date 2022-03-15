/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, Platform, Alert} from 'react-native';
import {Root, StyleProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import getTheme from '../../../native-base-theme/components';

import {firebase} from '@react-native-firebase/app-check';

// redux
import {connect} from 'react-redux';
import {store} from '../store';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionSettingsLoaded,
} from '../actions';
import {fetchDealers} from '../../dealer/actions';

import {APP_STORE_UPDATED} from '../../core/actionTypes';

import {strings} from '../lang/const';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../components/PushNotifications';
// import notifee, { EventType } from '@notifee/react-native';
import styleConst from '../../core/style-const';

// components
import DeviceInfo from 'react-native-device-info';
import * as Nav from '../../navigation/NavigationBase';

const mapStateToProps = ({core, dealer, modal}) => {
  return {
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    modal,
    currentLanguage: core.language.selected,
    dealer,
  };
};

const mapDispatchToProps = {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionSettingsLoaded,
  fetchDealers,
};

const App = props => {
  const [isLoading, setLoading] = useState(true);

  const {
    auth,
    actionSetPushGranted,
    actionSetPushActionSubscribe,
    dealer,
    menuOpenedCount,
    isStoreUpdated,
    fetchDealers,
  } = props;

  const mainScreen = 'BottomTabNavigation';
  const storeVersion = '2021-09-03';

  const currentLanguage = get(props, 'currentLanguage', 'ru');

  const _awaitStoreToUpdate = async () => {
    const storeData = store.getState();

    const currentDealer = get(storeData, 'dealer.selected.id', false);
    const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);

    const currentVersion = DeviceInfo.getVersion();
    API.fetchVersion(currentVersion || null).then(res => {
      if (res && res.settings) {
        props.actionSettingsLoaded(res.settings);
      }
    });

    if (currentDealer && isStoreUpdatedCurrent === storeVersion) {
      // уже всё обновлено, открываем экран автоцентра
      return mainScreen;
    }

    try {
      setLoading(true);
      // если мы ещё не очищали стор
      props.actionMenuOpenedCount(0);
      const action = await props.actionStoreUpdated(storeVersion);
      if (action && action.type) {
        let result;
        if (action.type === APP_STORE_UPDATED) {
          result = 'IntroScreen';
        }
        return result;
      }
    } catch (error) {
      console.error('_awaitStoreToUpdate error', error);
    }
  };

  useEffect(() => {
    NavigationService.setTopLevelNavigator(NavigationService.navigationRef);
    fetchDealers();

    _awaitStoreToUpdate().then(res => {
      if (typeof res === 'undefined' || !res) {
        res = 'IntroScreen';
      }
      setLoading(false);
    });

    strings.setLanguage(currentLanguage);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    PushNotifications.init();

    if (Platform.OS === 'ios') {
      //Prompt for push on iOS
      OneSignal.promptForPushNotificationsWithUserResponse(status => {
        if (status) {
          actionSetPushGranted(true);

          if (
            Number(menuOpenedCount) <= 1 ||
            menuOpenedCount === 0 ||
            isStoreUpdated === false
          ) {
            actionSetPushActionSubscribe(true);
          }

          OneSignal.disablePush(false);
        } else {
          actionSetPushGranted(false);
          actionSetPushActionSubscribe(false);
          PushNotifications.unsubscribeFromTopic('actions');
          OneSignal.disablePush(true);
        }
      });
    } else {
      firebase.appCheck().activate('ignored', false);
    }

    // notifee.setNotificationCategories([
    //   {
    //     id: 'onlineChat',
    //     actions: [
    //       {
    //         id: 'read',
    //         title: 'Прочитать',
    //       },
    //     ],
    //   },
    // ]);

    // return notifee.onForegroundEvent(({ type, detail }) => {
    //   switch (type) {
    //     case EventType.DISMISSED:
    //       console.warn('User dismissed notification', detail);
    //       break;
    //     case EventType.PRESS:
    //       const typePress = detail.notification?.ios?.categoryId;
    //       console.warn('User pressed notification', detail, typePress);
    //       switch (typePress) {
    //         case 'ChatMessage':
    //           NavigationService.navigate('ChatScreen', { update: true });
    //           break;
    //       }
    //       break;
    //   }
    // });
  }, []);

  if (isLoading || !NavigationContainer) {
    return (
      <SafeAreaProvider>
        <ActivityIndicator
          style={styles.activityIndicator}
          color={styleConst.color.blue}
          size="large"
        />
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <StyleProvider style={getTheme()}>
          <Root>
            <NavigationContainer ref={NavigationService.navigationRef}>
              <Nav.Base />
            </NavigationContainer>
          </Root>
        </StyleProvider>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  activityIndicator: {
    width: '100%',
    height: '100%',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
