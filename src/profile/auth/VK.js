import VKLogin from 'react-native-vkontakte-login';
import API from '../../utils/api';

import {VK_APP_ID} from '../../core/const';

export default {
  async _GetUserDataVK() {
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
      const userData = await API.apiGetData(url, {
        method: 'GET',
      });
      console.info('Login success, get userData', userData);
      return Object.assign(auth, userData.response);
    } catch (err) {
      console.error('_GetUserDataVK apiGetDataError', err);
    }
  },

  async signIn(callbackFn) {
    VKLogin.initialize(VK_APP_ID);
    try {
      const userData = await this._GetUserDataVK();
      if (!userData) {
        return false;
      }
      const profile = {
        id: userData?.user_id,
        email: userData?.email || '',
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        personal_birthday: userData?.bdate || '',
        personal_gender: userData?.sex === 2 ? 'M' : 'F',
        // phone: userData.phone,
      };
      callbackFn({...profile, networkName: 'vk'});
    } catch (error) {
      console.error('VK signIn error', error);
    }
  },
};
