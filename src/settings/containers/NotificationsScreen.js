/* eslint-disable react-native/no-inline-styles */
import {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {ScrollView, Text, View} from 'native-base';

import * as NavigationService from '../../navigation/NavigationService';

// redux
import {connect} from 'react-redux';
import {actionGetNotifications} from '../actions';

// components
import TransitionView from '../../core/components/TransitionView';
import RNBounceable from '@freakycoder/react-native-bounceable';
import NotificationItem from '../components/NotificationItem';
import LogoLoader from '../../core/components/LogoLoader';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';
import {get} from 'lodash';
import {getDateFromTimestamp, dayMonthYearTime2} from '../../utils/date';

const mapStateToProps = ({settings, nav, profile}) => {
  return {
    nav,
    notifications: get(settings, 'notifications.data', []),
    login: profile.login,
  };
};

const mapDispatchToProps = {
  actionGetNotifications,
};

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
  const {url, type} = item;

  const supported = await Linking.canOpenURL(url);

  if (isValidUrl(url) && supported) {
    return await Linking.openURL(url);
  } else {
    // URL is not valid, do something else
    switch (get(type, 'id')) {
      case 2: // акция
        return NavigationService.navigate('InfoPostScreen', {id: url});
      case 1: // общее
      case 3: // новости
      case 4: // ТВА
      default:
        break;
    }
  }
  return;
};

const NotificationsScreen = props => {
  const {notifications, login: userData, navigation} = props;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    Analytics.logEvent('screen', 'notifications');
    setLoading(true);
    props
      .actionGetNotifications({userID: get(userData, 'SAP.ID', null)})
      .then(() => {
        setLoading(false);
        if (get(notifications, 'length')) {
          setTimeout(() => {
            navigation.setParams({
              notificationsCount: get(notifications, 'length'),
            });
          }, 500);
        }
      });
  }, []);

  if (isLoading) {
    return (
      <LogoLoader
        style={{
          position: 'relative',
        }}
      />
    );
  }

  if (!get(notifications, 'length')) {
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
        {notifications.map((item, index) => {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsScreen);
