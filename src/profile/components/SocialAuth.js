/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';

import {View, Platform, StyleSheet} from 'react-native';
import {Button, Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {connectSocialMedia} from '../actions';
import styleConst from '../../core/style-const';

// imports for auth
import {AccessToken, GraphRequestManager} from 'react-native-fbsdk';
import {LoginManager} from 'react-native-fbsdk';
import VKLogin from 'react-native-vkontakte-login';
import {GoogleSignin} from '@react-native-community/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

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

const mapStateToProps = ({profile}) => {
  return {
    login: profile.login,
  };
};
const mapDispatchToProps = {
  connectSocialMedia,
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
    fontSize: 14,
    position: 'absolute',
    bottom: 4,
    right: 5,
    marginRight: 0,
    marginLeft: 0,
    color: styleConst.color.white,
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

  _connectGoogle = async () => {
    console.log('_connectGoogle');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const im = {VALUE: userInfo.user.id, VALUE_TYPE: 'google'};
      this.props.connectSocialMedia({profile: this.props.login, im});
    } catch (error) {}
  };

  getFBToken = () => {
    AccessToken.getCurrentAccessToken().then((auth) => {
      const im = {VALUE: auth.userID, VALUE_TYPE: 'facebook'};
      this.props.connectSocialMedia({profile: this.props.login, im});
      this.setState({isSigninInProgress: false});
    });
  };

  _connectFB = () => {
    this.setState({isSigninInProgress: true});
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
          this.setState({isSigninInProgress: false});
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
      console.log('apiGetDataError', err);
      this.setState({isSigninInProgress: false});
    }
  };

  _connectVK = async () => {
    console.log('_connectVK');
    VKLogin.initialize(XXXX);
    try {
      const userData = await this._GetUserDataVK();
      console.log('userData', userData);
      const im = {VALUE: userData.user_id, VALUE_TYPE: 'vk'};
      this.props.connectSocialMedia({profile: this.props.login, im});
    } catch (error) {
      console.log('error', error);
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
        // console.log('error', error);
      }
      this.setState({isSigninInProgress: false});
    }
  };

  _renderLoginButtons = (region) => {
    const isAndroid = Platform.OS === 'android';
    let VKenabled = true;
    let ButtonWidth = '25%';
    let ButtonHeight = 50;

    switch (region.toLowerCase()) {
      case 'ua':
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
            onPress={this._connectGoogle}
            disabled={this.state.isSigninInProgress || Boolean(im.google)}
            iconLeft
            style={[
              styleConst.shadow.default,
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#4286F5',
              },
              im.google ? styles.SocialLoginBtActive : null,
            ]}>
            <Icon
              name="google"
              type="FontAwesome5"
              style={{marginLeft: 0, color: styleConst.color.white}}
            />
            {im.google ? (
              <Icon
                name="check-circle"
                type="FontAwesome5"
                style={styles.CheckCircleIcon}
              />
            ) : null}
          </Button>
          <Button
            onPress={this._connectFB}
            disabled={this.state.isSigninInProgress || Boolean(im.facebook)}
            style={[
              styleConst.shadow.default,
              styles.SocialLoginBt,
              {
                backgroundColor: '#4167B2',
                width: VKenabled ? '29%' : ButtonWidth,
                height: 60,
              },
              im.facebook ? styles.SocialLoginBtActive : null,
            ]}>
            <Icon
              name="facebook"
              type="FontAwesome5"
              style={{
                marginLeft: 0,
                color: styleConst.color.white,
                fontSize: 35,
              }}
            />
            {im.facebook ? (
              <Icon
                name="check-circle"
                type="FontAwesome5"
                style={styles.CheckCircleIcon}
              />
            ) : null}
          </Button>
          {VKenabled ? (
            <Button
              onPress={this._connectVK}
              disabled={this.state.isSigninInProgress || Boolean(im.vk)}
              iconLeft
              style={[
                styleConst.shadow.default,
                styles.SocialLoginBt,
                {
                  width: ButtonWidth,
                  height: ButtonHeight,
                  backgroundColor: '#4680C2',
                },
                im.vk ? styles.SocialLoginBtActive : null,
              ]}>
              <Icon
                name="vk"
                type="FontAwesome5"
                style={{marginLeft: 0, color: styleConst.color.white}}
              />
              {im.vk ? (
                <Icon
                  name="check-circle"
                  type="FontAwesome5"
                  style={styles.CheckCircleIcon}
                />
              ) : null}
            </Button>
          ) : null}
        </View>
        {!isAndroid && appleAuth.isSupported ? (
          <View>
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              disabled={this.state.isSigninInProgress || Boolean(im.apple)}
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
              onPress={() => this._signInWithApple()}
            />
            {im.apple ? (
              <Icon
                name="check-circle"
                type="FontAwesome5"
                style={styles.CheckCircleIcon}
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
      region = 'by';
    }
    return this._renderLoginButtons(region);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth);
