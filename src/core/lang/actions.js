import {APP_LANG_SET} from './actionTypes';
import {strings} from './const';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

export const actionSetGlobalLanguage = lang => {
  return dispatch => {
    if (lang !== 'ru') {
      lang = 'ru';
    }
    dispatch({
      type: APP_LANG_SET,
      payload: lang,
    });

    strings.setLanguage(lang);
    switch (lang) {
      case 'ua':
      case 'uk':
        moment.locale('uk');
        break;
      case 'ru':
      case 'by':
        moment.locale('ru');
        break;
      default:
        moment.locale('ru');
        break;
    }
  };
};
