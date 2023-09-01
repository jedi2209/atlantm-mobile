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
    region: dealer.region,
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
  const {actionSettingsLoaded, actionMenuOpenedCount, actionStoreUpdated} =
    props;
  const storeData = store.getState();

  const currentRegion = get(
    storeData,
    'dealer.region',
    get(props, 'region', false),
  );
  const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);

  const currentVersion = DeviceInfo.getVersion();
  const {settings} = await API.fetchVersion(currentVersion || null);
  if (settings) {
    actionSettingsLoaded(settings);
  }

  if (currentRegion && isStoreUpdatedCurrent === storeVersion) {
    return mainScreen;
  }

  try {
    // если мы ещё не очищали стор
    actionMenuOpenedCount(0);
    await actionStoreUpdated(storeVersion);
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
