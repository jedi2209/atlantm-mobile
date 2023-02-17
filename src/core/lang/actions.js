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

    strings.setLanguage(lang || APP_LANG);
    moment.locale(lang || APP_LANG);
  };
};
