import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 4,
  },
  badgeName: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
  },
});

const Badge = props => {
  return props?.onPress ? (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPressOut={props.onPress}
      style={[
        styles.badgeContainer,
        {backgroundColor: props.bgColor},
        props.badgeContainerStyle,
      ]}>
      <Text
        selectable={false}
        style={[styles.badgeName, {color: props.textColor}, props.textStyle]}>
        {props.name}
      </Text>
    </TouchableHighlight>
  ) : (
    <View
      style={[
        styles.badgeContainer,
        {backgroundColor: props.bgColor},
        props.badgeContainerStyle,
      ]}>
      <Text
        selectable={false}
        style={[styles.badgeName, {color: props.textColor}, props.textStyle]}>
        {props.name}
      </Text>
    </View>
  );
};

Badge.propTypes = {
  name: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

Badge.defaultProps = {
  textColor: 'black',
};

export default Badge;
