/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';

import {View, Platform, StyleSheet} from 'react-native';
import {Button, Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {connectSocialMedia, disconnectSocialMedia} from '../actions';
import styleConst from '../../core/style-const';

// imports for auth
import {
  AccessToken,
  GraphRequestManager,
  LoginManager,
  Settings,
} from 'react-native-fbsdk-next';
import VKLogin from 'react-native-vkontakte-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {FB_APP_ID, AUTH_DATA, APP_REGION, UKRAINE} from '../../core/const';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.email'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: AUTH_DATA[APP_REGION].GoogleSignin.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: AUTH_DATA[APP_REGION].GoogleSignin.iosClientId, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const mapStateToProps = ({profile}) => {
  return {
    login: profile.login,
  };
};
const mapDispatchToProps = {
  connectSocialMedia,
  disconnectSocialMedia,
};

const styles = StyleSheet.create({
  SocialLoginBt: {
    justifyContent: 'center',
    borderRadius: 5,
  },
  SocialLoginBtActive: {
    opacity: 0.7,
    backgroundColor: '#afafaf',
  },
  CheckCircleIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    color: styleConst.color.white,
  },
  CheckCloseIcon: {
    position: 'absolute',
    top: -10,
    right: -25,
    color: styleConst.color.black,
  },
});

class SocialAuth extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isSigninInProgress: false,
    };

    this.requestManager = new GraphRequestManager();
  }

  _connectGoogle = async ({connected}) => {
    if (connected) {
      return this.props.disconnectSocialMedia({
        profile: this.props.login,
        network: 'google',
      });
    }
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const im = {VALUE: userInfo.user.id, VALUE_TYPE: 'google'};
      this.props.connectSocialMedia({profile: this.props.login, im});
    } catch (error) {}
  };

  getFBToken = () => {
    AccessToken.getCurrentAccessToken().then(auth => {
      const im = {VALUE: auth.userID, VALUE_TYPE: 'facebook'};
      this.props.connectSocialMedia({profile: this.props.login, im});
      this.setState({isSigninInProgress: false});
    });
  };

  _connectFB = () => {
    this.setState({isSigninInProgress: true});
    Settings.initializeSDK();
    Settings.setAppID(FB_APP_ID);
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.warn('_connectFB Login cancelled');
          this.setState({isSigninInProgress: false});
        } else {
          console.info(
            '_connectFB Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          this.getFBToken();
        }
      }.bind(this),
      function (error) {
        console.error('_connectFB Login fail with error: ' + error);
        this.setState({isSigninInProgress: false});
      },
    );
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
      console.error('_GetUserDataVK apiGetDataError', err);
      this.setState({isSigninInProgress: false});
    }
  };

  _connectVK = async ({connected}) => {
    if (connected) {
      return this.props.disconnectSocialMedia({
        profile: this.props.login,
        network: 'vk',
      });
    }
    VKLogin.initialize(7255802);
    try {
      const userData = await this._GetUserDataVK();
      const im = {VALUE: userData.user_id, VALUE_TYPE: 'vk'};
      this.props.connectSocialMedia({profile: this.props.login, im});
    } catch (error) {
      console.error('_connectVK error', error);
    }
    this.setState({isSigninInProgress: false});
  };

  _signInWithApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      try {
        const im = {VALUE: appleAuthRequestResponse.user, VALUE_TYPE: 'apple'};
        this.props.connectSocialMedia({profile: this.props.login, im});
      } catch (error) {
        console.error('_signInWithApple error', error);
      }
      this.setState({isSigninInProgress: false});
    }
  };

  _renderLoginButtons = region => {
    const isAndroid = Platform.OS === 'android';
    let VKenabled = true;
    let ButtonWidth = '25%';
    let ButtonHeight = 50;

    switch (region.toLowerCase()) {
      case UKRAINE:
        VKenabled = false;
        ButtonWidth = '30%';
        ButtonHeight = 60;
        break;
      default:
        break;
    }

    const im = (this.props.login.IM || []).reduce((acc, soc) => {
      if (!soc.VALUE_TYPE) {
        return acc;
      }

      acc[soc.VALUE_TYPE.toLowerCase()] = {
        id: soc.ID || null,
        value: soc.VALUE,
      };

      return acc;
    }, {});

    return (
      <View
        style={[
          {
            width: '100%',
            opacity: this.state.code ? 0 : 1,
            height: this.state.code
              ? Platform.select({ios: 'auto', android: 0})
              : 'auto',
          },
          this.props.style,
        ]}>
        <View
          style={[
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <Button
            onPress={() => this._connectGoogle({connected: Boolean(im.google)})}
            // disabled={this.state.isSigninInProgress || Boolean(im.google)}
            leftIcon={
              <Icon
                name="google"
                as={FontAwesome5}
                size={10}
                color={styleConst.color.white}
                style={{marginLeft: 0}}
              />
            }
            rightIcon={
              im.google ? (
                <Icon
                  name="close-circle-sharp"
                  size={5}
                  as={Ionicons}
                  style={styles.CheckCloseIcon}
                />
              ) : null
            }
            style={[
              styleConst.shadow.default,
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#4286F5',
              },
              im.google ? styles.SocialLoginBtActive : null,
            ]}></Button>
          {false ? (
            <Button
              onPress={this._connectFB}
              disabled={this.state.isSigninInProgress || Boolean(im.facebook)}
              leftIcon={
                <Icon
                  name="facebook"
                  size={10}
                  as={FontAwesome5}
                  style={{
                    marginLeft: 0,
                    color: styleConst.color.white,
                  }}
                />
              }
              rightIcon={
                im.facebook ? (
                  <Icon
                    name="check-circle"
                    size={4}
                    as={FontAwesome5}
                    style={[styles.CheckCircleIcon, {right: -12, bottom: -5}]}
                  />
                ) : null
              }
              style={[
                styleConst.shadow.default,
                styles.SocialLoginBt,
                {
                  backgroundColor: '#4167B2',
                  width: VKenabled ? '29%' : ButtonWidth,
                  height: 60,
                },
                im.facebook ? styles.SocialLoginBtActive : null,
              ]}></Button>
          ) : null}
          {VKenabled ? (
            <Button
              onPress={() => this._connectVK({connected: Boolean(im.vk)})}
              // disabled={this.state.isSigninInProgress || Boolean(im.vk)}
              leftIcon={
                <Icon
                  name="vk"
                  size={10}
                  as={FontAwesome5}
                  style={{marginLeft: 0, color: styleConst.color.white}}
                />
              }
              rightIcon={
                im.vk ? (
                  <Icon
                    name="close-circle-sharp"
                    size={5}
                    as={Ionicons}
                    style={styles.CheckCloseIcon}
                  />
                ) : null
              }
              style={[
                styleConst.shadow.default,
                styles.SocialLoginBt,
                {
                  width: ButtonWidth,
                  height: ButtonHeight,
                  backgroundColor: '#4680C2',
                },
                im.vk ? styles.SocialLoginBtActive : null,
              ]}></Button>
          ) : null}
        </View>
        {!isAndroid && appleAuth.isSupported ? (
          <View>
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              // disabled={this.state.isSigninInProgress || Boolean(im.apple)}
              cornerRadius={5}
              style={[
                styleConst.shadow.default,
                styles.SocialLoginBt,
                im.apple ? styles.SocialLoginBtActive : null,
                {
                  justifyContent: 'space-between',
                  height: 45,
                  marginTop: 15,
                },
              ]}
              onPress={() =>
                this._signInWithApple({connected: Boolean(im.apple)})
              }
            />
            {im.apple ? (
              <Icon
                name="close-circle-sharp"
                size={5}
                as={Ionicons}
                style={[styles.CheckCloseIcon, {top: 5, right: -7}]}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    let {region} = this.props;
    if (!region) {
      region = APP_REGION;
    }
    return this._renderLoginButtons(region);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth);
