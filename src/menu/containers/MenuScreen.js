/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon, Text} from 'native-base';
import {View} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

// redux
import {connect} from 'react-redux';
import {
  actionMenuOpenedCount,
  actionAppRated,
  actionAppRateAskLater,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionStoreUpdated,
} from '../../core/actions';

// helpers
import styleConst from '../../core/style-const';
// import {scale, verticalScale} from '../../utils/scale';
// import {get} from 'lodash';
// import stylesHeader from '../../core/components/Header/style';
// import RateThisApp from '../../core/components/RateThisApp';
// import OneSignal from 'react-native-onesignal';
// import PushNotifications from '../../core/components/PushNotifications';
import ContactsScreen from '../../contacts/containers/ContactsScreen';
import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import ProfileScreen from '../../profile/containers/ProfileScreen';
import ServiceScreen from '../../service/containers/ServiceScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';
import NewCarItemScreen from '../../catalog/newcar/containers/NewCarItemScreen';
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

const Application = () => {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Text>Comming soon</Text>
    </View>
  );
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
    screen: ProfileScreen,
  },
  Service: {
    screen: Application,
    navigationOptions: ({navigation}) => {
      return {
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

const mapStateToProps = ({core, dealer}) => {
  return {
    dealerSelected: dealer.selected,
    menuOpenedCount: core.menuOpenedCount,
    isAppRated: core.isAppRated,
    AppRateAskLater: core.AppRateAskLater,
    isStoreUpdated: core.isStoreUpdated,
    MenuCounterLimit: 10, // счётчик открытия меню, после которого показывается предложение об оценке
  };
};

const mapDispatchToProps = {
  actionMenuOpenedCount,
  actionAppRated,
  actionAppRateAskLater,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionStoreUpdated,
};
