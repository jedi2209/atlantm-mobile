import React, {useState, useEffect, useRef} from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';
import {Box, Pressable, Text, View, Image} from 'native-base';

import Imager from './Imager';
import styleConst from '../style-const';

import PropTypes from 'prop-types';

const {width: widthDefault, height: heightDefault} = Dimensions.get('screen');

const defaultOpacity = 1;

const BackGroundComponent = props => {
  const {background} = props;
  let type = null;
  let backgroundPath = null;

  if (typeof background === 'object') {
    backgroundPath = background?.uri;
  }

  if (typeof backgroundPath === 'string') {
    if (
      backgroundPath.indexOf('http://') === 0 ||
      backgroundPath.indexOf('https://') === 0
    ) {
      type = 'pathRemote';
    } else if (backgroundPath.indexOf('#') === 0) {
      type = 'color';
    } else if (backgroundPath.indexOf('../') === 0) {
      type = 'pathLocal';
    }
  }

  if (typeof background === 'number') {
    type = 'pathLocalObject';
  }

  switch (type) {
    case 'pathLocal':
      return <Imager source={background} {...props} />;
    case 'pathLocalObject':
      return <Imager source={background} {...props} />;
    case 'pathRemote':
      return (
        <Imager
          key={`mainScreenButtonImageBackground`}
          source={{
            uri: backgroundPath,
          }}
          {...props}
        />
      );
    case 'color':
      return (
        <View backgroundColor={background} position={'absolute'} {...props} />
      );
  }
};

const sizeType = {
  small: {
    width: widthDefault / 3.5,
    height: 96,
  },
  half: {
    width: widthDefault / 2,
    height: widthDefault / 2,
  },
  full: {
    width: '100%',
    height: 128,
  },
};

const stylesTitle = StyleSheet.create({
  main: {
    zIndex: 10,
    color: styleConst.color.blueNew,
    fontFamily: styleConst.font.regular,
    position: 'absolute',
    paddingHorizontal: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  full: {
    fontSize: 24,
    lineHeight: 45,
  },
  half: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  small: {
    fontSize: 12.5,
    lineHeight: 16,
  },
});

const styles = StyleSheet.create({
  titleBackground: {
    backgroundColor: styleConst.color.white,
    position: 'absolute',
    opacity: 0.9,
    zIndex: 5,
  },
  titleBackgroundtop: {
    borderTopRightRadius: styleConst.borderRadius,
    borderTopLeftRadius: styleConst.borderRadius,
    top: 0,
  },
  titleBackgroundbottom: {
    borderBottomRightRadius: styleConst.borderRadius,
    borderBottomLeftRadius: styleConst.borderRadius,
    bottom: 0,
  },
});

export const MainScreenButton = ({
  size,
  type,
  background,
  backgroundProps,
  hash,
  title,
  titleStyle,
  titleBackgroundStyle,
  subTitle,
  subTitleStyle,
  onPress,
  style,
  width,
  height,
}) => {
  const [styleState, setStyleState] = useState({
    opacity: defaultOpacity,
  });

  const selectedAnim = useRef(new Animated.Value(1)).current;
  const _onPressIn = () => {
    setStyleState({
      opacity: 0.9,
    });
    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const widthDefault = sizeType[size].width;
  const heightDefault = sizeType[size].height;

  return (
    <Animated.View style={[{transform: [{scale: selectedAnim}]}]}>
      <Pressable
        onPressIn={_onPressIn}
        onPress={() => {
          setStyleState({
            opacity: defaultOpacity,
          });
          onPress();
        }}
        shadow={5}
        background={styleConst.color.white}
        borderRadius={styleConst.borderRadius}
        style={[
          styleState,
          {
            width: width ? width : widthDefault,
            height: height ? height : heightDefault,
          },
          style,
        ]}>
        {background ? (
          <BackGroundComponent
            background={background}
            style={[
              {
                width: width ? width : widthDefault,
                height: height ? height : heightDefault,
                position: 'absolute',
                borderRadius: styleConst.borderRadius,
                zIndex: 0,
              },
            ]}
            {...backgroundProps}
          />
        ) : null}
        <Text
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={[
            stylesTitle.main,
            stylesTitle[type],
            stylesTitle[size],
            {
              width: width ? width : widthDefault,
              height: height ? height / 2.75 : heightDefault / 2.75,
            },
            titleStyle,
          ]}>
          {title}
        </Text>
        {subTitle ? (
          <Text
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={[
              stylesTitle.main,
              {
                width: width ? width : widthDefault,
              },
              subTitleStyle,
            ]}>
            {subTitle}
          </Text>
        ) : null}
        {size !== 'half' ? (
          <View
            style={[
              {
                width: width ? width : widthDefault,
                height: height ? height / 2.75 : heightDefault / 2.75,
              },
              styles.titleBackground,
              styles['titleBackground' + type],
              titleBackgroundStyle,
            ]}
          />
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export const MainScreenButtons = () => {
  return <></>;
};

MainScreenButton.propTypes = {
  background: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  type: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['small', 'full', 'half']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
MainScreenButton.defaultProps = {
  background: null,
  type: 'top',
  size: 'small',
  width: null,
  height: null,
};

MainScreenButtons.propTypes = {
  config: PropTypes.object,
};
MainScreenButtons.defaultProps = {
  config: {},
};
