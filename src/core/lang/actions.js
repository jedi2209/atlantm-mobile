import {APP_LANG_SET} from './actionTypes';

export const actionSetGlobalLanguage = (lang) => {
  return (dispatch) => {
    if (lang !== 'ru' && lang !== 'ua') {
      lang = 'ru';
    }
    dispatch({
      type: APP_LANG_SET,
      payload: lang,
    });
  };
};
