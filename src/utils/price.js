export default function(price, country) {
  if (!country) {
    country = 'BY';
  }

  let country_code = 'be-BE',
    currency_code = 'BYN';

  switch (country.toLowerCase()) {
    case 'ru':
    case 'rub':
    case 'rur':
      country_code = 'ru-RU';
      currency_code = 'RUB';
      // currency_code = 'руб.';
      break;
    case 'by':
    case 'byn':
      country_code = 'be-BE';
      // currency_code = 'byn';
      currency_code = 'BYN';
      break;
    case 'ua':
    case 'uah':
      country_code = 'ua-UA';
      // currency_code = 'грн.';
      currency_code = 'UAH';
      break;
  }

  return parseInt(price, 10).toLocaleString(country_code, {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: currency_code,
    minimumFractionDigits: 0,
  });
}
