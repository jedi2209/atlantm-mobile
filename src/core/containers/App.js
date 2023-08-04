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
import {fetchDealers, selectDealer, fetchBrands} from '../../dealer/actions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {APP_STORE_UPDATED} from '../actionTypes';
import {APP_LANG, APP_REGION} from '../const';

import {strings} from '../lang/const';
import {theme} from '../theme';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import OneSignal from 'react-native-onesignal';
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
  fetchDealers,
  selectDealer,
  fetchBrands,
  actionFetchMainScreenSettings,
};

const mainScreen = 'BottomTabNavigation';
const storeVersion = '2023-07-29';
const isNewIntroScreen = true;

const _awaitStoreToUpdate = async props => {
  const storeData = store.getState();

  const currentDealer = get(storeData, 'dealer.selected.id', false);
  const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);

  const currentVersion = DeviceInfo.getVersion();
  const {settings} = await API.fetchVersion(currentVersion || null);
  if (settings) {
    props.actionSettingsLoaded(settings);
  }

  if (currentDealer && isStoreUpdatedCurrent === storeVersion) {
    // если мы уже выбрали регион и стор обновлен
    await props.fetchBrands(); // обновляем бренды при каждом открытии прилаги
    await props.actionFetchMainScreenSettings(APP_REGION); // обновляем настройки главного экрана при каждом открытии прилаги
    const actionDealer = await props.fetchDealers(); // обновляем дилеров при каждом открытии прилаги
    const currDealerItem = get(storeData, 'dealer.selected');
    const currentDealerUpdated = await props.selectDealer({
      dealerBaseData: currDealerItem,
      dealerSelected: undefined,
      isLocal: false,
    });
    if (currentDealerUpdated && actionDealer?.type) {
      // уже всё обновлено, открываем экран автоцентра
      return mainScreen;
    }
  }

  try {
    // если мы ещё не очищали стор
    props.actionMenuOpenedCount(0);
    const action = await props.actionStoreUpdated(storeVersion);
    if (action && action.type) {
      await props.fetchBrands();
      await props.actionFetchMainScreenSettings(APP_REGION); // обновляем настройки главного экрана при каждом открытии прилаги
      const actionDealer = await props.fetchDealers();
      if (actionDealer && actionDealer.type) {
        let result;
        if (action.type === APP_STORE_UPDATED) {
          if (isNewIntroScreen) {
            result = 'IntroScreenNew';
          } else {
            result = 'IntroScreen';
          }
        }
        return result;
      }
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

  useEffect(() => {
    NavigationService.setTopLevelNavigator(NavigationService.navigationRef);

    setLoading(true);
    _awaitStoreToUpdate(props)
      .then(res => {
        if (typeof res === 'undefined' || !res) {
          if (isNewIntroScreen) {
            res = 'IntroScreenNew';
          } else {
            res = 'IntroScreen';
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('_awaitStoreToUpdate error', err);
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
