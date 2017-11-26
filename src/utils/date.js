import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

// moment.js playground https://codepen.io/widmoser/pen/NNOQEx

export const dayMonth = (ts) => ts ? moment(ts).format('D MMMM') : null;

export const yearMonthDay = (date) => date ? moment(date).format('YYYY-MM-DD') : null;

export const dayMonthYear = (date) => date ? moment(date).format('D MMMM YYYY') : null;

export const dayMonthYearTime = (date) => date ? moment(date).format('D.MM.YYYY, HH:mm') : null;

export const firstDayOfMonth = () => moment().startOf('month').format('YYYY-MM-DD');
