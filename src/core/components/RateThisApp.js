import {Platform, Alert, Linking} from 'react-native';
import {strings} from '../lang/const';
import {STORE_LINK} from '../const';
// import {GooglePackageName} from '../../core/const';
// import Rate, {AndroidMarket} from 'react-native-rate';
// import InAppReview from 'react-native-in-app-review';

const RateThisApp = ({onSuccess}) => {
  let alert_buttons = { // такое задротство из-за разного положения кнопок на iOS / Android. Нужно, чтобы кнопки были одинаково расположены
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
        onPress: () => { Linking.openURL(STORE_LINK[Platform.OS]);
            // if (!InAppReview.isAvailable()) {
            //     Linking.openURL(STORE_LINK[Platform.OS]);
            // } else {
            //     Rate.rate({
            //         GooglePackageName: GooglePackageName,
            //         preferredAndroidMarket: AndroidMarket.Google,
            //         preferInApp: true,
            //       },
            //       (success) => {
            //           if (success) {
            //               onSuccess && onSuccess();
            //             } else {
            //                 onAskLater && onAskLater();
            //             }
            //     });
            // }
        },
      },
    ],
    ios: [
      {
        text: strings.RateThisApp.rate,
        onPress: () => {
            Linking.openURL(STORE_LINK[Platform.OS]);
            // if (!InAppReview.isAvailable()) {
            //     Linking.openURL(STORE_LINK[Platform.OS]);
            // }
            // // Rate.rate({
            // //     AppleAppID: AppleAppID,
            // //     preferInApp: true,
            // //     inAppDelay: 1.0,
            // // }, (success) => {
            // //     // if (success) {
            // //     //   props.onSuccess && props.onSuccess();
            // //     // } else {
            // //     //   props.onAskLater && props.onAskLater();
            // //     // }
            // // });
            // InAppReview.RequestInAppReview()
            // .then((hasFlowFinishedSuccessfully) => {
            //     if (hasFlowFinishedSuccessfully) {
            //         onSuccess && onSuccess();
            //     }
            // })
            // .catch((error) => {
            //     console.log('InAppReview.RequestInAppReview ERROR', error);
            // });
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
        cancelable: false
      },
    );
}

export default RateThisApp;
