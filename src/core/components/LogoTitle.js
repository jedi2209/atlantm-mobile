import React, {PureComponent} from 'react';
import {Text, View, Image, Platform, StyleSheet} from 'react-native';

import styleConst from '../style-const';

import {connect} from 'react-redux';
import LangSwitcher from './LangSwitcher';

import DeviceInfo from 'react-native-device-info';

const mapStateToProps = ({core}) => {
  return {
    currentLang: core.language.selected || 'ru',
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
  },
  Text: {
    fontSize: 10,
    bottom: -10,
    right: isAndroid ? 10 : 20,
    position: 'absolute',
    fontFamily: styleConst.font.light,
    color: styleConst.new.blueHeader,
  },
  LangSwitcher: {
    fontSize: 14,
    marginLeft: 20,
    fontFamily: styleConst.font.light,
    color: styleConst.new.blueHeader,
  },
});

const isAndroid = Platform.OS === 'android';

class LogoTitle extends PureComponent {
  render() {
    return (
      <View style={styles.Container}>
        <Image
          resizeMode="contain"
          style={styles.Image}
          source={require('../../menu/assets/logo-horizontal.svg')}
        />
        <LangSwitcher
          items={languagesItems}
          placeholder={{
            label: 'язык',
            value: this.props.currentLang === 'ua' ? 2 : 1,
            color: styleConst.color.bg,
          }}
          value={this.props.currentLang}
          bgColor={styleConst.color.bg}
          style={styles.LangSwitcher}
        />
        <Text style={styles.Text}>
          {'v. ' +
            DeviceInfo.getVersion() +
            ' (' +
            DeviceInfo.getBuildNumber() +
            ')'}
        </Text>
      </View>
    );
  }
}

export default connect(mapStateToProps)(LogoTitle);
