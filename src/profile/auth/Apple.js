import {appleAuth} from '@invertase/react-native-apple-authentication';

export default {
  async signIn(callbackFn) {
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
        const profile = {
          id: appleAuthRequestResponse.user,
          first_name: appleAuthRequestResponse.fullName.nickname || '',
          second_name: appleAuthRequestResponse.fullName.middleName || '',
          last_name: appleAuthRequestResponse.fullName.familyName || '',
          email: appleAuthRequestResponse.email || '',
        };
        callbackFn({...profile, networkName: 'apple'});
      } catch (error) {
        // console.log('error', error);
      }
    }
  },
};
