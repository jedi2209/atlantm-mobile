import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker';
import {useSelector} from 'react-redux';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Icon,
  Actionsheet,
  View,
  Text,
  Pressable,
  Box,
  VStack,
  HStack,
  useDisclose,
  IconButton,
} from 'native-base';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {EVENT_REFRESH} from '../core/actionTypes';

// EKO
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilter from '../eko/reviews/containers/ReviewsFilter';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

import NewCarListScreen from '../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import FullScreenGallery from '../core/components/FullScreenGallery';

// Filters
import MainFilterScreen from '../catalog/containers/filters/MainFilterScreen';
import BrandModelFilterScreen from '../catalog/containers/filters/BrandModelFilterScreen';

import DealerInfoScreen from '../dealer/containers/DealerInfoScreen';

// Used Cars Catalog
import UsedCarListScreen from '../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';

import WorkTimeScreen from '../contacts/containers/WorkTimeScreen';
import ChatScreen from '../contacts/containers/ChatScreen';
import InfoListScreen from '../info/containers/InfoListScreen';
import InfoPostScreen from '../info/containers/InfoPostScreen';

// TVA
import TvaScreen from '../tva/containers/TvaScreen';
import TvaResultsScreen from '../tva/containers/TvaResultsScreen';

import BottomTabNavigation from '../menu/containers/BottomTabNavigation';

// routes
import IntroScreen from '../intro/containers/IntroScreen';
import IntroScreenNew from '../intro/containers/IntroScreenNew';
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
import AdditionalPurchaseScreen from '../profile/additionalPurchase/containers/AdditionalPurchaseScreen';
import TOHistory from '../profile/carhistory/containers/CarHistoryScreen';
import CarInfoScreen from '../profile/containers/CarInfoScreen';
import ServiceTOCalculatorScreen from '../service/containers/ServiceTOCalculatorScreen';
import CarHistoryDetailsScreen from '../profile/carhistory/containers/CarHistoryDetailsScreen';

import UserAgreementScreen from '../core/components/Form/UserAgreementScreen';
import WebviewScreen from '../core/containers/WebviewScreen';

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
import style from '../core/components/Footer/style';

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
  const regionSelected = useSelector(state => state.dealer.region);
  let initialRouteName = 'BottomTabNavigation';

  if (!regionSelected) {
    initialRouteName = 'IntroScreenNew';
  }
  return (
    <>
      <OrientationLocker
        orientation={PORTRAIT}
        // onChange={orientation => console.log('onChange', orientation)}
        // onDeviceChange={orientation => console.log('onDeviceChange', orientation)}
      />
      <StackBase.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{orientation: 'portrait'}}>
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
          name="IntroScreenNew"
          component={IntroScreenNew}
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
            presentation: 'modal',
          })}
        />
        <StackContacts.Screen
          name="DealerInfoScreen"
          component={DealerInfoScreen}
          options={TransparentBack(
            navigation,
            route,
            {
              // ...TransitionPresets.ModalTransition,
              headerTitle: '',
              headerTitleStyle: [
                stylesHeader.transparentHeaderTitle,
                {color: '#222B45'},
              ],
              presentation: 'card',
            },
            {
              icon: 'close',
              iconSize: 12,
              ContainerStyle: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                position: 'absolute',
                borderRadius: 15,
                marginTop: 10,
                marginLeft: 10,
                width: 50,
                height: 50,
                zIndex: 10000,
              },
            },
          )}
        />
        <StackContacts.Screen
          name="WorkTimeScreen"
          component={WorkTimeScreen}
          options={TransparentBack(
            navigation,
            route,
            {
              ...TransitionPresets.ModalTransition,
            },
            {
              icon: 'close',
              iconSize: 12,
            },
          )}
        />
        <StackBase.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({route}) => ({
            headerStyle: [
              stylesHeader.resetBorder,
              {
                backgroundColor: styleConst.color.bg,
              },
            ],
            headerBackTitleVisible: false,
            headerBackVisible: false,
            headerShadowVisible: false,
            headerShown: true,
            headerLeft: null,
            headerRight: null,
            // headerRight: () => {
            //   return ArrowBack(navigation, route, {
            //     icon: 'close',
            //     IconStyle: {
            //       fontSize: 42,
            //       width: 40,
            //       color: '#222B45',
            //     },
            //     ContainerStyle: {
            //       marginRight: 10,
            //     },
            //   });
            // },
            presentation: 'modal',
            headerTransparent: true,
            headerTitle: '',
            // headerTitle: () => {
            //   return (
            //     <View style={{flexDirection: 'row'}}>
            //       <Text
            //         style={[stylesHeader.whiteHeaderTitle, {marginRight: 10}]}
            //         selectable={false}>
            //         {strings.ChatScreen.title}
            //       </Text>
            //       <Text>{route?.params?.serviceMessage}</Text>
            //       {route?.params?.status?.color ? (
            //         <View
            //           w={2}
            //           h={2}
            //           mt={2}
            //           borderRadius={10}
            //           backgroundColor={route.params.status.color}
            //         />
            //       ) : (
            //         <ActivityIndicator
            //           color={styleConst.color.blue}
            //           size={'small'}
            //         />
            //       )}
            //     </View>
            //   );
            // },
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
            ...TransitionPresets.ModalTransition,
          })}
        />
        <StackBase.Screen
          name="InfoList"
          component={InfoListScreen}
          options={BigCloseButton(navigation, route, {
            ...TransitionPresets.ModalTransition,
            headerTitle: strings.InfoListScreen.title,
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
          })}
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
          name="WebviewScreen"
          component={WebviewScreen}
          options={{
            headerTitle: '',
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
              iconSize: 12,
            },
          )}
        />
        <StackBase.Screen
          name="IndicatorsScreen"
          component={IndicatorsScreen}
          options={BigCloseButton(navigation, route, {
            headerStyle: [
              {
                backgroundColor: styleConst.color.white,
              },
            ],
          })}
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
                  icon: 'close-outline',
                  iconSize: 12,
                  IconStyle: {
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
          name="TvaScreenBase"
          component={TVA}
          options={{headerShown: false, presentation: 'modal'}}
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
              },
            },
            {
              icon: 'close',
              iconSize: 12,
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
              },
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
          options={{
            headerTitle: '',
            presentation: 'modal',
            headerTransparent: true,
            headerLeft: null,
          }}
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
          name="AdditionalPurchaseScreen"
          component={AdditionalPurchaseScreen}
          options={BigCloseButton(navigation, route, {
            ...TransitionPresets.ScaleFromCenterAndroid,
            headerTitle: strings.AdditionalPurchaseScreen.title,
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
          })}
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
          name="CarInfoScreen"
          component={CarInfoScreen}
          options={TransparentBack(
            navigation,
            route,
            {
              ...TransitionPresets.ModalTransition,
              presentation: 'modal',
              headerTitle: strings.CarInfoScreen.title,
              headerTitleStyle: [
                stylesHeader.transparentHeaderTitle,
                {color: '#222B45'},
              ],
            },
            {
              icon: 'close',
              iconSize: 12,
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
                icon: 'close-outline',
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
    </>
  );
};

const EKO = ({navigation, route}) => {
  return (
    <StackEKO.Navigator initialRouteName="ReviewsScreenMain">
      <StackEKO.Screen
        name="ReviewsScreenMain"
        component={ReviewsScreen}
        options={BigCloseButton(
          navigation,
          {...route, params: {...route.params, dealerClear: true}},
          {
            ...TransitionPresets.ScaleFromCenterAndroid,
            headerTitle: strings.ReviewsScreen.title,
            headerRight: () => (
              <IconButton
                size={'sm'}
                variant={'ghost'}
                onPress={() => navigation.navigate('ReviewsFilter')}
                style={{marginRight: 4}}
                icon={
                  <Icon
                    size={7}
                    as={MaterialCommunityIcons}
                    name="filter"
                    color={styleConst.color.blue}
                    _dark={{
                      color: styleConst.color.white,
                    }}
                  />
                }
              />
            ),
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
          },
        )}
      />
      <StackEKO.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={ClassicHeaderBlue(
          strings.ReviewScreen.title,
          navigation,
          route,
          {
            headerLeft: () => {
              return ArrowBack(navigation, route, {
                icon: 'close-outline',
                iconSize: 12,
                IconStyle: {
                  color: styleConst.color.white,
                },
              });
            },
            presentation: 'modal',
          },
        )}
      />
      <StackEKO.Screen
        name="ReviewsFilter"
        component={ReviewsFilter}
        options={BigCloseButton(navigation, route, {
          ...TransitionPresets.ModalTransition,
          headerTitle: strings.ReviewsFilterDateScreen.title,
          headerRight: () => <></>,
          headerTitleStyle: [
            stylesHeader.transparentHeaderTitle,
            {color: '#222B45'},
          ],
          presentation: 'modal',
        })}
      />
      <StackEKOAddReview.Screen
        name="ReviewAddMessageStepScreen"
        component={ReviewAddMessageStepScreen}
        options={BigCloseButton(navigation, route, {
          ...TransitionPresets.ModalTransition,
          presentation: 'modal',
          headerTitle: strings.ReviewAddMessageStepScreen.title + '\t[1 / 2]',
          headerRight: () => <></>,
          headerTitleStyle: stylesHeader.blueHeaderTitle,
          headerStyle: [stylesHeader.common, stylesHeader.blueHeader],
          headerLeft: () => {
            return ArrowBack(navigation, route, {
              icon: 'close-outline',
              iconSize: 10,
              IconStyle: {
                color: styleConst.color.white,
              },
            });
          },
        })}
      />
      <StackEKOAddReview.Screen
        name="ReviewAddRatingStepScreen"
        component={ReviewAddRatingStepScreen}
        options={BigCloseButton(navigation, route, {
          ...TransitionPresets.ModalTransition,
          presentation: 'modal',
          headerTitle: strings.ReviewAddMessageStepScreen.title + '\t[2 / 2]',
          headerRight: () => <></>,
          headerTitleStyle: stylesHeader.blueHeaderTitle,
          headerStyle: [stylesHeader.common, stylesHeader.blueHeader],
          headerLeft: () => {
            return ArrowBack(navigation, route, {
              icon: 'close-outline',
              iconSize: 10,
              IconStyle: {
                color: styleConst.color.white,
              },
            });
          },
        })}
      />
    </StackEKO.Navigator>
  );
};

const CarsStock = ({navigation, route}) => {
  const {isOpen, onOpen, onClose} = useDisclose();

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
              return ArrowBack(navigation, route, {
                theme: 'white',
                iconSize: 7,
              });
            },
            headerRight: () => (
              <View style={stylesHeader.headerRightStyle}>
                {/* <Pressable onPress={() => handlePresentModalPress()}> */}
                <Pressable onPress={onOpen}>
                  <Icon
                    size={7}
                    as={MaterialCommunityIcons}
                    name="sort"
                    color={styleConst.color.white}
                    _dark={{
                      color: styleConst.color.white,
                    }}
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
              iconSize: 12,
            },
          )}
        />
        <StackBase.Screen
          name="UsedCarListScreenStack"
          component={UsedCars}
          options={{headerShown: false}}
        />
      </SearchStack.Navigator>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <View w="90%">
            <Box h={60} justifyContent="center">
              <Text
                fontSize="xl"
                color="gray.500"
                _dark={{
                  color: 'gray.300',
                }}>
                {strings.Sort.title}
              </Text>
            </Box>
            <Box>
              <VStack space={4}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'price',
                      sortDirection: 'asc',
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'priceAsc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={FontAwesome5}
                      size={5}
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
                    {isSorted === 'priceAsc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'price',
                      sortDirection: 'desc',
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'priceDesc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={FontAwesome5}
                      size={5}
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
                    {isSorted === 'priceDesc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('NewCarListScreen', {
                      sortBy: 'created',
                      sortDirection: 'desc',
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'createdDesc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={MaterialCommunityIcons}
                      size={5}
                      name="sort-clock-ascending"
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
                    {isSorted === 'createdDesc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
              </VStack>
            </Box>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

const UsedCars = ({navigation, route}) => {
  const {isOpen, onOpen, onClose} = useDisclose();

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
              return ArrowBack(navigation, route, {
                theme: 'white',
                iconSize: 7,
              });
            },
            headerRight: () => (
              <View style={stylesHeader.headerRightStyle}>
                <Pressable onPress={onOpen}>
                  <Icon
                    as={MaterialCommunityIcons}
                    name="sort"
                    style={styles.sortHeaderButton}
                    size={7}
                    color={styleConst.color.white}
                    _dark={{
                      color: styleConst.color.white,
                    }}
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
              iconSize: 12,
            },
          )}
        />
      </StackCatalogUsed.Navigator>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <View w="90%">
            <Box h={60} justifyContent="center">
              <Text
                fontSize="xl"
                color="gray.500"
                _dark={{
                  color: 'gray.300',
                }}>
                {strings.Sort.title}
              </Text>
            </Box>
            <Box>
              <VStack space={4}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'price',
                        sortDirection: 'asc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'priceAsc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={FontAwesome5}
                      size={5}
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
                    {isSorted === 'priceAsc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'price',
                        sortDirection: 'desc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'priceDesc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={FontAwesome5}
                      size={5}
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
                    {isSorted === 'priceDesc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'created',
                        sortDirection: 'desc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'createdDesc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={MaterialCommunityIcons}
                      size={5}
                      name="sort-clock-ascending-outline"
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
                    {isSorted === 'createdDesc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'year',
                        sortDirection: 'desc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'yearDesc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={MaterialCommunityIcons}
                      size={5}
                      name="sort-calendar-descending"
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
                    {isSorted === 'yearDesc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'year',
                        sortDirection: 'asc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'yearAsc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={MaterialCommunityIcons}
                      size={5}
                      name="sort-calendar-ascending"
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
                    {isSorted === 'yearAsc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UsedCarListScreenStack', {
                      screen: 'UsedCarListScreen',
                      params: {
                        sortBy: 'mileage',
                        sortDirection: 'asc',
                      },
                    });
                    onClose();
                  }}>
                  <HStack justifyContent="space-between">
                    <Icon
                      style={[
                        styles.sortingButtonIcon,
                        isSorted === 'mileageAsc'
                          ? styles.sortingColorSelected
                          : null,
                      ]}
                      as={FontAwesome5}
                      size={5}
                      name="sort-amount-down-alt"
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
                    {isSorted === 'mileageAsc' ? (
                      <Icon
                        as={FontAwesome5}
                        name="check"
                        size={5}
                        style={styles.sortingColorSelected}
                      />
                    ) : null}
                  </HStack>
                </Pressable>
              </VStack>
            </Box>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
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
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.TvaScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <StackTVA.Screen
      name="TvaResultsScreen"
      component={TvaResultsScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ScaleFromCenterAndroid,
        headerTitle: strings.TvaResultsScreen.title,
        headerRight: () => <></>,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
  </StackTVA.Navigator>
);

const styles = StyleSheet.create({
  UsedCarListIconFilter: {
    color: styleConst.color.white,
    fontSize: 25,
    marginRight: 15,
  },
  MapHeaderIconStyle: {
    marginLeft: 5,
  },
  sortHeaderButton: {
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
    color: styleConst.color.greyText,
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
    color: styleConst.color.greyText,
  },
  sortingColorSelected: {
    color: styleConst.color.blue,
  },
});
