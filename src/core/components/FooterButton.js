import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Footer } from 'native-base';
import isIPhoneX from '@utils/is_iphone_x';

// components
import ButtonFull from './ButtonFull';

const styles = StyleSheet.create({
  footer: {
    height: isIPhoneX() ? 14 : 50, // хак чтобы в новой версии native-base футер прижимался к низу
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
