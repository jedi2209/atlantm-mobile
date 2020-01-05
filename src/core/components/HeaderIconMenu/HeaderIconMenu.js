import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

// helpers
import styleConst from '../../style-const';
import DeviceInfo from 'react-native-device-info';
import { NavigationActions, StackActions } from 'react-navigation';

const containerSize = 40;
const size = 23;
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
    alignSelf: 'center',
  },
});

export default class HeaderIconMenu extends Component {
  shouldComponentUpdate() {
    return false;
  }

  onPressIcon = () => {
    Keyboard.dismiss();
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'BottomTabNavigation' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    if (DeviceInfo.isTablet()) return null;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPressIcon}
      >
        <View style={styles.inner}>
          <Image
            style={styles.icon}
            source={require('./assets/menu.png')}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
