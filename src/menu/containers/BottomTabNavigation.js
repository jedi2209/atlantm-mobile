/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, ActionSheet} from 'native-base';
import orderFunctions from '../../utils/orders';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// screens
import ContactsScreen from '../../contacts/containers/ContactsScreen';

import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../../catalog/newcar/containers/NewCarItemScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';

import AuthContainer from '../../profile/containers/AuthContainer';
import ProfileSettingsScreen from '../../profile/containers/ProfileSettingsScreen';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import TOHistory from '../../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../../profile/carhistory/containers/CarHistoryDetailsScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
import DiscountsScreen from '../../profile/discounts/containers/DiscountsScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import ReestablishScreen from '../../profile/containers/ReestablishScreen';

import MoreScreen from './MenuScreenNew';

// helpers
import strings from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

import {
  ArrowBack,
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
    shadowColor: '#fff',
    elevation: 1,
  },
};

const Tab = createBottomTabNavigator();
const ContactStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const MoreStack = createStackNavigator();

const ContactStackView = (navigation, route) => (
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
          return <ArrowBack theme="white" />;
        },
        headerTitle: (
          <Text style={stylesHeader.blueHeaderTitle}>
            {strings.InfoListScreen.title}
          </Text>
        ),
      }}
    />
    <ContactStack.Screen
      name="InfoPostScreen"
      component={InfoPostScreen}
      options={ClassicHeaderBlue(
        strings.ChooseDealerScreen.title,
        navigation,
        route,
      )}
    />
  </ContactStack.Navigator>
);

const SearchStackView = ({navigation, route}) => (
  <SearchStack.Navigator initialRouteName="NewCarListScreen">
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
        headerRight: () => (
          <View style={stylesHeader.headerRightStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('NewCarFilterScreen');
              }}>
              <Icon
                type="FontAwesome"
                name="filter"
                style={{
                  color: '#fff',
                  fontSize: 25,
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <SearchStack.Screen name="NewCarItemScreen" component={NewCarItemScreen} />
    <SearchStack.Screen
      name="NewCarFilterScreen"
      component={NewCarFilterScreen}
      options={{
        headerTitle: strings.NewCarFilterScreen.title,
        headerStyle: stylesHeader.common,
        headerTitleStyle: {
          fontWeight: '300',
          color: '#000',
        },
        headerLeft: null,
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
            onPress={() => {
              return navigation.popToTop();
            }}
          />
        ),
      }}
    />
  </SearchStack.Navigator>
);

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
      options={BigCloseButton(
        strings.ProfileSettingsScreen.title,
        navigation,
        route,
      )}
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

const MoreStackView = ({navigation, route}) => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="MoreScreen"
      component={MoreScreen}
      options={{
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          height: 120,
          backgroundColor: 'transparent',
        },
      }}
    />
  </MoreStack.Navigator>
);

const OrdersSheetStackView = () => {
  return <></>;
};

const _showOrdersMenu = (navigation) => {
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

export const BottomTabNavigation = ({navigation, route}) => {
  return (
    <Tab.Navigator
      // barStyle={{backgroundColor: styleConst.color.accordeonGrey1}}
      // shifting={false}
      // labeled={true}
      // activeColor={styleConst.color.lightBlue}
      // inactiveColor={styleConst.new.passive}
      initialRouteName="Contact"
      tabBarOptions={{
        activeTintColor: styleConst.color.lightBlue,
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
