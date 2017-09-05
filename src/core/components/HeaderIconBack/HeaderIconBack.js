import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styleConst from '../../style-const';

const containerSize = 40;
const size = 20;
const styles = StyleSheet.create({
  container: {
    paddingLeft: styleConst.ui.horizontalGap * 2,
    paddingRight: styleConst.ui.horizontalGap * 2,
    width: containerSize,
    height: containerSize,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: size,
    height: size,
    resizeMode: 'contain',
  },
});

export default class HeaderIconBack extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.navigation.goBack()}
      >
        <View style={styles.inner}>
          <Image
            style={styles.icon}
            source={require('./assets/back.png')}
          />
        </View>
      </TouchableOpacity>
    );
  }
};
