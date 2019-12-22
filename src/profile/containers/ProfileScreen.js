/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  Platform,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Container,
  Content,
  List,
  StyleProvider,
  Button,
  Icon,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';

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

// components
import Auth from '../components/Auth';
import ProfileForm from '../components/ProfileForm';
import ListItemHeader from '../components/ListItemHeader';
import BonusDiscount from '../components/BonusDiscount';
import SpinnerView from '../../core/components/SpinnerView';
import DealerItemList from '../../core/components/DealerItemList';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    paddingBottom: isAndroid ? 0 : styleConst.ui.footerHeightIphone,
  },
  button: {
    height: isAndroid
      ? styleConst.ui.footerHeightAndroid
      : styleConst.ui.footerHeightIphone,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
    marginBottom: 30,

    ...Platform.select({
      ios: {
        borderBottomWidth: styleConst.ui.borderWidth,
        borderBottomColor: styleConst.color.border,
      },
    }),
  },
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
    flex: 1,
    flexDirection: 'row',
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
});

const mapStateToProps = ({dealer, profile, nav, core}) => {
  console.log('profile.login =============>', profile.login);

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

    //    fcmToken: core.fcmToken,
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

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

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
    };

    this.requestManager = new GraphRequestManager();
  }

  static navigationOptions = () => ({
    header: null,
  });

  static defaultProps = {
    auth: {},
  };

  _verifyCode = () => {
    const phone = this.state.phone;
    this.props.actionSavePofileWithPhone({phone}).then(checkCode => {
      this.setState({code: true, checkCode});
    });
  };

  _verifyCodeStepTwo = () => {
    const phone = this.state.phone;
    const code = this.state.codeValue;

    this.props.actionSavePofileWithPhone({phone, code}).then(data => {
      // SAP: {ID: "62513365", TOKEN: "f7c27e35610137909a092be12fc1e2b1"}
      console.log(data);
      this.props
        .actionSavePofile({
          first_name: data.NAME,
          last_name: data.LAST_NAME,
          token: data.SAP.TOKEN,
          id: data.SAP.ID,
        });

        Keyboard.dismiss();

        setTimeout(() => this.props.navigation.navigate('ProfileScreenInfo'), 600)
    });
  };

  _sendDataToApi(profile) {
    console.log('ya tyt', this.props);
    this.props.actionSavePofile(profile);
    // todo?
    this.props.navigation.navigate('ProfileScreenInfo');
  }

  componentDidMount() {
    const {auth, navigation, profile} = this.props;

    console.log('profile', profile);

    if (profile && profile.login) {
      console.log('ya tyt navigate me');
    }

    navigation.setParams({
      isAuth: get(auth, 'token.id'),
      onReload: auth.token ? this.onReload : null,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   const nav = nextProps.nav.newState;
  //   let isActiveScreen = false;

  //   if (nav) {
  //     const rootLevel = nav.routes[nav.index];
  //     if (rootLevel) {
  //       isActiveScreen =
  //         get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
  //         'ProfileScreen';
  //     }
  //   }

  //   return isActiveScreen;
  // }

  onReload = () => {
    const {auth, actionFetchProfileData} = this.props;
    const token = get(auth, 'token.id');

    actionFetchProfileData({token});
  };

  onPressLogout = () => {
    const {auth, actionLogout} = this.props;

    return Alert.alert(
      'Подтверждение выхода',
      'Вы действительно хотите выйти?',
      [
        {text: 'Нет', style: 'destructive'},
        {
          text: 'Выйти',
          onPress() {
            if (get(auth, 'login') === 'zteam') {
              // отключаем debug режим
              window.atlantmDebug = null;
            }

            setTimeout(() => {
              PushNotifications.removeTag('login');
              actionLogout();
            }, 100);
          },
        },
      ],
    );
  };

  getDealersList = () => {
    const {listRussia, listUkraine, listBelarussia} = this.props;
    return [].concat(listRussia, listUkraine, listBelarussia);
  };

  async fetchProfile(token) {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'email,name,first_name,middle_name,last_name', // what you want to get
            },
            access_token: {
              string: token, // put your accessToken here
            },
          },
        },
        (error, result) => {
          if (result) {
            const profile = result;
            console.log('async fetchProfile', profile);
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

  // Somewhere in your code
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google auth userInfo', userInfo);
      this.setState({userInfo});
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
  }

  onInputCode = text => {
    this.setState({codeValue: text});
  }

  onInputPhone = text => {
      this.setState({phone: text});
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('./bg.jpg')}
            style={{width: '100%', height: '100%'}}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 100,
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
              <LoginButton
                readPermissions={['email']}
                style={{
                  width: '80%',
                  height: 44,
                  borderWidth: 0,
                }}
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log('Facebook login error', error);
                  } else if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                      this.fetchProfile(data.accessToken).then(data1 => {
                        // this.setState({userInfo: data1});
                        this._sendDataToApi(data1);
                      });
                    });
                    console.log('Facebook login success', result);
                  }
                }}
                onLogoutFinished={() => {
                  this.props.actionLogout();
                }}
              />
              <GoogleSigninButton
                style={{
                  width: '82%',
                  height: 52,
                  marginVertical: 8,
                  borderWidth: 0,
                  marginTop: 12,
                }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={this._signIn}
                disabled={this.state.isSigninInProgress}
              />
              {/* <Button
                iconLeft
                style={{
                  backgroundColor: '#EB722E',
                  width: '80%',
                  marginVertical: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'flex-start',
                }}>
                <Icon name="home" />
                <Text style={{color: '#fff', marginLeft: 8}}>
                  Войти через Одноклассники
                </Text>
              </Button> */}
              <Button
                onPress={async () => {
                  const isLoggedIn = await VKLogin.isLoggedIn();

                  if (isLoggedIn) {
                    console.log('isLoggedIn', isLoggedIn);
                  }
                  try {
                    const auth = await VKLogin.login([
                      'friends',
                      'photos',
                      'email',
                    ]);
                    console.log(auth.access_token, auth);
                    // await VKLogin.logout();
                  } catch (error) {
                    console.error(error);
                  }
                }}
                iconLeft
                style={{
                  backgroundColor: '#4680C2',
                  width: '80%',
                  marginVertical: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'flex-start',
                }}>
                <Icon name="vk" type="FontAwesome5" />
                <Text style={{color: '#fff', marginLeft: 8}}>
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
                  style={{backgroundColor: '#979797', height: 1, width: '40%'}}
                />
                <Text style={{color: '#9097A5', fontSize: 16, lineHeight: 16}}>
                  или
                </Text>
                <View
                  style={{backgroundColor: '#979797', height: 1, width: '40%'}}
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
              <TextInput
                style={{
                  height: 40,
                  paddingHorizontal: 14,
                  borderColor: 'gray',
                  borderWidth: 1,
                  color: '#fff',
                  width: '80%',
                  borderRadius: 5,
                }}
                placeholder="Телефон"
                keyboardType="phone-pad"
                onChangeText={this.onInputPhone}
              />
              {!this.state.code && (
                <Button
                  onPress={this._verifyCode}
                  style={{
                    marginTop: 20,
                    width: '80%',
                    backgroundColor: '#34BD78',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff'}}>Получить код</Text>
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
                    placeholder="Код"
                    onChangeText={this.onInputCode}
                  />
                  <Button
                    onPress={this._verifyCodeStepTwo}
                    style={{
                      marginTop: 20,
                      width: '80%',
                      backgroundColor: '#34BD78',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#fff'}}>Подвердить</Text>
                  </Button>
                </>
              )}
            </View>
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
