/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';

import {View, Platform, StyleSheet} from 'react-native';
import {Button, Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {connectSocialMedia, disconnectSocialMedia} from '../actions';
import styleConst from '../../core/style-const';

// imports for auth
import VKLogin from 'react-native-vkontakte-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {get} from 'lodash';

import {AUTH_DATA, APP_REGION, UKRAINE, VK_APP_ID} from '../../core/const';
import {ActivityIndicator} from 'react-native-paper';

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
  },
  SocialLoginBtActive: {
    backgroundColor: '#cccccc',
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
    right: -15,
    color: styleConst.color.black,
  },
});

const _GetUserDataVK = async () => {
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
    return false;
  }
};

const transformIM = (im = []) => {
  return im.reduce((acc, soc) => {
    if (!soc.VALUE_TYPE) {
      return acc;
    }

    acc[soc.VALUE_TYPE.toLowerCase()] = {
      id: soc.ID || null,
      value: soc.VALUE,
    };

    return acc;
  }, {});
};

const SocialAuth = ({
  connectSocialMedia,
  disconnectSocialMedia,
  login,
  region = APP_REGION,
  style,
}) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  const isAndroid = Platform.OS === 'android';
  let VKenabled = true;
  let ButtonWidth = '25%';
  let ButtonHeight = 50;
  let im = useRef([]);
  im.current = transformIM(get(login, 'IM', []));

  switch (region.toLowerCase()) {
    case UKRAINE:
      VKenabled = false;
      ButtonWidth = '30%';
      ButtonHeight = 60;
      break;
    default:
      break;
  }

  const connectSocialWrapper = async ({profile, im}) => {
    const res = await connectSocialMedia({
      profile,
      im,
    });
    if (get(res, 'type') === 'SAVE_PROFILE__UPDATE') {
      return get(res, 'payload');
    } else {
      console.error('connectSocialWrapper error', res);
      return false;
    }
  };

  const _connectGoogle = async ({profile, connected}) => {
    if (connected) {
      await disconnectSocialMedia({
        profile,
        network: 'google',
      });
      return;
    }

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    return await connectSocialWrapper({
      profile,
      im: {
        VALUE: userInfo.user.id,
        VALUE_TYPE: 'google',
      },
    });
  };

  const _connectVK = async ({profile, connected}) => {
    if (connected) {
      await disconnectSocialMedia({
        profile,
        network: 'vk',
      });
      return;
    }
    VKLogin.initialize(VK_APP_ID);
    const userData = await _GetUserDataVK();
    return await connectSocialWrapper({
      profile,
      im: {
        VALUE: userData.user_id,
        VALUE_TYPE: 'vk',
      },
    });
  };

  const _signInWithApple = async ({profile, connected}) => {
    if (connected) {
      await disconnectSocialMedia({
        profile,
        network: 'apple',
      });
      return;
    }
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
      return await connectSocialWrapper({
        profile,
        im: {
          VALUE: appleAuthRequestResponse.user,
          VALUE_TYPE: 'apple',
        },
      });
    }
  };

  console.info('im', im);

  return (
    <View
      style={[
        {
          width: '100%',
          opacity: 1,
          height: 'auto',
        },
        style,
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
          onPress={async () => {
            setIsSigninInProgress('google');
            _connectGoogle({
              profile: login,
              connected: Boolean(get(im, 'current.google', false)),
            })
              .then(res => {
                setIsSigninInProgress(false);
              })
              .catch(err => {
                console.error('Google auth error', err);
                setIsSigninInProgress(false);
              });
          }}
          // disabled={isSigninInProgress || Boolean(get(im, 'current.google', false))}
          isLoading={isSigninInProgress && isSigninInProgress === 'google'}
          _spinner={{
            color: styleConst.color.blue,
          }}
          borderRadius={5}
          leftIcon={
            <Icon
              name="google"
              as={FontAwesome5}
              size={8}
              color={styleConst.color.white}
              style={{marginLeft: 0}}
            />
          }
          rightIcon={
            get(im, 'current.google', false) ? (
              <Icon
                name="close-circle-sharp"
                size={5}
                as={Ionicons}
                style={[styles.CheckCloseIcon, {right: -27, top: -14}]}
              />
            ) : null
          }
          style={[
            styles.SocialLoginBt,
            {
              width: ButtonWidth,
              height: ButtonHeight,
              backgroundColor: '#4286F5',
            },
            get(im, 'current.google', false)
              ? styles.SocialLoginBtActive
              : null,
          ]}
        />
        {!isAndroid && appleAuth.isSupported ? (
          <Button
            onPress={async () => {
              setIsSigninInProgress('apple');
              _signInWithApple({
                profile: login,
                connected: Boolean(get(im, 'current.apple', false)),
              })
                .then(res => {
                  setIsSigninInProgress(false);
                })
                .catch(err => {
                  console.error('Apple auth error', err);
                  setIsSigninInProgress(false);
                });
            }}
            isLoading={isSigninInProgress && isSigninInProgress === 'apple'}
            _spinner={{
              color: styleConst.color.blue,
            }}
            borderRadius={5}
            leftIcon={
              <Icon
                name="apple"
                size={10}
                as={FontAwesome5}
                style={{
                  marginLeft: get(im, 'current.apple', false) ? 15 : 10,
                  color: styleConst.color.white,
                }}
              />
            }
            rightIcon={
              get(im, 'current.apple', false) ? (
                <Icon
                  name="close-circle-sharp"
                  size={5}
                  as={Ionicons}
                  style={styles.CheckCloseIcon}
                />
              ) : null
            }
            style={[
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#000000',
              },
              get(im, 'current.apple', false)
                ? styles.SocialLoginBtActive
                : null,
            ]}
          />
        ) : null}
        {VKenabled ? (
          <Button
            onPress={async () => {
              setIsSigninInProgress('vk');
              _connectVK({
                profile: login,
                connected: Boolean(get(im, 'current.vk', false)),
              })
                .then(res => {
                  setIsSigninInProgress(false);
                })
                .catch(err => {
                  console.error('VK auth error', err);
                  setIsSigninInProgress(false);
                });
            }}
            // disabled={isSigninInProgress || Boolean(get(im, 'current.vk', false))}
            isLoading={isSigninInProgress && isSigninInProgress === 'vk'}
            _spinner={{
              color: styleConst.color.blue,
            }}
            borderRadius={5}
            leftIcon={
              <Icon
                name="vk"
                size={12}
                as={FontAwesome5}
                style={{
                  marginTop: 3,
                  color: styleConst.color.white,
                }}
              />
            }
            rightIcon={
              get(im, 'current.vk', false) ? (
                <Icon
                  name="close-circle-sharp"
                  size={5}
                  as={Ionicons}
                  style={[styles.CheckCloseIcon, {right: -19, top: -5}]}
                />
              ) : null
            }
            style={[
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#4680C2',
              },
              get(im, 'current.vk', false) ? styles.SocialLoginBtActive : null,
            ]}
          />
        ) : null}
      </View>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth);
