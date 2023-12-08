/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

// components
import * as NavigationService from '../../../navigation/NavigationService';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../style-const';

import {localDealerClear} from '../../../dealer/actions';

const containerSize = 40;
const styles = StyleSheet.create({
  container: {
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
    width: containerSize / 2,
    height: containerSize / 2,
    resizeMode: 'contain',
  },
});

const mapDispatchToProps = {
  localDealerClear,
};

const MENU_SCREEN_NAME = 'BottomTabNavigation';

const HeaderBackButton = props => {
  const onPressBack = () => {
    const {returnScreen, onPressBackCallBack, dealerClear, localDealerClear} =
      props;

    if (onPressBackCallBack && typeof onPressBackCallBack === 'function') {
      onPressBackCallBack();
    }

    if (returnScreen === MENU_SCREEN_NAME) {
      _onPressBackHome();
      return false;
    }

    returnScreen
      ? NavigationService.navigate(returnScreen)
      : NavigationService.goBack();

    if (dealerClear) {
      setTimeout(() => {
        localDealerClear();
      }, 500);
    }
  };

  const _onPressBackHome = () => {
    Keyboard.dismiss();
    NavigationService.reset();
  };

  const fontColor = {
    white: styleConst.color.bg,
    blue: styleConst.color.lightBlue,
    black: styleConst.color.lightBlack,
  };

  let fontType = null;

  switch (props.type) {
    default:
      fontType = Ionicons;
      break;
  }

  return (
    <TouchableOpacity
      style={[styles.container, props.ContainerStyle]}
      testID="HeaderIconBack.Button"
      onPress={onPressBack}>
      <View style={[styles.inner, props.InnerStyle]}>
        <Icon
          size={props.iconSize}
          as={fontType}
          name={props.icon}
          color={styleConst.color.white}
          _dark={{
            color: styleConst.color.white,
          }}
          style={[
            {
              color: fontColor[props.theme],
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
  IconStyle: PropTypes.object,
};

HeaderBackButton.defaultProps = {
  ContainerStyle: {},
  type: 'Ionicons',
  iconSize: 10,
  icon: 'arrow-back',
  theme: 'blue',
};

export default connect(null, mapDispatchToProps)(HeaderBackButton);
