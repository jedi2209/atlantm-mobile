/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from 'native-base';
import {Alert} from 'react-native';
// import AwesomeAlert from 'react-native-awesome-alerts';
// TODO: подключить другие алерты

import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

// TODO: https://github.com/react-navigation/react-navigation/issues/6458
// TODO: https://github.com/kmagiera/react-native-screens/issues/220
// Используем createNativeStackNavigator только для раздела Profile,
// т.к. там возникаете визуальный лаг при переходе после логина.
// Не можем использовать на всех страницах, т.к. перестают работать фильтры.
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';

// helpers
import styleConst from '../../core/style-const';
import ContactsScreen from '../../contacts/containers/ContactsScreen';
import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import ProfileScreen from '../../profile/containers/ProfileScreen';
import ProfileScreenInfo from '../../profile/containers/ProfileScreenInfo';
import ProfileSettingsScreen from '../../profile/containers/ProfileSettingsScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import TOHistore from '../../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../../profile/carhistory/containers/CarHistoryDetailsScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';
import UsedCarListScreen from '../../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarFilterScreen from '../../catalog/usedcar/containers/UsedCarFilterScreen';
import UsedCarCityScreen from '../../catalog/usedcar/containers/UsedCarCityScreen';
import MoreScreen from './MenuScreenNew';
import MapScreen from '../../contacts/map/containers/MapScreen';
import ApplicationModalScreen from './Application';

import {store} from '../../core/store';
import {actionToggleModal} from '../../core/actions';

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

const SearchStack = {
  screen: createStackNavigator({
    NewCarListScreen: {
      screen: NewCarListScreen,
    },
    MapScreen: {
      screen: MapScreen,
      screenProps: {
        tabBarVisible: false,
      },
    },
    NewCarFilterScreen: {
      screen: NewCarFilterScreen,
    },
  }),
};

SearchStack.navigationOptions = ({navigation}) => {
  return {
    tabBarLabel: 'Поиск',
    tabBarIcon: ({focused}) => (
      <Icon
        name="search"
        type="FontAwesome5"
        style={[
          styles.shadow,
          {
            color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
          },
        ]}
      />
    ),
  };
};

const BottomTabNavigation = createBottomTabNavigator({
  Contact: {
    screen: createStackNavigator({
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
  Search: SearchStack,
  Profile: {
    screen: createNativeStackNavigator({
      ProfileScreenInfo: {screen: ProfileScreenInfo},
      ProfileScreen: {screen: ProfileScreen},
      ProfileSettingsScreen: {screen: ProfileSettingsScreen},
      TOHistore: {screen: TOHistore},
      CarHistoryDetailsScreen: {screen: CarHistoryDetailsScreen},
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
  Service: {
    screen: createStackNavigator({
      ApplicationModalScreen: {screen: ApplicationModalScreen},
    }),
    navigationOptions: ({navigation}) => {
      return {
        tabBarOnPress: () =>
          Alert.alert(
            'Выберите заявку',
            'Какую заявку Вы хотите отправить?',
            [
              {
                text: 'На обратный звонок',
                onPress: () => navigation.navigate('CallMeBackScreen'),
              },
              {
                text: 'На СТО',
                onPress: () => navigation.navigate('ServiceScreen'),
              },
              {
                text: 'Отмена',
                onPress: () => console.log('OK Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          ),
        // store.dispatch(actionToggleModal('application')),
        tabBarLabel: 'Заявка',
        tabBarIcon: ({focused}) => (
          <Icon
            name="comments"
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
  More: {
    screen: createStackNavigator({
      MoreScreen: {screen: MoreScreen},
      UsedCarListScreen: {
        screen: UsedCarListScreen,
      },
      UsedCarFilterScreen: {screen: UsedCarFilterScreen},
      UsedCarCityScreen: {screen: UsedCarCityScreen},
    }),
    navigationOptions: () => {
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

BottomTabNavigation.navigationOptions = () => ({
  header: null,
});

export default BottomTabNavigation;
