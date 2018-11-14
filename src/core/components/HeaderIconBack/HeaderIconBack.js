import React, { Component } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// components
import { NavigationActions } from 'react-navigation';

// helpers
import PropTypes from 'prop-types';
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

const MENU_SCREEN_NAME = 'MenuScreen';

export default class HeaderIconBack extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    returnScreen: PropTypes.string,
  }

  shouldComponentUpdate() {
    return false;
  }

  onPressBack = () => {
    const { returnScreen, navigation } = this.props;

    if (returnScreen === MENU_SCREEN_NAME) {
      this.onPressBackHome();
      return false;
    }

    returnScreen ? navigation.navigate(returnScreen) : navigation.goBack();
  }

  onPressBackHome = () => {
    Keyboard.dismiss();
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: MENU_SCREEN_NAME }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPressBack}
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
}
