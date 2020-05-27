import {Platform, PermissionsAndroid, Alert, Linking} from 'react-native';

import {NavigationActions, StackActions} from 'react-navigation';
import OneSignal from 'react-native-onesignal';
import Amplitude from '../../utils/amplitude-analytics';

import {get} from 'lodash';

// const isAndroid = Platform.OS === 'android';

export default {
  init() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  },

  onReceived(notification) {
    console.log('Notification received: ', notification);
    Amplitude.logEvent('action', 'PushNotification/received', {
      id: notification.payload.notificationID,
    });
  },

  onOpened(openResult, listener) {
    let routeName;

    Amplitude.logEvent('action', 'PushNotification/opened', {
      id: openResult.notification.payload.notificationID,
    });

    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    const notif = openResult.notification.payload.additionalData;

    const target = get(notif, 'target');
    const dealer = get(notif, 'dealer');
    const carNumber = get(notif, 'car_number');
    const actionId = get(notif, 'action_id');
    const actionDate = get(notif, 'action_date', {});
    const params = {};

    if (target === 'tva') {
      routeName = 'TvaResultsScreen';
      params.isPush = true;
      params.dealerId = dealer;
      params.carNumber = carNumber;
    }
    if (target === 'action') {
      routeName = 'InfoList';
      params.isPush = true;
      params.id = actionId;
      params.date = actionDate;
    }
    if (!routeName) return;

    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({routeName, params})],
    // });

    // window.atlantmNavigation.dispatch(resetAction);

    if (target === 'action') {
      setTimeout(
        () => window.atlantmNavigation.navigate('InfoPostScreen', params),
        200,
      );
    }
  },

  setExternalUserId(userID) {
    OneSignal.setExternalUserId(userID);
  },

  removeExternalUserId() {
    OneSignal.removeExternalUserId();
  },

  onIds(device) {
    console.log('Device info: ', device);
  },

  addTag(name, value) {
    console.log('addTag name:', name);
    console.log('addTag value:', value);
    OneSignal.sendTag(name, value.toString());
  },

  removeTag(name) {
    console.log('removeTag', name);
    OneSignal.deleteTag(name);
  },

  subscribeToTopic(topic, id) {
    return this.checkPermission().then(isPermission => {
      if (isPermission) {
        OneSignal.setSubscription(true);
        OneSignal.sendTag(topic, id.toString());
      }
      return isPermission;
    });
  },

  unsubscribeFromTopic(topic) {
    OneSignal.deleteTag(topic);
  },

  setEmail(value) {
    //OneSignal.setEmail(value);
  },

  // logoutEmail() {
  //     OneSignal.logoutEmail();
  // },

  checkPermission() {
    return new Promise(function(resolve, reject) {
      // Check push notification and OneSignal subscription statuses
      OneSignal.getPermissionSubscriptionState(status => {
        if (status.notificationsEnabled) {
          return resolve(true);
        } else {
          switch (Platform.OS) {
            case 'ios':
              setTimeout(() => {
                return Alert.alert(
                  'Уведомления выключены',
                  'Необходимо разрешить получение push-уведомлений для приложения Атлант-М в настройках',
                  [
                    {text: 'Позже', style: 'destructive'},
                    {
                      text: 'Разрешить',
                      onPress() {
                        Linking.openURL(
                          'app-settings://notification/com.atlantm.app',
                        );
                      },
                      style: 'cancel',
                    },
                  ],
                );
              }, 100);
              break;
          }
          return resolve(false);
        }
      });
    });
  },
};