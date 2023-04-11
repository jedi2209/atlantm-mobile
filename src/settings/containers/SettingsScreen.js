/* eslint-disable react-native/no-inline-styles */
import {PureComponent, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
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
  HStack,
  VStack,
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
import TransitionView from '../../core/components/TransitionView';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';
import {APP_EMAIL, APP_REGION, STORE_LINK} from '../../core/const';
import {strings} from '../../core/lang/const';

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
    fontSize: 24,
  },
  pushHeading: {
    fontSize: 16,
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
  },
  pushText: {
    fontSize: 14,
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

const mapStateToProps = ({dealer, info, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
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
  useEffect(() => {
    Analytics.logEvent('screen', 'settings');
  }, []);

  const _onAppRateSuccess = () => {
    !props.isAppRated && props.actionAppRated();
  };

  const _onSwitchActionSubscribe = value => {
    const {dealerSelected} = props;

    let text,
      title = '';
    if (value === true) {
      PushNotifications.subscribeToTopic('actions', dealerSelected.id).then(
        isPermission => {
          console.info('isPermission', isPermission);
          props.actionSetPushActionSubscribe(isPermission);
          if (isPermission) {
            title = strings.Notifications.success.title;
            text = strings.Notifications.success.textPush;
            Alert.alert(title, text);
          }
        },
      );
    } else {
      PushNotifications.unsubscribeFromTopic('actions');
      props.actionSetPushActionSubscribe(value);
      title = strings.Notifications.success.titleSad;
      text = strings.Notifications.success.textPushSad;
      Alert.alert(title, text);
    }
  };

  return (
    <ScrollView style={styleConst.safearea.default}>
      <Text selectable={false} style={styleConst.text.bigHead}>
        {strings.Menu.main.settings}
      </Text>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={2}>
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
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '80%'}}>
                <Text selectable={false} style={styles.pushHeading}>
                  {strings.SettingsScreen.pushTitle}
                </Text>
              </View>
              <View
                style={{
                  width: '20%',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Switch
                  style={styles.pushButton}
                  value={props.pushActionSubscribeState}
                  trackColor={{
                    false: '#767577',
                    true: styleConst.color.darkBg,
                  }}
                  thumbColor={'white'}
                  ios_backgroundColor={styleConst.color.darkBg}
                  onToggle={_onSwitchActionSubscribe}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text selectable={false} style={styles.pushText}>
                {strings.SettingsScreen.pushText +
                  ' ' +
                  props.dealerSelected.name +
                  strings.SettingsScreen.pushText2}
              </Text>
            </View>
          </VStack>
        </Box>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={3}>
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
                style={[styles.langHeading, {fontSize: 20, lineHeight: 20}]}>
                {strings.SettingsScreen.mailtoUs}
              </Text>
              <Icon
                size={55}
                as={Ionicons}
                name={
                  Platform.OS === 'android'
                    ? 'logo-google-playstore'
                    : 'logo-apple-appstore'
                }
                color="white"
                _dark={{
                  color: 'white',
                }}
                selectable={false}
              />
            </HStack>
          </Box>
        </Pressable>
      </TransitionView>
      <TransitionView
        animation={styleConst.animation.zoomIn}
        duration={250}
        index={4}>
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
                style={[styles.langHeading, {fontSize: 20, lineHeight: 20}]}>
                {strings.SettingsScreen.mailtoUs}
              </Text>
              <Icon
                size={55}
                as={Ionicons}
                name={'mail-outline'}
                color="white"
                _dark={{
                  color: 'white',
                }}
                selectable={false}
              />
            </HStack>
          </Box>
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
          onPress={() => {
            return Linking.openURL(STORE_LINK[Platform.OS]);
          }}>
          <Text selectable={false} style={styles.TextVersionInfo}>
            {'ver. ' +
              DeviceInfo.getVersion() +
              ' (' +
              DeviceInfo.getBuildNumber() +
              ')'}
          </Text>
        </Button>
      </TransitionView>
    </ScrollView>
  );
};

SettingsScreen.propTypes = {
  dealerSelected: PropTypes.object,
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
