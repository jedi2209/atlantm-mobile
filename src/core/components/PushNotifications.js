import {Platform, PermissionsAndroid, Alert, Linking, AppState} from 'react-native';

import OneSignal from 'react-native-onesignal';
import {ONESIGNAL} from '../const';
import Analytics from '../../utils/amplitude-analytics';
import * as NavigationService from '../../navigation/NavigationService';

// import notifee from '@notifee/react-native';
import {get} from 'lodash';

// const isAndroid = Platform.OS === 'android';

export default {
  init() {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(ONESIGNAL);
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    //Method for handling notifications opened
    this.setNotificationOpenedHandler();
    //Method for handling notifications received while app in foreground
    this.setNotificationWillShowInForegroundHandler();

    OneSignal.addPermissionObserver(event => {
      console.info("OneSignal: permission changed:", event);
    });
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
    const dealer = get(notif, 'dealer', null);
    const carNumber = get(notif, 'car_number', null);
    const actionId = get(notif, 'action_id', null);
    const actionDate = get(notif, 'action_date', null);
    const params = {};

    params.isPush = true;

    switch (target) {
      case 'tva':
        routeName = 'TvaResultsScreen';
        params.dealerId = dealer;
        params.carNumber = carNumber;
        break;
      case 'action':
        routeName = 'InfoPostScreen';
        params.id = actionId;
        break;
      case 'chat':
        routeName = 'ChatScreen';
        params.refresh = true;
      default:
        break;
    }
    if (!routeName) return;
    return NavigationService.navigate(routeName, params);
  },

  setNotificationWillShowInForegroundHandler() {
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      const appState = AppState.currentState;
      console.info("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.info("notification: ", notification);
      const data = notification.additionalData
      console.info("additionalData: ", data);
      // Complete with null means don't show a notification.
      if (appState === 'active' && data.target === 'chat') {
        notification = null;
      }
      notificationReceivedEvent.complete(notification);
    });
  },

  setNotificationOpenedHandler() {
    OneSignal.setNotificationOpenedHandler(notification => {
      this.onOpened(notification);
    });
  },

  setExternalUserId(userID) {
    OneSignal.setExternalUserId(userID);
  },

  removeExternalUserId() {
    OneSignal.removeExternalUserId();
  },

  addTag(name, value) {
    OneSignal.sendTag(name, value.toString());
  },

  removeTag(name) {
    OneSignal.deleteTag(name);
  },

  async subscribeToTopic(topic, id) {
    const isPermission = await this.checkPermission();
    if (isPermission) {
      OneSignal.disablePush(false);
      OneSignal.sendTag(topic, id.toString());
    }
    return isPermission;
  },

  unsubscribeFromTopic(topic) {
    OneSignal.deleteTag(topic);
  },

  setEmail(value) {
    OneSignal.setEmail(value);
  },

  async deviceState() {
    return await OneSignal.getDeviceState();
  },

  checkPermission() {
    return new Promise((resolve, reject) => {
      // Check push notification and OneSignal subscription statuses
      // OneSignal.promptForPushNotificationsWithUserResponse();
      this.deviceState().then(deviceState => {
        if (deviceState.isSubscribed == false) {
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
                      onPress: () => {
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
        return resolve(true);
      });
    });
  },

  // async showLocalMessage({title, message, category}) {
  //   if (!category) {
  //     category = 'onlineChat';
  //   }
  //   const channelId = await notifee.createChannel({
  //     id: category,
  //     name: 'Онлайн-чат',
  //   });

  //   await notifee.displayNotification({
  //     title,
  //     body: message,
  //     android: {
  //       channelId,
  //       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //     },
  //     ios: {
  //       categoryId: category,
  //     },
  //   });
  // },
};
