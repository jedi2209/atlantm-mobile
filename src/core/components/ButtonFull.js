import React, { PureComponent } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  spinnerButton: {
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    height: styleConst.ui.footerHeight,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonWhite: {
    borderBottomWidth: 1,
    borderBottomColor: styleConst.color.border,
    paddingLeft: styleConst.ui.horizontalGap,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: styleConst.font.medium,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonTextBlack: {
    color: '#000',
    fontFamily: styleConst.font.regular,
  },
  buttonIconRight: {
    width: 18,
    marginTop: 3,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  buttonIconLeft: {
    marginRight: 10,
    width: 28,
    height: 28,
  },
});

export default class ButtonFull extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    isLoading: PropTypes.bool,
    onPressButton: PropTypes.func,

    icon: PropTypes.string,
    theme: PropTypes.string,
    uppercase: PropTypes.bool,
  }

  static defaultProps = {
    icon: 'arrow',
    theme: 'blue',
    uppercase: true,
    isLoading: false,
  }

  render() {
    const {
      text,
      icon,
      theme,
      uppercase,
      isLoading,
      onPressButton,
    } = this.props;

    const isWhiteTheme = theme === 'white';

    return (
      <Button onPress={onPressButton} full style={[
        styles.button,
        isWhiteTheme ? styles.buttonWhite : null,
      ]}>
        {
          isLoading ?
            <ActivityIndicator color={isWhiteTheme ? styleConst.color.lightBlue : '#fff'} style={styles.spinnerButton} /> :
            (
              <View style={styles.buttonContent}>
                {
                  icon === 'phone' ?
                    <Image
                      source={require('../../contacts/assets/call_me.png')}
                      style={styles.buttonIconLeft}
                    /> :
                    null
                }

                <Text style={[
                  styles.buttonText,
                  isWhiteTheme ? styles.buttonTextBlack : null,
                ]}>{uppercase ? text.toUpperCase() : text}</Text>
                {
                  icon === 'arrow' ?
                    (
                      <Image
                        source={require('./CustomIcon/assets/arrow_right_white.png')}
                        style={styles.buttonIconRight}
                      />
                    ) : null
                }
                {
                  (icon !== 'phone' && icon !== 'arrow' && React.isValidElement(icon)) ? icon : null
                }
              </View>
            )
        }
      </Button>
    );
  }
}
