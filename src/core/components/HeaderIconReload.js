import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    marginTop: 4,
    fontSize: size,
    color: styleConst.color.systemBlue,

    ...Platform.select({
      android: {
        fontSize: size * 1.1,
        width: size,
        height: size,
        marginTop: 0,
      },
    }),
  },
});

export default class HeaderIconReload extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Icon
          size={22}
          as={Ionicons}
          name="ios-refresh"
          color="primary.600"
          _dark={{
            color: 'warmGray.50',
          }}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}
