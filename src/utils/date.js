import moment from 'moment-timezone';
import 'moment/locale/ru';
import 'moment/locale/uk';
import {APP_LANG} from '../core/const';

moment.locale(APP_LANG);

// moment.js playground https://codepen.io/widmoser/pen/NNOQEx

export const time = date =>
  date ? moment(date).tz('Europe/Minsk').format('HH:mm') : null;

export const year = moment().year();

export const dayMonth = ts =>
  ts ? moment(ts).tz('Europe/Minsk').format('D MMMM') : null;

export const format = (date, format) =>
  date
    ? moment(date)
        .tz('Europe/Minsk')
        .format(format ? format : 'YYYY-MM-DD')
    : null;

export const yearMonthDay = date =>
  date ? moment(date).tz('Europe/Minsk').format('YYYY-MM-DD') : null;

export const dayMonthYear = date =>
  date ? moment(date).tz('Europe/Minsk').format('D MMMM YYYY') : null;

export const dayMonthYearTime = date =>
  date ? moment(date).tz('Europe/Minsk').format('D.MM.YYYY, HH:mm') : null;

export const dayMonthYearTime2 = date =>
  date ? moment(date).tz('Europe/Minsk').format('D MMM YYYY, HH:mm') : null;

export const humanDate = date =>
  date ? moment(date).tz('Europe/Minsk').format('DD MMMM') : null;

export const humanDateTime = date =>
  date ? moment(date).tz('Europe/Minsk').format('DD MMMM в HH:mm') : null;

export const substructMonth = () =>
  moment().tz('Europe/Minsk').subtract(1, 'months').format('YYYY-MM-DD');

export const substractWeek = () =>
  moment().tz('Europe/Minsk').subtract(1, 'week').format('YYYY-MM-DD');

export const substractYears = yearsCol =>
  moment().tz('Europe/Minsk').subtract(yearsCol, 'years').format('YYYY-MM-DD');

export const addDays = daysCol =>
  moment().tz('Europe/Minsk').add(daysCol, 'days').format('YYYY-MM-DD');

export const getTimestampInSeconds = () => parseInt(moment().unix(), 10);

export const getTimestamp = () => moment().unix();

export const getTimestampFromDate = date =>
  parseInt(moment(date).format('X'), 10);

export const getDateFromTimestamp = ts => moment.unix(ts);

export const getHumanTime = seconds => {
  const hrs = Math.ceil(seconds / 60 / 60);
  const mns = Math.ceil(seconds % 60);
  if (hrs && mns) {
    return `${hrs} ч. ${mns} мин.`;
  } else if (hrs) {
    return `${hrs} ч.`;
  } else if (mns) {
    return `${mns} мин.`;
  }
};
