/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from 'native-base';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

// helpers
import styleConst from '../../core/style-const';
import ContactsScreen from '../../contacts/containers/ContactsScreen';
import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import ProfileScreen from '../../profile/containers/ProfileScreen';
import ProfileScreenInfo from '../../profile/containers/ProfileScreenInfo';
import InfoListScreen from '../../info/containers/InfoListScreen';
import TOHistore from '../../profile/carhistory/containers/CarHistoryScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';
import NewCarItemScreen from '../../catalog/newcar/containers/NewCarItemScreen';
import UsedCarListScreen from '../../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarFilterScreen from '../../catalog/usedcar/containers/UsedCarFilterScreen';
import UsedCarItemScreen from '../../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarCityScreen from '../../catalog/usedcar/containers/UsedCarCityScreen';
import MoreScreen from './MenuScreenNew';

const styles = {
  shadow: {
    fontSize: 23,
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    shadowColor: '#fff',
  },
};

const EnhancedMenuScreen = createBottomTabNavigator({
  Contacts: {
    screen: createStackNavigator({
      // TODO: Все роуты назвать *Screen (e.g. HomeScreen, для консистентности)
      Home: {screen: ContactsScreen},
      InfoList: {screen: InfoListScreen},
      InfoPostScreen: {screen: InfoPostScreen},
    }),
    navigationOptions: {
      tabBarLabel: 'Автоцентр',
      tabBarIcon: ({focused}) => (
        <Icon
          name="building"
          type="FontAwesome5"
          style={[
            styles.shadow,
            {
              color: focused
                ? styleConst.new.blueHeader
                : styleConst.new.passive,
            },
          ]}
        />
      ),
    },
  },
  Search: {
    screen: createStackNavigator(
      {
        NewCarListScreen: {
          screen: NewCarListScreen,
        },
        NewCarFilterScreen: {
          screen: NewCarFilterScreen,
        },
        NewCarItemScreen: {
          screen: NewCarItemScreen,
        },
        UsedCarListScreen: {
          screen: UsedCarListScreen,
        },
        UsedCarFilterScreen: {screen: UsedCarFilterScreen},
        UsedCarItemScreen: {screen: UsedCarItemScreen},
        UsedCarCityScreen: {screen: UsedCarCityScreen},
      },
      {
        mode: 'modal',
      },
    ),
    navigationOptions: ({navigation}) => {
      return {
        tabBarLabel: 'Поиск',
        tabBarIcon: ({focused}) => (
          <Icon
            name="search"
            type="FontAwesome5"
            style={[
              styles.shadow,
              {
                color: focused
                  ? styleConst.new.blueHeader
                  : styleConst.new.passive,
              },
            ]}
          />
        ),
      };
    },
  },
  Profile: {
    screen: createStackNavigator({
      ProfileScreen: {screen: ProfileScreen},
      ProfileScreenInfo: {screen: ProfileScreenInfo},
      TOHistore: {screen: TOHistore},
      BonusScreen: {screen: BonusScreen},
      BonusScreenInfo: {screen: BonusScreenInfo},
    }),
    navigationOptions: () => ({
      tabBarLabel: 'Кабинет',
      tabBarIcon: ({focused}) => (
        <Icon
          name="user"
          type="FontAwesome5"
          style={{
            fontSize: 24,
            color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
          }}
        />
      ),
    }),
  },
  // Service: {
  //   screen: Application,
  //   navigationOptions: ({navigation}) => {
  //     return {
  //       tabBarLabel: 'Заявка',
  //       tabBarIcon: ({focused}) => (
  //         <Icon
  //           name="comments"
  //           type="FontAwesome5"
  //           style={[
  //             styles.shadow,
  //             {
  //               color: focused
  //                 ? styleConst.new.blueHeader
  //                 : styleConst.new.passive,
  //             },
  //           ]}
  //         />
  //       ),
  //     };
  //   },
  // },
  More: {
    screen: createStackNavigator({MoreScreen: {screen: MoreScreen}}),
    navigationOptions: ({navigation}) => {
      return {
        tabBarLabel: 'Меню',
        tabBarIcon: ({focused}) => (
          <Icon
            name="bars"
            type="FontAwesome5"
            style={[
              styles.shadow,
              {
                color: focused
                  ? styleConst.new.blueHeader
                  : styleConst.new.passive,
              },
            ]}
          />
        ),
      };
    },
  },
});

EnhancedMenuScreen.navigationOptions = () => ({
  header: null,
});

export default EnhancedMenuScreen;
