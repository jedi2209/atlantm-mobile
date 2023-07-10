// import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {AUTH_DATA, APP_REGION} from '../../core/const';

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

export default {
  async signIn(callbackFn) {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.info('Login success, get userInfo', userInfo);

      const profile = {
        id: userInfo.user.id,
        email: userInfo.user.email,
        first_name: userInfo.user.givenName || '',
        last_name: userInfo.user.familyName || '',
        photo: userInfo.user.photo || '',
      };

      // Create a Google credential with the token
      // if (userInfo?.idToken) {
      //   const googleCredential = auth.GoogleAuthProvider.credential(
      //     userInfo.idToken,
      //   );
      //   auth().signInWithCredential(googleCredential);
      // }

      callbackFn({...profile, networkName: 'gl'});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn('Google auth cancelled', error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.info('Google auth in process', error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Google auth play services', error);
        // play services not available or outdated
      } else {
        console.error('Google auth error', error);
        // some other error happened
      }
    }
  },
};
