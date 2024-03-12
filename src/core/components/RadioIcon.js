import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  icon: {
    color: styleConst.color.blue,
  },
});

const RadioIcon = ({containerStyle, selected}) => {
  return (
    <Icon
      name={selected ? 'radio-button-on' : 'radio-button-off'}
      style={[styles.icon, containerStyle]}
      as={Ionicons}
    />
  );
};

RadioIcon.defaultProps = {
  selected: false,
  containerStyle: null,
};

export default RadioIcon;
