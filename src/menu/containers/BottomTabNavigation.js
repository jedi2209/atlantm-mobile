/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Icon, ActionSheet} from 'native-base';
import orderFunctions from '../../utils/orders';

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

import {
  ClassicHeaderWhite,
  ClassicHeaderBlue,
  BigCloseButton,
} from '../../navigation/const';

const styles = {
  shadow: {
    fontSize: 23,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.0,
    shadowColor: styleConst.color.white,
    elevation: 1,
  },
};

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MenuStack = createStackNavigator();

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
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="PhoneChangeScreen"
      component={PhoneChangeScreen}
      options={BigCloseButton(navigation, route, {
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

const CleanStackView = () => {
  return <></>;
};

const _showOrdersMenu = navigation => {
  orderFunctions.getOrders().then(data => {
    ActionSheet.show(
      {
        options: data.BUTTONS,
        cancelButtonIndex: data.CANCEL_INDEX,
        title: data.TITLE,
        destructiveButtonIndex: data.DESTRUCTIVE_INDEX || null,
      },
      buttonIndex => {
        switch (data.BUTTONS[buttonIndex].id) {
          case 'callMeBack':
            navigation.navigate('CallMeBackScreen');
            break;
          case 'orderService':
            navigation.navigate('ServiceScreen');
            break;
          case 'orderParts':
            navigation.navigate('OrderPartsScreen');
            break;
          case 'carCost':
            navigation.navigate('CarCostScreen');
            break;
        }
      },
    );
  });
};

export const BottomTabNavigation = ({navigation, route}) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: styleConst.color.lightBlue,
        tabBarInactiveTintColor: styleConst.new.passive,
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      }}>
      <Tab.Screen
        name="Home"
        component={ContactsScreen}
        options={{
          headerShown: false,
          tabBarLabel: strings.Menu.bottom.dealer,
          tabBarTestID: 'BottomMenu.Home',
          tabBarIcon: ({color}) => (
            <Icon
              name="building"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color,
                },
              ]}
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
            navigation.navigate('CarsStock');
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: strings.Menu.bottom.search,
          tabBarTestID: 'BottomMenu.NewCars',
          tabBarIcon: ({color}) => (
            <Icon
              name="search"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color,
                },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="About"
        component={ProfileStackView}
        options={{
          headerShown: false,
          tabBarLabel: strings.Menu.bottom.lkk,
          tabBarTestID: 'BottomMenu.Profile',
          tabBarIcon: ({color}) => (
            <Icon
              name="user"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color,
                },
              ]}
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
            _showOrdersMenu(navigation);
          },
        }}
        options={{
          tabBarLabel: strings.Menu.bottom.order,
          tabBarTestID: 'BottomMenu.Orders',
          tabBarIcon: ({color}) => (
            <Icon
              name="comments"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color,
                },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuStackView}
        options={{
          headerShown: false,
          tabBarLabel: strings.Menu.bottom.menu,
          tabBarTestID: 'BottomMenu.Menu',
          tabBarIcon: ({color}) => (
            <Icon
              name="bars"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color,
                },
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
