import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// import {enableScreens} from 'react-native-screens';
// import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {TransitionPresets} from '@react-navigation/stack';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'native-base';

// EKO
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

// Used Cars Catalog
import UsedCarListScreen from '../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarFilterScreen from '../catalog/usedcar/containers/UsedCarFilterScreen';

// TVA
import TvaScreen from '../tva/containers/TvaScreen';
import TvaResultsScreen from '../tva/containers/TvaResultsScreen';

import {BottomTabNavigation} from '../menu/containers/BottomTabNavigation';

// routes
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';

// orders
import ServiceContainer from '../service/containers/ServiceContainer';
import ServiceScreenStep2 from '../service/containers/OnlineService/ServiceScreenStep2';
import OrderScreen from '../catalog/containers/OrderScreen';
import TestDriveScreen from '../catalog/containers/TestDriveScreen';
import OrderMyPriceScreen from '../catalog/containers/OrderMyPriceScreen';
import OrderCreditScreen from '../catalog/containers/OrderCreditScreen';
import OrderPartsScreen from '../service/containers/OrderPartsScreen';
import CarCostScreen from '../catalog/carcost/containers/CarCostScreen';
import CallMeBackScreen from '../profile/containers/CallMeBackScreen';

import MapScreen from '../contacts/map/containers/MapScreen';

import IndicatorsScreen from '../indicators/containers/IndicatorsScreen';
import SettingsScreen from '../settings/containers/SettingsScreen';

import strings from '../core/lang/const';
import stylesHeader from '../core/components/Header/style';
import styleConst from '../core/style-const';
import {
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
  TransparentBack,
} from './const';

// enableScreens();

const StackEKO = createStackNavigator();
const StackEKOAddReview = createStackNavigator();
const StackCatalogUsed = createStackNavigator();
const StackTVA = createStackNavigator();

const StackBase = createStackNavigator();
const StackOrders = createStackNavigator();

export const Base = ({navigation, route}) => (
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
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ModalTransition,
        headerTitle: strings.ChooseDealerScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackBase.Screen
      name="MapScreen"
      component={MapScreen}
      options={TransparentBack(navigation, route)}
    />
    <StackBase.Screen
      name="IndicatorsScreen"
      component={IndicatorsScreen}
      options={BigCloseButton(navigation, route)}
    />
    <StackBase.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={BigCloseButton(navigation, route)}
    />
    {/* ЭКО */}
    <StackBase.Screen
      name="ReviewsScreen"
      component={EKO}
      options={{headerShown: false}}
    />
    {/* ТВА */}
    <StackBase.Screen
      name="TvaScreen"
      component={TVA}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.TvaScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    {/* Заявки */}
    <StackOrders.Screen
      name="ServiceScreen"
      component={ServiceContainer}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.ServiceScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="ServiceScreenStep2"
      component={ServiceScreenStep2}
      options={ClassicHeaderWhite(
        strings.ServiceScreen.title,
        navigation,
        route,
      )}
    />
    {/* Подержаные автомобили */}
    <StackBase.Screen
      name="UsedCarListScreen"
      component={UsedCars}
      options={{headerShown: false}}
    />
    <StackOrders.Screen
      name="OrderScreen"
      component={OrderScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.OrderScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="TestDriveScreen"
      component={TestDriveScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.TestDriveScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="OrderMyPriceScreen"
      component={OrderMyPriceScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.OrderMyPriceScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="OrderCreditScreen"
      component={OrderCreditScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.OrderCreditScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="OrderPartsScreen"
      component={OrderPartsScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.OrderPartsScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="CarCostScreen"
      component={CarCostScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.CarCostScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackOrders.Screen
      name="CallMeBackScreen"
      component={CallMeBackScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.CallMeBackScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
  </StackBase.Navigator>
);

export const EKO = ({navigation, route}) => (
  <StackEKO.Navigator initialRouteName="ReviewsScreen">
    <StackEKO.Screen
      name="ReviewsScreen"
      component={ReviewsScreen}
      options={ClassicHeaderBlue(
        strings.ReviewsScreen.title,
        navigation,
        route,
      )}
    />
    <StackEKO.Screen
      name="ReviewScreen"
      component={ReviewScreen}
      options={ClassicHeaderBlue(strings.ReviewScreen.title, navigation, route)}
    />
    <StackEKO.Screen
      name="ReviewsFilterDateScreen"
      component={ReviewsFilterDateScreen}
      options={ClassicHeaderBlue(
        strings.ReviewsFilterDateScreen.title,
        navigation,
        route,
      )}
    />
    <StackEKO.Screen
      name="ReviewsFilterRatingScreen"
      component={ReviewsFilterRatingScreen}
      options={ClassicHeaderBlue(
        strings.ReviewsFilterRatingScreen.title,
        navigation,
        route,
      )}
    />
    <StackEKOAddReview.Screen
      name="ReviewAddMessageStepScreen"
      component={ReviewAddMessageStepScreen}
      options={ClassicHeaderBlue(
        strings.ReviewAddMessageStepScreen.title,
        navigation,
        route,
      )}
    />
    <StackEKOAddReview.Screen
      name="ReviewAddRatingStepScreen"
      component={ReviewAddRatingStepScreen}
      options={ClassicHeaderBlue(
        strings.ReviewAddRatingStepScreen.title,
        navigation,
        route,
      )}
    />
  </StackEKO.Navigator>
);

export const UsedCars = ({navigation, route}) => (
  <StackCatalogUsed.Navigator initialRouteName="UsedCarListScreen">
    <StackCatalogUsed.Screen
      name="UsedCarListScreen"
      component={UsedCarListScreen}
      options={{
        headerTitle: (
          <Text style={stylesHeader.blueHeaderTitle} selectable={false}>
            {strings.UsedCarListScreen.title}
          </Text>
        ),
        headerStyle: stylesHeader.blueHeader,
        headerTitleStyle: stylesHeader.blueHeaderTitle,
        headerRight: () => (
          <View style={stylesHeader.headerRightStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UsedCarFilterScreen');
              }}>
              <Icon
                type="FontAwesome"
                name="filter"
                style={styles.UsedCarListIconFilter}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <StackCatalogUsed.Screen
      name="UsedCarItemScreen"
      component={UsedCarItemScreen}
      options={TransparentBack(navigation, route)}
    />
    <StackCatalogUsed.Screen
      name="UsedCarFilterScreen"
      component={UsedCarFilterScreen}
      options={{
        headerTitle: strings.NewCarFilterScreen.title,
        headerStyle: stylesHeader.common,
        headerTitleStyle: {fontWeight: '200', color: '#000'},
        headerRight: () => (
          <Icon
            type="AntDesign"
            style={{
              color: '#000',
              fontWeight: 'lighter',
              fontSize: 22,
              marginRight: 14,
            }}
            name="close"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    />
  </StackCatalogUsed.Navigator>
);

// export const Orders = () => (
// );

export const TVA = ({navigation, route}) => (
  <StackTVA.Navigator initialRouteName="TvaScreen">
    <StackTVA.Screen
      name="TvaScreen"
      component={TvaScreen}
      options={{headerShown: false}}
    />
    <StackTVA.Screen
      name="TvaResultsScreen"
      component={TvaResultsScreen}
      options={ClassicHeaderWhite(
        strings.TvaResultsScreen.title,
        navigation,
        route,
      )}
    />
  </StackTVA.Navigator>
);

const styles = StyleSheet.create({
  UsedCarListIconFilter: {
    color: styleConst.color.white,
    fontSize: 25,
    marginRight: 15,
  },
  MapHeaderStyle: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 5,
  },
  MapHeaderIconStyle: {
    marginLeft: 5,
  },
});
