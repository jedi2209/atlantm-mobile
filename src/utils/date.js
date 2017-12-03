import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

// moment.js playground https://codepen.io/widmoser/pen/NNOQEx

export const dayMonth = (ts) => ts ? moment(ts).format('D MMMM') : null;

export const yearMonthDay = (date) => date ? moment(date).format('YYYY-MM-DD') : null;

export const dayMonthYear = (date) => date ? moment(date).format('D MMMM YYYY') : null;

export const dayMonthYearTime = (date) => date ? moment(date).format('D.MM.YYYY, HH:mm') : null;

export const substructMonth = () => moment().subtract(1, 'months').format('YYYY-MM-DD');

export const substructWeek = () => moment().subtract(1, 'week').format('YYYY-MM-DD');

export const substructYear = () => moment().subtract(1, 'year').format('YYYY-MM-DD');

export const substruct10Years = () => moment().subtract(10, 'year').format('YYYY-MM-DD');
