/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Icon, useDisclose, Image, Pressable, Text, HStack} from 'native-base';
import orderFunctions from '../../utils/orders';
import Analytics from '../../utils/amplitude-analytics';
import {connect} from 'react-redux';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';

// screens
import MainScreen from '../../core/containers/MainScreen';

import AuthContainer from '../../profile/containers/AuthContainer';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import DiscountsScreen from '../../profile/discounts/containers/DiscountsScreen';
// import ReestablishScreen from '../../profile/containers/_old-ReestablishScreen';

import MenuScreen from './MenuScreen';

// helpers
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionSheetMenu from '../../core/components/ActionSheetMenu';

import {
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
} from '../../navigation/const';

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    dealerSelected: dealer.selected,
    region: dealer.region,
  };
};

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MenuStack = createStackNavigator();
const ChatStack = createStackNavigator();
const StackContacts = createStackNavigator();

const iconSize = 7;
const iconSizeFocused = 9;

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
    {/* <ProfileStack.Screen
      name="ReestablishScreen"
      component={ReestablishScreen}
      options={ClassicHeaderBlue(
        strings.ReestablishScreen.title,
        navigation,
        route,
      )}
    /> */}
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
  <StackContacts.Navigator initialRouteName="ContactsScreen">
    <StackContacts.Screen
      name="ContactsScreen"
      component={MainScreen}
      options={{
        headerShown: false,
      }}
    />
  </StackContacts.Navigator>
);

const CleanStackView = () => {
  return <></>;
};

const BottomTabNavigation = ({navigation, route, region}) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = useState({});
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
            position: 'absolute',
            bottom: 25,
            left: 7,
            right: 7,
            borderRadius: 15,
            height: 60,
            paddingBottom: 0,
            paddingHorizontal: 5,
            ...styleConst.shadow.light,
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
            headerShown: true,
            headerTitle: () => <LogoTitle containerStyle={{marginTop: 0}} />,
            headerStyle: {
              height: 70,
              backgroundColor: '#F8F8F8',
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarLabel: strings.Menu.bottom.main,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Home',
            tabBarIcon: ({focused, color}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={AntDesign}
                name="home"
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
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={Ionicons}
                name="car-sport-outline"
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
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={AntDesign}
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
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={MaterialCommunityIcons}
                name="phone-message-outline"
                color={color}
                _dark={{
                  color: {color},
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Chat"
          component={CleanStackView}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              Analytics.logEvent('click', 'bottomMenu/chat');
              navigation.navigate('ChatScreen');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.chat,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Chat',
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={AntDesign}
                name="message1"
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

export default connect(mapStateToProps, null)(BottomTabNavigation);
