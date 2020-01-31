import numberWithGap from '@utils/number-with-gap';

export default function(price, country, currency) {
  country = 'BY';
  currency = 'BY';

  let country_code = 'be-BE',
    currency_code = 'BYN';

  switch (country.toLowerCase()) {
    case 'ru':
      country_code = 'ru-RU';
      // currency_code = 'RUB';
      currency_code = 'руб.';
      break;
    case 'by':
      country_code = 'be-BE';
      currency_code = 'руб.';
      // currency_code = 'BYN';
      break;
    case 'ua':
      country_code = 'ua-UA';
      currency_code = 'грн.';
      // currency_code = 'UAH';

      break;
  }

  return `${numberWithGap(price)} ${currency_code}`;
  // return parseInt(price, 10).toLocaleString(country_code, {
  //   style: 'currency',
  //   currency: currency_code,
  //   maximumFractionDigits: 1,
  //   //maximumSignificantDigits: 1,
  // });
}
