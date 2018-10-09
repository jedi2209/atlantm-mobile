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
  Button,
  StyleProvider,
} from 'native-base';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import test from '@catalog/test.js';

import SplashScreen from 'react-native-splash-screen';

import MapView from 'react-native-maps';

import DeviceInfo from 'react-native-device-info';

import ImagePicker from 'react-native-image-crop-picker';

import RNFetchBlob from 'rn-fetch-blob';

import RNAmplitude from 'react-native-amplitude-analytics';

import PushNotification from './src/core/components/PushNotifications';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.impl = new RNAmplitude('2716d7eebc63593e80e4fd172fc8b6f3');
  }

  componentDidMount() {
    setTimeout(() => {
      PushNotification.init({
        // fcmToken,
        // actionSetFCMToken,
        // actionSetPreviousFCMToken,
        onPushPermissionGranted: this.onPushPermissionGranted,
        onPushPermissionRejected: this.onPushPermissionRejected,
      });
    }, 1000);
  }

  componentWillUnmount() {
    PushNotification.notificationListener.remove();
    PushNotification.refreshTokenListener.remove();
  }

  onPushPermissionGranted = () => {
    console.log('permission granted');
    // this.props.actionSetPushGranted(true);
  }
  onPushPermissionRejected = () => {
    console.log('permission rejected');
    // const { actionSetPushActionSubscribe, actionSetPushGranted } = this.props;
    // actionSetPushActionSubscribe(false);
    // this.props.actionSetPushGranted(false);
  }

  render() {
    console.log('test', test());

    // console.log('this.impl', this.impl);

    this.impl.logEvent(`test:${Platform.OS}`);

    SplashScreen.hide();

    console.log('isTablet()', DeviceInfo.getBrand());

    console.log('RNFetchBlob', RNFetchBlob);

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.container}>
          <Button onPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true
            }).then(image => {
              console.log(image);
            });
          }}>
            <Text>Click Me!</Text>
          </Button>
          <Icon ios='ios-menu' android="md-menu" style={{fontSize: 20, color: 'red'}}/>
          <Text style={styles.welcome}>W111elcome to React Native!</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>
          <Text style={styles.instructions}>{instructions}</Text>
          <MapView
            style={styles.map}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
          </MapView>
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
  map: {
    height: 400,
    width: 400,
  },
});
