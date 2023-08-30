/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';

// redux
import {connect} from 'react-redux';
import {store} from '../store';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionSettingsLoaded,
  actionFetchMainScreenSettings,
} from '../actions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {APP_STORE_UPDATED} from '../actionTypes';
import {APP_LANG, APP_REGION} from '../const';

import {strings} from '../lang/const';
import {theme} from '../theme';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import {OneSignal} from 'react-native-onesignal';
import moment from 'moment';
import PushNotifications from '../components/PushNotifications';
import styleConst from '../style-const';

// components
import DeviceInfo from 'react-native-device-info';
import * as Nav from '../../navigation/NavigationBase';
import LogoTitle from '../components/LogoTitle';

const mapStateToProps = ({core, dealer, modal}) => {
  return {
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    modal,
    currentLanguage: core.language.selected,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionSettingsLoaded,
  actionFetchMainScreenSettings,
};

const mainScreen = 'BottomTabNavigation';
const storeVersion = '2023-08-01';

const _awaitStoreToUpdate = async props => {
  const storeData = store.getState();

  const currentRegion = get(storeData, 'dealer.region', false);
  const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);

  const currentVersion = DeviceInfo.getVersion();
  const {settings} = await API.fetchVersion(currentVersion || null);
  if (settings) {
    props.actionSettingsLoaded(settings);
  }

  if (currentRegion && isStoreUpdatedCurrent === storeVersion) {
    console.info(
      'isStoreUpdatedCurrent\tactionFetchMainScreenSettings\t\tstart',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    // если мы уже выбрали регион и стор обновлен
    await props.actionFetchMainScreenSettings(APP_REGION); // обновляем настройки главного экрана при каждом открытии прилаги
    console.info(
      'isStoreUpdatedCurrent\tactionFetchMainScreenSettings\t\tfinish',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    return mainScreen;
  }

  try {
    // если мы ещё не очищали стор
    props.actionMenuOpenedCount(0);
    console.info(
      'actionStoreUpdated\t\tstart',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    const action = await props.actionStoreUpdated(storeVersion);
    if (action && action.type) {
      console.info(
        'actionStoreUpdated\t\tfinish',
        moment().format('YYYY-MM-DD HH:mm:ss'),
      );
      console.info(
        'actionFetchMainScreenSettings\t\tstart',
        moment().format('YYYY-MM-DD HH:mm:ss'),
      );
      await props.actionFetchMainScreenSettings(APP_REGION); // обновляем настройки главного экрана при каждом открытии прилаги
      console.info(
        'actionFetchMainScreenSettings\t\tfinish',
        moment().format('YYYY-MM-DD HH:mm:ss'),
      );
    }
  } catch (error) {
    console.error('_awaitStoreToUpdate error', error);
  }
};

const App = props => {
  const [isLoading, setLoading] = useState(true);

  const {
    auth,
    actionSetPushGranted,
    actionSetPushActionSubscribe,
    dealerSelected,
    menuOpenedCount,
    isStoreUpdated,
  } = props;

  moment.locale(APP_LANG);

  const hasPermission = async () => {
    const res = await OneSignal.Notifications.hasPermission();
    if (res) {
      return res;
    }
    return false;
  };

  useEffect(() => {
    NavigationService.setTopLevelNavigator(NavigationService.navigationRef);
    console.info(
      '_awaitStoreToUpdate\t\tstart',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
    setLoading(true);
    _awaitStoreToUpdate(props)
      .then(res => {
        console.info(
          '_awaitStoreToUpdate\t\tfinish',
          moment().format('YYYY-MM-DD HH:mm:ss'),
          res,
        );
        setLoading(false);
      })
      .catch(err => {
        console.error('_awaitStoreToUpdate error', err);
        setLoading(false);
      });

    PushNotifications.init();

    if (Platform.OS === 'ios') {
      //Prompt for push on iOS
      OneSignal.Notifications.requestPermission();
      if (hasPermission()) {
        actionSetPushGranted(true);

        if (
          Number(menuOpenedCount) <= 1 ||
          menuOpenedCount === 0 ||
          isStoreUpdated === false
        ) {
          actionSetPushActionSubscribe(true);
        }

        OneSignal.User.PushSubscription.optIn();
      } else {
        actionSetPushGranted(false);
        actionSetPushActionSubscribe(false);
        PushNotifications.unsubscribeFromTopic(['actionsRegion', 'actions']);
        OneSignal.User.PushSubscription.optOut();
      }
    }

    strings.setLanguage(APP_LANG);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }
  }, []);

  if (isLoading || !NavigationContainer) {
    return (
      <View
        flex={1}
        style={styles.center}
        backgroundColor={styleConst.color.blue}>
        <LogoTitle theme={'white'} />
      </View>
    );
  } else {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <NativeBaseProvider
          theme={theme}
          config={{
            dependencies: {
              'linear-gradient': require('react-native-linear-gradient')
                .default,
            },
          }}>
          <NavigationContainer ref={NavigationService.navigationRef}>
            <Nav.Base />
          </NavigationContainer>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    );
  }
};

const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 20,
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
