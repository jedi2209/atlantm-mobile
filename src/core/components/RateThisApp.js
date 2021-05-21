import React from 'react';
import {Platform, Alert} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
import {strings} from '../../core/lang/const';
import {AppleAppID, GooglePackageName} from '../../core/const';

const RateThisApp = (props) => {
  let alert_buttons = { // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
    android: [
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          props.onSuccess && props.onSuccess();
        },
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.later,
        onPress: () => {
          props.onAskLater && props.onAskLater();
        },
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.rate,
        onPress: () => {
          Rate.rate({
            GooglePackageName: GooglePackageName,
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
          }, (success) => {
            if (success) {
              props.onSuccess && props.onSuccess();
            } else {
              props.onAskLater && props.onAskLater();
            }
          });
        },
      },
    ],
    ios: [
      {
        text: strings.RateThisApp.rate,
        onPress: () => {
          return Rate.rate({
            AppleAppID: AppleAppID,
            preferInApp: true,
            inAppDelay: 1.0,
          }, (success) => {
            if (success) {
              props.onSuccess && props.onSuccess();
            } else {
              props.onAskLater && props.onAskLater();
            }
          });
        },
        style: 'default',
      },
      {
        text: strings.RateThisApp.later,
        onPress: () => {
          return props.onAskLater && props.onAskLater();
        },
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          return props.onSuccess && props.onSuccess();
        },
        style: 'destructive',
      },
    ],
  };

  if (props.show) {
    Alert.alert(
      strings.RateThisApp.title,
      strings.RateThisApp.text,
      alert_buttons[Platform.OS],
      {
        cancelable: false
      },
    );
  }
  return (<></>);
}

export default RateThisApp;
