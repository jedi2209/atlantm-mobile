import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import {LoginManager} from 'react-native-fbsdk';

LoginManager.logOut();

export default {
  async fetchProfileFromFacebook(token) {
    this.requestManager = new GraphRequestManager();
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
            if (result.id) {
              profile.avatar = `https://graph.facebook.com/${result.id}/picture`;
            }
            resolve(profile);
          } else {
            reject(error);
          }
        },
      );

      this.requestManager.addRequest(request).start();
    });
  },

  _getFBToken(callbackFn) {
    AccessToken.getCurrentAccessToken().then(auth => {
      this.fetchProfileFromFacebook(auth.accessToken).then(data => {
        callbackFn({...data, networkName: 'fb'});
      });
    });
  },

  signIn(callbackFn) {
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.warn('Facebook signIn Login cancelled', result);
        } else {
          console.info(
            'Facebook Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          this._getFBToken(callbackFn);
        }
      }.bind(this),
      function (error) {
        console.error('Facebook signIn Login fail with error: ' + error);
      },
    );
  },
};
