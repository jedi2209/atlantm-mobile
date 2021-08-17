import React from 'react';
import stylesHeader from '../core/components/Header/style';
import HeaderIconBack from '../core/components/HeaderIconBack/HeaderIconBack';
import styleConst from '../core/style-const';

const ArrowBack = (navigation, route, AdditionalProps) => {
  return (
    <HeaderIconBack
      returnScreen={route?.params?.returnScreen}
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
      return ArrowBack(navigation, route);
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
    headerTitleStyle: stylesHeader.transparentHeaderTitle,
    headerShown: true,
    headerTransparent: false,
    headerLeft: () => {
      return ArrowBack(navigation, route, {
        icon: 'md-close',
        IconStyle: {
          fontSize: 42,
          width: 40,
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
