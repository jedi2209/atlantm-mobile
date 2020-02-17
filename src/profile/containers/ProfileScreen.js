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
} from 'react-native';
import {Button, Icon} from 'native-base';
import PhoneInput from 'react-native-phone-input';
import {store} from '@core/store';

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
      phone: '',
      codeValue: '',
      checkCode: '',
      vkLogin: false,
      loading: false,
      loadingVerify: false,
    };

    this.requestManager = new GraphRequestManager();
    this.scrollRef = createRef();
    this.storeData = store.getState();

    // this.onPressFlag = this.onPressFlag.bind(this);
    // this._onSelectCountry = this._onSelectCountry.bind(this);
    this.state = {
      pickerData: null,
    };
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
      pickerData: this.phone.getPickerData(),
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

  _verifyCode = () => {
    const phoneCountryCode = this.phone.getCountryCode();
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
      this.setState({loadingVerify: false});

      if (response.code >= 300) {
        let message = 'Что-то пошло не так, попробуйте снова';

        if (response.code === 400) {
          message = 'Телефон не должен быть пустым';
        }

        if (response.code === 406) {
          message =
            'Не опознан мобильный оператор или не правильный формат номера';
        }

        Alert.alert(message);
        return;
      }

      this.setState({code: true, checkCode: response.checkCode});
    });
  };

  _verifyCodeStepTwo = () => {
    const phone = this.state.phone;
    const code = this.state.codeValue;

    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (code != this.state.checkCode) {
      Alert.alert('Неверный код.', 'Попробуйте снова');
      return;
    }

    this.setState({loading: true, loadingVerify: true});
    this.props
      .actionSavePofileWithPhone({phone, code})
      .then(data => {
        Keyboard.dismiss();
        return this.props.actionSavePofile(data.user);
      })
      .then(() => {
        this.setState({loading: false});
        this.props.navigation.navigate('ProfileScreenInfo');
      })
      .catch(() => {
        this.setState({loading: false});
        Alert.alert('Что-то пошло не так', 'попробуйте снова');
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
        first_name: userInfo.user.givenName,
        last_name: userInfo.user.familyName,
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

  _signInWithVK = async () => {
    VKLogin.initialize(XXXX);
    const isLoggedIn = await VKLogin.isLoggedIn();

    if (!isLoggedIn) {
      try {
        const auth = await VKLogin.login(['friends', 'photos', 'email']);
        const profile = {
          id: auth.user_id,
          email: auth.email,
        };
        this._sendDataToApi({...profile, networkName: 'vk'});
      } catch (error) {
        console.log('error', error);
      }
    } else {
      await VKLogin.logout();
    }
  };

  onInputCode = text => {
    this.setState({codeValue: text});
  };

  onInputPhone = text => {
    this.setState({phone: text});
  };

  // _onSelectCountry() {
  //   const countryCode = this.phone.getCountryCode();
  // }

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
        behavior={Platform.select({ios: 'position', android: null})}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('./bg.jpg')}
            style={{width: '100%', height: '100%'}}>
            <ScrollView ref={this.scrollRef}>
              <View style={{marginBottom: 20}}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10%',
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                    marginBottom: 20,
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
                    onPress={this._signInFB}
                    iconLeft
                    style={{
                      backgroundColor: '#4167B2',
                      width: '80%',
                      marginVertical: 8,
                      paddingHorizontal: 8,
                      justifyContent: 'flex-start',
                    }}>
                    <Icon name="facebook" type="FontAwesome5" />
                    <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через Facebook
                    </Text>
                  </Button>
                  <Button
                    onPress={this._signInWithGoogle}
                    disabled={this.state.isSigninInProgress}
                    iconLeft
                    style={{
                      backgroundColor: '#4286F5',
                      width: '80%',
                      marginVertical: 8,
                      paddingHorizontal: 8,
                      justifyContent: 'flex-start',
                    }}>
                    <Icon name="google" type="FontAwesome5" />
                    <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через Google
                    </Text>
                  </Button>
                  <Button
                    onPress={this._signInWithVK}
                    iconLeft
                    style={{
                      backgroundColor: '#4680C2',
                      width: '80%',
                      marginVertical: 8,
                      paddingHorizontal: 8,
                      justifyContent: 'flex-start',
                    }}>
                    <Icon name="vk" type="FontAwesome5" />
                    <Text style={{color: '#fff', marginLeft: 20}}>
                      Войти через VK
                    </Text>
                  </Button>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                      style={{color: '#9097A5', fontSize: 16, lineHeight: 16}}>
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
                  <PhoneInput
                    style={{
                      width: '80%',
                      justifyContent: 'center',
                      flex: 1,
                    }}
                    ref={ref => {
                      this.phone = ref;
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
                      borderColor: 'gray',
                      borderWidth: 1,
                      color: '#fff',
                      width: '100%',
                      borderRadius: 5,
                    }}
                    offset={20}
                    cancelText="Отмена"
                    confirmText="Выбрать"
                    onChangePhoneNumber={this.onInputPhone}
                    // onSelectCountry={this._onSelectCountry}
                    textProps={{
                      placeholderTextColor: 'white',
                      placeholder: 'Телефон',
                      keyboardType: 'phone-pad',
                      autoCompleteType: 'tel',
                      enablesReturnKeyAutomatically: true,
                    }}
                  />
                  {!this.state.code && (
                    <Button
                      onPress={this._verifyCode}
                      disabled={this.state.loadingVerify}
                      style={{
                        marginTop: 20,
                        width: '80%',
                        backgroundColor: '#34BD78',
                        justifyContent: 'center',
                      }}>
                      {this.state.loadingVerify ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{color: '#fff'}}>Получить код</Text>
                      )}
                    </Button>
                  )}
                  {this.state.code && (
                    <>
                      <TextInput
                        style={{
                          height: 40,
                          paddingHorizontal: 14,
                          borderColor: 'gray',
                          borderWidth: 1,
                          color: '#fff',
                          width: '80%',
                          borderRadius: 5,
                          marginTop: 15,
                        }}
                        keyboardType="number-pad"
                        enablesReturnKeyAutomatically={true}
                        placeholder="Код"
                        placeholderTextColor="white"
                        autoCompleteType="off"
                        onChangeText={this.onInputCode}
                      />
                      <Button
                        disabled={this.state.loadingVerify}
                        onPress={this._verifyCodeStepTwo}
                        style={{
                          marginTop: 20,
                          width: '80%',
                          backgroundColor: '#34BD78',
                          justifyContent: 'center',
                        }}>
                        {this.state.loadingVerify ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={{color: '#fff'}}>Подвердить</Text>
                        )}
                      </Button>
                    </>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
