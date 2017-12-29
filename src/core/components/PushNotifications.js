import { Platform } from 'react-native';

import { NavigationActions } from 'react-navigation';

import FCM, {
  FCMEvent,
  NotificationType,
  RemoteNotificationResult,
  WillPresentNotificationResult,
} from 'react-native-fcm';

import { get } from 'lodash';

export default {
  init({ fcmToken, actionSetFCMToken }) {
    FCM.requestPermissions()
      .then(this.onPushPermissionGranted)
      .catch(this.onPushPermissionRejected);

    FCM.getFCMToken().then(token => actionSetFCMToken(token || null));

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      console.log('refresh FCM token', token);
      this.props.actionSetPreviousFCMToken(fcmToken);
      this.props.actionSetFCMToken(token);
    });

    FCM.getInitialNotification().then((notif) => {
      console.log('getInitialNotification', notif);

      this.openScreen(notif);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      const title = get(notif, 'fcm.title');
      const body = get(notif, 'fcm.body');
      const icon = get(notif, 'fcm.icon');
      const color = get(notif, 'fcm.color');

      const target = get(notif, 'target');

      const dealer = get(notif, 'dealer');
      const carNumber = get(notif, 'car_number');
      const actionId = get(notif, 'action_id');
      const actionDate = get(notif, 'action_date', {});

      console.log('FCMEvent.Notification', notif);

      if (Platform.OS === 'android' && !notif.local_notification) {
        this.sendLocalNotification({
          title,
          body,
          icon,
          color,

          target,
          carNumber,
          dealer,
          actionId,
          actionDate,
        });
      }

      if (notif.opened_from_tray) {
        this.openScreen(notif);
      }

      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            console.log('type Remote');
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            console.log('type NotificationResponse');
            notif.finish();
            break;
          case NotificationType.WillPresent:
            console.log('type WillPresent');
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
      }
    });
  },

  sendLocalNotification({
    title,
    body,
    icon,
    color,

    target,
    carNumber,
    dealer,
    actionId,
    actionDate,
  }) {
    FCM.presentLocalNotification({
      target,
      car_number: carNumber,
      action_id: actionId,
      action_date: actionDate,
      dealer,
      icon,
      color,
      title,  // as FCM payload
      body, // as FCM payload (required)
      sound: 'default',                // as FCM payload
      priority: 'high',                // as FCM payload
      badge: 0,                        // as FCM payload IOS only, set 0 to clear badges
      number: 1,                       // Android only
      lights: true,                    // Android only, LED blinking (default false)
      show_in_foreground: true,        // notification when app is in foreground (local & remote)
    });
  },

  subscribeToTopic({ id }) {
    console.log('subscribeToTopic', id);
    const topic = `actions_${id}`;
    FCM.subscribeToTopic(topic);
  },

  unsubscribeFromTopic({ id }) {
    console.log('unsubscribeFromTopic', id);
    const topic = `actions_${id}`;
    FCM.unsubscribeFromTopic(topic);
  },

  openScreen(notif) {
    let routeName;
    const target = get(notif, 'target');

    const dealer = get(notif, 'dealer');
    const carNumber = get(notif, 'car_number');
    const actionId = get(notif, 'action_id');
    const actionDate = get(notif, 'action_date', {});
    const params = {};

    if (target === 'tva') {
      routeName = 'Tva2Screen';
      params.isPush = true;
      params.dealerId = dealer;
      params.carNumber = carNumber;
    }

    if (target === 'action') {
      routeName = 'InfoListScreen';
      params.isPush = true;
      params.id = actionId;
      try {
        params.date = JSON.parse(actionDate);
      } catch (e) {
        console.log('не получилось распарсить json date для акции');
      }
    }

    if (!routeName) return;

    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName, params }),
      ],
    });

    window.atlantmNavigation.dispatch(resetAction);

    if (target === 'action') {
      setTimeout(() => window.atlantmNavigation.navigate('InfoPostScreen', params), 200);
    }
  },
};
