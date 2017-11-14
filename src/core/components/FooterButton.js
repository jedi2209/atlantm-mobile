import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Footer } from 'native-base';

// components
import ButtonFull from './ButtonFull';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  footer: {
    height: styleConst.ui.footerHeight,
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
