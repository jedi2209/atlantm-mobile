import React from 'react';
import {Platform} from 'react-native';
import stylesHeader from '../core/components/Header/style';
import HeaderIconBack from '../core/components/HeaderIconBack/HeaderIconBack';
import styleConst from '../core/style-const';

const ArrowBack = (navigation, route, AdditionalProps) => {
  return (
    <HeaderIconBack
      returnScreen={route?.params?.returnScreen}
      dealerClear={route?.params?.dealerClear}
      {...AdditionalProps}
    />
  );
};

const ClassicHeaderWhite = (title, navigation, route, options) => {
  return {
    headerTitle: title ? title : null,
    headerStyle: [
      stylesHeader.common,
      stylesHeader.headerStyle,
      stylesHeader.whiteHeader,
    ],
    headerTitleStyle: [
      stylesHeader.headerTitleStyle,
      stylesHeader.whiteHeaderTitle,
    ],
    headerShown: true,
    headerTransparent: false,
    headerLeft: () => {
      return ArrowBack(navigation, route, {theme: 'black'});
    },
    headerRight: () => <></>,
    ...options,
  };
};

const ClassicHeaderBlue = (title, navigation, route, options) => {
  return {
    headerTitle: title ? title : null,
    headerStyle: [stylesHeader.common, stylesHeader.blueHeader],
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerShown: true,
    headerTransparent: false,
    headerLeft: () => {
      return ArrowBack(navigation, route, {theme: 'white'});
    },
    headerRight: () => <></>,
    ...options,
  };
};

const TransparentBack = (navigation, route, options, buttonOptions) => {
  return {
    headerTitle: '',
    headerTitleStyle: stylesHeader.transparentHeaderTitle,
    headerStyle: {
      height: 55,
    },
    headerMode: Platform.OS === 'ios' ? 'screen' : 'float',
    headerTransparent: true,
    headerLeft: () => {
      return ArrowBack(navigation, route, {
        theme: 'white',
        ContainerStyle: stylesHeader.headerBackButtonContainer,
        IconStyle: stylesHeader.headerBackButtonIcon,
        ...buttonOptions,
      });
    },
    headerRight: () => <></>,
    ...options,
  };
};

const BigCloseButton = (navigation, route, options) => {
  return {
    headerStyle: [
      stylesHeader.resetBorder,
      {
        backgroundColor: styleConst.color.bg,
      },
    ],
    headerTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerBackVisible: false,
    headerTitleStyle: stylesHeader.transparentHeaderTitle,
    headerShadowVisible: false,
    headerTransparent: false,
    headerShown: true,
    headerLeft: () => {
      return ArrowBack(navigation, route, {
        icon: 'close-outline',
        iconSize: 10,
        IconStyle: {
          color: '#222B45',
        },
      });
    },
    ...options,
  };
};

const isTabBarVisible = (navigation, route) => {
  if (
    !route ||
    !route.state?.routes[route.index] ||
    !route.state?.routes[route.index].params
  ) {
    return true;
  }
  let tabBarVisible = route.state?.routes[route.index].params
    ? route.state?.routes[route.index].params.showTabBar
    : true;

  return tabBarVisible;
};

export {
  ArrowBack,
  ClassicHeaderBlue,
  ClassicHeaderWhite,
  TransparentBack,
  BigCloseButton,
  isTabBarVisible,
};
