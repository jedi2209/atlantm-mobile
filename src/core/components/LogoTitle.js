import React, {PureComponent} from 'react';
import {View, Image, Platform, StyleSheet} from 'react-native';

import styleConst from '../style-const';

import {connect} from 'react-redux';
import LangSwitcher from './LangSwitcher';

const mapStateToProps = ({dealer, core}) => {
  return {
    currentLang: core.language.selected || 'ua',
    dealerSelected: dealer.selected,
  };
};

const languagesItems = [
  {
    label: '🇷🇺',
    value: 'ru',
    key: 1,
  },
  {
    label: '🇺🇦',
    value: 'ua',
    key: 2,
  },
];

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 2,
  },
  Image: {
    maxHeight: 70,
    marginBottom: 3,
    position: 'relative',
    width: isAndroid ? '80%' : '85%',
  },
  LangSwitcherContainer: {
    width: isAndroid ? '20%' : '15%',
    minWidth: 95,
  },
  LangSwitcher: {
    fontSize: 14,
    fontFamily: styleConst.font.light,
    color: styleConst.new.blueHeader,
  },
});

class LogoTitle extends PureComponent {
  render() {
    return (
      <View style={styles.Container}>
        <Image
          resizeMode="contain"
          style={styles.Image}
          source={require('../../menu/assets/logo-horizontal.svg')}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(LogoTitle);
