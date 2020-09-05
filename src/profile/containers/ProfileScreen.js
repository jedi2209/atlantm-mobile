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
  Alert,
} from 'react-native';
import {Button, Icon, Toast} from 'native-base';
import PhoneInput from 'react-native-phone-input';
import {store} from '../../core/store';
import styleConst from '../../core/style-const';
import LinearGradient from 'react-native-linear-gradient';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

// redux
import {connect} from 'react-redux';
import {actionSavePofile, actionSavePofileWithPhone} from '../actions';

import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';
import Amplitude from '../../utils/amplitude-analytics';

import {verticalScale} from '../../utils/scale';

export const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
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
  actionSavePofileWithPhone,
};

// imports for auth
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import {LoginManager} from 'react-native-fbsdk';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.email'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    'XXXX-XXXX.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    'XXXX-XXXX.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

import VKLogin from 'react-native-vkontakte-login';
import {ScrollView} from 'react-native';

class ProfileScreen extends Component {
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
      pickerData: null,
    };

    this.requestManager = new GraphRequestManager();
    this.scrollRef = createRef();
    this.storeData = store.getState();
  }

  CodeInput = [];
  otpArray = [];

  static navigationOptions = () => ({
    header: null,
    headerTransparent: true,
  });

  onOtpChange = (index) => {
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

  onOtpKeyPress = (index) => {
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

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.onKeyboardVisibleChange,
    );
    this.keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.onKeyboardVisibleChange,
    );
    this.setState({
      pickerData: this.phoneInput.getPickerData(),
    });
    Amplitude.logEvent('screen', 'profile/login');
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  onKeyboardVisibleChange = () => {
    requestAnimationFrame(() => {
      this.scrollRef.current.scrollToEnd();
    });
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

  _verifyCode = () => {
    const phoneCountryCode = this.phoneInput.getCountryCode();
    let phone = this.state.phone;
    let phoneNew = phone;
    if (phoneNew.indexOf(phoneCountryCode) === -1) {
      phoneNew = phoneCountryCode + phone;
    }
    if (phoneNew.indexOf(phoneCountryCode) !== -1) {
      phoneNew = '+' + phone;
    }
    if (phoneNew.indexOf('+' + phoneCountryCode) === -1) {
      phoneNew = '+' + phoneCountryCode + phone;
    }
    phone = phoneNew.replace('++', '+');
    this.setState({phone: phone});
    this.setState({loadingVerify: true});
    this.props.actionSavePofileWithPhone({phone}).then((response) => {
      if (response.code >= 300) {
        this.setState({
          code: false,
          loadingVerify: false,
          checkCode: '',
          codeValue: '',
        });

        let header = 'Хьюстон, у нас проблемы...';
        let message = 'Что-то пошло не так, попробуйте снова';

        if (response.code === 400) {
          message = 'Телефон не должен быть пустым';
        }

        if (response.code === 406) {
          message =
            'Не опознан мобильный оператор или не правильный формат номера';
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
        text: 'Неверный код',
        buttonText: 'ОК',
        position: 'top',
        type: 'danger',
      });
      return;
    }
    this.keyboardHideListener.remove();
    this.setState({loading: true, loadingVerify: true});
    this.props
      .actionSavePofileWithPhone({phone, code})
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
        this.props.navigation.navigate('ProfileScreenInfo');
      })
      .catch(() => {
        this.setState({loading: false});
        Toast.show({
          text: 'Что-то пошло не так...',
          position: 'top',
          type: 'warning',
        });
      });
  };

  _sendDataToApi(profile) {
    this.setState({loading: true});
    this.props
      .actionSavePofile(profile)
      .then(() => {
        this.setState({loading: false});
        this.props.navigation.goBack();
      })
      .catch(() => {
        this.setState({loading: false});
        Toast.show({
          text: 'Что-то пошло не так...',
          position: 'top',
          type: 'warning',
        });
      });
  }

  async fetchProfileFromFacebook(token) {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'email,name,first_name,middle_name,last_name',
            },
            access_token: {
              string: token,
            },
          },
        },
        (error, result) => {
          if (result) {
            const profile = result;
            profile.avatar = `https://graph.facebook.com/${result.id}/picture`;
            resolve(profile);
          } else {
            reject(error);
          }
        },
      );

      this.requestManager.addRequest(request).start();
    });
  }

  _signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const profile = {
        id: userInfo.user.id,
        email: userInfo.user.email,
        first_name: userInfo.user.givenName || '',
        last_name: userInfo.user.familyName || '',
      };

      this._sendDataToApi({...profile, networkName: 'gl'});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google auth cancelled', error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google auth in process', error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google auth play services', error);
        // play services not available or outdated
      } else {
        console.log('Google auth error', error);
        // some other error happened
      }
    }
  };

  _signInFB = () => {
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          this.getFBToken();
        }
      }.bind(this),
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  getFBToken = () => {
    AccessToken.getCurrentAccessToken().then((auth) => {
      this.fetchProfileFromFacebook(auth.accessToken).then((data) => {
        this._sendDataToApi({...data, networkName: 'fb'});
      });
    });
  };

  _GetUserDataVK = async () => {
    try {
      const auth = await VKLogin.login([
        'friends',
        'photos',
        'email',
        'contacts',
        'phone',
      ]);
      const url =
        'https://api.vk.com/method/account.getProfileInfo?user_id=' +
        auth.user_id +
        '&v=5.103&fields=contacts&access_token=' +
        auth.access_token;
      const response = await fetch(url);
      const userData = await response.json();
      return Object.assign(auth, userData.response);
    } catch (err) {
      console.log('apiGetDataError', err);
    }
  };

  _signInWithVK = async () => {
    VKLogin.initialize(XXXX);
    try {
      const userData = await this._GetUserDataVK();
      const profile = {
        id: userData.user_id,
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        personal_birthday: userData.bdate || '',
        personal_gender: userData.sex === 2 ? 'M' : 'F',
      };
      this._sendDataToApi({...profile, networkName: 'vk'});
    } catch (error) {
      console.log('error', error);
    }
  };

  _signInWithApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      try {
        const profile = {
          id: appleAuthRequestResponse.user,
          first_name: appleAuthRequestResponse.fullName.nickname || '',
          second_name: appleAuthRequestResponse.fullName.middleName || '',
          last_name: appleAuthRequestResponse.fullName.familyName || '',
          email: appleAuthRequestResponse.email || '',
        };
        this._sendDataToApi({...profile, networkName: 'apple'});
      } catch (error) {
        // console.log('error', error);
      }
    }
  };

  onInputCode = (text) => {
    if (text.length === 4) {
      this.setState({codeValue: text});
      setTimeout(() => {
        this._verifyCodeStepTwo();
      }, 200);
    }
  };

  onInputPhone = (text) => {
    this.setState({phone: text});
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
            onPress={this._signInWithGoogle}
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
            onPress={this._signInFB}
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
              onPress={this._signInWithVK}
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
            onPress={() => this._signInWithApple()}
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
      <KeyboardAvoidingView
        // behavior={Platform.select({ios: 'position', android: null})}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('./bg.jpg')}
            style={{width: '100%', height: '100%'}}>
            <ScrollView ref={this.scrollRef} scrollEnabled={false}>
              <View style={{marginBottom: 10}}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['rgba(0, 0, 0, 0.60)', 'rgba(51, 51, 51, 0)']}
                  style={{
                    height: '80%',
                    width: '100%',
                    position: 'absolute',
                  }}
                />
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '10%',
                    justifyContent: 'center',
                  }}>
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
                      или
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
                            style={{
                              height: 80,
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              borderColor: 'gray',
                              borderWidth: 1,
                              color: '#fff',
                              backgroundColor: 'rgba(175, 175, 175, 0.7)',
                              borderRadius: 5,
                              fontSize: 50,
                              letterSpacing: 0,
                              marginLeft: '3%',
                              width: '22%',
                              textAlign: 'center',
                            }}
                            key={'textCode' + index}
                            textContentType="oneTimeCode"
                            keyboardType="number-pad"
                            ref={(input) => {
                              this.CodeInput[index] = input;
                            }}
                            maxLength={1}
                            caretHidden={false}
                            enablesReturnKeyAutomatically={true}
                            returnKeyType="send"
                            placeholderTextColor="#afafaf"
                            autoCompleteType="off"
                            onKeyPress={this.onOtpKeyPress(index)}
                            onChangeText={this.onOtpChange(index)}
                            selected={false}
                          />
                        ))}
                      </>
                    ) : (
                      <PhoneInput
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        ref={(ref) => {
                          this.phoneInput = ref;
                        }}
                        initialCountry={
                          this.storeData.dealer.region
                            ? this.storeData.dealer.region
                            : 'by'
                        }
                        countriesList={require('../../utils/countries.json')}
                        autoFormat={true}
                        textStyle={{
                          height: 40,
                          paddingHorizontal: 14,
                          fontSize: 18,
                          letterSpacing: 3,
                          borderColor: '#afafaf',
                          borderWidth: 0.45,
                          color: '#fff',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          width: '100%',
                          borderRadius: 5,
                        }}
                        offset={20}
                        cancelText="Отмена"
                        confirmText="Выбрать"
                        onChangePhoneNumber={this.onInputPhone}
                        // onSelectCountry={this._onSelectCountry}
                        textProps={{
                          placeholderTextColor: '#afafaf',
                          placeholder: 'ваш телефон',
                          keyboardType: 'phone-pad',
                          autoCompleteType: 'tel',
                          selectionColor: '#afafaf',
                          returnKeyType: 'go',
                          textContentType: 'telephoneNumber',
                          enablesReturnKeyAutomatically: true,
                          editable: this.state.code ? false : true,
                          onEndEditing: () => {
                            if (this.state.phone) {
                              this._verifyCode();
                            }
                          },
                        }}
                      />
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
                          {
                            marginTop: 10,
                            width: '80%',
                            marginHorizontal: '10%',
                            backgroundColor: '#34BD78',
                            justifyContent: 'center',
                            borderRadius: 5,
                          },
                        ]}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={{color: '#fff'}}>Подтвердить</Text>
                        )}
                      </Button>
                      <Button
                        disabled={this.state.loadingVerify}
                        onPress={this._cancelVerify}
                        style={[
                          styleConst.shadow.default,
                          {
                            flex: 1,
                            height: 25,
                            width: '30%',
                            marginHorizontal: '35%',
                            backgroundColor: 'rgba(101, 101, 101, 0.4)',
                            justifyContent: 'center',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 20,
                          },
                        ]}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={{color: '#fff'}}>отмена</Text>
                        )}
                      </Button>
                    </>
                  ) : null}
                  {!this.state.code && (
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
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{color: '#fff'}}>Получить код</Text>
                      )}
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
  SocialLoginBt: {
    marginVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
