/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Icon, Actionsheet, useDisclose, Box, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import orderFunctions from '../../utils/orders';
import Analytics from '../../utils/amplitude-analytics';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';

// screens
import ContactsScreen from '../../contacts/containers/ContactsScreen';

import AuthContainer from '../../profile/containers/AuthContainer';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import DiscountsScreen from '../../profile/discounts/containers/DiscountsScreen';
import ReestablishScreen from '../../profile/containers/ReestablishScreen';

import MenuScreen from './MenuScreen';

// helpers
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionSheetMenu from '../../core/components/ActionSheetMenu';

import {
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
  TransparentBack,
  ArrowBack,
} from '../../navigation/const';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MenuStack = createStackNavigator();
const StackContacts = createStackNavigator();

const ProfileStackView = ({navigation, route}) => (
  <ProfileStack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{
      headerShown: false,
      presentation: 'modal',
    }}>
    <ProfileStack.Screen
      name="LoginScreen"
      component={AuthContainer}
      options={{
        headerShown: false,
        presentation: 'card',
      }}
    />
    <ProfileStack.Screen
      name="PhoneChangeScreen"
      component={PhoneChangeScreen}
      options={BigCloseButton(navigation, route, {
        tabBarHideOnKeyboard: true,
        headerTitle: strings.ProfileSettingsScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <ProfileStack.Screen
      name="ReestablishScreen"
      component={ReestablishScreen}
      options={ClassicHeaderBlue(
        strings.ReestablishScreen.title,
        navigation,
        route,
      )}
    />
    <ProfileStack.Screen
      name="BonusScreen"
      component={BonusScreen}
      options={BigCloseButton(navigation, route, {
        presentation: null,
        headerTitle: strings.ProfileScreenInfo.bonus.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <ProfileStack.Screen
      name="DiscountsScreen"
      component={DiscountsScreen}
      options={ClassicHeaderWhite(
        strings.DiscountsScreen.title,
        navigation,
        route,
      )}
    />
  </ProfileStack.Navigator>
);

const MenuStackView = ({navigation, route}) => (
  <MenuStack.Navigator>
    <MenuStack.Screen
      name="MenuScreen"
      component={MenuScreen}
      options={{
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          height: 120,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
  </MenuStack.Navigator>
);

const ContactsStackView = ({navigation, route}) => (
  <StackContacts.Navigator
    initialRouteName="ContactsScreen"
    options={{
      headerShown: false,
    }}>
    <StackContacts.Screen
      name="ContactsScreen"
      component={ContactsScreen}
      options={{
        headerShown: false,
      }}
    />
  </StackContacts.Navigator>
);

const CleanStackView = () => {
  return <></>;
};

export const BottomTabNavigation = ({navigation, route}) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = React.useState({});
  const _showOrdersMenu = () => {
    orderFunctions.getOrders().then(data => {
      setActionSheetData({
        options: data.BUTTONS,
        cancelButtonIndex: data.CANCEL_INDEX,
        title: data.TITLE,
        destructiveButtonIndex: data.DESTRUCTIVE_INDEX || null,
      });
      onOpen();
    });
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: styleConst.color.lightBlue,
          tabBarInactiveTintColor: styleConst.new.passive,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            // position: 'absolute',
            // bottom: 20,
            // left: 10,
            // right: 10,
            marginBottom: 25,
            marginHorizontal: 15,
            elevation: 0,
            borderRadius: 15,
            height: 60,
            paddingBottom: 5,
            paddingHorizontal: 5,
            ...styleConst.shadow.default,
          },
          // tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Home"
          component={ContactsStackView}
          listeners={{
            tabPress: e => {
              Analytics.logEvent('click', 'bottomMenu/home');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.dealer,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Home',
            tabBarIcon: ({color}) => (
              <Icon
                size={5}
                as={FontAwesome}
                name="building-o"
                color={color}
                _dark={{
                  color: color,
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={CleanStackView}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              Analytics.logEvent('click', 'bottomMenu/catalogSearch');
              navigation.navigate('CarsStock');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.search,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.NewCars',
            tabBarIcon: ({color}) => (
              <Icon
                size={5}
                as={FontAwesome5}
                name="car"
                color={color}
                _dark={{
                  color: color,
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="About"
          component={ProfileStackView}
          listeners={{
            tabPress: e => {
              Analytics.logEvent('click', 'bottomMenu/profile');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.lkk,
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Profile',
            tabBarIcon: ({color}) => (
              <Icon
                size={6}
                as={FontAwesome5}
                name="user"
                color={color}
                _dark={{
                  color: color,
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Orders"
          component={CleanStackView}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              Analytics.logEvent('click', 'bottomMenu/orders');
              _showOrdersMenu();
            },
          }}
          options={{
            tabBarLabel: strings.Menu.bottom.order,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Orders',
            tabBarIcon: ({color}) => (
              <Icon
                size={6}
                as={MaterialCommunityIcons}
                name="phone-message"
                color={color}
                _dark={{
                  color: {color},
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Menu"
          component={MenuStackView}
          listeners={{
            tabPress: e => {
              Analytics.logEvent('click', 'bottomMenu/menu');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.menu,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Menu',
            tabBarIcon: ({color}) => (
              <Icon
                size={5}
                as={FontAwesome5}
                name="bars"
                color={color}
                _dark={{
                  color: color,
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <ActionSheetMenu
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        actionSheetData={actionSheetData}
      />
    </>
  );
};
