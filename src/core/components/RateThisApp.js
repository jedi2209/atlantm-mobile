import {PureComponent} from 'react';
import {Platform, Alert} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
import {strings} from '../../core/lang/const';
import {AppleAppID, GooglePackageName} from '../../core/const';

export default class RateThisApp extends PureComponent {
  render() {
    let alert_buttons;
    alert_buttons = [];

    switch (Platform.OS) {
      case 'android': // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
        alert_buttons = [
          {
            text: strings.RateThisApp.no,
            onPress: () => {
              this.props.onSuccess && this.props.onSuccess();
            },
            style: 'cancel',
          },
          {
            text: strings.RateThisApp.later,
            onPress: () => {
              this.props.onAskLater && this.props.onAskLater();
            },
            style: 'cancel',
          },
          {
            text: strings.RateThisApp.rate,
            onPress: () => {
              let options = {
                GooglePackageName: GooglePackageName,
                preferredAndroidMarket: AndroidMarket.Google,
                preferInApp: true,
              };

              Rate.rate(options, (success) => {
                if (success) {
                  this.props.onSuccess && this.props.onSuccess();
                } else {
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
            text: strings.RateThisApp.rate,
            onPress: () => {
              let options = {
                AppleAppID: AppleAppID,
                preferInApp: true,
                inAppDelay: 1.0,
              };

              Rate.rate(options, (success) => {
                if (success) {
                  this.props.onSuccess && this.props.onSuccess();
                } else {
                  this.props.onAskLater && this.props.onAskLater();
                }
              });
            },
            style: 'default',
          },
          {
            text: strings.RateThisApp.later,
            onPress: () => {
              this.props.onAskLater && this.props.onAskLater();
            },
            style: 'cancel',
          },
          {
            text: strings.RateThisApp.no,
            onPress: () => {
              this.props.onSuccess && this.props.onSuccess();
            },
            style: 'destructive',
          },
        ];
    }

    Alert.alert(
      strings.RateThisApp.title,
      strings.RateThisApp.text,
      alert_buttons,
      {cancelable: false},
    );

    return null;
  }
}
