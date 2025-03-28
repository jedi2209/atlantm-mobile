import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

const FlatListFooter = () => {
  return (
    <View style={styles.footer}>
      <ActivityIndicator animating color={styleConst.color.blue} />
    </View>
  );
};

export default FlatListFooter;
