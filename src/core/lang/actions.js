import {APP_LANG_SET} from './actionTypes';
import {strings} from './const';
import moment from 'moment';
import 'moment/locale/uk';

export const actionSetGlobalLanguage = lang => {
  return dispatch => {
    if (lang !== 'ua') {
      lang = 'ua';
    }
    dispatch({
      type: APP_LANG_SET,
      payload: lang,
    });

    strings.setLanguage(lang);
    switch (lang) {
      case 'ua':
        moment.locale('uk');
        break;
      default:
        moment.locale('uk');
        break;
    }
  };
};
