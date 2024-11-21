import {Platform, Alert, Linking} from 'react-native';
import {strings} from '../lang/const';
import {STORE_LINK} from '../const';
// import * as StoreReview from 'react-native-store-review';
// import {GooglePackageName} from '../../core/const';
// import Rate, {AndroidMarket} from 'react-native-rate';
import InAppReview from 'react-native-in-app-review';

const rateInApp = onSuccess => {
  if (!InAppReview.isAvailable()) {
    Linking.openURL(STORE_LINK[Platform.OS]);
    onSuccess && onSuccess();
    return;
  }
  InAppReview.RequestInAppReview()
  .then((hasFlowFinishedSuccessfully) => {
      if (hasFlowFinishedSuccessfully) {
          onSuccess && onSuccess();
      }
  })
  .catch((error) => {
      console.log('InAppReview.RequestInAppReview ERROR', error);
  });
};

const RateThisApp = ({onSuccess, navigation}) => {
  let alert_buttons = {
    // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
    android: [
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          navigation.navigate('FeedbackScreen');
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
        onPress: () => rateInApp(onSuccess),
      },
    ],
    ios: [
      {
        text: strings.RateThisApp.rate,
        onPress: () => rateInApp(onSuccess),
        style: 'default',
      },
      {
        text: strings.RateThisApp.later,
        style: 'cancel',
      },
      {
        text: strings.RateThisApp.no,
        onPress: () => {
          navigation.navigate('FeedbackScreen');
          onSuccess && onSuccess();
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
