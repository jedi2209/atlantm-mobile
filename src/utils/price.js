export default function(price, country, currency) {
  country = 'BY';
  currency = 'BY';

  let country_code = 'be-BE',
    currency_code = 'BYN';

  switch (country.toLowerCase()) {
    case 'ru':
      country_code = 'ru-RU';
      currency_code = 'RUB';
      break;
    case 'by':
      country_code = 'be-BE';
      currency_code = 'BYN';
      break;
    case 'ua':
      country_code = 'ua-UA';
      currency_code = 'UAH';
      break;
  }
  return parseFloat(price).toLocaleString(country_code, {
    style: 'currency',
    currency: currency_code,
    maximumFractionDigits: 1,
    maximumSignificantDigits: 1,
  });
}
