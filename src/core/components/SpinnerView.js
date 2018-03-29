import React from 'react';

import { Text, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

// helpers
import styleConst from '../style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  text: {
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
});

const SpinnerView = ({ text }) => (
  <SafeAreaView style={styles.spinnerContainer} >
    <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
    { text ? <Text style={styles.text}>{text}</Text> : null }
  </SafeAreaView>
);

export default SpinnerView;
