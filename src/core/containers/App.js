/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {ActivityIndicator} from 'react-native';
import {Root} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import * as NavigationService from '../../navigation/NavigationService';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// redux
import {connect} from 'react-redux';
import {store} from '../store';
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

import {BottomTabNavigation} from '../../menu/containers/BottomTabNavigation';

// routes
import IntroScreen from '../../intro/containers/IntroScreen';
import ChooseDealerScreen from '../../dealer/containers/ChooseDealerScreen';

// orders
import ServiceContainer from '../../service/containers/ServiceContainer';
import ServiceScreenNewStep2 from '../../service/containers/OnlineService/ServiceScreenNewStep2';
import OrderScreen from '../../catalog/containers/OrderScreen';
import TestDriveScreen from '../../catalog/containers/TestDriveScreen';
import OrderMyPriceScreen from '../../catalog/containers/OrderMyPriceScreen';
import OrderCreditScreen from '../../catalog/containers/OrderCreditScreen';
import OrderPartsScreen from '../../service/containers/OrderPartsScreen';
import CarCostScreen from '../../catalog/carcost/containers/CarCostScreen';
import CallMeBackScreen from '../../profile/containers/CallMeBackScreen';

// tva
import TvaScreen from '../../tva/containers/TvaScreen';
import TvaResultsScreen from '../../tva/containers/TvaResultsScreen';

// eko
import ReviewsScreen from '../../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../../eko/reviews/containers/ReviewAddRatingStepScreen';

import UsedCarListScreen from '../../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarFilterScreen from '../../catalog/usedcar/containers/UsedCarFilterScreen';
import MapScreen from '../../contacts/map/containers/MapScreen';

import IndicatorsScreen from '../../indicators/containers/IndicatorsScreen';
import SettingsScreen from '../../settings/containers/SettingsScreen';

const mapStateToProps = ({core, dealer, modal}) => {
  return {
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    modal,
    currentLanguage: core.language.selected,
  };
};

const mapDispatchToProps = {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionMenuOpenedCount,
  actionStoreUpdated,
  actionToggleModal,
};

const StackBase = createStackNavigator();
const StackTVA = createStackNavigator();
const StackOrders = createStackNavigator();
const StackEKO = createStackNavigator();
const StackEKOAddReview = createStackNavigator();
const StackCatalogUsed = createStackNavigator();

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

    NavigationService.setTopLevelNavigator(NavigationService.navigationRef);

    this._awaitStoreToUpdate().then((res) => {
      if (typeof res === 'undefined' || !res) {
        res = 'IntroScreen';
      }
      this.setState({
        isloading: false,
      });
    });

    const currentLanguage = get(this.props, 'currentLanguage', 'ru');
    strings.setLanguage(currentLanguage);

    if (get(auth, 'login') === 'zteam') {
      window.atlantmDebug = true;
    }

    OneSignal.init('XXXX', {
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

  render() {
    if (this.state.isloading || !NavigationContainer) {
      return (
        <SafeAreaProvider>
          <ActivityIndicator
            style={{width: '100%', height: '100%'}}
            color={styleConst.color.blue}
            size="large"
          />
        </SafeAreaProvider>
      );
    }
    return (
      <SafeAreaProvider>
        <Root>
          <NavigationContainer ref={NavigationService.navigationRef}>
            <StackBase.Navigator initialRouteName="BottomTabNavigation">
              <StackBase.Screen
                name="BottomTabNavigation"
                component={BottomTabNavigation}
                options={{headerShown: false}}
              />
              <StackBase.Screen
                name="IntroScreen"
                component={IntroScreen}
                options={{headerShown: false}}
              />
              <StackBase.Screen
                name="ChooseDealerScreen"
                component={ChooseDealerScreen}
                options={{headerShown: false}}
              />
              <StackBase.Screen
                name="MapScreen"
                component={MapScreen}
                options={{headerShown: false}}
              />
              <StackBase.Screen
                name="IndicatorsScreen"
                component={IndicatorsScreen}
                options={{headerShown: false}}
              />
              <StackBase.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{headerShown: false}}
              />
              {/* ЭКО */}
              <StackEKO.Screen
                name="ReviewsScreen"
                component={ReviewsScreen}
                options={{headerShown: false}}
              />
              <StackEKO.Screen
                name="ReviewScreen"
                component={ReviewScreen}
                options={{headerShown: false}}
              />
              <StackEKO.Screen
                name="ReviewsFilterDateScreen"
                component={ReviewsFilterDateScreen}
                options={{headerShown: false}}
              />
              <StackEKO.Screen
                name="ReviewsFilterRatingScreen"
                component={ReviewsFilterRatingScreen}
                options={{headerShown: false}}
              />
              <StackEKOAddReview.Screen
                name="ReviewAddMessageStepScreen"
                component={ReviewAddMessageStepScreen}
                options={{headerShown: false}}
              />
              <StackEKOAddReview.Screen
                name="ReviewAddRatingStepScreen"
                component={ReviewAddRatingStepScreen}
                options={{headerShown: false}}
              />
              {/* ТВА */}
              <StackTVA.Screen
                name="TvaScreen"
                component={TvaScreen}
                options={{headerShown: false}}
              />
              <StackTVA.Screen
                name="TvaResultsScreen"
                component={TvaResultsScreen}
                options={{headerShown: false}}
              />
              {/* Заявки */}
              <StackOrders.Screen
                name="ServiceScreen"
                component={ServiceContainer}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="ServiceScreenNewStep2"
                component={ServiceScreenNewStep2}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="OrderScreen"
                component={OrderScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="TestDriveScreen"
                component={TestDriveScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="OrderMyPriceScreen"
                component={OrderMyPriceScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="OrderCreditScreen"
                component={OrderCreditScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="OrderPartsScreen"
                component={OrderPartsScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="CarCostScreen"
                component={CarCostScreen}
                options={{headerShown: false}}
              />
              <StackOrders.Screen
                name="CallMeBackScreen"
                component={CallMeBackScreen}
                options={{headerShown: false}}
              />
              {/* Подержаные автомобили */}
              <StackCatalogUsed.Screen
                name="UsedCarListScreen"
                component={UsedCarListScreen}
                options={{headerShown: false}}
              />
              <StackCatalogUsed.Screen
                name="UsedCarItemScreen"
                component={UsedCarItemScreen}
                options={{headerShown: false}}
              />
              <StackCatalogUsed.Screen
                name="UsedCarFilterScreen"
                component={UsedCarFilterScreen}
                options={{headerShown: false}}
              />
            </StackBase.Navigator>
          </NavigationContainer>
        </Root>
      </SafeAreaProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
