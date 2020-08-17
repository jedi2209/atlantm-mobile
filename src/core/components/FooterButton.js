import React, {PureComponent} from 'react';
import {Footer} from 'native-base';

// components
import ButtonFull from './ButtonFull';

// helpers
import styleFooter from './Footer/style';

export default class FooterButton extends PureComponent {
  render() {
    let style_footer = styleFooter.footer;
    if (this.props.style) {
      style_footer = {...styleFooter.footer, ...this.props.style};
    }
    return (
      <Footer style={style_footer}>
        <ButtonFull {...this.props} />
      </Footer>
    );
  }
}
