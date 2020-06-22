// import {Platform} from 'react-native';

// const isAndroid = Platform.OS === 'android';

export default function (price, country = 'BY') {
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
    case 'ua':
    case 'uah':
      country_code = 'ru-UA';
      options = {
        ...options,
        currency: 'UAH',
      };
      break;
  }

  return parseInt(price, 10).toLocaleString(country_code, options);
}
