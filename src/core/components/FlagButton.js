import React, {useState, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Pressable, Text, Avatar, Button} from 'native-base';

import styleConst from '../style-const';
import Imager from './Imager';

const flags = {
  by: require('../../../assets/flags/belarus.jpg'),
  belarus: require('../../../assets/flags/belarus.jpg'),
  ru: require('../../../assets/flags/russia.jpg'),
  russia: require('../../../assets/flags/russia.jpg'),
};

const countryName = {
  by: 'Беларусь',
  belarus: 'Беларусь',
  ru: 'Россия',
  russia: 'Россия',
};

const defaultOpacity = 0.7;

const FlagButton = props => {
  const {
    buttonSize = 32,
    flagSize = 188,
    country = 'belarus',
    showCaption = false,
    shadow = styleConst.shadow.prop,
    style = {
      width: 150,
      height: 100,
      borderRadius: 10,
    },
    styleImage = {
      width: 50,
      height: 10,
      borderRadius: 10,
    },
    type = 'text',
    onPress,
    styleText,
    backgroundColor,
  } = props;

  const [styleState, setStyleState] = useState({
    opacity: defaultOpacity,
  });
  const selectedAnim = useRef(new Animated.Value(1)).current;
  const _onPressIn = () => {
    setStyleState({
      opacity: 1,
    });
    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  switch (type) {
    case 'avatar':
      return (
        <Pressable
          onPressIn={_onPressIn}
          onPressOut={() => {
            setStyleState({
              opacity: defaultOpacity,
            });
            onPress();
          }}>
          <Animated.View style={[{transform: [{scale: selectedAnim}]}]}>
            <Avatar
              key={'flag' + country}
              bg={styleConst.color.blueNew}
              alignSelf="center"
              size={buttonSize}
              shadow={shadow}
              source={flags[country]}
            />
          </Animated.View>
        </Pressable>
      );
    case 'flag':
      return (
        <Pressable
          key={'flag' + country}
          onPressIn={_onPressIn}
          shadow={shadow}
          background={backgroundColor}
          onPressOut={() => {
            setStyleState({
              opacity: defaultOpacity,
            });
            onPress();
          }}
          style={styleState}>
          <Animated.View style={[{transform: [{scale: selectedAnim}]}]}>
            <Imager source={flags[country]} style={style} />
          </Animated.View>
        </Pressable>
      );
    case 'button':
      return (
        <Button
          key={'flag' + country}
          shadow={shadow}
          variant={'unstyle'}
          leftIcon={
            <Imager
              source={flags[country]}
              style={[styleImage, {borderRadius: styleConst.borderRadius}]}
              resizeMode="contain"
            />
          }
          {...props}>
          <Text style={[styleText, {fontFamily: styleConst.font.regular}]}>
            {countryName[country]}
          </Text>
        </Button>
      );
    default:
      return (
        <Pressable key={'flag' + country} {...props} shadow={null}>
          <Text style={[styleText, {fontFamily: styleConst.font.regular}]}>
            {countryName[country]}
          </Text>
        </Pressable>
      );
  }
};

export default FlagButton;
