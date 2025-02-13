/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Animated, StyleSheet, Platform, View, Text} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {DefaultTheme, PaperProvider, Button} from 'react-native-paper';

import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';

import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import CircularProgress from 'react-native-circular-progress-indicator';
import RNRestart from 'react-native-restart';
import Analytics from '../../utils/amplitude-analytics';
import RateThisApp from '../components/RateThisApp';
import TransitionView from '../components/TransitionView';

// redux
import {connect} from 'react-redux';
import {store} from '../store';
import {
  actionSetPushActionSubscribe,
  actionStoreUpdated,
  actionSettingsLoaded,
} from '../actions';
import {fetchDealers, actionDealersUpdated} from '../../dealer/actions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {APP_LANG} from '../const';

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

const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({core, dealer}) => {
  return {
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    isAppRated: core.isAppRated,
    dealersLastUpdateDate: dealer.meta.lastUpdateDate,
    currentLanguage: core.language.selected,
    dealerSelected: dealer.selected,
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  actionSetPushActionSubscribe,
  actionStoreUpdated,
  actionSettingsLoaded,
  fetchDealers,
  actionDealersUpdated,
};

const paperTheme = {
  ...DefaultTheme,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: styleConst.color.blue,
    // primaryContainer: styleConst.color.white,
    surfaceVariant: styleConst.color.white,
  },
};

const mainScreen = 'BottomTabNavigation';
const storeVersion = '2023-08-02';
const currDate = moment().format('YYYY-MM-DD');

const _awaitDealersToUpdate = async props => {
  const {fetchDealers, actionDealersUpdated, dealersLastUpdateDate} = props;

  console.info('dealersLastUpdateDate', dealersLastUpdateDate);

  if (dealersLastUpdateDate === currDate) {
    return true;
  }
  try {
    await fetchDealers(false);
    await actionDealersUpdated(currDate);
    return true;
  } catch (error) {
    console.error('_awaitDealersToUpdate error', error);
    return false;
  }
};

const _awaitStoreToUpdate = async props => {
  const {actionSettingsLoaded, actionStoreUpdated, isStoreUpdated} =
    props;

  const storeData = store.getState();

  const currentRegion = get(
    storeData,
    'dealer.region',
    get(props, 'region', false),
  );
  const isStoreUpdatedCurrent = get(storeData, 'core.isStoreUpdated', false);
  console.info('isStoreUpdatedCurrent', isStoreUpdated);

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
    await actionStoreUpdated(storeVersion);
    return true;
  } catch (error) {
    console.error('_awaitStoreToUpdate error', error);
    return false;
  }
};

const App = props => {
  const {
    actionSetPushActionSubscribe,
    dealerSelected,
    menuOpenedCount,
    isStoreUpdated,
    region,
    isAppRated,
  } = props;

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [isUpdateDownloading, setUpdateDownload] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);

  const opacityValue = new Animated.Value(0);

  const inAppUpdates = new SpInAppUpdates(
    false, // isDebug
  );

  moment.locale(APP_LANG);

  const onStatusUpdate = statusInfo => {
    const {bytesDownloaded, totalBytesToDownload, status} = statusInfo;

    const percent = Math.ceil((bytesDownloaded / totalBytesToDownload) * 100);
    // do something
    switch (status) {
      case 1: // PENDING
      case 2: // DOWNLOADING
      case 3: // INSTALLING
        if (!isUpdateDownloading) {
          setUpdateDownload(true);
          setDownloadPercent(percent || 0);
        }
        break;
      case 0: // UNKNOWN
      case 5: // FAILED
      case 6: // CANCELED
        if (!isUpdateDownloading) {
          setUpdateDownload(false);
          setDownloadPercent(0);
        }
        break;
      case 11: // DOWNLOADED
        if (bytesDownloaded === totalBytesToDownload) {
          inAppUpdates.installUpdate();
        }
        break;
      default:
        break;
    }
  };

  const checkAppForUpdate = async region => {
    try {
      inAppUpdates.checkNeedsUpdate().then(async result => {
        if (!get(result, 'shouldUpdate', false)) {
          return;
        }
        let updateOptions = Platform.select({
          ios: {
            title: strings.Notifications.UpdatePopup.title,
            message: strings.Notifications.UpdatePopup.text,
            buttonUpgradeText: strings.Notifications.UpdatePopup.update,
            buttonCancelText: strings.Notifications.UpdatePopup.later,
            bundleId: DeviceInfo.getBundleId(),
          },
          android: {
            updateType: get(result, 'other.isFlexibleUpdateAllowed', false) ? IAUUpdateKind.FLEXIBLE : IAUUpdateKind.IMMEDIATE,
          },
        });
        if (isAndroid) {
          inAppUpdates.addStatusUpdateListener(onStatusUpdate);
          inAppUpdates.startUpdate(updateOptions);
        }
      });
    } catch (error) {
      console.error(error);
    }
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
        // if (!res) {
        //   setError(true);
        // } else {
        //   setError(false);
        //   setLoading(false);
        // }
        // checkAppForUpdate(region);
        _awaitDealersToUpdate(props).then(resDealers => {
          console.info(
            '_awaitDealersToUpdate\t\tfinish',
            moment().format('YYYY-MM-DD HH:mm:ss'),
            resDealers,
          );
          if (!resDealers) {
            setError(true);
          } else {
            if (isError) {
              setError(false);
            }
            setLoading(false);
          }
          if (!__DEV__) {
            checkAppForUpdate(region);
          }
        });
      })
      .catch(err => {
        console.error('_awaitStoreToUpdate error', err);
        setError(true);
        // setLoading(false);
      });

    PushNotifications.init();

    if (!isAndroid) {
      //Prompt for push on iOS
      OneSignal.Notifications.requestPermission().then(res => {
        if (PushNotifications.deviceState()) {
          OneSignal.User.pushSubscription.optIn();
        } else {
          PushNotifications.unsubscribeFromTopic(['actionsRegion', 'actions']);
          OneSignal.User.pushSubscription.optOut();
        }
      });
    }

    strings.setLanguage(APP_LANG);
  }, []);

  useEffect(() => {
    if (isError) {
      Analytics.logEvent('screen', 'app/startError');
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000, // Adjust the duration as per your requirement
        useNativeDriver: true, // Enable this for better performance
      }).start();
    }
  }, [isError]);

  if (isUpdateDownloading || isLoading || !NavigationContainer) {
    return (
      <PaperProvider theme={paperTheme}>
        <View
          style={styles.center}
          flex={1}
          backgroundColor={styleConst.color.blue}>
          <TransitionView
            style={styles.center}
            animation={'fadeIn'}
            duration={1200}
            index={1}>
            <LogoTitle
              theme={'white'}
              containerStyle={{opacity: isError ? 0 : 1}}
            />
            {isUpdateDownloading ? (
              <View style={{marginTop: 20}}>
                <CircularProgress
                  value={downloadPercent}
                  inActiveStrokeColor={'#2ecc71'}
                  inActiveStrokeOpacity={0.2}
                  progressValueColor={styleConst.color.white}
                  valueSuffix={'%'}
                />
              </View>
            ) : null}
            {isError ? (
              <>
                <Animated.View style={{opacity: opacityValue}}>
                  <Text style={styles.apiErrorText}>
                    {strings.App.APIError}
                  </Text>
                  <Button
                    onPress={() => RNRestart.restart()}
                    buttonColor={styleConst.color.white}
                    textColor={styleConst.color.blue}>
                    {strings.Base.repeat}
                  </Button>
                </Animated.View>
              </>
            ) : null}
          </TransitionView>
        </View>
      </PaperProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1, paddingBottom: isAndroid ? 10 : 0}}>
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
            <RateThisApp navigation={NavigationService} menuOpenedCount={menuOpenedCount} isAppRated={isAppRated}/>
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
