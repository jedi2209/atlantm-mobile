import React from 'react';
import {View, Image, Platform, StyleSheet} from 'react-native';

import {connect} from 'react-redux';
import {APP_LANG} from '../const';

const mapStateToProps = ({dealer, core}) => {
  return {
    currentLang: core.language.selected || APP_LANG,
    dealerSelected: dealer.selected,
  };
};

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  Image: {
    maxHeight: 70,
    marginBottom: 3,
    position: 'relative',
    width: isAndroid ? '80%' : '85%',
  },
});

const LogoTitle = props => {
  let logoPath = require('../../menu/assets/logo-horizontal.svg');
  if (props?.theme === 'white') {
    logoPath = require('../../menu/assets/logo-horizontal-white.svg');
  }
  return (
    <View style={styles.Container}>
      <Image resizeMode="contain" style={styles.Image} source={logoPath} />
    </View>
  );
};

export default connect(mapStateToProps)(LogoTitle);
