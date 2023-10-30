/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Animated, StyleSheet, Platform, View, Text} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {DefaultTheme, PaperProvider, Button} from 'react-native-paper';

import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';

import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import RNRestart from 'react-native-restart';

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
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {APP_LANG} from '../const';

import {strings} from '../lang/const';
import {theme} from '../theme';

// helpers
import API from '../../utils/api';
import {get} from 'lodash';
import {OneSignal} from 'react-native-onesignal';
import moment from 'moment';
// import AppMetrica from 'react-native-appmetrica';
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
};

const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: styleConst.color.blue,
  },
};

const mainScreen = 'BottomTabNavigation';
const storeVersion = '2023-08-02';

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
  } else {
    console.error('_awaitStoreToUpdate => settings not loaded', settings);
    return false;
  }

  if (currentRegion && isStoreUpdatedCurrent === storeVersion) {
    return mainScreen;
  }

  try {
    // если мы ещё не очищали стор
    actionMenuOpenedCount(0);
    await actionStoreUpdated(storeVersion);
    return true;
  } catch (error) {
    console.error('_awaitStoreToUpdate error', error);
    return false;
  }
};

const checkAppForUpdate = async region => {
  try {
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );
    inAppUpdates.checkNeedsUpdate().then(async result => {
      if (result.shouldUpdate) {
        let updateOptions = Platform.select({
          ios: {
            title: strings.Notifications.UpdatePopup.title,
            message: strings.Notifications.UpdatePopup.text,
            buttonUpgradeText: strings.Notifications.UpdatePopup.update,
            buttonCancelText: strings.Notifications.UpdatePopup.later,
            bundleId: DeviceInfo.getBundleId(),
          },
          android: {
            updateType: IAUUpdateKind.FLEXIBLE,
          },
        });
        await inAppUpdates.startUpdate(updateOptions);
        if (Platform.OS === 'android') {
          inAppUpdates.installUpdate();
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const App = props => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const opacityValue = new Animated.Value(0);

  const {
    auth,
    actionSetPushGranted,
    actionSetPushActionSubscribe,
    dealerSelected,
    menuOpenedCount,
    isStoreUpdated,
    region,
  } = props;

  moment.locale(APP_LANG);

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
        if (!res) {
          setError(true);
        } else {
          setError(false);
          setLoading(false);
        }
        checkAppForUpdate(region);
      })
      .catch(err => {
        console.error('_awaitStoreToUpdate error', err);
        setError(true);
        // setLoading(false);
      });

    PushNotifications.init();

    if (Platform.OS === 'ios') {
      //Prompt for push on iOS
      OneSignal.Notifications.requestPermission();
      if (OneSignal.Notifications.hasPermission()) {
        actionSetPushGranted(true);

        if (
          Number(menuOpenedCount) <= 1 ||
          menuOpenedCount === 0 ||
          isStoreUpdated === false
        ) {
          actionSetPushActionSubscribe(true);
        }

        OneSignal.User.pushSubscription.optIn();
      } else {
        actionSetPushGranted(false);
        actionSetPushActionSubscribe(false);
        PushNotifications.unsubscribeFromTopic(['actionsRegion', 'actions']);
        OneSignal.User.pushSubscription.optOut();
      }
    }

    strings.setLanguage(APP_LANG);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }
  }, []);

  useEffect(() => {
    if (isError) {
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000, // Adjust the duration as per your requirement
        useNativeDriver: true, // Enable this for better performance
      }).start();
    }
  }, [isError]);

  if (isLoading || !NavigationContainer) {
    return (
      <PaperProvider theme={paperTheme}>
        <View
          flex={1}
          style={styles.center}
          backgroundColor={styleConst.color.blue}>
          <LogoTitle
            theme={'white'}
            containerStyle={{opacity: isError ? 0 : 1}}
          />
          {isError ? (
            <>
              <Animated.View style={{opacity: opacityValue}}>
                <Text style={styles.apiErrorText}>{strings.App.APIError}</Text>
                <Button
                  onPress={() => RNRestart.restart()}
                  buttonColor={styleConst.color.white}
                  textColor={styleConst.color.blue}>
                  {strings.Base.repeat}
                </Button>
              </Animated.View>
            </>
          ) : null}
        </View>
      </PaperProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NativeBaseProvider
        theme={theme}
        config={{
          dependencies: {
            'linear-gradient': require('react-native-linear-gradient').default,
          },
        }}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer ref={NavigationService.navigationRef}>
            <Nav.Base />
          </NavigationContainer>
        </PaperProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 20,
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  apiErrorText: {
    color: styleConst.color.white,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
