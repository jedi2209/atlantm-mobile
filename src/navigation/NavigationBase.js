import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Icon} from 'native-base';

// EKO
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

import NewCarListScreen from '../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import NewCarFilterScreen from '../catalog/newcar/containers/NewCarFilterScreen';

// Filters
import CarsFilterScreen from '../catalog/containers/filters/CarsFilterScreen';
import BrandModelsFilterScreen from '../catalog/containers/filters/BrandModelsFilterScreen';

// Used Cars Catalog
import UsedCarListScreen from '../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarFilterScreen from '../catalog/usedcar/containers/UsedCarFilterScreen';

import ContactsScreen from '../contacts/containers/ContactsScreen';
import InfoListScreen from '../info/containers/InfoListScreen';
import InfoPostScreen from '../info/containers/InfoPostScreen';

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

import {strings} from '../core/lang/const';
import stylesHeader from '../core/components/Header/style';
import styleConst from '../core/style-const';
import {
  ArrowBack,
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
  TransparentBack,
  isTabBarVisible,
} from './const';

const StackEKO = createStackNavigator();
const StackEKOAddReview = createStackNavigator();
const SearchStack = createStackNavigator();
const StackCatalogUsed = createStackNavigator();
const StackTVA = createStackNavigator();

const StackBase = createStackNavigator();
const StackOrders = createStackNavigator();
const StackContacts = createStackNavigator();

export const Base = ({navigation, route}) => {
  const dealerSelected = useSelector((state) => state.dealer.selected);
  let initialRouteName = 'BottomTabNavigation';

  if (!dealerSelected || !dealerSelected.id) {
    initialRouteName = 'IntroScreen';
  }
  return (
  <StackBase.Navigator initialRouteName={initialRouteName}>
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
      name="ContactsScreen"
      component={Contacts}
      options={{headerShown: false}}
    />
    <StackBase.Screen
      name="InfoList"
      component={InfoListScreen}
      options={ClassicHeaderWhite(
        strings.InfoListScreen.title,
        navigation,
        route,
      )}
    />
    <StackBase.Screen
      name="InfoPostScreen"
      component={InfoPostScreen}
      options={TransparentBack(
        navigation,
        route,
        {
          ...TransitionPresets.ModalTransition,
          headerTitle: '',
          headerTitleStyle: [
            stylesHeader.transparentHeaderTitle,
            {color: '#222B45'},
          ],
        },
        {
          icon: 'close',
          IconStyle: {
            fontSize: 24,
          },
        },
      )}
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
      options={BigCloseButton(navigation, route, {
        headerLeft: () => {
          return ArrowBack(
            navigation,
            {
              params: {
                returnScreen: 'BottomTabNavigation',
              },
            },
            {
              icon: 'md-close',
              IconStyle: {
                fontSize: 42,
                width: 40,
                color: '#222B45',
              },
            },
          );
        },
      })}
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
    {/* НОВЫЕ АВТО */}
    <StackBase.Screen
      name="CarsStock"
      component={CarsStock}
      options={{headerShown: false}}
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
};

export const Contacts = ({navigation, route}) => (
  <StackContacts.Navigator initialRouteName="ContactsScreen">
    <StackContacts.Screen name="ContactsScreen" component={ContactsScreen} />
  </StackContacts.Navigator>
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
        strings.ReviewAddMessageStepScreen.title + '\t[1 / 2]',
        navigation,
        route,
      )}
    />
    <StackEKOAddReview.Screen
      name="ReviewAddRatingStepScreen"
      component={ReviewAddRatingStepScreen}
      options={ClassicHeaderBlue(
        strings.ReviewAddRatingStepScreen.title + '\t[2 / 2]',
        navigation,
        route,
      )}
    />
  </StackEKO.Navigator>
);

export const CarsStock = ({navigation, route}) => (
  <SearchStack.Navigator initialRouteName="CarsFilterScreen">
    <SearchStack.Screen
      name="CarsFilterScreen"
      component={CarsFilterScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.CarsFilterScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <SearchStack.Screen
      name="BrandModelsFilterScreen"
      component={BrandModelsFilterScreen}
      options={ClassicHeaderWhite(
        strings.CarsFilterScreen.chooseBrandModel,
        navigation,
        route,
      )}
    />
    <SearchStack.Screen
      name="NewCarListScreen"
      component={NewCarListScreen}
      options={{
        headerTitle: (
          <Text style={stylesHeader.blueHeaderTitle} selectable={false}>
            {strings.NewCarListScreen.title}
          </Text>
        ),
        headerStyle: stylesHeader.blueHeader,
        headerTitleStyle: stylesHeader.blueHeaderTitle,
        headerLeft: () => {
          return ArrowBack(navigation, route, {theme: 'white'});
        },
        headerRight: () => (
          <View style={stylesHeader.headerRightStyle}>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('NewCarFilterScreen');
              }}>
              <Icon
                type="MaterialCommunityIcons"
                name="sort"
                style={{
                  color: styleConst.color.white,
                  fontSize: 25,
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <SearchStack.Screen
      name="NewCarItemScreen"
      component={NewCarItemScreen}
      options={TransparentBack(
        navigation,
        route,
        {
          ...TransitionPresets.ModalTransition,
          headerTitle: '',
          headerTitleStyle: [
            stylesHeader.transparentHeaderTitle,
            {color: '#222B45'},
          ],
        },
        {
          icon: 'close',
          IconStyle: {
            fontSize: 24,
          },
        },
      )}
    />
    <SearchStack.Screen
      name="NewCarFilterScreen"
      component={NewCarFilterScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.CarsFilterScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />

    <StackBase.Screen
      name="UsedCarListScreen"
      component={UsedCars}
      options={{headerShown: false}}
    />
  </SearchStack.Navigator>
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
        headerLeft: () => {
          return ArrowBack(navigation, route, {theme: 'white'});
        },
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
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.CarsFilterScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
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
