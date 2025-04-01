import React from 'react';
import {View, Image, Platform, StyleSheet, ImageStyle, ViewStyle} from 'react-native';
import {connect} from 'react-redux';
import {APP_LANG} from '../const';

interface StateProps {
  currentLang: string;
  dealerSelected: any;
}

interface OwnProps {
  theme?: 'white' | 'default';
  containerStyle?: ViewStyle;
  styleImage?: ImageStyle;
  ImageProps?: object;
}

type Props = StateProps & OwnProps;

const mapStateToProps = ({dealer, core}: any): StateProps => {
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
  } as ViewStyle,
  Image: {
    maxHeight: 70,
    marginBottom: 3,
    position: 'relative',
    width: isAndroid ? '80%' : '85%',
  } as ImageStyle,
});

const LogoTitle: React.FC<Props> = props => {
  let logoPath = require('../../menu/assets/logo-horizontal.svg');
  if (props?.theme === 'white') {
    logoPath = require('../../menu/assets/logo-horizontal-white.svg');
  }
  return (
    <View style={[styles.Container, props?.containerStyle]}>
      <Image
        resizeMode="contain"
        style={[styles.Image, props?.styleImage]}
        source={logoPath}
        {...props?.ImageProps}
      />
    </View>
  );
};

export default connect(mapStateToProps)(LogoTitle);
