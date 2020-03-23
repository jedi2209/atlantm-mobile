/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from 'native-base';
import {Alert} from 'react-native';
// import AwesomeAlert from 'react-native-awesome-alerts';
// TODO: подключить другие алерты

import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

// helpers
import styleConst from '../../core/style-const';
import ContactsScreen from '../../contacts/containers/ContactsScreen';
import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import AuthContnainer from '../../profile/containers/AuthContnainer';
import ProfileSettingsScreen from '../../profile/containers/ProfileSettingsScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import TOHistore from '../../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../../profile/carhistory/containers/CarHistoryDetailsScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import BonusScreenInfo from '../../profile/bonus/containers/BonusInfoScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import UsedCarListScreen from '../../catalog/usedcar/containers/UsedCarListScreen';
import MoreScreen from './MenuScreenNew';
// import ApplicationModalScreen from './Application';

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

const SearchStack = {
  screen: createStackNavigator({
    NewCarListScreen: {
      screen: NewCarListScreen,
    },
  }),
};

SearchStack.navigationOptions = ({navigation}) => {
  return {
    tabBarLabel: 'Поиск',
    tabBarIcon: ({tintColor}) => (
      <Icon
        name="search"
        type="FontAwesome5"
        style={[
          styles.shadow,
          {
            color: tintColor,
          },
        ]}
      />
    ),
  };
};

const BottomTabNavigation = createBottomTabNavigator(
  {
    Contact: {
      screen: createStackNavigator({
        Home: {screen: ContactsScreen},
        InfoList: {screen: InfoListScreen},
        InfoPostScreen: {screen: InfoPostScreen},
      }),
      navigationOptions: {
        tabBarLabel: 'Автоцентр',
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="building"
            type="FontAwesome5"
            style={[
              styles.shadow,
              {
                color: tintColor,
              },
            ]}
          />
        ),
        tabBarOnPress: ({navigation}) => {
          navigation.popToTop();
          navigation.navigate(navigation.state.routeName);
        },
      },
    },
    Search: SearchStack,
    Profile: {
      screen: createStackNavigator({
        ProfileScreenInfo: {screen: AuthContnainer},
        ProfileSettingsScreen: {screen: ProfileSettingsScreen},
        TOHistore: {screen: TOHistore},
        CarHistoryDetailsScreen: {screen: CarHistoryDetailsScreen},
        BonusScreen: {screen: BonusScreen},
        BonusScreenInfo: {screen: BonusScreenInfo},
      }),
      navigationOptions: () => ({
        tabBarLabel: 'Кабинет',
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="user"
            type="FontAwesome5"
            style={[
              styles.shadow,
              {
                color: tintColor,
              },
            ]}
          />
        ),
        tabBarOnPress: ({navigation}) => {
          navigation.popToTop();
          navigation.navigate(navigation.state.routeName);
        },
      }),
    },
    Service: {
      screen: createStackNavigator({
        ApplicationModalScreen: {screen: AuthContnainer},
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
              {cancelable: true},
            ),
          // store.dispatch(actionToggleModal('application')),
          tabBarLabel: 'Заявка',
          tabBarIcon: ({tintColor}) => (
            <Icon
              name="comments"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color: tintColor,
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
      }),
      navigationOptions: () => {
        return {
          tabBarLabel: 'Меню',
          tabBarIcon: ({tintColor}) => (
            <Icon
              name="bars"
              type="FontAwesome5"
              style={[
                styles.shadow,
                {
                  color: tintColor,
                },
              ]}
            />
          ),
          tabBarOnPress: ({navigation}) => {
            navigation.popToTop();
            navigation.navigate(navigation.state.routeName);
          },
        };
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: styleConst.lightBlue,
      inactiveTintColor: styleConst.new.passive,
    },
  },
);

BottomTabNavigation.navigationOptions = () => ({
  header: null,
});

export default BottomTabNavigation;
