import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Footer } from 'native-base';

// components
import ButtonFull from './ButtonFull';

// helpers
import styleConst from '@core/style-const';
import isIPhoneX from '@utils/is_iphone_x';

const styles = StyleSheet.create({
  footer: {
    height: isIPhoneX() ? styleConst.ui.footerHeightIphone : styleConst.ui.footerHeightAndroid,
  },
});

export default class FooterButton extends PureComponent {
  render() {
    return (
      <Footer style={styles.footer}>
        <ButtonFull {...this.props}/>
      </Footer>
    );
  }
}
