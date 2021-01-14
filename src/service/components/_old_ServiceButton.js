import React, {PureComponent} from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';

// components
import {Button, Footer, FooterTab} from 'native-base';

// helpers
import styleConst from '../../core/style-const';
import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    width: 18,
    marginLeft: 5,
    resizeMode: 'contain',
  },
});

export default class ServiceButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
  };

  static defaultProps = {};

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button onPress={this.props.onPress} full style={styles.button}>
            <Text style={styles.buttonText}>{strings.Form.button.send}</Text>
            <Image
              source={require('../../core/components/CustomIcon/assets/arrow_right_white.png')}
              style={styles.buttonIcon}
            />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
