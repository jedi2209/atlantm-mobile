/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, createRef} from 'react';
import {
  Alert,
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
import {Button, Icon} from 'native-base';
import PhoneInput from 'react-native-phone-input';
import {store} from '@core/store';
import styleConst from '@core/style-const';
import LinearGradient from 'react-native-linear-gradient';

// redux
import {connect} from 'react-redux';
import {
  nameFill,
  phoneFill,
  emailFill,
  carFill,
  carNumberFill,
  loginFill,
  passwordFill,
  actionLogin,
  actionLogout,
  actionFetchProfileData,
  actionSavePofile,
  actionSavePofileWithPhone,
} from '../actions';

import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import PushNotifications from '@core/components/PushNotifications';

import {verticalScale} from '../../utils/scale';

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

    auth: profile.auth,
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
  nameFill,
  phoneFill,
  emailFill,
  carFill,
  carNumberFill,

  actionFetchProfileData,

  loginFill,
  passwordFill,
  actionLogin,
  actionLogout,

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
    '53201529704-4fl35lhveh4lvcdj9o3nli0fpk8c942r.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '53201529704-pofi5bbpvo7dtnuu521lo00f3bl6qiq2.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
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
      phone: '',
      codeValue: '',
      checkCode: '',
      vkLogin: false,
      loading: false,
      loadingVerify: false,
      pickerData: null,
    };

    this.requestManager = new GraphRequestManager();
    this.scrollRef = createRef();
    this.storeData = store.getState();
    // this.onPressFlag = this.onPressFlag.bind(this);
    // this._onSelectCountry = this._onSelectCountry.bind(this);
  }

  static navigationOptions = () => ({
    header: null,
  });

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
    this.props.actionSavePofileWithPhone({phone}).then(response => {
      if (response.code >= 300) {
        this.setState({
          code: false,
          loadingVerify: false,
          checkCode: '',
          codeValue: '',
        });

        let message = 'Что-то пошло не так, попробуйте снова';

        if (response.code === 400) {
          message = 'Телефон не должен быть пустым';
        }

        if (response.code === 406) {
          message =
            'Не опознан мобильный оператор или не правильный формат номера';
        }

        Alert.alert(message);
      } else {
        this.setState({
          code: true,
          loadingVerify: false,
          checkCode: response.checkCode,
        });
        this.CodeInput.focus();
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
      Alert.alert('Неверный код', 'Попробуйте снова', [
        {
          text: 'OK',
          onPress: () => {
            this.setState({codeValue: ''});
            this.CodeInput.clear();
          },
        },
      ]);
      return;
    }
    this.keyboardHideListener.remove();
    this.setState({loading: true, loadingVerify: true});
    this.props
      .actionSavePofileWithPhone({phone, code})
      .then(data => {
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
        Alert.alert('Что-то пошло не так...', 'Попробуем ещё раз?');
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
        Alert.alert('Что-то пошло не так', 'попробуйте снова');
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
      function(result) {
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
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  getFBToken = () => {
    AccessToken.getCurrentAccessToken().then(auth => {
      this.fetchProfileFromFacebook(auth.accessToken).then(data => {
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
    VKLogin.initialize(7255802);
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

  onInputCode = text => {
    if (text.length === 4) {
      this.setState({codeValue: text});
      setTimeout(() => {
        this._verifyCodeStepTwo();
      }, 200);
    }
  };

  onInputPhone = text => {
    this.setState({phone: text});
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
              <View style={{marginBottom: 20}}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  // useAngle
                  // angle={180}
                  // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '80%',
                    marginHorizontal: '10%',
                    marginTop: 40,
                    marginBottom: 20,
                    opacity: this.state.code ? 0 : 1,
                    height: this.state.code
                      ? Platform.select({ios: 'auto', android: 0})
                      : 'auto',
                  }}>
                  {/* <LoginButton
                        readPermissions={['email']}
                        style={{
                          width: '80%',
                          height: 44,
                          borderWidth: 0,
                        }}
                        onLoginFinished={this._loginFacebook}
                        onLogoutFinished={() => {
                          this.props.actionLogout();
                        }}
                      /> */}
                  <Button
                    onPress={this._signInWithGoogle}
                    disabled={this.state.isSigninInProgress}
                    iconLeft
                    style={[
                      styleConst.shadow.default,
                      styles.SocialLoginBt,
                      {
                        backgroundColor: '#4286F5',
                      },
                    ]}>
                    <Icon name="google" type="FontAwesome5" />
                    {/* <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через Google
                    </Text> */}
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
                        width: '29%',
                        height: 60,
                        marginVertical: 8,
                        paddingHorizontal: 8,
                      },
                    ]}>
                    <Icon
                      name="facebook"
                      type="FontAwesome5"
                      style={{fontSize: 35}}
                    />
                    {/* <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через Facebook
                    </Text> */}
                  </Button>
                  <Button
                    onPress={this._signInWithVK}
                    disabled={this.state.isSigninInProgress}
                    iconLeft
                    style={[
                      styleConst.shadow.default,
                      styles.SocialLoginBt,
                      {
                        backgroundColor: '#4680C2',
                      },
                    ]}>
                    <Icon name="vk" type="FontAwesome5" />
                    {/* <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через VK
                    </Text> */}
                  </Button>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: this.state.code ? 0 : 1,
                  }}>
                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 20,
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
                      <Button
                        disabled={this.state.loadingVerify}
                        onPress={this._cancelVerify}
                        style={[
                          styleConst.shadow.default,
                          {
                            flex: 1,
                            height: 50,
                            width: '40%',
                            backgroundColor: 'rgba(101, 101, 101, 0.9)',
                            justifyContent: 'center',
                            padding: 10,
                            borderRadius: 5,
                          },
                        ]}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={{color: '#fff'}}>Отменить</Text>
                        )}
                      </Button>
                    ) : (
                      <PhoneInput
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        ref={ref => {
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
                    {this.state.code ? (
                      <TextInput
                        style={{
                          height: 50,
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderColor: 'gray',
                          borderWidth: 1,
                          color: '#fff',
                          borderRadius: 5,
                          fontSize: 30,
                          letterSpacing: 10,
                          marginLeft: 25,
                          width: 155,
                          textAlign: 'center',
                          // marginTop: 15,
                        }}
                        textContentType="oneTimeCode"
                        keyboardType="number-pad"
                        ref={input => {
                          this.CodeInput = input;
                        }}
                        maxLength={4}
                        caretHidden={true}
                        enablesReturnKeyAutomatically={true}
                        placeholder="код"
                        returnKeyType="send"
                        placeholderTextColor="#afafaf"
                        autoCompleteType="off"
                        onChangeText={this.onInputCode}
                        // onEndEditing={() => {
                        //   if (this.state.checkCode === 4) {
                        //     this._verifyCodeStepTwo();
                        //   }
                        // }}
                      />
                    ) : null}
                  </View>
                  {this.state.code ? (
                    <Button
                      disabled={this.state.loadingVerify}
                      onPress={this._verifyCodeStepTwo}
                      style={[
                        styleConst.shadow.default,
                        {
                          marginTop: 20,
                          width: '80%',
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
                  ) : null}
                  {!this.state.code && (
                    <Button
                      onPress={this._verifyCode}
                      disabled={
                        this.state.loadingVerify
                          ? true
                          : this.state.phone
                          ? false
                          : true
                      }
                      ref={ref => {
                        this.getCodeButton = ref;
                      }}
                      style={[
                        styleConst.shadow.default,
                        {
                          marginTop: 20,
                          width: '80%',
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
    width: '25%',
    height: 50,
    marginVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
