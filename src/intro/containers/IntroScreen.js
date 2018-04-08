import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Image, View } from 'react-native';

// components
import FooterButton from '../../core/components/FooterButton';

// helpers
import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
  },
  logoContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: scale(200),
    height: scale(200),
    alignSelf: 'center',
  },
});

export default class IntroScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  })

  onPressButton = () => this.props.navigation.navigate('ChooseDealerScreen')

  render() {
    return (
      <SafeAreaView style={styles.container} >
        <View style={styles.logoContainer} >
            <Image
              style={styles.logo}
              source={require('../assets/logo.png')}
            />
          </View>
          <FooterButton
            text="Выберите свой автоцентр"
            onPressButton={this.onPressButton}
          />
      </SafeAreaView>
    );
  }
}
