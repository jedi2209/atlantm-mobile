import React, {Component} from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import {Button, Icon} from 'native-base';

import {SafeAreaView} from 'react-navigation';

// components
import FooterButton from '../../core/components/FooterButton';

// helpers
import styleConst from '../../core/style-const';
import {scale} from '../../utils/scale';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
  },
  logoContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  logo: {
    width: scale(1000),
    height: scale(1000),
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default class IntroScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

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
            title="Выберите свой автоцентр"
            onPress={this.onPressButton}
            style={[
              styleConst.shadow.default,
              {
                backgroundColor: '#fff',
                bottom: '10%',
                width: '80%',
                marginHorizontal: '10%',
                borderRadius: 5,
                position: 'absolute',
              },
            ]}>
            <Image
              style={{
                marginRight: 20,
                tintColor: styleConst.color.lightBlue,
              }}
              resizeMode="contain"
              source={require('../../menu/assets/Home.svg')}
            />
            <Text
              style={{
                color: styleConst.color.lightBlue,
                fontFamily: styleConst.font.regular,
                fontSize: 15
              }}>
              Выберите свой автоцентр
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}
