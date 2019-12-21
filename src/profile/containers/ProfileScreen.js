/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
import HeaderIconReload from '../../core/components/HeaderIconReload';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import stylesFooter from '../../core/components/Footer/style';
import SafeAreaView from 'react-native-safe-area-view';

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
};

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.email'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: 'XXXX-XXXX.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    'XXXX-XXXX.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSigninInProgress: false,
    };

    console.log(GraphRequestManager);
    this.requestManager = new GraphRequestManager();
  }

  static navigationOptions = () => ({
    tabBarLabel: 'Кабинет',
    tabBarIcon: ({focused}) => (
      <Icon
        name="user"
        type="FontAwesome5"
        style={{
          fontSize: 24,
          color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
        }}
      />
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carFill: PropTypes.func,
    carNumberFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    carNumber: PropTypes.string,

    cars: PropTypes.array,

    auth: PropTypes.object,
    loginFill: PropTypes.func,
    passwordFill: PropTypes.func,
    login: PropTypes.string,
    password: PropTypes.string,
    isLoginRequest: PropTypes.bool,
    isFetchProfileData: PropTypes.bool,

    bonus: PropTypes.object,
    discounts: PropTypes.array,

    //    fcmToken: PropTypes.string,
    pushActionSubscribeState: PropTypes.bool,
    //    actionSetFCMToken: PropTypes.func,
    actionSetPushGranted: PropTypes.func,
    actionSetPushActionSubscribe: PropTypes.func,
    actionFetchCars: PropTypes.func,
  };

  static defaultProps = {
    auth: {},
  };

  componentDidMount() {
    const {auth, navigation} = this.props;

    navigation.setParams({
      isAuth: get(auth, 'token.id'),
      onReload: auth.token ? this.onReload : null,
    });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'ProfileScreen';
      }
    }

    return isActiveScreen;
  }

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
            console.log(profile);
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
      console.log('userInfo', userInfo);
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

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
              <Image source={require('./white-logo.png')} />
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <LoginButton
                publishPermissions={['email']}
                onLoginFinished={(error, result) => {
                  if (error) {
                    alert('Login failed with error: ' + error.message);
                  } else if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    alert(
                      'Login was successful with permissions: ' +
                        result.grantedPermissions,
                    );
                    console.log('result ==================>', result);
                  }
                }}
                onLogoutFinished={() => alert('User logged out')}
              />
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
                disabled={this.state.isSigninInProgress}
              />
              <Button
                iconLeft
                style={{
                  backgroundColor: '#4286F5',
                  width: '80%',
                  marginVertical: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'flex-start',
                }}>
                <Icon name="google" type="FontAwesome5" />
                <Text style={{color: '#fff', marginLeft: 8}}>
                  Войти через Google
                </Text>
              </Button>
              <Button
                onPress={() => {
                  LoginManager.logInWithPermissions(['public_profile']).then(
                    function(result) {
                      if (result.isCancelled) {
                        alert('Login was cancelled');
                      } else {
                        AccessToken.getCurrentAccessToken()
                          .then(data => {
                            console.log(data);
                            this.fetchProfile(data.accessToken).then(data1 => {
                              console.log('!!!!!!');
                              console.log('data1', data1);
                            });
                          })
                          .catch(error => {
                            console.log('!!!!!!');
                            console.log(error);
                          });
                      }
                    }.bind(this),
                    function(error) {
                      alert('Login failed with error: ' + error);
                    },
                  );
                }}
                iconLeft
                style={{
                  backgroundColor: '#4167B2',
                  width: '80%',
                  marginVertical: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'flex-start',
                }}>
                <Icon name="facebook" type="FontAwesome5" />
                <Text style={{color: '#fff', marginLeft: 8}}>
                  Войти через Facebook
                </Text>
              </Button>
              <Button
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
              </Button>
              <Button
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Form>
                <Item regular style={{width: '80%', borderRadius: 6}}>
                  <Input placeholder="Телефон" />
                </Item>
              </Form>
              <Button
                style={{
                  marginTop: 20,
                  width: '80%',
                  backgroundColor: '#34BD78',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#fff'}}>Получить код</Text>
              </Button>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );

    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      dealerSelected,
      navigation,
      nameFill,
      phoneFill,
      emailFill,
      carFill,
      carNumberFill,
      name,
      phone,
      email,
      car,
      carNumber,

      cars,
      auth,
      login,
      password,
      loginFill,
      passwordFill,
      actionLogin,
      isLoginRequest,
      bonus,
      discounts,

      //      fcmToken,
      pushActionSubscribeState,
      //      actionSetFCMToken,
      actionSetPushGranted,
      actionSetPushActionSubscribe,

      isFetchProfileData,
    } = this.props;

    console.log('== Profile ==');

    if (isFetchProfileData) {
      return <SpinnerView text="Обновляем данные личного кабинета" />;
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <Content
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={
              Platform.OS === 'android' ? 'always' : 'never'
            }>
            <List style={styles.list}>
              {!auth.token ? (
                <Auth
                  dealers={this.getDealersList()}
                  dealerSelected={dealerSelected}
                  navigation={navigation}
                  loginHandler={actionLogin}
                  isRequest={isLoginRequest}
                  login={login}
                  password={password}
                  loginFill={loginFill}
                  passwordFill={passwordFill}
                />
              ) : null}

              {auth.token ? (
                <BonusDiscount
                  bonus={get(bonus, 'saldo.value')}
                  discounts={discounts.length}
                  navigation={navigation}
                />
              ) : null}

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                navigation={navigation}
                auth={auth}
                carSection={true}
                name={name}
                phone={phone}
                email={email}
                car={car}
                carNumber={carNumber}
                cars={cars}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
                carFill={carFill}
                carNumberFill={carNumberFill}
                //                fcmToken={fcmToken}
                dealerSelected={dealerSelected}
                pushActionSubscribeState={pushActionSubscribeState}
                actionSetPushGranted={actionSetPushGranted}
                actionSetPushActionSubscribe={actionSetPushActionSubscribe}
              />
            </List>

            {auth.token ? (
              <Button onPress={this.onPressLogout} full style={styles.button}>
                <Icon name="ios-exit" style={styles.buttonIcon} />
                <Text numberOfLines={1} style={styles.buttonText}>
                  ВЫЙТИ ИЗ ЛИЧНОГО КАБИНЕТА
                </Text>
              </Button>
            ) : null}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
