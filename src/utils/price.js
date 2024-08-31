import {default as currencyJS} from 'currency.js';
import {APP_REGION} from '../core/const';

const showPrice = (
  price,
  country = APP_REGION,
  float = false,
  returnAllData = false,
) => {
  if (!price) {
    return false;
  }

  let options = {
    precision: 0,
    decimal: ' ',
    separator: ' ',
  };

  if (float) {
    price = parseFloat(price, 10);
    options = {
      precision: 2,
      decimal: '.',
      separator: ' ',
    };
  } else {
    price = parseInt(price, 10);
  }
  const result = getPriceData({
    price,
    country,
    options: options || null,
  });
  if (result && result?.value === 'NaN') {
    return false;
  }
  if (returnAllData) {
    return result;
  }
  return result?.text;
};

const getPriceData = ({
  price,
  country,
  options = {
    precision: 0,
    decimal: ' ',
    separator: ' ',
  },
}) => {
  let result = {};

  const symbols = {
    USD: '$',
    RUB: '₽',
    BYN: 'BYN',
    BYR: 'BYR',
    UAH: '₴',
  };

  const USD = value =>
    currencyJS(
      value,
      Object.assign({symbol: symbols.USD, pattern: `# !`}, options),
    );
  const RUB = value =>
    currencyJS(
      value,
      Object.assign({symbol: symbols.RUB, pattern: `#!`}, options),
    );
  const BYN = value =>
    currencyJS(
      value,
      Object.assign({symbol: symbols.BYN, pattern: `# !`}, options),
    );
  const BYR = value =>
    currencyJS(
      value,
      Object.assign({symbol: symbols.BYR, pattern: `# !`}, options),
    );
  const UAH = value =>
    currencyJS(
      value,
      Object.assign({symbol: symbols.UAH, pattern: `#!`}, options),
    );

  switch (country.toLowerCase()) {
    case 'usd':
      result = {
        text: USD(price).format(),
        symbol: symbols.USD,
        value: USD(price).format().replaceAll(symbols.USD, '').trim(),
      };
      break;
    case 'ru':
    case 'rub':
    case 'rur':
      result = {
        text: RUB(price).format(),
        symbol: symbols.RUB,
        value: RUB(price).format().replaceAll(symbols.RUB, '').trim(),
      };
      break;
    case 'ua':
    case 'uah':
      result = {
        text: UAH(price).format(),
        symbol: symbols.UAH,
        value: UAH(price).format().replaceAll(symbols.UAH, '').trim(),
      };
      break;
    case 'byr':
      result = {
        text: BYR(price).format(),
        symbol: symbols.BYR,
        value: BYR(price).format().replaceAll(symbols.BYR, '').trim(),
      };
      break;
    case 'by':
    case 'byn':
    default:
      result = {
        text: BYN(price).format(),
        symbol: symbols.BYN,
        value: BYN(price).format().replaceAll(symbols.BYN, '').trim(),
      };
      break;
  }
  return result;
};

const getAllDataPrice = (
  price,
  country = APP_REGION,
  float = false,
  allData = true,
) => {
  return showPrice(price, country, float, allData);
};

export {showPrice, getAllDataPrice};
