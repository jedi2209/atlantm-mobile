/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// components
import {NavigationActions, StackActions} from 'react-navigation';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../style-const';
import {Icon} from 'native-base';

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
  arrowFont: {
    fontSize: 22,
    width: 20,
    marginTop: 4,
  },
});

const MENU_SCREEN_NAME = 'MenuScreen';

export default class HeaderIconBack extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    returnScreen: PropTypes.string,
    color: PropTypes.string,
  };

  shouldComponentUpdate() {
    return false;
  }

  onPressBack = () => {
    const {returnScreen, navigation} = this.props;

    if (returnScreen === MENU_SCREEN_NAME) {
      this.onPressBackHome();
      return false;
    }

    returnScreen ? navigation.navigate(returnScreen) : navigation.goBack();
  };

  onPressBackHome = () => {
    Keyboard.dismiss();
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({routeName: MENU_SCREEN_NAME})],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressBack}>
        <View style={styles.inner}>
          <Icon
            // type="MaterialCommunityIcons"
            name="arrow-back"
            style={[
              styles.arrowFont,
              {
                color:
                  this.props.theme === 'white'
                    ? '#fff'
                    : this.props.theme === 'blue'
                    ? '#0F66B2'
                    : '#000',
              },
            ]}
          />
          {/* {this.props.theme === 'white' ? (
            <Image
              style={styles.icon}
              source={require('./assets/back@2x-white.png')}
            />
          ) : (
            <Image style={styles.icon} source={require('./assets/back.png')} />
          )} */}
        </View>
      </TouchableOpacity>
    );
  }
}
