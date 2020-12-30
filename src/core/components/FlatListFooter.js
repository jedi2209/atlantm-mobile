import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default class FlatListFooter extends Component {
  render() {
    return (
      <View style={styles.footer}>
        <ActivityIndicator animating color={styleConst.color.blue} />
      </View>
    );
  }
}
