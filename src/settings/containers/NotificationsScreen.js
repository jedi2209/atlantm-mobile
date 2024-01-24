/* eslint-disable react-native/no-inline-styles */
import {PureComponent, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Text,
  Icon,
  Button,
  Box,
  Pressable,
  View,
  Divider,
  HStack,
  VStack,
  useToast,
  Heading,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import * as NavigationService from '../../navigation/NavigationService';
import LinearGradient from 'react-native-linear-gradient';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Imager from '../../core/components/Imager';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe} from '../../core/actions';

// components
import PushNotifications from '../../core/components/PushNotifications';
import RateThisApp from '../../core/components/RateThisApp';
import FlagButton from '../../core/components/FlagButton';
import TransitionView from '../../core/components/TransitionView';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';
import {APP_EMAIL, APP_REGION, STORE_LINK} from '../../core/const';
import {strings} from '../../core/lang/const';
import ToastAlert from '../../core/components/ToastAlert';
import NotificationItem from '../components/NotificationItem';

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  VersionContainer: {
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  TextVersionInfo: {
    fontSize: 12,
    fontFamily: styleConst.font.light,
    color: styleConst.color.lightBlue,
  },
  block: {
    marginVertical: 10,
    marginLeft: 10,
  },
  langHeading: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
  },
  pushHeading: {
    fontSize: 16,
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
  },
  pushText: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.light,
  },
  pushButton: {
    borderColor: styleConst.color.white,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 0,
  },
  userAgreementText: {
    fontSize: 12,
    fontFamily: styleConst.font.light,
    color: styleConst.color.lightBlue,
  },
  badgeService: {
    color: '#FFFFFF',
    background: '#FB4D3D',
  },
  badgeCars: {
    color: '#FFFFFF',
    background: '#7765E3',
  },
});

const mapStateToProps = ({dealer, nav, core}) => {
  return {
    nav,
    region: dealer.region,
    pushActionSubscribeState: core.pushActionSubscribeState,
    currentLang: core.language.selected || APP_REGION,
  };
};

const mapDispatchToProps = {
  actionSetPushActionSubscribe,
};

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;
const imgHeight = 200;

const NotificationsScreen = props => {
  const {region, pushActionSubscribeState, navigation} = props;

  const toast = useToast();

  useEffect(() => {
    Analytics.logEvent('screen', 'notifications');
  }, []);

  const _onSwitchActionSubscribe = async value => {
    let title = strings.Notifications.success.titleSad,
      text = strings.Notifications.success.textPushSad,
      status = 'info';

    if (value) {
      PushNotifications.unsubscribeFromTopic('actions');
      const subscriptionStatus = await PushNotifications.subscribeToTopic(
        'actionsRegion',
        region,
      );
      if (subscriptionStatus) {
        props.actionSetPushActionSubscribe(true);
        title = strings.Notifications.success.title;
        text = strings.Notifications.success.textPush;
        status = 'success';
      } else {
        return false;
      }
    } else {
      PushNotifications.unsubscribeFromTopic('actionsRegion');
      PushNotifications.unsubscribeFromTopic('actions');
      props.actionSetPushActionSubscribe(false);
    }
    toast.show({
      render: ({id}) => {
        return (
          <ToastAlert
            id={id}
            description={text}
            status={status}
            title={title}
            duration={5000}
          />
        );
      },
    });
  };

  return (
    <ScrollView style={styleConst.safearea.default}>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={1}>
        <RNBounceable onPress={() => console.info('asd')}>
          <NotificationItem
            date={'13 дек. 2023, 11:20'}
            title={'Запишитесь на сервис через наше приложение!'}
            text={
              'Павел, добрый день!\nНапоминаем Вам про возможности записаться на сервис через наше мобильное приложение.'
            }
          />
        </RNBounceable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={2}>
        <RNBounceable onPress={() => console.info('asd')}>
          <NotificationItem
            date={'12 дек. 2023, 22:20'}
            title={'Давайте знакомиться выгодно!'}
            colorBackground="rgba(119, 101, 227, 0.1)"
            text={
              'Павел Сушкевич, самое время воспользоваться нашим акционным предложением! Ваш промокод “ЗИМА2023”, введите его и получите скидку 20%.'
            }
          />
        </RNBounceable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={3}>
        <RNBounceable onPress={() => console.info('asd')}>
          <NotificationItem
            date={'13 дек. 2023, 11:20'}
            title={'Запишитесь на сервис через наше приложение!'}
            text={
              'Павел, добрый день!\nНапоминаем Вам про возможности записаться на сервис через наше мобильное приложение.'
            }
          />
        </RNBounceable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={4}>
        <RNBounceable onPress={() => console.info('asd')}>
          <NotificationItem
            date={'12 дек. 2023, 22:20'}
            title={'Давайте знакомиться выгодно!'}
            colorBackground="rgba(119, 101, 227, 0.1)"
            text={
              'Павел Сушкевич, самое время воспользоваться нашим акционным предложением! Ваш промокод “ЗИМА2023”, введите его и получите скидку 20%.'
            }
          />
        </RNBounceable>
      </TransitionView>
    </ScrollView>
  );
};

NotificationsScreen.propTypes = {
  isMessageSending: PropTypes.bool,
  actionTvaMessageFill: PropTypes.func,
  actionTvaMessageSend: PropTypes.func,
  actionSetActiveTvaOrderId: PropTypes.func,
  message: PropTypes.string,
  results: PropTypes.object,
  activeOrderId: PropTypes.string,
};

NotificationsScreen.defaultProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsScreen);
