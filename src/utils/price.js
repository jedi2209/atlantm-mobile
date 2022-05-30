import {default as currencyJS} from 'currency.js';

const showPrice = (price, country = 'BY', float = false) => {
  if (!price) {
    return false;
  }

  let result;
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

  const USD = value =>
    currencyJS(value, Object.assign({symbol: '$', pattern: `# !`}, options));
  const RUB = value =>
    currencyJS(value, Object.assign({symbol: '₽', pattern: `#!`}, options));
  const BYN = value =>
    currencyJS(value, Object.assign({symbol: 'BYN', pattern: `# !`}, options));
  const BYR = value =>
    currencyJS(value, Object.assign({symbol: 'BYR', pattern: `# !`}, options));
  const UAH = value =>
    currencyJS(value, Object.assign({symbol: '₴', pattern: `#!`}, options));

  switch (country.toLowerCase()) {
    case 'usd':
      result = USD(price).format();
      break;
    case 'ru':
    case 'rub':
    case 'rur':
      result = RUB(price).format();
      break;
    case 'ua':
    case 'uah':
      result = UAH(price).format();
      break;
    case 'byr':
      result = BYR(price).format();
      break;
    case 'by':
    case 'byn':
    default:
      result = BYN(price).format();
      break;
  }
  return result;
};

export default showPrice;
