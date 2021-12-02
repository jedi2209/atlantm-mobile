import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Text, View, Pressable, Platform, StyleSheet} from 'react-native';
import {OrientationLocker, PORTRAIT} from "react-native-orientation-locker";
import {useSelector} from 'react-redux';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  Header,
  Container,
  Card,
  CardItem,
  Content,
  Right,
  Icon,
} from 'native-base';
import Orientation from "react-native-orientation-locker";
import {EVENT_REFRESH} from '../core/actionTypes';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

// EKO
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

import NewCarListScreen from '../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import FullScreenGallery from '../core/components/FullScreenGallery';

// Filters
import MainFilterScreen from '../catalog/containers/filters/MainFilterScreen';
import BrandModelFilterScreen from '../catalog/containers/filters/BrandModelFilterScreen';

// Used Cars Catalog
import UsedCarListScreen from '../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';

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
import ServiceInfoModal from '../service/containers/OnlineService/ServiceInfoModal';
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

import ProfileSettingsScreen from '../profile/containers/ProfileSettingsScreen';
import BonusScreenInfo from '../profile/bonus/containers/BonusInfoScreen';
import TOHistory from '../profile/carhistory/containers/CarHistoryScreen';
import ServiceTOCalculatorScreen from '../service/containers/ServiceTOCalculatorScreen';
import CarHistoryDetailsScreen from '../profile/carhistory/containers/CarHistoryDetailsScreen';

import UserAgreementScreen from '../core/components/Form/UserAgreementScreen';

import {strings} from '../core/lang/const';
import stylesHeader from '../core/components/Header/style';
import styleConst from '../core/style-const';
import {
  ArrowBack,
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
  TransparentBack,
} from './const';
import nav from './reducers';

const StackEKO = createStackNavigator();
const StackEKOAddReview = createStackNavigator();
const SearchStack = createStackNavigator();
const StackCatalogUsed = createStackNavigator();
const StackTVA = createStackNavigator();

const StackFullScreen = createNativeStackNavigator();
const StackBase = createStackNavigator();
const StackProfile = createStackNavigator();
const StackOrders = createStackNavigator();
const StackContacts = createStackNavigator();

export const Base = ({navigation, route}) => {
  const dealerSelected = useSelector(state => state.dealer.selected);
  let initialRouteName = 'BottomTabNavigation';

  if (!dealerSelected || !dealerSelected.id) {
    initialRouteName = 'IntroScreen';
  }
  return (
    <>
    <OrientationLocker
        orientation={PORTRAIT}
        // onChange={orientation => console.log('onChange', orientation)}
        // onDeviceChange={orientation => console.log('onDeviceChange', orientation)}
      />
    <StackBase.Navigator initialRouteName={initialRouteName} screenOptions={{orientation: 'portrait'}}>
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
        options={{
          headerTitle: '',
          headerTitleStyle: stylesHeader.transparentHeaderTitle,
          headerStyle: {
            height: 55,
          },
          presentation: 'modal',
          headerTransparent: true,
          headerLeft: null,
        }}
      />
      <StackBase.Screen
        name="UserAgreementScreen"
        component={UserAgreementScreen}
        options={{
          headerTitle: '',
          headerTitleStyle: stylesHeader.transparentHeaderTitle,
          headerStyle: {
            height: 55,
          },
          presentation: 'modal',
          headerTransparent: true,
          headerLeft: null,
        }}
      />
      <StackBase.Screen
        name="MapScreen"
        component={MapScreen}
        options={TransparentBack(
          navigation,
          route,
          {
            ...TransitionPresets.ModalTransition,
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
      <StackFullScreen.Screen
        name="FullScreenGallery"
        component={FullScreenGallery}
        options={TransparentBack(
            navigation,
            route,
            {
              presentation: 'fullScreenModal',
              animation: 'fade',
              statusBarHidden: true,
              headerStyle: {
                height: null,
              }
            },
            {
              icon: 'close',
              IconStyle: {
                fontSize: 42,
              },
              ContainerStyle: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: 15,
                marginTop: 10,
                marginLeft: 10,
                width: 55,
                height: 55,
                zIndex: 10000,
              },
              onPressBackCallBack: () => {
                Orientation.lockToPortrait();
              }
            },
          )}
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
        name="ServiceInfoModal"
        component={ServiceInfoModal}
        options={{
          presentation: 'modal',
          orientation: 'portrait',
          headerShown: false,
          statusBarHidden: true,
          gestureEnabled: false,
        }}
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

      {/* Профиль */}
      <StackProfile.Screen
        name="ProfileSettingsScreen"
        component={ProfileSettingsScreen}
        options={BigCloseButton(navigation, route, {
          presentation: 'modal',
          headerTitle: strings.ProfileSettingsScreen.title,
          headerTitleStyle: [
            stylesHeader.transparentHeaderTitle,
            {color: '#222B45'},
          ],
        })}
      />
      <StackProfile.Screen
        name="BonusScreenInfo"
        component={BonusScreenInfo}
        options={ClassicHeaderWhite(
          strings.BonusInfoScreen.title,
          navigation,
          route,
        )}
      />
      <StackProfile.Screen
        name="TOHistory"
        component={TOHistory}
        options={ClassicHeaderWhite(
          strings.CarHistoryScreen.title,
          navigation,
          route,
          {
            presentation: 'card',
          },
        )}
      />
      <StackProfile.Screen
        name="ServiceTOCalculatorScreen"
        component={ServiceTOCalculatorScreen}
        options={ClassicHeaderWhite(
          strings.UserCars.menu.tocalc,
          navigation,
          route,
          {
            presentation: 'card',
          },
        )}
      />
      <StackProfile.Screen
        name="CarHistoryDetailsScreen"
        component={CarHistoryDetailsScreen}
        options={({route}) => ({
          headerShown: true,
          headerTransparent: false,
          presentation: 'modal',
          orientation: 'portrait',
          headerTitle: () => {
            return (
              <Text style={stylesHeader.whiteHeaderTitle} selectable={false}>
                {route?.params?.mainTitle ? route?.params?.mainTitle : null}
              </Text>
            );
          },
          headerStyle: stylesHeader.whiteHeader,
          headerTitleStyle: stylesHeader.whiteHeaderTitle,
          headerLeft: () => {
            return ArrowBack(navigation, route, {
              icon: 'md-close',
              IconStyle: {
                fontSize: 42,
                width: 40,
                color: '#222B45',
              },
            });
          },
          headerRight: () => <></>,
        })}
      />
    </StackBase.Navigator>
  </>);
};

const Contacts = ({navigation, route}) => (
  <StackContacts.Navigator initialRouteName="ContactsScreen">
    <StackContacts.Screen name="ContactsScreen" component={ContactsScreen} />
  </StackContacts.Navigator>
);

const EKO = ({navigation, route}) => (
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

const CarsStock = ({navigation, route}) => {
  const bottomSheetModalRef = useRef(null);
  const [bottomSheeetState, setBottomState] = useState(false);

  const sorting = useSelector(state => state.catalog.newCar.filters.sorting);
  let isSorted = 'priceAsc';

  switch (sorting?.sortBy) {
    case 'date':
    case 'created':
      isSorted = 'createdDesc';
      break;
    case 'price':
      if (sorting?.sortDirection === 'desc') {
        isSorted = 'priceDesc';
      }
      break;
  }

  const snapPoints = useMemo(() => [250], []);
  // callbacks

  const handleClosePress = () => bottomSheetModalRef.current?.close();

  const handlePresentModalPress = useCallback(() => {
    if (bottomSheeetState) {
      bottomSheetModalRef.current?.close();
    } else {
      bottomSheetModalRef.current?.present();
    }
  }, [bottomSheeetState]);
  const handleSheetChanges = useCallback(index => {
    if (index > 0) {
      setBottomState(true);
    } else {
      setBottomState(false);
    }
  }, []);

  return (
    <>
      <SearchStack.Navigator initialRouteName="MainFilterScreen">
        <SearchStack.Screen
          name="MainFilterScreen"
          component={MainFilterScreen}
          options={BigCloseButton(navigation, route, {
            ...TransitionPresets.ScaleFromCenterAndroid,
            headerTitle: strings.CarsFilterScreen.title,
            headerRight: () => <></>,
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
          })}
        />
        <SearchStack.Screen
          name="BrandModelFilterScreen"
          component={BrandModelFilterScreen}
          options={BigCloseButton(navigation, route, {
            ...TransitionPresets.ScaleFromCenterAndroid,
            headerTitle: strings.CarsFilterScreen.chooseBrandModel.title,
            headerRight: () => <></>,
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
          })}
        />
        <SearchStack.Screen
          name="NewCarListScreen"
          component={NewCarListScreen}
          options={({route}) => ({
            safeAreaInsets: {
              bottom: 0,
            },
            headerTitle: () => {
              return (
                <Text style={stylesHeader.blueHeaderTitle} selectable={false}>
                  {route?.params?.total?.count
                    ? route?.params.total.count + ' авто'
                    : null}
                </Text>
              );
            },
            headerStyle: stylesHeader.blueHeader,
            headerTitleStyle: stylesHeader.blueHeaderTitle,
            orientation: 'portrait',
            headerLeft: () => {
              return ArrowBack(navigation, route, {theme: 'white'});
            },
            headerRight: () => (
              <View style={stylesHeader.headerRightStyle}>
                <Pressable onPress={() => handlePresentModalPress()}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="sort"
                    selectable={false}
                    style={styles.sortHeaderButton}
                  />
                </Pressable>
              </View>
            ),
          })}
        />
        <SearchStack.Screen
          name="NewCarItemScreen"
          component={NewCarItemScreen}
          options={TransparentBack(
            navigation,
            route,
            {
              ...TransitionPresets.ModalTransition,
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
          name="UsedCarListScreenStack"
          component={UsedCars}
          options={{headerShown: false}}
        />
      </SearchStack.Navigator>
      <BottomSheetModalProvider>
        <BottomSheetModal
          snapPoints={snapPoints}
          index={0}
          style={styleConst.shadow.light}
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}>
          <Container>
            <Header noShadow style={{backgroundColor: styleConst.color.white}}>
              <Text selectable={false} style={styles.sortingBottomSheetTitle}>
                {strings.Sort.title}
              </Text>
            </Header>
            <Content>
              <Card transparent>
                <CardItem
                  button
                  first
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'price',
                      sortDirection: 'asc',
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'priceAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-numeric-up"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'priceAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.price.asc}
                  </Text>
                  <Right>
                    {isSorted === 'priceAsc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'price',
                      sortDirection: 'desc',
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'priceDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-numeric-down-alt"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'priceDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.price.desc}
                  </Text>
                  <Right>
                    {isSorted === 'priceDesc' ? (
                      <Icon
                        selectable={false}
                        type="FontAwesome5"
                        name="check"
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  last
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'created',
                      sortDirection: 'desc',
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'createdDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-amount-down"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'createdDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.date.desc}
                  </Text>
                  <Right>
                    {isSorted === 'createdDesc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
              </Card>
            </Content>
          </Container>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

const UsedCars = ({navigation, route}) => {
  const bottomSheetModalRefUsed = useRef(null);
  const [bottomSheeetState, setBottomState] = useState(false);

  const sorting = useSelector(state => state.catalog.usedCar.filters?.sorting);
  let isSorted = 'priceAsc';

  switch (sorting?.sortBy) {
    case 'price':
      if (sorting?.sortDirection === 'desc') {
        isSorted = 'priceDesc';
      }
      break;
    case 'created':
      isSorted = 'createdDesc';
      break;
    case 'year':
      isSorted = 'yearAsc';
      if (sorting?.sortDirection === 'desc') {
        isSorted = 'yearDesc';
      }
      break;
    case 'mileage':
      isSorted = 'mileageAsc';
      break;
  }

  const snapPoints = useMemo(() => [370], []);
  // callbacks
  const handleSheetChanges = useCallback(index => {
    if (index > 0) {
      setBottomState(true);
    } else {
      setBottomState(false);
    }
  }, []);
  const handlePresentModalPress = useCallback(() => {
    if (bottomSheeetState) {
      bottomSheetModalRefUsed.current?.close();
    } else {
      bottomSheetModalRefUsed.current?.present();
    }
  }, [bottomSheeetState]);
  const handleClosePress = () => bottomSheetModalRefUsed.current.close();

  return (
    <>
      <StackCatalogUsed.Navigator initialRouteName="UsedCarListScreen">
        <StackCatalogUsed.Screen
          name="UsedCarListScreen"
          component={UsedCarListScreen}
          options={({route}) => ({
            headerTitle: () => {
              return (
                <Text style={stylesHeader.blueHeaderTitle} selectable={false}>
                  {route?.params?.total?.count
                    ? route?.params.total.count + ' авто'
                    : null}
                </Text>
              );
            },
            headerStyle: stylesHeader.blueHeader,
            headerTitleStyle: stylesHeader.blueHeaderTitle,
            headerLeft: () => {
              return ArrowBack(navigation, route, {theme: 'white'});
            },
            headerRight: () => (
              <View style={stylesHeader.headerRightStyle}>
                <Pressable onPress={() => handlePresentModalPress()}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="sort"
                    selectable={false}
                    style={styles.sortHeaderButton}
                  />
                </Pressable>
              </View>
            ),
          })}
        />
        <StackCatalogUsed.Screen
          name="UsedCarItemScreen"
          component={UsedCarItemScreen}
          options={TransparentBack(
            navigation,
            route,
            {
              ...TransitionPresets.ModalTransition,
            },
            {
              icon: 'close',
              IconStyle: {
                fontSize: 24,
              },
            },
          )}
        />
      </StackCatalogUsed.Navigator>
      <BottomSheetModalProvider>
        <BottomSheetModal
          snapPoints={snapPoints}
          index={0}
          style={styleConst.shadow.light}
          ref={bottomSheetModalRefUsed}
          onChange={handleSheetChanges}>
          <Container>
            <Header noShadow style={{backgroundColor: styleConst.color.white}}>
              <Text selectable={false} style={styles.sortingBottomSheetTitle}>
                {strings.Sort.title}
              </Text>
            </Header>
            <Content>
              <Card transparent>
                <CardItem
                  button
                  first
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'price',
                        sortDirection: 'asc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'priceAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-numeric-up"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'priceAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.price.asc}
                  </Text>
                  <Right>
                    {isSorted === 'priceAsc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'price',
                        sortDirection: 'desc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'priceDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    type="FontAwesome5"
                    selectable={false}
                    name="sort-numeric-down-alt"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'priceDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.price.desc}
                  </Text>
                  <Right>
                    {isSorted === 'priceDesc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  last
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'created',
                        sortDirection: 'desc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'createdDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-amount-down"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'createdDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.date.desc}
                  </Text>
                  <Right>
                    {isSorted === 'createdDesc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  last
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'year',
                        sortDirection: 'desc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'yearDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    selectable={false}
                    type="FontAwesome5"
                    name="sort-amount-down"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'yearDesc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.year.desc}
                  </Text>
                  <Right>
                    {isSorted === 'yearDesc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  last
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'year',
                        sortDirection: 'asc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'yearAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    type="FontAwesome5"
                    name="sort-numeric-down-alt"
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'yearAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.year.asc}
                  </Text>
                  <Right>
                    {isSorted === 'yearAsc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
                <CardItem
                  button
                  last
                  onPress={() => {
                    handleClosePress();
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'mileage',
                        sortDirection: 'asc',
                      },
                    });
                  }}>
                  <Icon
                    active
                    style={[
                      styles.sortingButtonIcon,
                      isSorted === 'mileageAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}
                    type="FontAwesome5"
                    name="sort-amount-down-alt"
                    selectable={false}
                  />
                  <Text
                    selectable={false}
                    style={[
                      styles.sortingButtonText,
                      isSorted === 'mileageAsc'
                        ? styles.sortingColorSelected
                        : null,
                    ]}>
                    {strings.Sort.mileage.asc}
                  </Text>
                  <Right>
                    {isSorted === 'mileageAsc' ? (
                      <Icon
                        type="FontAwesome5"
                        name="check"
                        selectable={false}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </Right>
                </CardItem>
              </Card>
            </Content>
          </Container>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

// export const Orders = () => (
// );

const TVA = ({navigation, route}) => (
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
  sortHeaderButton: {
    color: styleConst.color.white,
    fontSize: 25,
    marginRight: 20,
  },
  sortingBottomSheetWrapper: {
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'flex-start',
  },
  sortingBottomSheetTitle: {
    fontSize: 26,
    fontFamily: styleConst.font.light,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 15,
    // textTransform: 'lowercase',
  },
  sortingButton: {
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  sortingButtonIcon: {
    marginRight: 10,
    fontSize: 22,
    width: 40,
    marginLeft: 0,
  },
  sortingButtonText: {
    fontSize: 16,
    fontFamily: styleConst.font.light,
    flex: 1,
  },
  sortingColorSelected: {
    color: styleConst.color.blue,
  },
});
