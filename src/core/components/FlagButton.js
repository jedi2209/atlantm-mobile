import React from 'react';
import {StyleSheet} from 'react-native';
import {Pressable, Text, Avatar} from 'native-base';
import styleConst from '../style-const';

const flags = {
  belarus: require('../../../assets/flags/belarus.jpg'),
  russia: require('../../../assets/flags/russia.jpg'),
  belarusFree: require('../../../assets/flags/belarus-free.jpg'),
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

const FlagButton = ({onPress, country, buttonSize, showCaption}) => {
  return (
    <Pressable onPress={onPress}>
      <Avatar
        key={'flag' + country}
        bg={styleConst.color.blueNew}
        alignSelf="center"
        size={buttonSize}
        shadow={8}
        source={flags[country]}
      />
      {showCaption && country === 'belarusFree' ? (
        <Text style={styles.text}>Жыве Беларусь!</Text>
      ) : null}
    </Pressable>
  );
};

FlagButton.defaultProps = {
  buttonSize: 32,
  flagSize: 188,
  country: 'belarus',
  showCaption: false,
};

export default FlagButton;
