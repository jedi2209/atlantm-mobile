import React, { PureComponent } from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 36,
    resizeMode: 'contain',
    alignSelf: 'center',
    flex: 1
  },
});

export default class HeaderLogo extends PureComponent {
  render() {
    return (
      <Image
        resizeMode="cover"
        style={styles.logo}
        source={require('./assets/company_logo_with_background.png')}
      />
    );
  }
}
