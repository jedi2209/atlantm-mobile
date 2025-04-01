import React from 'react';
import {StyleSheet, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  icon: {
    color: styleConst.color.blue,
  } as ViewStyle,
});

interface RadioIconProps {
  selected?: boolean;
  containerStyle?: StyleProp<TextStyle>;
}

const RadioIcon: React.FC<RadioIconProps> = ({selected = false, containerStyle = null}) => {
  return (
    <Icon
      name={selected ? 'radio-button-on' : 'radio-button-off'}
      style={[styles.icon, containerStyle]}
      as={Ionicons}
    />
  );
};

export default RadioIcon;
