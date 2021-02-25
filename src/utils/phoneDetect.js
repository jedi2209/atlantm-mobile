export default class PhoneDetect {
  static cleanNum(anyNumber) {
    return ('' + anyNumber).replace(/\D/g, '');
  }

  static country(anyNumber) {
    const cleanVal = this.cleanNum(anyNumber);
    if (!cleanVal) {
      return false;
    }
    const first = cleanVal.charAt(0);
    if (!first) {
      return false;
    }
    const second = cleanVal.charAt(1);
    let country = {};
    switch (parseInt(first)) {
      case 7:
        // ru
        country = {
          name: 'Russia',
          code: 'ru',
          phoneCode: '+7',
          nums: {
            total: 11,
            phone: 7,
            code: 3,
            country: 1,
          },
        };
        break;
      case 3:
        // by / ua
        if (second) {
          switch (parseInt(second)) {
            case 7:
              // by
              country = {
                name: 'Belarus',
                code: 'by',
                phoneCode: '+375',
                nums: {
                  total: 12,
                  phone: 7,
                  code: 2,
                  country: 3,
                },
              };
              break;
            case 8:
              country = {
                name: 'Ukraine',
                code: 'ua',
                phoneCode: '+380',
                nums: {
                  total: 12,
                  phone: 7,
                  code: 2,
                  country: 3,
                },
              };
              // ua
              break;
          }
        }
        break;
    }
    return country;
  }

  static getCountryCodeByMask(mask) {
    let countryCode = '';
    if (mask.indexOf('+7') !== -1) {
      countryCode = 'ru';
    }
    if (mask.indexOf('+380') !== -1) {
      countryCode = 'ua';
    }
    if (mask.indexOf('+375') !== -1) {
      countryCode = 'by';
    }
    return countryCode;
  }

  static validatePhone(anyNumber) {
    const cleanVal = this.cleanNum(anyNumber);
    if (!cleanVal) {
      return false;
    }
    if (anyNumber.length) {
      const country = this.country(anyNumber);
      if (!country) {
        return false;
      }
      if (country.nums.total === anyNumber) {
        return true;
      }
    }
  }
}
