/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Platform, Keyboard, Animated, StyleSheet} from 'react-native';
import {useDisclose, Icon, View} from 'native-base';
import RNBounceable from '@freakycoder/react-native-bounceable';
import orderFunctions from '../../utils/orders';
import Analytics from '../../utils/amplitude-analytics';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LogoTitle from '../../core/components/LogoTitle';

// screens
import MainScreen from '../../core/containers/MainScreen';

import AuthContainer from '../../profile/containers/AuthContainer';
import PhoneChangeScreen from '../../profile/containers/PhoneChangeScreen';
import ProfileEditScreen from '../../profile/containers/ProfileEditScreen';
import BonusScreen from '../../profile/bonus/containers/BonusScreen';
import DiscountsScreen from '../../profile/discounts/containers/DiscountsScreen';

// helpers
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheetMenu from '../../core/components/ActionSheetMenu';

import {ClassicHeaderWhite, BigCloseButton} from '../../navigation/const';
import {BELARUSSIA} from '../../core/const';

const mapStateToProps = ({dealer}) => {
  return {
    region: dealer.region,
  };
};

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const StackContacts = createStackNavigator();

const iconSize = 7;
const iconSizeFocused = 9;
const isDynamicIsland = DeviceInfo.hasDynamicIsland();
const isNotch = DeviceInfo.hasNotch();
let styleSuffix = '';

if (isNotch) {
  styleSuffix = 'Notch';
}
if (isDynamicIsland) {
  styleSuffix = 'Island';
}

let logoStyle = 'logo' + Platform.OS + styleSuffix;
let headerStyle = 'header' + Platform.OS + styleSuffix;
let styleImage = 'logoStyle' + Platform.OS + styleSuffix;
let headerRightStyle = 'headerRight' + Platform.OS + styleSuffix;

const styles = StyleSheet.create({
  logoandroid: {
    marginTop: 5,
  },
  logoStyleandroid: {
    width: '70%',
  },
  logoios: {
    marginTop: 0,
  },
  logoStyleios: {
    width: '85%',
  },
  logoiosIsland: {
    marginTop: -10,
  },
  logoiosNotch: {
    marginTop: -10,
  },
  logoStyleiosIsland: {
    width: '55%',
  },
  logoStyleiosNotch: {
    width: '55%',
  },
  headerandroid: {
    height: 70,
  },
  headerios: {
    height: 60,
  },
  headeriosIsland: {
    height: 100,
  },
  headeriosNotch: {
    height: 80,
  },
  headerRightiosNotch: {
    top: -5,
  },
  headerRightiosIsland: {
    top: -5,
  },
});

const ProfileStackView = ({navigation, route}) => (
  <ProfileStack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{
      tabBarHideOnKeyboard: true,
      headerShown: false,
      presentation: 'modal',
    }}>
    <ProfileStack.Screen
      name="LoginScreen"
      component={AuthContainer}
      options={{
        tabBarHideOnKeyboard: true,
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
      name="ProfileEditScreen"
      component={ProfileEditScreen}
      options={BigCloseButton(navigation, route, {
        presentation: 'modal',
        headerTitle: strings.ProfileSettingsScreen.title,
        headerTitleStyle: [
          stylesHeader.transparentHeaderTitle,
          {color: '#222B45'},
        ],
      })}
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

const headerRight = ({navigation}) => {
  return (
    <View style={[stylesHeader.headerRightStyle, styles[headerRightStyle]]}>
      <RNBounceable
        onPress={() => navigation.navigateDeprecated('NotificationsScreen', {})}>
        <Icon
          size={7}
          as={Ionicons}
          name="notifications-outline"
          color={styleConst.color.blueNew}
          _dark={{
            color: styleConst.color.white,
          }}
          style={stylesHeader.headerRightButton}
        />
      </RNBounceable>
    </View>
  );
};

const logoTitle = () => (
  <LogoTitle
    styleImage={styles[styleImage]}
    containerStyle={styles[logoStyle]}
  />
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

const menuOpacity = 1;

const BottomTabNavigation = ({navigation, route, region}) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = useState({});
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [bonusButtonPosition, setBonusButtonPosition] = useState(menuOpacity);

  const _animated = {
    bottomMenu: new Animated.Value(bonusButtonPosition),
    duration: 200,
  };

  const _showHideBottomMenu = show => {
    if (show) {
      Animated.timing(_animated.bottomMenu, {
        toValue: menuOpacity,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setBonusButtonPosition(menuOpacity);
      });
    } else {
      Animated.timing(_animated.bottomMenu, {
        toValue: 0,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setBonusButtonPosition(0);
      });
    }
  };

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    _showHideBottomMenu(!keyboardShow);
  }, [keyboardShow]);

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
            bottom: keyboardShow ? -120 : 0,
            opacity: _animated.bottomMenu,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: 90,
            paddingBottom: 20,
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
            headerTitle: logoTitle,
            headerRight: () => headerRight({navigation}),
            headerBackButtonMenuEnabled: false,
            headerBackVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            tabBarLabel: strings.Menu.bottom.main,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            headerLeft: null,
            headerTitleAlign: 'center',
            headerStyle: [
              {
                backgroundColor: '#f2f2f2',
                elevation: 0,
                shadowOpacity: 0,
              },
              styles[headerStyle],
            ],
            tabBarButtonTestID: 'BottomMenu.Home',
            tabBarIcon: ({focused, color}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={Ionicons}
                name="home-outline"
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
              navigation.navigateDeprecated('CarsStock');
            },
          }}
          options={{
            headerShown: false,
            tabBarLabel: strings.Menu.bottom.search,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarButtonTestID: 'BottomMenu.NewCars',
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
          name="Profile"
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
            tabBarButtonTestID: 'BottomMenu.Profile',
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={Ionicons}
                name="person-outline"
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
            tabBarButtonTestID: 'BottomMenu.Orders',
            tabBarIcon: ({color, focused}) => (
              <Icon
                size={focused ? iconSizeFocused : iconSize}
                as={Ionicons}
                name="call-outline"
                color={color}
                _dark={{
                  color: {color},
                }}
              />
            ),
          }}
        />

        {region === BELARUSSIA ? (
          <Tab.Screen
            name="Chat"
            component={CleanStackView}
            listeners={{
              tabPress: e => {
                e.preventDefault();
                Analytics.logEvent('click', 'bottomMenu/chat');
                navigation.navigateDeprecated('ChatScreen');
              },
            }}
            options={{
              headerShown: false,
              tabBarLabel: strings.Menu.bottom.chat,
              tabBarLabelStyle: {
                fontSize: 14,
              },
              tabBarButtonTestID: 'BottomMenu.Chat',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  size={focused ? iconSizeFocused : iconSize}
                  as={Ionicons}
                  name="chatbox-ellipses-outline"
                  color={color}
                  _dark={{
                    color: color,
                  }}
                />
              ),
            }}
          />
        ) : null}
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
