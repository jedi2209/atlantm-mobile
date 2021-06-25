/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Icon, ActionSheet} from 'native-base';
import orderFunctions from '../../utils/orders';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';

// screens
import ContactsScreen from '../../contacts/containers/ContactsScreen';

import AuthContainer from '../../profile/containers/AuthContainer';
import ProfileSettingsScreen from '../../profile/containers/ProfileSettingsScreen';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import TOHistory from '../../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../../profile/carhistory/containers/CarHistoryDetailsScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
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
  isTabBarVisible,
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
    mode="modal"
    headerShown={false}
    headerTransparent={true}>
    <ProfileStack.Screen
      name="LoginScreen"
      component={AuthContainer}
      options={{headerShown: false, headerTransparent: true}}
    />
    <ProfileStack.Screen
      name="PhoneChangeScreen"
      component={PhoneChangeScreen}
      options={BigCloseButton(navigation, route, {
        ...TransitionPresets.ModalTransition,
        headerTitle: strings.ProfileSettingsScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
    />
    <ProfileStack.Screen
      name="ProfileSettingsScreen"
      component={ProfileSettingsScreen}
      options={ClassicHeaderWhite(
        strings.ProfileSettingsScreen.title,
        navigation,
        route,
      )}
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
      name="TOHistory"
      component={TOHistory}
      options={ClassicHeaderWhite(
        strings.CarHistoryScreen.title,
        navigation,
        route,
      )}
    />
    <ProfileStack.Screen
      name="CarHistoryDetailsScreen"
      component={CarHistoryDetailsScreen}
      options={ClassicHeaderWhite('', navigation, route)}
    />
    <ProfileStack.Screen
      name="BonusScreen"
      component={BonusScreen}
      options={ClassicHeaderWhite(
        strings.ProfileScreenInfo.bonus.title,
        navigation,
        route,
      )}
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
    <ProfileStack.Screen
      name="BonusScreenInfo"
      component={BonusScreenInfo}
      options={ClassicHeaderWhite(
        strings.BonusInfoScreen.title,
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
      // barStyle={{backgroundColor: styleConst.color.accordeonGrey1}}
      // shifting={false}
      // labeled={true}
      // activeColor={styleConst.color.lightBlue}
      // inactiveColor={styleConst.new.passive}
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: styleConst.color.lightBlue,
        inactiveTintColor: styleConst.new.passive,
      }}>
      <Tab.Screen
        name="Home"
        component={ContactsScreen}
        options={{
          headerTransparent: true,
          headerTitle: null,
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
