import {APP_LANG_SET} from './actionTypes';
import {strings} from './const';
import {APP_LANG} from '../const';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

export const actionSetGlobalLanguage = lang => {
  return dispatch => {
    dispatch({
      type: APP_LANG_SET,
      payload: APP_LANG,
    });

    strings.setLanguage(APP_LANG);
    switch (APP_LANG) {
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
