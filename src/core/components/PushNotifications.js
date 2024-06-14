import {Platform, Alert, Linking, AppState} from 'react-native';

import {OneSignal} from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import {ONESIGNAL} from '../const';
import {actionSetPushActionSubscribe} from '../../core/actions';
import Analytics from '../../utils/amplitude-analytics';
import * as NavigationService from '../../navigation/NavigationService';
import {strings} from '../lang/const';

import {get} from 'lodash';

const bundle = DeviceInfo.getBundleId();

export default {
  async init() {
    OneSignal.initialize(ONESIGNAL);
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    //Method for handling notifications opened
    this.setNotificationOpenedHandler();
    //Method for handling notifications received while app in foreground
    this.setNotificationWillShowInForegroundHandler();

    OneSignal.Notifications.addEventListener(
      'permissionChange',
      this.permissionChange,
    );
  },

  permissionChange(observer) {
    if (!observer) {
      actionSetPushActionSubscribe(false);
    } else {
      actionSetPushActionSubscribe(true);
    }
  },

  onReceived(data) {
    console.info('Notification received: ', data);
    Analytics.logEvent('action', 'PushNotification/received', {
      id: data.notification.notificationId,
    });
  },

  onOpened(data) {
    let routeName;

    Analytics.logEvent('action', 'PushNotification/opened', {
      id: data.notification.notificationId,
    });

    const notif = data.notification.additionalData;

    const target = get(notif, 'target');
    // const actionDate = get(notif, 'action_date', null);
    const params = {};

    params.isPush = true;

    switch (target) {
      case 'tva':
        routeName = 'TvaResultsScreen';
        params.dealerId = get(notif, 'dealer', null);
        params.carNumber = get(notif, 'car_number', null);
        break;
      case 'action':
        routeName = 'InfoPostScreen';
        params.id = get(notif, 'action_id', null);
        break;
      case 'chat':
        routeName = 'ChatScreen';
        params.refresh = true;
        break;
      case 'screen':
        routeName = get(notif, 'screenName', get(notif, 'value'));
        break;
      default:
        break;
    }
    if (!routeName) return;
    return NavigationService.navigate(routeName, params);
  },

  setNotificationWillShowInForegroundHandler() {
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      notificationReceivedEvent => {
        notificationReceivedEvent.preventDefault();
        const appState = AppState.currentState;
        console.info(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.info('notification: ', notification);
        const data = notification.additionalData;
        console.info('additionalData: ', data);
        // Complete with null means don't show a notification.
        if (
          appState === 'active' &&
          data.target === 'chat' &&
          NavigationService.navigationRef.getCurrentRoute().name ===
            'ChatScreen'
        ) {
          return;
        }
        notificationReceivedEvent.getNotification().display();
      },
    );
  },

  setNotificationOpenedHandler() {
    OneSignal.Notifications.addEventListener('click', notification => {
      this.onOpened(notification);
    });
  },

  setExternalUserId(userID) {
    OneSignal.login(userID);
  },

  removeExternalUserId() {
    OneSignal.logout();
  },

  addTag(name, value = '') {
    OneSignal.User.addTag(name, value.toString());
  },

  async getUserID() {
    const res = await OneSignal.User.pushSubscription.getIdAsync();
    return res;
  },

  removeTag(name) {
    if (typeof name === 'object') {
      OneSignal.User.removeTags(name);
    } else if (typeof name === 'string') {
      OneSignal.User.removeTag(name);
    }
  },

  async subscribeToTopic(topic, id = '') {
    const isPermission = await this.checkPermission();
    if (isPermission) {
      this.unsubscribeFromTopic(topic);
      this.addTag(topic, id.toString());
    }
    return isPermission;
  },

  unsubscribeFromTopic(topic) {
    this.removeTag(topic);
  },

  setEmail(value) {
    OneSignal.User.addEmail(value);
  },

  async deviceState() {
    const deviceState = await OneSignal.Notifications.getPermissionAsync();
    return deviceState;
  },

  async checkPermissionIOS() {
    let permission = await OneSignal.Notifications.requestPermission();
    if (typeof permission === 'object') {
      permission = permission[0];
    }
    if (!permission) {
      setTimeout(() => {
        return Alert.alert(
          strings.Notifications.PushAlert.title,
          strings.Notifications.PushAlert.text,
          [
            {
              text: strings.Notifications.PushAlert.later,
              style: 'destructive',
            },
            {
              text: strings.Notifications.PushAlert.approve,
              onPress: () => {
                Linking.openURL('app-settings://notification/' + bundle);
              },
              style: 'cancel',
            },
          ],
        );
      }, 100);
      return false;
    }
  },

  async checkPermissionAndroid() {
    let permission = await OneSignal.Notifications.requestPermission(true);
    console.info('permission', permission);
    return permission;
  },

  async checkPermission() {
    const currPermission = this.deviceState();
    if (currPermission) return true;
    switch (Platform.OS) {
      case 'ios':
        return await this.checkPermissionIOS();
      case 'android':
        return await this.checkPermissionAndroid();
      default:
        return false;
    }
    // // Check push notification and OneSignal subscription statuses
    // const isPermission = this.deviceState();
    // const canRequestPermission =
    //   await OneSignal.Notifications.canRequestPermission();
    // if (isPermission) {
    //   return true;
    // } else if (canRequestPermission) {
    //   // OneSignal.InAppMessages.addTrigger('showPrompt', true);
    //   OneSignal.Notifications.requestPermission(true);
    // }
  },
};
