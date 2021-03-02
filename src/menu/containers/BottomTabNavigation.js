/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Text} from 'react-native';
import {Icon, ActionSheet} from 'native-base';
import orderFunctions from '../../utils/orders';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// screens
import ContactsScreen from '../../contacts/containers/ContactsScreen';

import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../../catalog/newcar/containers/NewCarItemScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';

import AuthContnainer from '../../profile/containers/AuthContnainer';
import ProfileSettingsScreen from '../../profile/containers/ProfileSettingsScreen';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import TOHistory from '../../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../../profile/carhistory/containers/CarHistoryDetailsScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import ReestablishScreen from '../../profile/containers/ReestablishScreen';

import MoreScreen from './MenuScreenNew';

// helpers
import strings from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

const styles = {
  shadow: {
    fontSize: 23,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.0,
    shadowColor: '#fff',
    elevation: 1,
  },
};

const Tab = createBottomTabNavigator();
const ContactStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const MoreStack = createStackNavigator();

const ContactStackView = () => (
  <ContactStack.Navigator initialRouteName="Home">
    <ContactStack.Screen
      name="Home"
      component={ContactsScreen}
      options={{
        headerTransparent: true,
        headerTitle: null,
      }}
    />
    <ContactStack.Screen
      name="InfoList"
      component={InfoListScreen}
      options={{
        headerStyle: stylesHeader.blueHeader,
        headerTitleStyle: stylesHeader.blueHeaderTitle,
        headerLeft: () => {
          return <HeaderIconBack theme="white" />;
        },
        headerTitle: (
          <Text style={stylesHeader.blueHeaderTitle}>
            {strings.InfoListScreen.title}
          </Text>
        ),
      }}
    />
    <ContactStack.Screen name="InfoPostScreen" component={InfoPostScreen} />
  </ContactStack.Navigator>
);

const SearchStackView = () => (
  <SearchStack.Navigator initialRouteName="NewCarListScreen">
    <SearchStack.Screen name="NewCarListScreen" component={NewCarListScreen} />
    <SearchStack.Screen name="NewCarItemScreen" component={NewCarItemScreen} />
    <SearchStack.Screen
      name="NewCarFilterScreen"
      component={NewCarFilterScreen}
    />
  </SearchStack.Navigator>
);

const ProfileStackView = () => (
  <ProfileStack.Navigator
    initialRouteName="ProfileScreenInfo"
    mode="modal"
    headerShown={false}>
    <ProfileStack.Screen
      name="ProfileScreenInfo"
      component={AuthContnainer}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="PhoneChangeScreen"
      component={PhoneChangeScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="ProfileSettingsScreen"
      component={ProfileSettingsScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="ReestablishScreen"
      component={ReestablishScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="TOHistory"
      component={TOHistory}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="CarHistoryDetailsScreen"
      component={CarHistoryDetailsScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="BonusScreen"
      component={BonusScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen
      name="BonusScreenInfo"
      component={BonusScreenInfo}
      options={{headerShown: false}}
    />
  </ProfileStack.Navigator>
);

const MoreStackView = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="More"
      component={MoreScreen}
      options={{
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          height: 80,
          backgroundColor: 'transparent',
        },
      }}
    />
  </MoreStack.Navigator>
);

const OrdersSheetStackView = () => {
  return <></>;
};

const _showOrdersMenu = ({navigation}) => {
  orderFunctions.getOrders().then((data) => {
    ActionSheet.show(
      {
        options: data.BUTTONS,
        cancelButtonIndex: data.CANCEL_INDEX,
        title: data.TITLE,
        destructiveButtonIndex: data.DESTRUCTIVE_INDEX || null,
      },
      (buttonIndex) => {
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

export const BottomTabNavigation = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Contact"
      tabBarOptions={{
        activeTintColor: styleConst.lightBlue,
        inactiveTintColor: styleConst.new.passive,
      }}>
      <Tab.Screen
        name="Contact"
        component={ContactStackView}
        options={{
          tabBarLabel: strings.Menu.bottom.dealer,
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
        component={SearchStackView}
        options={{
          tabBarLabel: strings.Menu.bottom.search,
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
        component={OrdersSheetStackView}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            _showOrdersMenu(navigation);
          },
        }}
        options={{
          tabBarLabel: strings.Menu.bottom.order,
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
        name="More"
        component={MoreStackView}
        options={{
          tabBarLabel: strings.Menu.bottom.menu,
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
