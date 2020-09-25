import React, {Component} from 'react';
import {
  Platform,
  View,
  Button,
  Modal,
  Text,
  TouchableHighlight,
  Alert,
} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';

export default class RateThisApp extends React.Component {
  render() {
    let alert_buttons;
    alert_buttons = [];

    switch (Platform.OS) {
      case 'android': // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
        alert_buttons = [
          {
            text: 'Нет, спасибо',
            onPress: () => {
              this.props.onSuccess && this.props.onSuccess();
            },
            style: 'cancel',
          },
          {
            text: 'Не сейчас',
            onPress: () => {
              this.props.onAskLater && this.props.onAskLater();
            },
            style: 'cancel',
          },
          {
            text: 'Оценить',
            onPress: () => {
              let options = {
                AppleAppID: 'XXXX',
                GooglePackageName: 'com.atlantm',
                preferredAndroidMarket: AndroidMarket.Google,
                preferInApp: true,
                openAppStoreIfInAppFails: true,
                inAppDelay: 2.0,
              };

              Rate.rate(options, (success) => {
                console.log('Rate success', success);
                if (success) {
                  console.log(
                    'Rate this.props.onSuccess',
                    this.props.onSuccess,
                  );
                  this.props.onSuccess && this.props.onSuccess();
                } else {
                  console.log(
                    'Rate this.props.onAskLater',
                    this.props.onAskLater,
                  );
                  this.props.onAskLater && this.props.onAskLater();
                }
              });
            },
          },
        ];
        break;
      case 'ios':
        alert_buttons = [
          {
            text: 'Оценить',
            onPress: () => {
              let options = {
                AppleAppID: 'XXXX',
                GooglePackageName: 'com.atlantm',
                preferredAndroidMarket: AndroidMarket.Google,
                preferInApp: true,
                openAppStoreIfInAppFails: true,
                inAppDelay: 2.0,
              };

              Rate.rate(options, (success) => {
                console.log('Rate success', success);
                if (success) {
                  console.log(
                    'Rate this.props.onSuccess',
                    this.props.onSuccess,
                  );
                  this.props.onSuccess && this.props.onSuccess();
                } else {
                  console.log(
                    'Rate this.props.onAskLater',
                    this.props.onAskLater,
                  );
                  this.props.onAskLater && this.props.onAskLater();
                }
              });
            },
          },
          {
            text: 'Не сейчас',
            onPress: () => {
              this.props.onAskLater && this.props.onAskLater();
            },
            style: 'cancel',
          },
          {
            text: 'Нет, спасибо',
            onPress: () => {
              this.props.onSuccess && this.props.onSuccess();
            },
            style: 'cancel',
          },
        ];
    }

    Alert.alert(
      'Нравится приложение?',
      'Расскажи миру о своём опыте и оставь свой отзыв!',
      alert_buttons,
      {cancelable: false},
    );

    return null;
  }
}
