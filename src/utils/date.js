import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

// moment.js playground https://codepen.io/widmoser/pen/NNOQEx

export const dayMonth = (ts) => {
  return ts ? moment(ts).format('D MMMM') : null;
};

export const yearMonthDay = (date) => {
  return date ? moment(date).format('YYYY-MM-DD') : null;
};

export const dayMonthYear = (date) => {
  return date ? moment(date).format('D MMMM YYYY') : null;
};

export const dayMonthYearTime = (date) => {
  return date ? moment(date).format('D.MM.YYYY, HH:mm') : null;
};
