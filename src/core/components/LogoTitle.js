import React, {PureComponent} from 'react';
import {Text, View, Image, Platform, StyleSheet} from 'react-native';

import styleConst from '../style-const';

import {connect} from 'react-redux';
import LangSwitcher from './LangSwitcher';

import DeviceInfo from 'react-native-device-info';

const mapStateToProps = ({dealer, core}) => {
  return {
    currentLang: core.language.selected || 'ru',
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
    width: '60%',
  },
  Text: {
    fontSize: 10,
    bottom: -10,
    right: isAndroid ? 10 : 20,
    position: 'absolute',
    fontFamily: styleConst.font.light,
    color: styleConst.new.blueHeader,
  },
  LangSwitcherContainer: {
    marginHorizontal: '2%',
    padding: 0,
    width: '30%',
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
        {this.props.dealerSelected.region === 'ua' ? ( // выбор языка есть только для РУ региона
          <View style={styles.LangSwitcherContainer}>
            <LangSwitcher
              items={languagesItems}
              placeholder={{
                label: 'язык',
                value: this.props.currentLang === 'ua' ? 2 : 1,
                color: styleConst.color.bg,
              }}
              value={this.props.currentLang}
              style={styles.LangSwitcher}
            />
          </View>
        ) : null}
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
