/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Platform,
  NativeModules,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';
// import {SafeAreaProvider} from 'react-native-safe-area-context';

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
import {fetchDealers, fetchBrands} from '../../dealer/actions';

import {APP_STORE_UPDATED} from '../../core/actionTypes';

import {strings} from '../lang/const';
import {theme} from '../theme';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../components/PushNotifications';
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
  fetchBrands,
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
  } = props;

  const mainScreen = 'BottomTabNavigation';
  const storeVersion = '2022-09-20';

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
      const actionDealer = await props.fetchDealers(); // обновляем дилеров при каждом открытии прилаги
      //props.fetchBrands(); // обновляем бренды при каждом открытии прилаги
      if (actionDealer && actionDealer.type) {
        // уже всё обновлено, открываем экран автоцентра
        return mainScreen;
      }
    }

    try {
      setLoading(true);
      // если мы ещё не очищали стор
      props.actionMenuOpenedCount(0);
      const action = await props.actionStoreUpdated(storeVersion);
      if (action && action.type) {
        props.fetchBrands();
        const actionDealer = await props.fetchDealers();
        if (actionDealer && actionDealer.type) {
          let result;
          if (action.type === APP_STORE_UPDATED) {
            result = 'IntroScreen';
          }
          return result;
        }
      }
    } catch (error) {
      console.error('_awaitStoreToUpdate error', error);
    }
  };

  useEffect(() => {
    NavigationService.setTopLevelNavigator(NavigationService.navigationRef);

    _awaitStoreToUpdate().then(res => {
      if (typeof res === 'undefined' || !res) {
        res = 'IntroScreen';
      }
      setLoading(false);
    });

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

    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

    strings.setLanguage(currentLanguage);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }
  }, []);

  if (isLoading || !NavigationContainer) {
    return (
      <View backgroundColor={styleConst.color.blue}>
        <ActivityIndicator
          style={styles.activityIndicator}
          color={styleConst.color.white}
          size="large"
        />
      </View>
    );
  } else {
    return (
      <NativeBaseProvider theme={theme}>
        <NavigationContainer ref={NavigationService.navigationRef}>
          <Nav.Base />
        </NavigationContainer>
      </NativeBaseProvider>
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
