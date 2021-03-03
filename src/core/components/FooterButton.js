import React from 'react';
import {Footer} from 'native-base';

// components
import ButtonFull from './ButtonFull';

// helpers
import styleFooter from './Footer/style';

const FooterButton = ({style, text, onPressButton}) => {
  return (
    <Footer style={[styleFooter.footer, style]}>
      <ButtonFull text={text} onPressButton={onPressButton} />
    </Footer>
  );
};

export default FooterButton;
