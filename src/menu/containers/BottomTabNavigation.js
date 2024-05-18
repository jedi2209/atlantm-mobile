/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Platform, Keyboard, Animated, StyleSheet} from 'react-native';
import {useDisclose, Icon, Text, View, Pressable} from 'native-base';
import orderFunctions from '../../utils/orders';
import Analytics from '../../utils/amplitude-analytics';
import DeviceInfo from 'react-native-device-info';
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

// helpers
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheetMenu from '../../core/components/ActionSheetMenu';

import {ClassicHeaderWhite, BigCloseButton} from '../../navigation/const';
import {BELARUSSIA} from '../../core/const';

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
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

let logoStyle = 'logo' + Platform.OS + (isDynamicIsland ? 'Island' : '');
let headerStyle = 'header' + Platform.OS + (isDynamicIsland ? 'Island' : '');
let styleImage = 'logoStyle' + Platform.OS + (isDynamicIsland ? 'Island' : '');

const styles = StyleSheet.create({
  logoandroid: {
    marginTop: 5,
  },
  logoStyleandroid: {
    width: '80%',
  },
  logoios: {
    marginTop: 0,
  },
  logoStyleios: {
    width: '85%',
  },
  logoiosIsland: {
    marginTop: 0,
  },
  logoStyleiosIsland: {
    width: '60%',
  },
  headerandroid: {
    height: 70,
  },
  headerios: {
    height: 60,
  },
  headeriosIsland: {
    height: 110,
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

const ContactsStackView = ({navigation, route}) => (
  <StackContacts.Navigator initialRouteName="ContactsScreen">
    <StackContacts.Screen
      name="ContactsScreen"
      component={MainScreen}
      options={{
        headerTitle: () => (
          <LogoTitle
            styleImage={styles[styleImage]}
            containerStyle={styles[logoStyle]}
          />
        ),
        headerRight: () => (
          <View style={stylesHeader.headerRightStyle}>
            <Pressable
              onPress={() => navigation.navigate('NotificationsScreen', {})}>
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
            </Pressable>
          </View>
        ),
        headerBackButtonMenuEnabled: false,
        headerBackVisible: false,
        headerBackTitleVisible: false,
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
    // const keyboardWillShowListener = Keyboard.addListener(
    //   'keyboardWillShow',
    //   () => {
    //     setKeyboardShow(true);
    //   },
    // );
    // const keyboardWillHideListener = Keyboard.addListener(
    //   'keyboardWillHide',
    //   () => {
    //     setKeyboardShow(false);
    //   },
    // );
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
      // keyboardWillHideListener.remove();
      // keyboardWillShowListener.remove();
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
            headerShown: false,
            headerBackButtonMenuEnabled: false,
            headerBackVisible: false,
            headerBackTitleVisible: false,
            tabBarLabel: strings.Menu.bottom.main,
            tabBarLabelStyle: {
              fontSize: 14,
            },
            tabBarTestID: 'BottomMenu.Home',
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
            tabBarTestID: 'BottomMenu.Orders',
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
