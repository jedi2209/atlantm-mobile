import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

// helpers
import styleConst from '../../style-const';
import * as NavigationService from '../../../navigation/NavigationService';

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

const _onPressIcon = () => {
  Keyboard.dismiss();
  NavigationService.reset();
};

const HeaderIconMenu = (props) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => {
      return _onPressIcon();
    }}>
    <View style={styles.inner}>
      <Image style={styles.icon} source={require('./assets/menu.png')} />
    </View>
  </TouchableOpacity>
);

export default HeaderIconMenu;
