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
  belarusFree: require('../../../assets/flags/belarus-free.jpg'),
};

const countryName = {
  by: 'Беларусь',
  belarus: 'Беларусь',
  ru: 'Россия',
  russia: 'Россия',
  belarusFree: 'Беларусь',
};

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    bottom: '8%',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 10,
    color: styleConst.color.darkBg,
    shadowOpacity: 0.8,
    shadowOffset: {width: -0.2, height: 0.2},
    shadowColor: styleConst.color.white,
    opacity: 1,
  },
});

const defaultOpacity = 0.7;

const FlagButton = props => {
  const {onPress, country, buttonSize, showCaption, type, style, styleText} =
    props;

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
              shadow={styleConst.shadow.prop}
              source={flags[country]}
            />
            {showCaption && country === 'belarusFree' ? (
              <Text style={styles.text}>Жыве Беларусь!</Text>
            ) : null}
          </Animated.View>
        </Pressable>
      );
    case 'flag':
      return (
        <Pressable
          key={'flag' + country}
          onPressIn={_onPressIn}
          shadow={styleConst.shadow.prop}
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
          style={style}
          shadow={styleConst.shadow.prop}
          leftIcon={
            <Imager
              source={flags[country]}
              style={[style, {borderRadius: styleConst.borderRadius}]}
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
        <Pressable key={'flag' + country} {...props}>
          <Text style={[styleText, {fontFamily: styleConst.font.regular}]}>
            {countryName[country]}
          </Text>
        </Pressable>
      );
  }
};

FlagButton.defaultProps = {
  buttonSize: 32,
  flagSize: 188,
  country: 'belarus',
  showCaption: false,
  style: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  type: 'text',
};

export default FlagButton;
