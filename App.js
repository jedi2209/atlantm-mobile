/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import getTheme from './native-base-theme/components';
import {
  Icon,
  StyleProvider,
} from 'native-base';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import test from '@catalog/test.js';

import SplashScreen from 'react-native-splash-screen';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    console.log('test', test());

    SplashScreen.hide();

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.container}>
        <Icon ios='ios-menu' android="md-menu" style={{fontSize: 20, color: 'red'}}/>
          <Text style={styles.welcome}>W111elcome to React Native!</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>
          <Text style={styles.instructions}>{instructions}</Text>
        </View>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
