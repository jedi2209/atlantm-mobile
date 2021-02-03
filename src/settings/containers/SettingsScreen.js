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
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import PushNotifications from '../../core/components/PushNotifications';
import LangSwitcher from '../../core/components/LangSwitcher';
import RateThisApp from '../../core/components/RateThisApp';
import TransitionView from '../../core/components/TransitionView';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {APP_EMAIL, STORE_LINK} from '../../core/const';
import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#fff',
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
    color: styleConst.new.blueHeader,
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
    color: styleConst.new.blueHeader,
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
    isAppRated: core.isAppRated,
    AppRateAskLater: core.AppRateAskLater,
  };
};

const mapDispatchToProps = {
  actionSetPushActionSubscribe,
  actionAppRated,
};

const languagesItems = [
  {
    label: '🇷🇺 русский язык',
    value: 'ru',
    key: 1,
  },
  {
    label: '🇺🇦 українська мова',
    value: 'ua',
    key: 2,
  },
];

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;

class SettingsScreen extends PureComponent {
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
    Amplitude.logEvent('screen', 'settings');
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

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.resetBorder,
      headerTitleStyle: stylesHeader.transparentHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          // theme="blue"
          // type=""
          icon="md-close"
          IconStyle={{
            fontSize: 42,
            width: 40,
          }}
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    isMessageSending: PropTypes.bool,
    actionTvaMessageFill: PropTypes.func,
    actionTvaMessageSend: PropTypes.func,
    actionSetActiveTvaOrderId: PropTypes.func,
    message: PropTypes.string,
    results: PropTypes.object,
    activeOrderId: PropTypes.string,
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
            <Text
              style={{
                color: '#222B45',
                fontSize: 48,
                fontWeight: 'bold',
                fontFamily: styleConst.font.medium,
                marginHorizontal: 10,
                marginBottom: 5,
              }}>
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
                    {strings.SettingsScreen.pushTitle +
                      '\r\n' +
                      this.props.dealerSelected.name}
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
                  {strings.SettingsScreen.pushText}
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
                onPress={() => {
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
            {this.state.showRatePopup ? (
              <RateThisApp
                onSuccess={this._onAppRateSuccess}
                onAskLater={this._onAppRateAskLater}
              />
            ) : null}
          </Container>
        </ScrollView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
