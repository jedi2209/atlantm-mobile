import React, { PureComponent } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Footer, Button } from 'native-base';

// helpers
import styleConst from '../style-const';

const FOOTER_HEIGHT = 50;
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
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: styleConst.font.medium,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    width: 18,
    marginTop: 3,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  footer: {
    height: FOOTER_HEIGHT,
  },
});

export default class FooterButton extends PureComponent {
  render() {
    const {
      text,
      arrow,
      isLoading,
      onPressButton,
    } = this.props;

    return (
      <Footer style={styles.footer}>
        <Button onPress={onPressButton} full style={styles.button}>
          {
            isLoading ?
              (
                <ActivityIndicator color="#fff" style={styles.spinnerButton} />
              ) :
              (
                <View style={styles.buttonContent} >
                  <Text style={styles.buttonText}>{text}</Text>
                  {
                    arrow ?
                      (
                        <Image
                          source={require('./CustomIcon/assets/arrow-right.png')}
                          style={styles.buttonIcon}
                        />
                      ) : null
                  }
                </View>
              )
          }
        </Button>
      </Footer>
    );
  }
}
