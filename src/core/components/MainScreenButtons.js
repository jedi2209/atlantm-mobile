import React, {useState, useEffect, useRef} from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';
import {Box, Pressable, Text, View, Image} from 'native-base';

import Imager from './Imager';
import styleConst from '../style-const';

import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');

const defaultOpacity = 1;

const BackGroundComponent = props => {
  const {background} = props;
  let type = null;

  if (typeof background === 'string') {
    if (
      background.indexOf('http://') === 0 ||
      background.indexOf('https://') === 0
    ) {
      type = 'pathRemote';
    } else if (background.indexOf('#') === 0) {
      type = 'color';
    } else if (background.indexOf('../') === 0) {
      type = 'pathLocal';
    }
  }

  if (typeof background === 'number') {
    type = 'pathLocalObject';
  }

  switch (type) {
    case 'pathLocal':
      return <Imager source={{uri: background}} {...props} />;
    case 'pathLocalObject':
      return <Imager source={background} {...props} />;
    case 'pathRemote':
      return (
        <Imager
          key={`mainScreenButtonImageBackground`}
          source={{
            uri: background,
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
    width: width / 3.5,
    height: 96,
  },
  half: {
    width: width / 2,
    height: width / 2,
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
    fontFamily: styleConst.font.brand,
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
    backgroundColor: 'white',
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
  hash,
  title,
  titleStyle,
  subTitle,
  subTitleStyle,
  onPress,
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

  const width = sizeType[size].width;
  const height = sizeType[size].height;

  return (
    <Animated.View style={[{transform: [{scale: selectedAnim}]}]}>
      <Pressable
        onPressIn={_onPressIn}
        onPressOut={() => {
          setStyleState({
            opacity: defaultOpacity,
          });
          onPress();
        }}
        shadow={size === 'half' ? 3 : 5}
        borderRadius={styleConst.borderRadius}
        style={[
          styleState,
          {
            width,
            height,
          },
        ]}>
        {background ? (
          <BackGroundComponent
            background={background}
            style={{
              width,
              height,
              position: 'absolute',
              borderRadius: styleConst.borderRadius,
              zIndex: 0,
            }}
          />
        ) : null}
        <Text
          style={[
            stylesTitle.main,
            stylesTitle[type],
            stylesTitle[size],
            {
              width,
            },
            titleStyle,
          ]}>
          {title}
        </Text>
        {subTitle ? (
          <Text
            style={[
              stylesTitle.main,
              {
                width,
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
                height: height / 2.75,
                width,
              },
              styles.titleBackground,
              styles['titleBackground' + type],
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
  background: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['small', 'full', 'half']),
};
MainScreenButton.defaultProps = {
  type: 'top',
  size: 'small',
};

MainScreenButtons.propTypes = {
  config: PropTypes.object,
};
MainScreenButtons.defaultProps = {
  config: {},
};
