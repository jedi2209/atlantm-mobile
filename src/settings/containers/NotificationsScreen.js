/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { ScrollView, Text, View } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';

import * as NavigationService from '../../navigation/NavigationService';

// redux
import { actionGetNotifications } from '../actions';

// components
import TransitionView from '../../core/components/TransitionView';
import RNBounceable from '@freakycoder/react-native-bounceable';
import NotificationItem from '../components/NotificationItem';
import LogoLoader from '../../core/components/LogoLoader';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';
import { get } from 'lodash';
import { getDateFromTimestamp, dayMonthYearTime2 } from '../../utils/date';

const types = {
  1: 'rgba(251, 77, 61, 0.1)', // общее
  2: 'rgba(119, 101, 227, 0.1)', // акции
  3: 'rgba(251, 77, 61, 0.1)', // новости
  4: 'rgba(100, 227, 127, 0.1)', // ТВА
};

const imageBackgrounds = {
  1: require('../../../assets/notifications/palette1.png'),
  2: require('../../../assets/notifications/palette2.png'),
  3: require('../../../assets/notifications/palette3.png'),
  4: require('../../../assets/notifications/palette4.png'),
  5: require('../../../assets/notifications/palette5.png'),
};

const isValidUrl = str => {
  const pattern = new RegExp(
    '^([a-zA-Z]+:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i',
  );
  return pattern.test(str);
};

const parseURL = async item => {
  const { url, type } = item;

  let supported = false;

  if (!url) {
    return;
  }

  if (url.startsWith('screen:')) {
    const urlArr = url.split(':');
    if (urlArr.length >= 2) {
      if (urlArr[1] === 'NotificationsScreen') {
        return;
      }
      return NavigationService.navigate(urlArr[1]);
    }
  }

  if (isNaN(url)) {
    supported = await Linking.canOpenURL(url);
  }

  if (isValidUrl(url) && supported) {
    return await Linking.openURL(url);
  } else {
    // URL is not valid, do something else
    switch (get(type, 'id')) {
      case 2: // акция
        return NavigationService.navigate('InfoPostScreen', { id: url });
      case 1: // общее
      case 3: // новости
      case 4: // ТВА
      default:
        break;
    }
  }
  return;
};

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const login = useSelector(state => state.profile.login);

  const [loading, setLoading] = useState(false);
  const [notificationsAll, setNotificationsAll] = useState([]);

  useEffect(() => {
    Analytics.logEvent('screen', 'notifications');
    const res = async () => {
      setLoading(true);
      const result = await dispatch(actionGetNotifications({ userID: get(login, 'SAP.ID', null) }));
      setNotificationsAll(result?.all);
      setLoading(false);
    };
    res();
  }, [login]);

  if (loading) {
    return (
      <LogoLoader
        style={{
          position: 'relative',
        }}
      />
    );
  }

  if (!get(notificationsAll, 'length')) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Нет уведомлений</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styleConst.safearea.default}>
      <View pb={10}>
        {notificationsAll.map((item, index) => {
          return (
            <TransitionView
              animation={styleConst.animation.zoomIn}
              duration={250}
              key={'notification-' + item.id}
              index={index}>
              <RNBounceable onPress={() => parseURL(item)}>
                <NotificationItem
                  date={dayMonthYearTime2(
                    getDateFromTimestamp(item.date.timestamp),
                  )}
                  title={item.title}
                  text={item.text}
                  colorBackground={types[get(item, 'type.id', 2)]}
                  borderBackgroundSource={
                    imageBackgrounds[get(item, 'type.id', 2)]
                  }
                />
              </RNBounceable>
            </TransitionView>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default NotificationsScreen;
