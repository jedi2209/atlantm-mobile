import {APP_LANG_SET} from './actionTypes';
import strings from './const';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

export const actionSetGlobalLanguage = (lang) => {
  return (dispatch) => {
    if (lang !== 'ru' && lang !== 'ua') {
      lang = 'ru';
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
      case 'ru':
        moment.locale('ru');
        break;
      default:
        moment.locale('ru');
        break;
    }
  };
};
