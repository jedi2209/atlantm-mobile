import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// helpers
import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  message: {
    marginTop: verticalScale(60),
    fontFamily: styleConst.font.regular,
    fontSize: 18,
    alignSelf: 'center',
    letterSpacing: styleConst.ui.letterSpacing,
    textAlign: 'center',
  },
});

const emptyMessage = ({text}) => (
  <View style={styles.messageContainer}>
    <Text style={styles.message}>{text}</Text>
  </View>
);

export default emptyMessage;
