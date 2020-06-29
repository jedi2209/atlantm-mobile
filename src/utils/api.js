import _ from 'lodash';

import {Platform, Linking, Alert, BackHandler} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const isAndroid = Platform.OS === 'android';

const host = 'https://api.atlantm.com/v1';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${
    isAndroid
      ? 'M8ttryMRXs6aTqfH4zNFSPUC78eKoVr3bw5cRwDe'
      : 'kZJt475LBU3B7aL82j43l7IBab165xbiuIqIqcv9'
  }`,
  'App-Version': DeviceInfo.getVersion(),
};
const baseRequestParams = {
  method: 'GET',
  headers,
};

export default {
  fetchDealers() {
    return this.request('/dealer/info/get/', baseRequestParams);
  },

  fetchDealer(id) {
    return this.request(`/dealer/info/get/${id}/`, baseRequestParams);
  },

  fetchBrands() {
    return this.request('/brands/info/get/', baseRequestParams);
  },

  fetchInfoList(region = 0, dealer = 0) {
    return this.request(
      `/info/actions/get/?region=${region}&dealer=${dealer}`,
      baseRequestParams,
    );
  },

  fetchInfoPost(infoID) {
    return this.request(`/info/actions/get/${infoID}/`, baseRequestParams);
  },

  async fetchVersion(version) {
    if (!version) {
      //console.log('version undefined', version);
      return false;
    }
    let requestedVersion = parseInt(version.replace(/\./gi, ''));
    let req = await this.request(
      '/mobile/check/version/',
      baseRequestParams,
    ).then((res) => {
      if (res && res.version) {
        let APPVersionFromApi = parseInt(res.version.replace(/\./gi, ''));
        if (APPVersionFromApi > requestedVersion) {
          let STORE_LINK;
          if (Platform.OS === 'ios') {
            STORE_LINK =
              'itms-apps://itunes.apple.com/app/id1492492166?action=update';
          } else {
            STORE_LINK = 'market://details?id=com.atlantm';
          }

          Alert.alert(
            'Есть свежая версия! 🏎',
            'Пожалуйста обновите приложение до актуальной версии.',
            [
              {text: 'Позже', style: 'destructive'},
              {
                text: '✅ Обновить',
                onPress: () => {
                  BackHandler.exitApp();
                  Linking.openURL(STORE_LINK);
                },
              },
            ],
          );
        }
      }
    });
    return req;
  },

  fetchTva({dealer, region, number, pushTracking}) {
    const url = `/tva/get/?number=${number}&region=${region}&dealer=${dealer}&notify=${pushTracking}&platform=${
      isAndroid ? 1 : 2
    }`;

    // __DEV__ && console.log('API fetchTva url', url);

    return this.request(url, baseRequestParams);
  },

  fetchIndicators() {
    return this.request('/info/indicator/get/', baseRequestParams);
  },

  fetchBonus({token, userid}) {
    return this.request(
      `/lkk/bonus/list/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  fetchBonusInfo({region}) {
    return this.request(`/info/bonus/get/?region=${region}`, baseRequestParams);
  },

  fetchDiscounts({token, userid}) {
    return this.request(
      `/lkk/actions/list/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  // TODO: проверить, продолжает ли падать на пустом ответе
  // @see https://github.com/facebook/react-native/commit/122b3791ede095345f44666691aa9ce5aa7f725a
  fetchReviews({
    dealerId,
    dateFrom,
    dateTo,
    ratingFrom,
    ratingTo,
    nextPageUrl,
  }) {
    let url = `/eko/review/get/${dealerId}/?date_from=${dateFrom}`;

    if (dateTo) {
      url += `&date_to=${dateTo}`;
    }

    if (ratingFrom) {
      url += `&grade_from=${ratingFrom}`;
    }

    if (ratingTo) {
      url += `&grade_to=${ratingTo}`;
    }

    url = nextPageUrl || url;

    // __DEV__ && console.log('API fetchReviews url', url);

    return this.request(url, baseRequestParams);
  },

  fetchDealerRating({dealerId}) {
    return this.request(`/eko/rating/get/${dealerId}/`, baseRequestParams);
  },

  fetchUsedCar({city, nextPageUrl, priceRange}) {
    let url = `/stock/trade-in/cars/get/city/${city}/`;

    if (priceRange) {
      url += `?price_from=${priceRange.minPrice}&price_to=${priceRange.maxPrice}`;
    }

    return this.request(nextPageUrl || url, baseRequestParams);
  },

  fetchUsedCarDetails(carId) {
    return this.request(
      `/stock/trade-in/cars/get/car/${carId}/`,
      baseRequestParams,
    );
  },

  fetchNewCarDetails(carId) {
    return this.request(`/stock/new/cars/get/car/${carId}/`, baseRequestParams);
  },

  fetchNewCarFilterData({city}) {
    return this.request(`/stock/new/cars/search/?city=${city}`, {
      ...baseRequestParams,
    });
  },

  fetchCarHistory({vin, token, userid}) {
    return this.request(
      `/lkk/cars/history/list/?userid=${userid}&token=${token}&vin=${vin}`,
      baseRequestParams,
    );
  },

  fetchCarHistoryDetails({vin, token, userid, workId, workDealer}) {
    return this.request(
      `/lkk/cars/history/item/?userid=${userid}&token=${token}&vin=${vin}&dealer=${workDealer}&id=${workId}`,
      baseRequestParams,
    );
  },

  fetchNewCarByFilter({
    filters,
    searchUrl,
    filterBrands,
    filterModels,
    filterBody,
    filterPrice,
  }) {
    let url = searchUrl;
    let isAmp = false;
    const setParamDivider = () => (isAmp ? '&' : '?');

    if (filterBrands) {
      filterBrands.forEach(({id, checked}) => {
        if (checked) {
          url += `${setParamDivider()}brand[${id}]=${id}`;
          if (!isAmp) {
            isAmp = true;
          }
        }
      });
    }

    if (filterModels) {
      filterModels.forEach(({id, checked}) => {
        if (checked) {
          url += `${setParamDivider()}model[${id}]=${id}`;
          if (!isAmp) {
            isAmp = true;
          }
        }
      });
    }

    if (filterBody) {
      filterBody.forEach(({id, checked}) => {
        if (checked) {
          url += `${setParamDivider()}body[${id}]=${id}`;
          if (!isAmp) {
            isAmp = true;
          }
        }
      });
    }

    if (filterPrice && filterPrice.min && filterPrice.max) {
      url += `${setParamDivider()}price_from=${filterPrice.min}&price_to=${
        filterPrice.max
      }`;
      if (!isAmp) {
        isAmp = true;
      }
    }

    // __DEV__ && console.log('API fetchNewCarByFilter url', url);

    return this.request(url, baseRequestParams);
  },

  callMe(props) {
    const {name, phone, actionID, dealerID} = props;

    const body = {
      f_Dealer: dealerID,
      f_Name: name,
      f_Action: actionID,
      f_Phone: phone,
      f_Source: 3,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  orderService(props) {
    const {
      brand,
      model,
      date,
      firstName,
      secondName,
      lastName,
      vin,
      email,
      phone,
      dealerID,
      text,
    } = props;

    const body = {
      f_Dealer: dealerID,
      f_Brand: brand,
      f_Model: model,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_VIN: vin,
      f_Phone: phone,
      f_Email: email,
      f_Date: date,
      f_Text: text,
      f_Source: 3,
    };
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return this.request('/orders/service/post/', requestParams);
  },

  orderCar(props) {
    const {
      carId,
      comment,
      firstName,
      secondName,
      lastName,
      email,
      phone,
      dealerId,
      isNewCar,
    } = props;

    const body = {
      f_Dealer: dealerId,
      f_Car: carId,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Email: email,
      f_Text: comment,
      f_Source: 3,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const url = isNewCar ? '/orders/stock/post/' : '/orders/trade-in/post/';

    // __DEV__ && console.log('API order car url', url);
    // __DEV__ && console.log('API order car body', body);

    return this.request(url, requestParams);
  },

  tvaMessageSend({id, dealer, text}) {
    const body = `id=${id}&dealer=${dealer}&text=${text}`;
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // __DEV__ && console.log('API tva message body', body);

    return this.request('/tva/message/post/', requestParams);
  },

  reviewAdd({
    name,
    phone,
    email,
    rating,
    dealerId,
    publicAgree,
    messagePlus,
    messageMinus,
  }) {
    const body = [
      'posting=1',
      `f_Dealer=${dealerId}`,
      `f_Name=${name}`,
      `f_Phone=${phone}`,
      `f_Email=${email}`,
      `f_Grade=${rating}`,
      `f_PublicAgree=${publicAgree}`,
      `f_TextPlus=${messagePlus}`,
      `f_TextMinus=${messageMinus}`,
    ].join('&');

    // console.log('body', body);

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // __DEV__ && console.log('API review add body', body);

    return this.request('/eko/review/post/', requestParams);
  },

  carCostOrder(props) {
    let formData = new FormData();

    const formBody = _.compact([
      {name: 'f_Source', value: '3'},
      props.dealerId && {name: 'f_Dealer', value: String(props.dealerId)},
      props.firstName && {name: 'f_FirstName', value: String(props.firstName)},
      props.secondName && {
        name: 'f_SecondName',
        value: String(props.secondName),
      },
      props.lastName && {name: 'f_LastName', value: String(props.lastName)},
      props.phone && {name: 'f_Phone', value: String(props.phone)},
      props.email && {name: 'f_Email', value: String(props.email)},
      props.comment && {name: 'f_Text', value: String(props.comment)},
      props.vin && {name: 'f_VIN', value: String(props.vin)},
      props.brand && {name: 'f_Brand', value: String(props.brand)},
      props.model && {name: 'f_Model', value: String(props.model)},
      props.year && {name: 'f_Year', value: String(props.year)},
      props.mileage && {name: 'f_Mileage', value: String(props.mileage)},
      props.mileageUnit && {
        name: 'f_Mileage_unit',
        value: String(props.mileageUnit),
      },
      props.engineVolume && {
        name: 'f_EngineVolume',
        value: String(props.engineVolume),
      },
      props.engineType && {
        name: 'f_EngineType',
        value: String(props.engineType),
      },
      props.gearbox && {name: 'f_Gearbox', value: String(props.gearbox)},
    ]);

    formBody.map((val) => {
      formData.append(val.name, val.value);
    });

    props.photos.map((photo) => {
      formData.append('f_Photo[]', {
        name: photo.filename,
        type: photo.mime,
        uri: photo.path,
      });
    });

    const body = formData;

    __DEV__ && console.log('API carcost body', body, props);

    return (async () => {
      const rawResponse = await fetch(`${host}/orders/usedbuy/post/`, {
        method: 'POST',
        headers: _.merge({}, headers, {
          'Content-Type': 'multipart/form-data',
        }),
        body: body,
      });
      if (rawResponse) {
        let txt = await rawResponse.text();
        console.log('rawResponse', txt);
        return JSON.parse(txt);
      }
    })();
  },

  fetchCars({token, userid}) {
    return this.request(
      `/lkk/cars/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  loginRequest({login, password}) {
    // __DEV__ &&
    //   console.log('API register login: %s, password: %s', login, password);

    return this.request(
      `/lkk/auth/login/?login=${login}&password=${password}`,
      baseRequestParams,
    );
  },

  registerRequest({dealerId, name, phone, email, carVIN, carNumber}) {
    const body = [
      'posting=1',
      `f_Dealer=${dealerId}`,
      `f_Name=${name}`,
      `f_Phone=${phone}`,
      `f_Email=${email}`,
      'f_Source=3',
      `f_VIN=${carVIN}`,
      `f_Number=${carNumber}`,
    ].join('&');

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // __DEV__ && console.log('API register body', body);

    return this.request('/lkk/register/', requestParams);
  },

  forgotPassRequest(forgotPassLogin) {
    return this.request(
      `/lkk/auth/restore/?login=${forgotPassLogin}`,
      baseRequestParams,
    );
  },

  forgotPassSubmitCode({forgotPassLogin, forgotPassCode}) {
    return this.request(
      `/lkk/auth/restore/?login=${forgotPassLogin}&code=${forgotPassCode}`,
      baseRequestParams,
    );
  },

  /*
    @property {Object} profile
    @propery {'fb'|'vk'|'ok'|'tw'|'im'|'ya'|'gl'} profile.networkName
  */
  loginWith(profile) {
    const {
      id,
      email,
      phone,
      personal_birthday,
      personal_gender,
      last_name,
      first_name,
      networkName,
    } = profile;

    const body = [
      `networkName=${networkName}`,
      `socialData[XML_ID]=${id}`,
      `socialData[EMAIL]=${typeof email !== 'undefined' ? email : ''}`,
      `socialData[NAME]=${typeof first_name !== 'undefined' ? first_name : ''}`,
      `socialData[LAST_NAME]=${
        typeof last_name !== 'undefined' ? last_name : ''
      }`,
      `socialData[PHONE]=${typeof phone !== 'undefined' ? phone : ''}`,
      `socialData[PERSONAL_BIRTHDAY]=${
        typeof personal_birthday !== 'undefined' ? personal_birthday : ''
      }`,
      `socialData[PERSONAL_GENDER]=${
        typeof personal_gender !== 'undefined' ? personal_gender : ''
      }`,
    ].join('&');

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/lkk/auth/social/', requestParams)
      .then((response) => {
        response.data.profile = profile;
        return response;
      })
      .catch((err) => {
        // console.log('error', err);
      });
  },

  loginWithPhone({phone, code}) {
    let body = `contact=${phone ? phone : ''}`;
    if (code) {
      body = body + `&code=${code ? code : ''}`;
    }

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/lkk/auth/validate/', requestParams)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.log('error', err);
      });
  },

  getProfile(id) {
    return this.request(`/lkk/user/${id}/`, baseRequestParams)
      .then((response) => {
        console.log('getProfile >>>>>>>>', response);
        return response.data;
      })
      .catch((err) => {
        console.log('error', err);
      });
  },

  saveProfile(profile) {
    // console.log('profile', profile);
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    return this.request(`/lkk/user/${profile.ID}/`, requestParams)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.log('error', err);
      });
  },

  getServiceAvailable({dealer, vin}) {
    return this.request(
      `/service/maintenance/intervals/?dealer=${dealer}&vin=${vin}`,
      baseRequestParams,
    );
  },

  getServiceInfo({id, dealer, vin}) {
    return this.request(
      `/service/maintenance/intervals/${id}/?dealer=${dealer}&vin=${vin}`,
      baseRequestParams,
    );
  },

  getPeriodForServiceInfo({dealer, date}) {
    // Дата в формате [YYYY-MM-DD] или [YYYYMMDD] или [DD.MM.YYYY]
    return this.request(
      `/service/order/?dealer=${dealer}&date=${date}`,
      baseRequestParams,
    );
  },

  saveOrderToService(data) {
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.request('/service/order/', requestParams);
  },

  request(path, requestParams) {
    const url = `${host}${path}`;

    // Если включен debug режим, добавляем в каждый запрос заголовок `Debug`
    if (window.atlantmDebug) {
      requestParams.headers.Debug = 'app';
    } else {
      delete requestParams.headers.Debug;
    }

    // console.log('>>> url', url);
    // console.log('>>> requestParams', requestParams);

    return this.apiGetData(url, requestParams);
  },

  async apiGetData(url, requestParams) {
    try {
      const response = await fetch(url, requestParams);
      // console.log('response', response);
      return response.json();
    } catch (err) {
      // console.log('apiGetDataError URL: ' + url, err);
    }
  },
};
