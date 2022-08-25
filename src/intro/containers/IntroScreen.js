import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Image, View, Text} from 'react-native';
import {Button} from 'native-base';

// helpers
import styleConst from '../../core/style-const';
import {scale} from '../../utils/scale';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
  },
  button: {
    backgroundColor: styleConst.color.white,
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
          <Image
            style={styles.logo}
            testID="IntroChooseDealerScreenLogo"
            resizeMode="contain"
            source={require('../../menu/assets/logo-horizontal-white.svg')}
          />
          <Button
            size="md"
            title={strings.IntroScreen.button}
            testID="IntroChooseDealerButton"
            onPress={this.onPressButton}
            style={[styleConst.shadow.default, styles.button]}
            leftIcon={
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../menu/assets/Home.svg')}
              />
            }>
            <Text style={styles.buttonText}>{strings.IntroScreen.button}</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}
