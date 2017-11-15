import React from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

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
});

const SpinnerView = () => (
  <View style={styles.spinnerContainer} >
    <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
  </View>
);

export default SpinnerView;
