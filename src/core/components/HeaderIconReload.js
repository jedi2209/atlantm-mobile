import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';

// helpers
import styleConst from '../style-const';

const size = 40;
const styles = StyleSheet.create({
  container: {
    // paddingLeft: styleConst.ui.horizontalGap * 2,
    // paddingRight: styleConst.ui.horizontalGap * 2,
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginTop: 10,
    fontSize: size,
    color: styleConst.color.systemBlue,

    ...Platform.select({
      android: {
        fontSize: size * 1.1,
        width: size,
        height: size,
        // marginRight: 30,
        marginTop: 0,
      },
    }),
  },
});

export default class HeaderIconReload extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPress}
      >
        <Icon name="ios-refresh-outline" style={styles.icon} />
      </TouchableOpacity>
    );
  }
}
