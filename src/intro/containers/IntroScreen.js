import React, {Component} from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import {Button} from 'native-base';

import {SafeAreaView} from 'react-native-safe-area-context';

// helpers
import styleConst from '../../core/style-const';
import {scale} from '../../utils/scale';
import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
  },
  button: {
    backgroundColor: '#fff',
    bottom: '10%',
    width: '80%',
    marginHorizontal: '10%',
    borderRadius: 5,
    position: 'absolute',
  },
  buttonText: {
    color: styleConst.color.lightBlue,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  image: {
    marginRight: 20,
    tintColor: styleConst.color.lightBlue,
  },
  logoContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  logo: {
    width: scale(250),
    height: scale(250),
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default class IntroScreen extends Component {

  onPressButton = () => this.props.navigation.navigate('ChooseDealerScreen');

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          {/* <Image style={styles.logo} source={require('../assets/logo.png')} /> */}
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../../menu/assets/logo-horizontal-white.svg')}
          />
          <Button
            full
            title={strings.IntroScreen.button}
            onPress={this.onPressButton}
            style={[styleConst.shadow.default, styles.button]}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../menu/assets/Home.svg')}
            />
            <Text style={styles.buttonText}>{strings.IntroScreen.button}</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}
