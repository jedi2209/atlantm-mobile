import {default as currencyJS} from 'currency.js';

const showPriceOLD = (price, country = 'BY', float = false) => {
  let country_code = 'ru-BE',
    options = {
      style: 'currency',
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
    };

  switch (country.toLowerCase()) {
    case 'ru':
    case 'rub':
    case 'rur':
      country_code = 'ru-RU';
      options = {
        ...options,
        currencyDisplay: 'symbol',
        currency: 'RUB',
      };
      break;
    case 'by':
    case 'byn':
      options = {
        ...options,
        currency: 'BYN',
      };
      country_code = 'ru-BE';
      // isAndroid
      break;
    case 'byr':
      options = {
        ...options,
        currency: 'BYR',
      };
      country_code = 'ru-BE';
      // isAndroid
      break;
    case 'ua':
    case 'uah':
      country_code = 'ru-UA';
      options = {
        ...options,
        currency: 'UAH',
      };
      break;
    default:
      country_code = 'ru-BE';
      options = {
        ...options,
        currency: 'BYN',
      };
      break;
  }
  if (float) {
    return parseFloat(price, 10).toLocaleString(country_code, options);
  } else {
    return parseInt(price, 10).toLocaleString(country_code, options);
  }
}

const showPrice = (price, country = 'BY', float = false) => {
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

  const RUB = value => currencyJS(value, Object.assign({symbol: '₽', pattern: `#!`}, options));
  const BYN = value => currencyJS(value, Object.assign({symbol: 'BYN', pattern: `# !`}, options));
  const UAH = value => currencyJS(value, Object.assign({symbol: '₴', pattern: `#!`}, options));

  switch (country.toLowerCase()) {
    case 'ru':
    case 'rub':
    case 'rur':
      result = RUB(price).format();
      break;
    case 'ua':
    case 'uah':
      result = UAH(price).format();
      break;
    case 'by':
    case 'byn':
    default:
      result = BYN(price).format();
      break;
  }
  return result;
}

export default showPrice;