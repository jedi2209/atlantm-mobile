/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';

// components
import * as NavigationService from '../../../navigation/NavigationService';

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

const MENU_SCREEN_NAME = 'BottomTabNavigation';

const HeaderBackButton = (props) => {
  const onPressBack = () => {
    const {returnScreen} = props;

    if (returnScreen === MENU_SCREEN_NAME) {
      _onPressBackHome();
      return false;
    }

    returnScreen
      ? NavigationService.navigate(returnScreen)
      : NavigationService.goBack();
  };

  const _onPressBackHome = () => {
    Keyboard.dismiss();
    NavigationService.reset();
  };

  return (
    <TouchableOpacity
      style={[styles.container, props.ContainerStyle]}
      onPress={onPressBack}>
      <View style={[styles.inner]}>
        <Icon
          type={props.type}
          name={props.icon}
          style={[
            styles.arrowFont,
            {
              color:
                props.theme === 'white'
                  ? '#fff'
                  : props.theme === 'blue'
                  ? styleConst.new.blueHeader
                  : '#000',
            },
            props.IconStyle,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

HeaderBackButton.propTypes = {
  returnScreen: PropTypes.string,
  color: PropTypes.string,
  IconStyle: ViewPropTypes.style,
};

HeaderBackButton.defaultProps = {
  ContainerStyle: {},
  type: 'Ionicons',
  icon: 'arrow-back',
};

export default HeaderBackButton;
