import _ from 'lodash';

import {Platform, Linking, Alert, BackHandler} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';

const isAndroid = Platform.OS === 'android';

const host = 'https://api.atlantm.com/v1';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${
    isAndroid
      ? 'XXXX'
      : 'XXXX'
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

  fetchVersion(version) {
    if (!version) {
      console.log('version undefined', version);
      return false;
    }
    let requested_version = parseInt(version.replace(/\./gi, ''));
    let req = this.request('/mobile/check/version/', baseRequestParams);
    return req.then(res => {
      if (!res.version) {
        return this.fetchVersion(DeviceInfo.getVersion());
      }
      let real_time_version_api = parseInt(res.version.replace(/\./gi, ''));
      if (real_time_version_api > requested_version) {
        let STORE_LINK;
        if (Platform.OS === 'ios') {
          STORE_LINK =
            'itms-apps://itunes.apple.com/app/idXXXX?action=update';
        } else {
          STORE_LINK = 'market://details?id=com.atlantm';
        }

        Alert.alert(
          'Приложение устарело',
          'Пожалуйста обновите приложение до актуальной версии.',
          [
            {
              text: 'Обновить',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(STORE_LINK);
              },
              style: 'default',
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    });
  },

  fetchTva({dealer, region, number, pushTracking}) {
    const url = `/tva/get/?number=${number}&region=${region}&dealer=${dealer}&notify=${pushTracking}&platform=${
      isAndroid ? 1 : 2
    }`;

    __DEV__ && console.log('API fetchTva url', url);

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

    __DEV__ && console.log('API fetchReviews url', url);

    return this.request(url, baseRequestParams);
  },

  fetchDealerRating({dealerId}) {
    return this.request(`/eko/rating/get/${dealerId}/`, baseRequestParams);
  },

  fetchUsedCar({city, nextPageUrl, priceRange}) {
    let url = `/stock/trade-in/cars/get/city/${city}/`;

    if (priceRange) {
      url += `?price_from=${priceRange.minPrice}&price_to=${
        priceRange.maxPrice
      }`;
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

    __DEV__ && console.log('API fetchNewCarByFilter url', url);

    return this.request(url, baseRequestParams);
  },

  callMe(props) {
    const {name, phone, email, action, dealerID} = props;

    const body = `f_Dealer=${dealerID}&f_Name=${name}&f_Phone=${phone}&f_Action=${action}&f_Email=${email}&f_Text=&f_URL=&f_Source=3`;
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  orderService(props) {
    const {car, date, name, email, phone, dealerID} = props;

    const body = `f_Dealer=${dealerID}&f_Model=${car}&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Date=${date}&f_URL=&f_Source=3`;
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/orders/service/post/', requestParams);
  },

  orderCar(props) {
    const {carId, comment, name, email, phone, dealerId, isNewCar} = props;

    const body = `f_Dealer=${dealerId}&f_Car=${carId}&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Text=${comment}&f_Source=3`;
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const url = isNewCar ? '/orders/stock/post/' : '/orders/trade-in/post/';

    __DEV__ && console.log('API order car url', url);
    __DEV__ && console.log('API order car body', body);

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

    __DEV__ && console.log('API tva message body', body);

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

    console.log('body', body);

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    __DEV__ && console.log('API review add body', body);

    return this.request('/eko/review/post/', requestParams);
  },

  carCostOrder(props) {
    const formBody = _.compact([
      {name: 'f_Source', data: '3'},
      props.dealerId && {name: 'f_Dealer', data: String(props.dealerId)},
      props.name && {name: 'f_Name', data: String(props.name)},
      props.phone && {name: 'f_Phone', data: String(props.phone)},
      props.email && {name: 'f_Email', data: String(props.email)},
      props.comment && {name: 'f_Text', data: String(props.comment)},
      props.vin && {name: 'f_VIN', data: String(props.vin)},
      props.brand && {name: 'f_Brand', data: String(props.brand)},
      props.model && {name: 'f_Model', data: String(props.model)},
      props.year && {name: 'f_Year', data: String(props.year)},
      props.mileage && {name: 'f_Mileage', data: String(props.mileage)},
      props.mileageUnit && {
        name: 'f_Mileage_unit',
        data: String(props.mileageUnit),
      },
      props.engineVolume && {
        name: 'f_Engine',
        data: String(props.engineVolume),
      },
      props.engineType && {
        name: 'f_EngineType',
        data: String(props.engineType),
      },
      props.gearbox && {name: 'f_Gearbox', data: String(props.gearbox)},
      props.color && {name: 'f_Color', data: String(props.color)},
      props.carCondition && {
        name: 'f_CarCondition',
        data: String(props.carCondition),
      },
    ]);

    const photosBody = props.photos.map(photo => {
      return {
        name: 'f_Photo[]',
        type: photo.mime,
        filename: photo.path,
        data: RNFetchBlob.wrap(photo.path),
      };
    });

    const body = formBody.concat(photosBody);

    __DEV__ && console.log('API carcost body', body);

    return RNFetchBlob.fetch(
      'POST',
      `${host}/orders/usedbuy/post/`,
      _.merge({}, headers, {
        'Content-Type': 'multipart/form-data',
      }),
      body,
    );
  },

  fetchCars({token, userid}) {
    console.log('token =================>', token);
    return this.request(
      `/lkk/cars/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  loginRequest({login, password}) {
    __DEV__ &&
      console.log('API register login: %s, password: %s', login, password);

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

    __DEV__ && console.log('API register body', body);

    return this.request('/lkk/register/', requestParams);
  },

  forgotPassRequest({forgotPassLogin}) {
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

  updateFCMToken({oldToken, newToken}) {
    const body = [`old=${oldToken}`, `new=${newToken}`].join('&');

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    __DEV__ && console.log('API update FCM token body', body);

    return this.request('/mobile/token/update/', requestParams);
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
      .then(data => {
        console.log('>>> login with data api:::', data, profile);
        return {status: 'success', error: {}, profile, data};
      })
      .catch(err => {
        console.log('error', err);
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
      .then(data => {
        return {status: 'success', error: {}, data};
      })
      .catch(err => {
        console.log('error', err);
      });
  },

  getProfile(id) {
    return this.request(`/lkk/user/${id}/`, baseRequestParams)
      .then(data => {
        return data.data;
      })
      .catch(err => {
        console.log('error', err);
      });
  },

  saveProfile(profile) {
    console.log('saveProfile', profile);
    const {id, first_name, last_name, email, phone} = profile;

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: first_name,
        surname: last_name,
        email,
        phone,
        userID: id,
      }),
    });

    return this.request(`/lkk/user/${id}/`, requestParams)
      .then(data => {
        return {status: 'success', error: {}, profile, data};
      })
      .catch(err => {
        console.log('error', err);
      });
  },

  request(path, requestParams) {
    const url = `${host}${path}`;

    // Если включен debug режим, добавляем в каждый запрос заголовок `Debug`
    if (window.atlantmDebug) {
      requestParams.headers.Debug = 'app';
    } else {
      delete requestParams.headers.Debug;
    }

    console.log('>>> url', url);
    console.log('>>> requestParams', requestParams);

    return this.apiGetData(url, requestParams);
  },

  async apiGetData(url, requestParams) {
    try {
      const response = await fetch(url, requestParams);
      return response.json();
    } catch (err) {
      console.log('apiGetDataError', err);
    }
  },
};
