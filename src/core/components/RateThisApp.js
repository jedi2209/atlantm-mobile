import {Platform, Alert, Linking} from 'react-native';
import {strings} from '../lang/const';
import {STORE_LINK} from '../const';
// import {GooglePackageName} from '../../core/const';
// import Rate, {AndroidMarket} from 'react-native-rate';
// import InAppReview from 'react-native-in-app-review';

const RateThisApp = ({onSuccess}) => {
  let alert_buttons = {
    // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
    android: [
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          onSuccess && onSuccess();
        },
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.later,
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.rate,
        onPress: () => {
          Linking.openURL(STORE_LINK[Platform.OS]);
        },
      },
    ],
    ios: [
      {
        text: strings.RateThisApp.rate,
        onPress: () => {
          Linking.openURL(STORE_LINK[Platform.OS]);
        },
        style: 'default',
      },
      {
        text: strings.RateThisApp.later,
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          return onSuccess && onSuccess();
        },
        style: 'destructive',
      },
    ],
  };

  Alert.alert(
    strings.RateThisApp.title,
    strings.RateThisApp.text,
    alert_buttons[Platform.OS],
    {
      cancelable: false,
    },
  );
};

export default RateThisApp;
