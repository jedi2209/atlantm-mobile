import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styleConst from '../../style-const';

const size = 20;
const styles = StyleSheet.create({
  container: {
    marginLeft: styleConst.ui.horizontalGap,
    width: size,
    height: size,
  },
  icon: {
    width: size,
    height: size,
    resizeMode: 'contain',
  },
});

const HeaderIconBack = props => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.navigation.goBack()}
    >
      <Image
        style={styles.icon}
        source={require('./assets/back.png')}
      />
    </TouchableOpacity>
  );
};

export default HeaderIconBack;
