import React from 'react';
import stylesHeader from '../core/components/Header/style';
import HeaderIconBack from '../core/components/HeaderIconBack/HeaderIconBack';

const ArrowBack = (navigation, route, AdditionalProps) => {
  console.log('ArrowBack route', route);
  return (
    <HeaderIconBack
      returnScreen={route?.params?.returnScreen}
      {...AdditionalProps}
    />
  );
};

const ClassicHeaderWhite = (title, navigation, route) => {
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
    headerLeft: () => {
      return ArrowBack(navigation, route);
    },
  };
};

const ClassicHeaderBlue = (title, navigation, route) => {
  return {
    headerTitle: title ? title : null,
    headerStyle: [stylesHeader.common, stylesHeader.blueHeader],
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: () => {
      return ArrowBack(navigation, route, {theme: 'white'});
    },
  };
};

const TransparentBack = (navigation, route) => {
  return {
    headerTitle: null,
    headerTitleStyle: stylesHeader.transparentHeaderTitle,
    headerTransparent: true,
    headerLeft: () => {
      return ArrowBack(navigation, route, {
        theme: 'white',
        ContainerStyle: stylesHeader.headerBackButtonContainer,
        IconStyle: stylesHeader.headerBackButtonIcon,
      });
    },
  };
};

const BigCloseButton = (navigation, route) => {
  return {
    headerStyle: [
      stylesHeader.resetBorder,
      {
        backgroundColor: '#fff',
      },
    ],
    headerTitle: null,
    headerTitleStyle: stylesHeader.transparentHeaderTitle,
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
  };
};

export {
  ArrowBack,
  ClassicHeaderBlue,
  ClassicHeaderWhite,
  TransparentBack,
  BigCloseButton,
};
