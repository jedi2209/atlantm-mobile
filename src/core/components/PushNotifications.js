import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

import { NavigationActions } from 'react-navigation';
import OneSignal from 'react-native-onesignal';

import { get } from 'lodash';
import {actionSetPushGranted} from "../actions";

const isAndroid = Platform.OS === 'android';

export default {
    init({
    fcmToken,
    actionSetFCMToken,
    onPushPermissionGranted,
    onPushPermissionRejected,
    actionSetPreviousFCMToken,
  }){
        OneSignal.init('XXXX', {
            kOSSettingsKeyAutoPrompt: true,
            kOSSettingsKeyInFocusDisplayOption: 2
        });

        OneSignal.setLogLevel(6, 0);
        OneSignal.setSubscription(true);
        OneSignal.enableSound(true);
        OneSignal.enableVibrate(true);

        OneSignal.getPermissionSubscriptionState((response) => {
            if (response.notificationsEnabled === true) {
                onPushPermissionGranted();
                actionSetPushGranted(true);
            } else {
                onPushPermissionRejected();
                actionSetPushGranted(false);
            }
            console.log('Received permission subscription state: ', response);
        });

        // OneSignal.checkPermissions(permissions => console.log(permissions));

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    },

    onReceived(notification) {
        console.log("Notification received: ", notification);
    },

    onOpened(openResult) {
        let routeName;
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
            routeName = 'Tva2Screen';
            params.isPush = true;
            params.dealerId = dealer;
            params.carNumber = carNumber;
        }
        if (target === 'action') {
            routeName = 'InfoListScreen';
            params.isPush = true;
            params.id = actionId;
            params.date = actionDate;
        }
        if (!routeName) return;

        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({routeName, params}),
            ],
        });

        window.atlantmNavigation.dispatch(resetAction);

        if (target === 'action') {
            setTimeout(() => window.atlantmNavigation.navigate('InfoPostScreen', params), 200);
        }
    },

    onIds(device) {
        console.log('Device info: ', device);
    },

    addTag(name, value) {
        console.log('addTag', name);
        console.log('addTag', value);
        OneSignal.sendTag(name, value.toString());
    },

    removeTag(name) {
        console.log('removeTag', name);
        OneSignal.deleteTag(name);
    },

    subscribeToTopic({ id }) {
        const topic = `actions_${id}`;
        console.log('subscribeToTopic', topic);
        OneSignal.setSubscription(true);
        OneSignal.sendTag("topic", topic);
    },

    unsubscribeFromTopic({ id }) {
        const topic = `actions_${id}`;
        console.log('unsubscribeFromTopic', topic);
        OneSignal.setSubscription(false);
        OneSignal.deleteTag("topic");
    },

    checkPermission() {

        async function requestNotificationsAndroidPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.NOTIFICATIONS,
                    {
                        'title': 'Cool Push Permission',
                        'message': 'Cool Push needs access to your push-service ' +
                        'so you can take awesome pictures.'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the camera");
                } else {
                    console.log("Camera permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        }

        // Check push notification and OneSignal subscription statuses
        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.notificationsEnabled === true) {
                //onPushPermissionGranted();
                //actionSetPushGranted(true);
                return true;
            } else {
                //actionSetPushGranted(false);
                //onPushPermissionRejected();
                switch (Platform.OS) {
                    case 'ios':
                        setTimeout(() => {
                            return Alert.alert(
                                'Уведомления выключены',
                                'Необходимо разрешить получение push-уведомлений для приложения Атлант-М в настройках',
                                [
                                    {text: 'Ок', style: 'cancel'},
                                    {
                                        text: 'Настройки',
                                        onPress() {
                                            Linking.openURL('app-settings://notification/com.atlant-m');
                                        },
                                    },
                                ],
                            );
                        }, 100);
                        break;

                    case 'android':
                        requestNotificationsAndroidPermission();
                    break;
                }
            }
        });
    },
}

// export default {
//   init({
//     fcmToken,
//     actionSetFCMToken,
//     onPushPermissionGranted,
//     onPushPermissionRejected,
//     actionSetPreviousFCMToken,
//   }){
//       firebase.messaging().hasPermission()
//           .then(enabled => {
//               if (enabled) {
//                   firebase.messaging().getToken().then(token => {
//                       console.log('token', token);
//                       actionSetFCMToken(token);
//                       onPushPermissionGranted();
//                   });
//               } else {
//                   try {
//                       firebase.messaging().requestPermission();
//                       firebase.messaging().getToken().then(token => {
//                           console.log('token', token);
//                           actionSetFCMToken(token);
//                           onPushPermissionGranted();
//                       });
//                   } catch (error) {
//                       console.log('не получили token');
//                       actionSetFCMToken(null);
//                       onPushPermissionRejected();
//                   }
//               }
//           });
//
//     this.refreshTokenListener = firebase.messaging().onTokenRefresh(token => {
//       actionSetPreviousFCMToken(fcmToken);
//       actionSetFCMToken(token);
//     });
//
//     // FCM.getInitialNotification().then((notif) => {
//     //   console.log('getInitialNotification', notif);
//     //
//     //   this.openScreen(notif);
//     // });
//
//       this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
//           // Get the action triggered by the notification being opened
//           const action = notificationOpen.action;
//           // Get information about the notification that was opened
//           const notification: Notification = notificationOpen.notification;
//       });
//
//       this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
//           // Process your notification as required
//           // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
//           console.log('notification1', notification);
//       });
//       this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
//           // Process your notification as required
//           console.log('notification2', notification);
//       });
//
//     // this.notificationListener = firebase.notifications().onNotification((notif: Notification) => {
//     //     console.log('notif', notif);
//     //   const title = get(notif, 'fcm.title');
//     //   const body = get(notif, 'fcm.body');
//     //   const icon = get(notif, 'fcm.icon');
//     //   const channel = get(notif, 'fcm.channel');
//     //   const color = get(notif, 'fcm.color');
//     //   const vibrate = get(notif, 'fcm.vibrate');
//     //
//     //   const target = get(notif, 'target');
//     //
//     //   const dealer = get(notif, 'dealer');
//     //   const carNumber = get(notif, 'car_number');
//     //   const actionId = get(notif, 'action_id');
//     //   const actionDate = get(notif, 'action_date', {});
//     //
//     //   console.log('FCM.messaging().onMessage', notif);
//     //
//     //   if (Platform.OS === 'android' && !notif.local_notification) {
//     //     this.sendLocalNotification({
//     //       title,
//     //       body,
//     //       icon,
//     //       color,
//     //       vibrate,
//     //
//     //       target,
//     //       carNumber,
//     //       dealer,
//     //       actionId,
//     //       actionDate,
//     //     });
//     //   }
//     //
//     //   if (notif.opened_from_tray) {
//     //     this.openScreen(notif);
//     //   }
//     //
//     //   if (Platform.OS === 'ios') {
//     //     switch (notif._notificationType) {
//     //     case NotificationType.Remote:
//     //       console.log('type Remote');
//     //       notif.finish(RemoteNotificationResult.NewData);
//     //       break;
//     //     case NotificationType.NotificationResponse:
//     //       console.log('type NotificationResponse');
//     //       notif.finish();
//     //       break;
//     //     case NotificationType.WillPresent:
//     //       console.log('type WillPresent');
//     //       notif.finish(WillPresentNotificationResult.All);
//     //       break;
//     //     }
//     //   }
//     // });
//   },
//
//   sendLocalNotification({
//     title,
//     body,
//     icon,
//     channel,
//     color,
//     vibrate,
//
//     target,
//     carNumber,
//     dealer,
//     actionId,
//     actionDate,
//   }) {
//     //   firebase.messaging().createLocalNotification({
//     //   target,
//     //   car_number: carNumber,
//     //   action_id: actionId,
//     //   action_date: actionDate,
//     //   channel: channel,
//     //   dealer,
//     //   icon,
//     //   color,
//     //   title,  // as FCM payload
//     //   body, // as FCM payload (required)
//     //   sound: 'default',                // as FCM payload
//     //   priority: 'high',                // as FCM payload
//     //   badge: 0,                        // as FCM payload IOS only, set 0 to clear badges
//     //   number: 1,                       // Android only
//     //   lights: true,                    // Android only, LED blinking (default false)
//     //   show_in_foreground: true,        // notification when app is in foreground (local & remote)
//     //   vibrate: vibrate || 500,
//     //   wake_screen: true, // Android only
//     // });
//   },
//
//   // createNotificationChannel({ id }) {
//   //     const channel = new firebase.notifications.Android.Channel(
//   //         id,
//   //         'Default',
//   //         firebase.notifications.Android.Importance.High
//   //     ).setDescription("used for example");
//   //     firebase.notifications.Android.createChannel(channel);
//   // },
//
//   // openScreen(notif) {
//   //   let routeName;
//   //   const target = get(notif, 'target');
//   //
//   //   const dealer = get(notif, 'dealer');
//   //   const carNumber = get(notif, 'car_number');
//   //   const actionId = get(notif, 'action_id');
//   //   const actionDate = get(notif, 'action_date', {});
//   //   const params = {};
//   //
//   //   if (target === 'tva') {
//   //     routeName = 'Tva2Screen';
//   //     params.isPush = true;
//   //     params.dealerId = dealer;
//   //     params.carNumber = carNumber;
//   //   }
//   //
//   //   if (target === 'action') {
//   //     routeName = 'InfoListScreen';
//   //     params.isPush = true;
//   //     params.id = actionId;
//   //     try {
//   //       params.date = JSON.parse(actionDate);
//   //     } catch (e) {
//   //       console.log('не получилось распарсить json date для акции');
//   //     }
//   //   }
//   //
//   //   if (!routeName) return;
//   //
//   //   const resetAction = NavigationActions.reset({
//   //     index: 0,
//   //     key: null,
//   //     actions: [
//   //       NavigationActions.navigate({ routeName, params }),
//   //     ],
//   //   });
//   //
//   //   window.atlantmNavigation.dispatch(resetAction);
//   //
//   //   if (target === 'action') {
//   //     setTimeout(() => window.atlantmNavigation.navigate('InfoPostScreen', params), 200);
//   //   }
//   // },
// };
