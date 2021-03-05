/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, createRef} from 'react';
import {
  View,
  TextInput,
  Keyboard,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import {Button, Icon, Toast} from 'native-base';
import PhoneInput from 'react-native-phone-input';
import {store} from '../../core/store';
import styleConst from '../../core/style-const';
import LinearGradient from 'react-native-linear-gradient';
import Form from '../../core/components/Form/Form';

// imports for auth
import {LoginManager} from 'react-native-fbsdk';
import Facebook from '../auth/Facebook';
import Google from '../auth/Google';
import VK from '../auth/VK';
import Apple from '../auth/Apple';

import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

// redux
import {connect} from 'react-redux';
import {actionSavePofile, actionGetPhoneCode} from '../actions';

import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';
import Amplitude from '../../utils/amplitude-analytics';

import strings from '../../core/lang/const';

import {verticalScale} from '../../utils/scale';
import {ScrollView} from 'react-native';
import {string} from 'prop-types';
import PhoneDetect from '../../utils/phoneDetect';
import UserData from '../../utils/user';

export const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: profile.email,
    car: profile.car,
    carNumber: profile.carNumber,

    isFetchProfileData: profile.meta.isFetchProfileData,

    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,

    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  actionSetPushGranted,
  actionSetPushActionSubscribe,

  actionSavePofile,
  actionGetPhoneCode,
};
class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSigninInProgress: false,
      userInfo: {},
      code: false,
      checkCode: '',
      phone: '',
      codeValue: '',
      vkLogin: false,
      loading: false,
      loadingVerify: false,
      // pickerData: null,
    };

    this.scrollRef = createRef();
    this.storeData = store.getState();

    this.FormConfig = {
      fields: [
        {
          name: 'PHONE',
          type: 'phone',
          label: strings.Form.field.label.phone,
          value: this.props.phone,
          props: {
            required: true,
            focusNextInput: false,
            offset: 5,
            textProps: {
              placeholderTextColor: '#afafaf',
              placeholder: strings.Form.field.label.phone,
              keyboardType: 'phone-pad',
              autoCompleteType: 'tel',
              selectionColor: '#afafaf',
              returnKeyType: 'go',
              textContentType: 'telephoneNumber',
              enablesReturnKeyAutomatically: true,
              editable: this.state.code ? false : true,
            },
          },
        },
      ],
    };
  }

  CodeInput = [];
  otpArray = [];

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.onKeyboardVisibleChange,
    );
    this.keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.onKeyboardVisibleChange,
    );
    Amplitude.logEvent('screen', 'profile/login');
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  onKeyboardVisibleChange = () => {
    if (this.scrollRef && this.scrollRef.current) {
      requestAnimationFrame(() => {
        this.scrollRef.current.scrollToEnd();
      });
    }
  };

  _onOtpChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = this.otpArray.concat();
      otpArrayCopy[index] = value;
      this.otpArray = otpArrayCopy;
      this.onInputCode(this.otpArray.join(''));

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index < 3) {
          this.CodeInput[Number(index + 1)].focus();
        }
      } else {
        if (index > 0) {
          this.CodeInput[Number(index - 1)].focus();
        }
      }
    };
  };

  _onOtpKeyPress = (index) => {
    return ({nativeEvent: {key: value}}) => {
      if (Number(value)) {
        if (index > 0 && index < 3 && this.otpArray[index] !== '') {
          this.CodeInput[Number(index + 1)].focus();
        }
      }
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (
        value === 'Backspace' &&
        (this.otpArray[index] === '' ||
          typeof this.otpArray[index] === 'undefined')
      ) {
        if (index > 0) {
          this.CodeInput[Number(index - 1)].focus();
        }
        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = this.otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          this.otpArray = otpArrayCopy;
        }
        this.onInputCode(this.otpArray.join(''));
      }
    };
  };

  _cancelVerify = () => {
    this.setState({
      code: false,
      loadingVerify: false,
      checkCode: '',
      codeValue: '',
      phone: '',
    });
  };

  _verifyCode = (data) => {
    let phone = data.PHONE;
    this.setState({phone: phone});
    this.setState({loadingVerify: true});
    this.props.actionGetPhoneCode({phone}).then((response) => {
      if (response.code >= 300) {
        this.setState({
          code: false,
          loadingVerify: false,
          checkCode: '',
          codeValue: '',
        });

        let message = strings.Notifications.error.text;

        if (response.code === 400) {
          message = strings.ProfileScreen.Notifications.error.phone;
        }

        if (response.code === 406) {
          message = strings.ProfileScreen.Notifications.error.phoneProvider;
        }
        Toast.show({
          text: message,
          position: 'top',
          type: 'warning',
        });
      } else {
        this.setState({
          code: true,
          loadingVerify: false,
          checkCode: response.checkCode,
        });
        this.CodeInput[0].focus();
      }
      return;
    });
  };

  _verifyCodeStepTwo = () => {
    const phone = this.state.phone;
    const code = this.state.codeValue;

    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (code != this.state.checkCode) {
      this.setState({codeValue: ''});
      this.CodeInput[0].clear();
      this.CodeInput[1].clear();
      this.CodeInput[2].clear();
      this.CodeInput[3].clear();
      this.CodeInput[0].focus();
      this.otpArray = [];
      Toast.show({
        text: strings.ProfileScreen.Notifications.error.wrongCode,
        buttonText: 'ОК',
        position: 'top',
        type: 'danger',
      });
      return;
    }
    this.keyboardHideListener.remove();
    this.setState({loading: true, loadingVerify: true});
    this.props
      .actionGetPhoneCode({phone, code})
      .then((data) => {
        Keyboard.dismiss();
        PushNotifications.addTag('login', data.user.ID);
        if (data.user.SAP && data.user.SAP.ID) {
          PushNotifications.addTag('sapID', data.user.SAP.ID);
          PushNotifications.setExternalUserId(data.user.SAP.ID);
        }
        return this.props.actionSavePofile(data.user);
      })
      .then(() => {
        this.setState({loading: false});
        this.props.navigation.navigate('LoginScreen');
      })
      .catch(() => {
        this.setState({loading: false});
        Toast.show({
          text: strings.Notifications.error.text,
          position: 'top',
          type: 'warning',
        });
      });
  };

  _sendDataToApi(profile) {
    this.setState({loading: true});
    return this.props.actionSavePofile(profile);
  }

  _checkPhone = async (data) => {
    data.update = 0;
    const res = await this._sendDataToApi(data);
    if (res) {
      switch (res.type) {
        case 'SAVE_PROFILE__UPDATE':
          if (res.payload && res.payload.ID && res.payload.PHONE) {
            // нашли юзверя в CRM и у него есть телефон
            this.setState({loading: false});
            this.props.navigation.goBack();
          }
          break;
        case 'SAVE_PROFILE__NOPHONE':
          this.setState({loading: false});
          this.props.navigation.navigate('PhoneChangeScreen', {
            refererScreen: 'LoginScreen',
            returnScreen: 'LoginScreen',
            userSocialProfile: data,
            type: 'auth',
          });
          break;
        case 'SAVE_PROFILE__FAIL':
          if (res.payload.code) {
            switch (res.payload.code) {
              case 100: // Пользователь не зарегистрирован
                delete data.update; // теперь будем регать пользователя по серьёзке
                this.setState({loading: false});
                this.props.navigation.navigate('PhoneChangeScreen', {
                  refererScreen: 'LoginScreen',
                  returnScreen: 'LoginScreen',
                  userSocialProfile: data,
                  type: 'auth',
                });
                break;
              default:
                this.setState({loading: false});
                Toast.show({
                  text: strings.Notifications.error.text,
                  position: 'top',
                  type: 'warning',
                });
                break;
            }
          } else {
            this.setState({loading: false});
            Toast.show({
              text: strings.Notifications.error.text,
              position: 'top',
              type: 'warning',
            });
          }
          break;
      }
    } else {
      this.setState({loading: false});
      Toast.show({
        text: strings.Notifications.error.text,
        position: 'top',
        type: 'warning',
      });
    }
  };

  onInputCode = (text) => {
    if (text.length === 4) {
      this.setState({codeValue: text}, () => {
        this._verifyCodeStepTwo();
      });
    }
  };

  renderLoginButtons = (region) => {
    let VKenabled = true;
    let ButtonWidth = '25%';
    let ButtonHeight = 50;
    const isAndroid = Platform.OS === 'android';
    switch (region.toLowerCase()) {
      case 'ua':
        VKenabled = false;
        ButtonWidth = '30%';
        ButtonHeight = 60;
        break;
    }
    return (
      <View
        style={{
          opacity: this.state.code ? 0 : 1,
          height: this.state.code
            ? Platform.select({ios: 'auto', android: 0})
            : 'auto',
          marginTop: 20,
          marginBottom: 10,
          width: '80%',
          marginHorizontal: '10%',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Button
            onPress={() => {
              return Google.signIn(this._checkPhone);
            }}
            disabled={this.state.isSigninInProgress}
            iconLeft
            style={[
              styleConst.shadow.default,
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#4286F5',
              },
            ]}>
            <Icon name="google" type="FontAwesome5" style={{marginLeft: 0}} />
          </Button>
          <Button
            onPress={() => {
              return Facebook.signIn(this._checkPhone);
            }}
            disabled={this.state.isSigninInProgress}
            iconLeft
            style={[
              styleConst.shadow.default,
              styles.SocialLoginBt,
              {
                backgroundColor: '#4167B2',
                width: VKenabled ? '29%' : ButtonWidth,
                height: 60,
                marginVertical: 8,
                paddingHorizontal: 8,
              },
            ]}>
            <Icon
              name="facebook"
              type="FontAwesome5"
              style={{marginLeft: 0, fontSize: 35}}
            />
          </Button>
          {VKenabled ? (
            <Button
              onPress={() => {
                return VK.signIn(this._checkPhone);
              }}
              disabled={this.state.isSigninInProgress}
              iconLeft
              style={[
                styleConst.shadow.default,
                styles.SocialLoginBt,
                {
                  width: ButtonWidth,
                  height: ButtonHeight,
                  backgroundColor: '#4680C2',
                },
              ]}>
              <Icon name="vk" type="FontAwesome5" style={{marginLeft: 0}} />
            </Button>
          ) : null}
        </View>
        {!isAndroid && appleAuth.isSupported ? (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE_OUTLINE}
            buttonType={AppleButton.Type.SIGN_IN}
            cornerRadius={5}
            style={[
              styles.SocialLoginBt,
              {
                justifyContent: 'space-between',
                height: 45,
              },
            ]}
            onPress={() => {
              return Apple.signIn(this._checkPhone);
            }}
          />
        ) : null}
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicator
            color="#0061ED"
            style={{
              alignSelf: 'center',
              marginTop: verticalScale(60),
            }}
          />
        </View>
      );
    }

    LoginManager.logOut();
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback>
          <ImageBackground
            source={require('./bg.jpg')}
            style={{width: '100%', height: '100%'}}>
            <ScrollView ref={this.scrollRef} scrollEnabled={false}>
              <View style={{marginBottom: 10}}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['rgba(0, 0, 0, 0.60)', 'rgba(51, 51, 51, 0)']}
                  style={styles.LinearGradient}
                />
                <View style={styles.ImageWrapper}>
                  <Image
                    resizeMode="contain"
                    source={require('../../menu/assets/logo-horizontal-white.svg')}
                  />
                </View>
                {!this.state.code
                  ? this.renderLoginButtons(this.props.dealerSelected.region)
                  : null}
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: this.state.code ? 0 : 1,
                  }}>
                  <View
                    style={{
                      marginTop: 5,
                      marginBottom: 10,
                      width: '80%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#979797',
                        height: 1,
                        width: '40%',
                      }}
                    />
                    <Text
                      style={{
                        color: '#9097A5',
                        fontSize: 16,
                        lineHeight: 16,
                      }}>
                      {strings.Base.or}
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#979797',
                        height: 1,
                        width: '40%',
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    marginTop: this.state.code ? '5%' : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '80%',
                    }}>
                    {this.state.code ? (
                      <>
                        {[0, 1, 2, 3].map((element, index) => (
                          <TextInput
                            style={styles.TextInputCode}
                            key={'textCode' + index}
                            textContentType="oneTimeCode"
                            keyboardType="number-pad"
                            ref={(input) => {
                              this.CodeInput[index] = input;
                            }}
                            maxLength={1}
                            caretHidden={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyType="send"
                            placeholderTextColor="#afafaf"
                            autoCompleteType="off"
                            onKeyPress={this._onOtpKeyPress(index)}
                            onChangeText={this._onOtpChange(index)}
                            selected={false}
                          />
                        ))}
                      </>
                    ) : (
                      <View style={styles.PhoneWrapper}>
                        <Form
                          fields={this.FormConfig.fields}
                          SubmitButton={{
                            text: strings.Form.button.receiveCode,
                          }}
                          onSubmit={this._verifyCode}
                        />
                      </View>
                    )}
                  </View>
                  {this.state.code ? (
                    <>
                      <Button
                        disabled={this.state.loadingVerify}
                        block
                        onPress={this._verifyCodeStepTwo}
                        style={[
                          styleConst.shadow.default,
                          styles.ApproveButton,
                        ]}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color={styleConst.color.white} />
                        ) : (
                          <Text style={{color: styleConst.color.white}}>
                            {strings.ProfileScreen.approve}
                          </Text>
                        )}
                      </Button>
                      <Button
                        disabled={this.state.loadingVerify}
                        onPress={this._cancelVerify}
                        style={[
                          styleConst.shadow.default,
                          styles.CancelButton,
                        ]}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color={styleConst.color.white} />
                        ) : (
                          <Text style={{color: styleConst.color.white}}>
                            {strings.Base.cancel.toLowerCase()}
                          </Text>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onPress={this._verifyCode}
                      full
                      disabled={
                        this.state.loadingVerify
                          ? true
                          : this.state.phone
                          ? false
                          : true
                      }
                      ref={(ref) => {
                        this.getCodeButton = ref;
                      }}
                      style={[
                        styleConst.shadow.default,
                        {
                          marginTop: 20,
                          width: '80%',
                          marginHorizontal: '10%',
                          backgroundColor: '#34BD78',
                          justifyContent: 'center',
                          borderRadius: 5,
                          opacity: this.state.loadingVerify
                            ? 0
                            : this.state.phone
                            ? 1
                            : 0,
                        },
                      ]}>
                      {this.state.loadingVerify ? (
                        <ActivityIndicator color={styleConst.color.white} />
                      ) : (
                        <Text style={{color: styleConst.color.white}}>
                          {strings.ProfileScreen.getCode}
                        </Text>
                      )}
                    </Button>
                  )}
                  {!this.state.code && (
                    <Button
                      onPress={() => {
                        this.props.navigation.navigate('BonusScreenInfo', {
                          refererScreen: 'LoginScreen',
                          returnScreen: 'LoginScreen',
                        });
                      }}
                      full
                      transparent
                      iconLeft
                      style={styles.BonusInfoButton}>
                      <Icon
                        name="info"
                        type="SimpleLineIcons"
                        style={styles.BonusInfoButtonIcon}
                      />
                      <Text
                        numberOfLines={1}
                        style={styles.BonusInfoButtonText}>
                        {strings.Menu.main.bonus}
                      </Text>
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  LinearGradient: {
    height: '80%',
    width: '100%',
    position: 'absolute',
  },
  ImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '10%',
    justifyContent: 'center',
  },
  SocialLoginBt: {
    marginVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
  PhoneWrapper: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
  },
  TextInputCode: {
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: 'gray',
    borderWidth: 1,
    color: styleConst.color.white,
    backgroundColor: 'rgba(175, 175, 175, 0.7)',
    borderRadius: 5,
    fontSize: 50,
    letterSpacing: 0,
    marginLeft: '3%',
    width: '22%',
    textAlign: 'center',
  },
  CancelButton: {
    flex: 1,
    height: 30,
    width: '30%',
    marginHorizontal: '35%',
    backgroundColor: 'rgba(101, 101, 101, 0.4)',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  ApproveButton: {
    marginTop: 10,
    width: '80%',
    marginHorizontal: '10%',
    backgroundColor: '#34BD78',
    justifyContent: 'center',
    borderRadius: 5,
  },
  BonusInfoButton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: styleConst.color.darkBg,
    opacity: 0.9,
    borderRadius: 5,
    width: '80%',
    marginVertical: 10,
    marginHorizontal: '10%',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  BonusInfoButtonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.white,
    paddingRight: styleConst.ui.horizontalGapInList,
  },
  BonusInfoButtonIcon: {
    fontSize: 20,
    marginRight: 10,
    color: styleConst.color.white,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
