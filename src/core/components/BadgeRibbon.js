import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  badgeContainer: {
    width: '100%',
    padding: 10,
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styleConst.color.blue,
    height: 40,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  badgeName: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '#232F3B',
    transform: [{rotate: '90deg'}],
  },
  textStyle: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.regular,
  },
  banner: {
    position: 'absolute',
    right: -40,
    top: 20,
    width: 160,
    transform: [{rotate: '45deg'}],
    backgroundColor: styleConst.color.blue,
    color: styleConst.color.white,
    padding: 8,
    textAlign: 'center',
    zIndex: 1,
  },
});

const BadgeRibbon = ({text = null, containerStyle = {}, textStyle = {}}) => {
  return (
    <View>
      <View style={[styles.badgeContainer, containerStyle]}>
        {text ? (
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
        ) : null}
      </View>
      <View style={styles.badgeName} />
    </View>
  );
};

const BadgeCorner = ({text = null, style = {}}) => {
  return <Text style={[styles.banner, style]}>{text}</Text>;
};

export {BadgeRibbon, BadgeCorner};
