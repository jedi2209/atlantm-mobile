export default function(price, country) {
  if (!country) {
    country = 'BY';
  }

  let country_code = 'be-BE',
    currency_code = 'BYN',
    currency_show = 'symbol';

  switch (country.toLowerCase()) {
    case 'ru':
    case 'rub':
    case 'rur':
      country_code = 'ru-RU';
      currency_code = 'RUB';
      currency_show = 'symbol';
      // currency_code = 'руб.';
      break;
    case 'by':
    case 'byn':
      country_code = 'be-BE';
      // currency_code = 'byn';
      currency_code = 'BYN';
      currency_show = 'code';
      break;
    case 'ua':
    case 'uah':
      country_code = 'ua-UA';
      // currency_code = 'грн.';
      currency_code = 'UAH';
      currency_show = 'code';
      break;
  }

  return parseInt(price, 10).toLocaleString(country_code, {
    style: 'currency',
    currencyDisplay: currency_show,
    currency: currency_code,
    minimumFractionDigits: 0,
  });
}
