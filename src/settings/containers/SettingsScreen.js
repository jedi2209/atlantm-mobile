/* eslint-disable react-native/no-inline-styles */
import {PureComponent, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Text,
  Switch,
  Icon,
  Button,
  Box,
  Pressable,
  View,
  HStack,
  VStack,
  useToast,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import * as NavigationService from '../../navigation/NavigationService';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe, actionAppRated} from '../../core/actions';

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
  actionAppRated,
};

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;

const SettingsScreen = props => {
  const {
    region,
    pushActionSubscribeState,
    isAppRated,
    actionAppRated,
    actionSetPushActionSubscribe,
    navigation,
  } = props;

  const toast = useToast();

  useEffect(() => {
    Analytics.logEvent('screen', 'settings');
  }, []);

  const _onAppRateSuccess = () => {
    !isAppRated && actionAppRated();
  };

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
      actionSetPushActionSubscribe(subscriptionStatus);
      title = strings.Notifications.success.title;
      text = strings.Notifications.success.textPush;
      status = 'success';
    } else {
      PushNotifications.unsubscribeFromTopic('actionsRegion');
      PushNotifications.unsubscribeFromTopic('actions');
      actionSetPushActionSubscribe(value);
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
      <Text selectable={false} style={styleConst.text.bigHead}>
        {strings.Menu.main.settings}
      </Text>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={3}>
        <Box
          borderWidth="1"
          borderColor="coolGray.300"
          shadow="3"
          bg={styleConst.color.blue}
          p="5"
          rounded={'lg'}
          style={[styleConst.shadow.default, styles.block, {width: cardWidth}]}>
          <VStack
            space={3}
            justifyContent="space-between"
            alignItems="flex-start">
            <HStack>
              <View w={'3/4'}>
                <Text selectable={false} style={styles.pushHeading}>
                  {strings.SettingsScreen.pushTitle}
                </Text>
              </View>
              <View
                w={'1/4'}
                alignContent={'center'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Switch
                  style={styles.pushButton}
                  value={pushActionSubscribeState}
                  trackColor={{
                    false: '#767577',
                    true: styleConst.color.darkBg,
                  }}
                  thumbColor={styleConst.color.white}
                  ios_backgroundColor={styleConst.color.darkBg}
                  onToggle={_onSwitchActionSubscribe}
                />
              </View>
            </HStack>
            <View w={'100%'} mt={2}>
              <Text
                selectable={false}
                style={styles.pushText}
                fontSize={12}
                adjustsFontSizeToFit={true}
                numberOfLines={3}>
                {[
                  strings.SettingsScreen.pushText,
                  strings.SettingsScreen.pushText2,
                ].join(' ')}
              </Text>
            </View>
          </VStack>
        </Box>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={4}>
        <Pressable
          onPress={() => {
            Analytics.logEvent('screen', 'ratePopup', {
              source: 'settings',
            });
            return RateThisApp({onSuccess: _onAppRateSuccess});
            //return Linking.openURL(STORE_LINK[Platform.OS]);
          }}>
          <Box
            borderWidth="1"
            borderColor="coolGray.300"
            shadow="3"
            bg={styleConst.color.orange}
            p="5"
            rounded={'lg'}
            style={[
              styleConst.shadow.default,
              styles.block,
              {width: cardWidth},
            ]}>
            <HStack
              space={3}
              justifyContent="space-between"
              alignItems="center">
              <Text
                selectable={false}
                // fontSize={18}
                // lineHeight={20}
                adjustsFontSizeToFit={true}
                numberOfLines={2}
                style={[styles.langHeading]}>
                {strings.SettingsScreen.rateAppTitleTwoRows}
              </Text>
              <Icon
                size={55}
                as={Ionicons}
                name={
                  Platform.OS === 'android'
                    ? 'logo-google-playstore'
                    : 'logo-apple-appstore'
                }
                color={styleConst.color.white}
                selectable={false}
              />
            </HStack>
          </Box>
        </Pressable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={5}>
        <Pressable
          onPress={() => {
            return Linking.openURL('mailto:' + APP_EMAIL);
          }}>
          <Box
            borderWidth="1"
            borderColor="coolGray.300"
            shadow="3"
            bg={styleConst.color.green}
            p="5"
            rounded={'lg'}
            style={[
              styleConst.shadow.default,
              styles.block,
              {width: cardWidth},
            ]}>
            <HStack
              space={3}
              justifyContent="space-between"
              alignItems="center">
              <Text
                selectable={false}
                // fontSize={18}
                // lineHeight={20}
                adjustsFontSizeToFit={true}
                numberOfLines={2}
                style={[styles.langHeading]}>
                {strings.SettingsScreen.mailtoUs}
              </Text>
              <Icon
                size={55}
                as={Ionicons}
                name={'mail-outline'}
                color={styleConst.color.white}
                selectable={false}
              />
            </HStack>
          </Box>
        </Pressable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={6}>
        <Pressable onPress={() => navigation.navigate('IntroScreenNew')}>
          <FlagButton
            style={[styles.block, {width: cardWidth}]}
            styleText={{
              textAlign: 'center',
              fontFamily: styleConst.font.light,
              color: styleConst.color.lightBlue,
            }}
            shadow={null}
            onPress={() => navigation.navigate('IntroScreenNew')}
            country={region}
            type={'button'}
            variant={'outline'}
          />
        </Pressable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.opacityIn}
        duration={350}
        index={6}
        style={[
          styles.VersionContainer,
          {width: cardWidth, marginHorizontal: 10, marginTop: 20},
        ]}>
        <Text
          onPress={() => NavigationService.navigate('UserAgreementScreen')}
          style={styles.userAgreementText}>
          {strings.Form.agreement.title}
        </Text>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.opacityIn}
        duration={350}
        index={6}
        style={[
          styles.VersionContainer,
          {width: cardWidth, marginHorizontal: 10, marginTop: 20},
        ]}>
        <Button
          variant="outline"
          size="md"
          borderColor={styleConst.color.accordeonGrey1}
          opacity={0.6}
          mb={4}
          onPress={() => {
            return Linking.openURL(STORE_LINK[Platform.OS]);
          }}>
          <Text selectable={false} style={styles.TextVersionInfo}>
            {[
              'ver',
              ' ' + DeviceInfo.getVersion(),
              DeviceInfo.getBuildNumber(),
            ].join('.')}
          </Text>
        </Button>
      </TransitionView>
    </ScrollView>
  );
};

SettingsScreen.propTypes = {
  isMessageSending: PropTypes.bool,
  actionTvaMessageFill: PropTypes.func,
  actionTvaMessageSend: PropTypes.func,
  actionSetActiveTvaOrderId: PropTypes.func,
  message: PropTypes.string,
  results: PropTypes.object,
  activeOrderId: PropTypes.string,
};

SettingsScreen.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
