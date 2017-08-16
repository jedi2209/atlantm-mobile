import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styleConst from '../../style-const';

const size = 23;
const styles = StyleSheet.create({
  container: {
    marginRight: styleConst.ui.horizontalGap,
    width: size,
    height: size,
  },
  icon: {
    width: size,
    height: size,
    resizeMode: 'contain',
  },
});

const HeaderIconMenu = props => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.navigation.navigate('MenuScreen')}
    >
      <Image
        style={styles.icon}
        source={require('./assets/menu.png')}
      />
    </TouchableOpacity>
  );
};

export default HeaderIconMenu;
