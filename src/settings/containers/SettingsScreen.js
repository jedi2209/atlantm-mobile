/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Container,
  Text,
  StyleProvider,
  Switch,
  Icon,
  Button,
} from 'native-base';
import DeviceInfo from 'react-native-device-info';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe, actionAppRated} from '../../core/actions';

// components
import PushNotifications from '../../core/components/PushNotifications';
import LangSwitcher from '../../core/components/LangSwitcher';
import RateThisApp from '../../core/components/RateThisApp';
import TransitionView from '../../core/components/TransitionView';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {APP_EMAIL, STORE_LINK} from '../../core/const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.new.mainbg,
  },
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
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginLeft: 10,
  },
  blockLang: {
    backgroundColor: styleConst.color.darkBg,
  },
  blockPush: {
    backgroundColor: styleConst.color.blue,
  },
  blockFeedback: {
    backgroundColor: styleConst.color.orange,
    height: 100,
  },
  blockContactUs: {
    backgroundColor: styleConst.color.green,
    height: 100,
  },
  langHeading: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    width: '80%',
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
  LangSwitcher: {
    fontSize: 14,
    fontFamily: styleConst.font.light,
    color: styleConst.color.lightBlue,
    width: '100%',
  },
  textInputProps: {
    marginTop: 14,
    padding: 10,
    color: styleConst.color.white,
    borderColor: styleConst.color.white,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonRate: {
    height: 'auto',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    flexDirection: 'row',
  },
});

const mapStateToProps = ({dealer, info, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    isFetchInfoList: info.meta.isFetchInfoList,
    pushActionSubscribeState: core.pushActionSubscribeState,
    currentLang: core.language.selected || 'ua',
    AppRateAskLater: core.AppRateAskLater,
  };
};

const mapDispatchToProps = {
  actionSetPushActionSubscribe,
  actionAppRated,
};

const languagesItems = [
  {
    label: '🇷🇺 Русский',
    value: 'ru',
    key: 1,
  },
  {
    label: '🇺🇦 Українська',
    value: 'ua',
    key: 2,
  },
];

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;

class SettingsScreen extends PureComponent {
  static propTypes = {
    dealerSelected: PropTypes.object,
    isMessageSending: PropTypes.bool,
    actionTvaMessageFill: PropTypes.func,
    actionTvaMessageSend: PropTypes.func,
    actionSetActiveTvaOrderId: PropTypes.func,
    message: PropTypes.string,
    results: PropTypes.object,
    activeOrderId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
      pushActionSubscribeState: this.props.pushActionSubscribeState,
      showRatePopup: false,
    };

    this.zoomIn = {
      1: {
        opacity: 1,
        scale: 1,
      },
      0.5: {
        opacity: 0.5,
        scale: 0.4,
      },
      0: {
        opacity: 0,
        scale: 0,
      },
    };
    this.opacityIn = {
      1: {
        opacity: 1,
      },
      0.5: {
        opacity: 0.5,
      },
      0: {
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    Analytics.logEvent('screen', 'settings');
  }

  _onAppRateSuccess = () => {
    this.setState({
      showRatePopup: false,
    });
    !this.props.isAppRated && this.props.actionAppRated();
  };

  _onAppRateAskLater = () => {
    this.setState({
      showRatePopup: false,
    });
  };

  onSwitchActionSubscribe = () => {
    const {
      dealerSelected,
      actionSetPushActionSubscribe,
      pushActionSubscribeState,
    } = this.props;

    let text,
      title = '';

    if (pushActionSubscribeState === false) {
      PushNotifications.subscribeToTopic('actions', dealerSelected.id).then(
        (isPermission) => {
          actionSetPushActionSubscribe(isPermission);
          if (isPermission) {
            this.setState({
              pushActionSubscribeState: true,
            });
            title = strings.Notifications.success.title;
            text = strings.Notifications.success.textPush;
            Alert.alert(title, text);
          }
        },
      );
    } else {
      PushNotifications.unsubscribeFromTopic('actions');
      actionSetPushActionSubscribe(false);
      this.setState({
        pushActionSubscribeState: false,
      });
      title = strings.Notifications.success.titleSad;
      text = strings.Notifications.success.textPushSad;
      Alert.alert(title, text);
    }
  };

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <ScrollView style={styles.container}>
          <Container style={styles.container}>
            <StatusBar hidden />
            <Text selectable={false} style={styleConst.text.bigHead}>
              {strings.Menu.main.settings}
            </Text>
            {this.props.dealerSelected.region === 'ua' ? (
              <TransitionView
                animation={this.zoomIn}
                duration={250}
                index={1}
                style={[
                  styleConst.shadow.default,
                  styles.block,
                  styles.blockLang,
                  {
                    width: cardWidth,
                  },
                ]}>
                <Text selectable={false} style={styles.langHeading}>
                  {strings.SettingsScreen.mainLanguage}
                </Text>
                <LangSwitcher
                  items={languagesItems}
                  bgColor={styleConst.color.darkBg}
                  value={this.props.currentLang}
                  style={styles.LangSwitcher}
                  styleContainer={{width: '100%'}}
                  textInputProps={styles.textInputProps}
                />
              </TransitionView>
            ) : null}
            <TransitionView
              animation={this.zoomIn}
              duration={250}
              index={2}
              style={[
                styleConst.shadow.default,
                styles.block,
                styles.blockPush,
                {width: cardWidth},
              ]}>
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
                    value={this.state.pushActionSubscribeState}
                    trackColor={{
                      false: '#767577',
                      true: styleConst.color.darkBg,
                    }}
                    thumbColor={'white'}
                    ios_backgroundColor={styleConst.color.darkBg}
                    onChange={this.onSwitchActionSubscribe}
                  />
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text selectable={false} style={styles.pushText}>
                  {strings.SettingsScreen.pushText +
                    ' ' +
                    this.props.dealerSelected.name +
                    strings.SettingsScreen.pushText2}
                </Text>
              </View>
            </TransitionView>
            <TransitionView
              animation={this.zoomIn}
              duration={250}
              index={3}
              style={[
                styleConst.shadow.default,
                styles.block,
                styles.blockFeedback,
                {width: cardWidth},
              ]}>
              <Button
                transparent
                full
                style={styles.buttonRate}
                selectable={false}
                onPress={() => {
                  Analytics.logEvent('screen', 'ratePopup', {source: 'settings'});
                  return this.setState({
                    showRatePopup: true,
                  });
                }}>
                <Text
                  selectable={false}
                  style={[styles.langHeading, {lineHeight: 30}]}>
                  {strings.SettingsScreen.rateAppTitle}
                </Text>
                <Icon
                  name={
                    Platform.OS === 'android'
                      ? 'logo-google-playstore'
                      : 'logo-apple-appstore'
                  }
                  style={{
                    color: 'white',
                    fontSize: 55,
                  }}
                  selectable={false}
                />
              </Button>
            </TransitionView>
            <TransitionView
              animation={this.zoomIn}
              duration={250}
              index={4}
              style={[
                styleConst.shadow.default,
                styles.block,
                styles.blockContactUs,
                {width: cardWidth},
              ]}>
              <Button
                transparent
                full
                style={styles.buttonRate}
                selectable={false}
                onPress={() => {
                  return Linking.openURL('mailto:' + APP_EMAIL);
                }}>
                <Text
                  selectable={false}
                  style={[styles.langHeading, {fontSize: 19, lineHeight: 22}]}>
                  {strings.SettingsScreen.mailtoUs}
                </Text>
                <Icon
                  name={'mail-outline'}
                  selectable={false}
                  style={{
                    color: 'white',
                    fontSize: 55,
                  }}
                />
              </Button>
            </TransitionView>
            <TransitionView
              animation={this.opacityIn}
              duration={350}
              index={5}
              style={[
                styles.VersionContainer,
                {width: cardWidth, marginHorizontal: 10, marginTop: 20},
              ]}>
              <Button
                transparent
                full
                onPress={() => {
                  return Linking.openURL(STORE_LINK[Platform.OS]);
                }}
                style={{
                  borderColor: styleConst.color.accordeonGrey1,
                  borderWidth: 1,
                  borderRadius: 10,
                  marginBottom: 20,
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
          </Container>
          <RateThisApp
            onSuccess={this._onAppRateSuccess}
            onAskLater={this._onAppRateAskLater}
            show={this.state.showRatePopup}
          />
        </ScrollView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
