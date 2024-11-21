import _ from 'lodash';

import {Platform, Linking, Alert, BackHandler} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import {sign as JWTSign} from 'react-native-pure-jwt';
import LogRocket from '@logrocket/react-native';
import {
  STORE_LINK,
  API_MAIN_URL,
  API_MAIN_KEY,
  APP_REGION,
} from '../core/const';
import {strings} from '../core/lang/const';
import {getTimestampInSeconds} from './date';

const isAndroid = Platform.OS === 'android';
const SourceID = 3;
const secretKey = [
  API_MAIN_KEY[APP_REGION][Platform.OS],
  DeviceInfo.getBundleId(),
  DeviceInfo.getVersion(),
].join('__');
const Buffer = require('buffer/').Buffer;

const JWTToken = async () => {
  const token = await JWTSign(
    {
      exp: (getTimestampInSeconds() + 60) * 1000, // expiration date, required, in ms, absolute to 1/1/1970
      iss: 'MobileAPP',
    }, // body
    secretKey,
    {
      alg: 'HS512',
    },
  ).catch(console.error);
  return token;
};
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${API_MAIN_KEY[APP_REGION][Platform.OS]}`,
  'App-Version': DeviceInfo.getVersion(),
  'App-Name': DeviceInfo.getApplicationName(),
};
const baseRequestParams = {
  method: 'GET',
  timeout: 45 * 1000,
  headers,
};

export default {
  headers,
  fetchMainScreenSettings(region) {
    const requestParams = _.merge({}, baseRequestParams, {
      noJWT: true,
    });
    return this.request(`/mobile/screen/main/${region}/`, requestParams);
  },

  fetchDealers() {
    return this.request('/dealer/data/', baseRequestParams);
  },

  fetchDealer(id) {
    return this.request(`/dealer/data/${id}/`, baseRequestParams);
  },

  fetchBrands() {
    return this.request('/brands/info/get/', baseRequestParams);
  },

  fetchInfoList(region = APP_REGION, dealer = null, type = null) {
    const url =
      '/info/actions/get/?' +
      new URLSearchParams(
        _.omitBy(
          {
            region,
            dealer,
            type,
          },
          _.isNil,
        ),
      );
    return this.request(url, baseRequestParams);
  },

  fetchInfoPost(infoID) {
    return this.request(`/info/actions/get/${infoID}/`, baseRequestParams);
  },

  async fetchVersion(version) {
    if (!version) {
      return false;
    }
    let requestedVersion = parseInt(version.replace(/\./gi, ''));
    const res = await this.request('/mobile/check/version/', baseRequestParams);
    if (res?.version) {
      let APPVersionFromApi = parseInt(res.version.replace(/\./gi, ''));
      if (APPVersionFromApi > requestedVersion) {
        Alert.alert(
          strings.Notifications.UpdatePopup.title,
          strings.Notifications.UpdatePopup.text,
          [
            {
              text: strings.Notifications.UpdatePopup.later,
              style: 'destructive',
            },
            {
              text: `✅ ${strings.Notifications.UpdatePopup.update}`,
              style: 'default',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(STORE_LINK[Platform.OS]);
              },
            },
          ],
        );
      }
    }
    return res;
  },

  chatAvailable() {
    return this.request('/jivo/status/', baseRequestParams);
  },

  chatData(session) {
    return this.request(`/jivo/status/${session}`, baseRequestParams);
  },

  chatSendMessage({user, message, session = null}) {
    const body = {
      user: user,
      message: {
        text: message.text,
      },
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    let url = '/jivo/send/';

    if (session) {
      url = '/jivo/send/' + session + '/';
    }

    return this.request(url, requestParams);
  },

  fetchTva({dealer, region, number, pushTracking}) {
    const url =
      '/tva/get/?' +
      new URLSearchParams(
        _.omitBy(
          {
            number,
            region,
            dealer,
            notify: pushTracking,
            platform: isAndroid ? 1 : 2,
          },
          _.isNil,
        ),
      );
    return this.request(url, baseRequestParams);
  },

  fetchIndicators(region) {
    if (!region) {
      return false;
    }
    return this.request(
      `/info/indicator/get/?region=${region}`,
      baseRequestParams,
    );
  },

  fetchBonus({token, userid, curr}) {
    if (!userid || !token) {
      return false;
    }
    let url = `/lkk/bonus/list/?userid=${userid}&token=${token}`;
    if (curr) {
      url += `&curr=${curr}`;
    }
    return this.request(url, baseRequestParams);
  },

  fetchBonusInfo({region = APP_REGION, dealerID}) {
    const url =
      '/info/bonus/get/?' +
      new URLSearchParams(
        _.omitBy(
          {
            region,
            dealer: dealerID,
          },
          _.isNil,
        ),
      );
    return this.request(url, baseRequestParams);
  },

  fetchDiscounts({token, userid}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/actions/list/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  fetchInsurance({token, userid}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/insurance/list/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  fetchInsuranceNew({token, userid}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/insurance/data/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  fetchAdditionalPurchase({token, userid}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/purchase/list/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  fetchAdditionalPurchaseItem({item, token, userid, dealer}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/purchase/item/${item}/?userid=${userid}&token=${token}&dealer=${dealer}`,
      baseRequestParams,
    );
  },

  fetchUserAgreement(region = APP_REGION) {
    return this.request(`/mobile/agreement/${region}/`, baseRequestParams);
  },

  // fetchVedaem(region) {
  //   return this.request(`/mobile/vedaem/${region}/`, baseRequestParams);
  // },

  fetchReviews({
    dealerId,
    dateFrom,
    dateTo,
    ratingFrom,
    ratingTo,
    nextPageUrl,
  }) {
    const url =
      `/eko/review/get/${dealerId}/?` +
      new URLSearchParams(
        _.omitBy(
          {
            date_from: dateFrom,
            date_to: dateTo,
            grade_from: ratingFrom,
            grade_to: ratingTo,
          },
          _.isNil,
        ),
      );

    return this.request(nextPageUrl ? nextPageUrl : url, baseRequestParams);
  },

  fetchDealerRating({dealerId}) {
    return this.request(`/eko/rating/get/${dealerId}/`, baseRequestParams);
  },

  fetchStock({nextPageUrl, url}) {
    return this.request(nextPageUrl ? nextPageUrl : url, baseRequestParams);
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

  fetchCreditProgramCalculate(programID, params, region = APP_REGION) {
    let paramsString = [
      `programID=${programID}`,
    ];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramsString.push(`${key}=${params[key]}`);
      }
    }
    return this.request(
      `/finance/calc/${region}/?${paramsString.join('&')}`,
      baseRequestParams,
    );
  },

  fetchCarCreditPrograms(params, region = APP_REGION) {
    let paramsString = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramsString.push(`${key}=${params[key]}`);
      }
    }
    return this.request(
      `/finance/programs/${region}/?${paramsString.join('&')}`,
      baseRequestParams,
    );
  },

  fetchCarCreditPartners(region = APP_REGION) {
    return this.request(`/finance/partners/${region}`, baseRequestParams);
  },

  async fetchTDCarDetails(dealer, carID) {
    if (typeof carID === 'object') {
      let cars = [];
      const carsData = carID.map(async el => {
        const data = await this.request(
          `/stock/new/test-drive/${dealer}/${el}/`,
          baseRequestParams,
        );
        if (!data.error) {
          cars.push(data.data);
          return data;
        }
        return false;
      });
      return await Promise.all(carsData).then(el => {
        return {status: 'success', data: cars};
      });
    } else {
      return this.request(
        `/stock/new/test-drive/${dealer}/${carID}/`,
        baseRequestParams,
      );
    }
  },

  fetchNewCarFilterData({city}) {
    return this.request(`/stock/new/cars/search/?city=${city}`, {
      ...baseRequestParams,
    });
  },

  fetchUsedCarFilterData({city, region}) {
    if (region) {
      return this.request(`/stock/trade-in/cars/search/?region=${region}`, {
        ...baseRequestParams,
      });
    }
    if (city) {
      return this.request(`/stock/trade-in/cars/search/?city=${city}`, {
        ...baseRequestParams,
      });
    }
  },

  fetchCarHistory({vin, token, userid}) {
    if (!vin || !userid || !token) {
      return false;
    }
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

  callMe(props) {
    const {name, phone, actionID, dealerID, carID} = props;

    const body = {
      f_Dealer: dealerID,
      f_Name: name,
      f_Action: actionID,
      f_Phone: phone,
      f_Car: carID,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  orderParts(props) {
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
      actionID,
      text,
      part,
    } = props;

    const body = {
      f_Dealer: dealerID,
      f_Action: actionID,
      f_Brand: brand,
      f_Model: model,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_VIN: vin,
      f_PartNumber: part,
      f_Phone: phone,
      f_Email: email,
      f_Text: text,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    return this.request('/orders/parts/post/', requestParams);
  },

  orderService(props) {
    const {
      brand,
      model,
      date,
      firstName,
      secondName,
      lastName,
      carNumber,
      vin,
      email,
      phone,
      dealerID,
      actionID,
      text,
      callMePls,
      service,
    } = props;

    const textModified = [];
    if (callMePls) {
      textModified.push('\r\nНеобходимо позвонить клиенту для подтверждения!');
    }
    if (service) {
      textModified.push('Требуемые работы: ' + service);
    }
    if (text) {
      textModified.push('\r\nКомментарий клиента: ' + text);
    }

    const body = {
      f_Dealer: dealerID,
      f_Action: actionID,
      f_Brand: brand,
      f_Model: model,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_CarNumber: carNumber,
      f_VIN: vin,
      f_Phone: phone,
      f_Email: email,
      f_Date: date,
      f_Text: textModified.join('\r\n'),
      f_Source: SourceID,
    };
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body,
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
      actionID,
      tradeIn,
      credit,
    } = props;

    const body = {
      f_Dealer: dealerId,
      f_Car: carId,
      f_Action: actionID,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Email: email,
      f_Text: comment,
      f_TradeIn: tradeIn ? true : false,
      f_Credit: credit ? true : false,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body: body,
    });

    const url = isNewCar ? '/orders/stock/post/' : '/orders/trade-in/post/';

    return this.request(url, requestParams);
  },

  orderCreditCar(props) {
    const {
      carId,
      comment,
      firstName,
      secondName,
      lastName,
      email,
      phone,
      dealerId,
      summ,
    } = props;

    const body = {
      f_Dealer: dealerId,
      f_Car: carId,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Email: email,
      f_Summ: summ,
      f_Text: comment,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body: body,
    });

    const url = '/orders/credit/post/';

    return this.request(url, requestParams);
  },

  orderTestDriveLead(props) {
    const {
      carID,
      comment,
      firstName,
      secondName,
      lastName,
      email,
      phone,
      dealerID,
      date,
    } = props;

    const body = {
      f_Dealer: dealerID,
      f_Car: carID,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Date: date,
      f_Email: email,
      f_Text: comment,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body: body,
    });

    const url = '/orders/testdrive/post/';

    return this.request(url, requestParams);
  },

  orderMyPrice(props) {
    const {
      carId,
      comment,
      firstName,
      secondName,
      lastName,
      email,
      phone,
      summ,
      dealerId,
    } = props;

    const body = {
      f_Dealer: dealerId,
      f_Car: carId,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Email: email,
      f_Summ: summ,
      f_Text: comment,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body: body,
    });

    const url = '/orders/my-price/post/';

    return this.request(url, requestParams);
  },

  orderTestDrive(props) {
    const {
      carID,
      comment,
      firstName,
      secondName,
      lastName,
      time,
      phone,
      dealerID,
      isNewCar,
    } = props;

    const body = {
      dealer: dealerID,
      car: carID,
      date: {
        from: time,
      },
      firstName: firstName || '',
      secondName: secondName || '',
      lastName: lastName || '',
      phone: phone || '',
      text: comment,
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PUT',
      body: body,
    });

    const url = isNewCar ? '/order/test-drive/' : null;

    return this.request(url, requestParams);
  },

  orderFeedbackApp({firstName, email, text, additional}) {
    const body = {
      appFeedback: true,
      f_FirstName: firstName,
      f_Email: email,
      f_Text: text + "\r\n\r\nИнформация о пользователе:\r\n" + Buffer.from(JSON.stringify(additional), 'binary').toString('base64'),
      f_Source: SourceID,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      body: body,
    });

    const url = '/orders/feedback/post/';

    return this.request(url, requestParams);
  },

  tvaMessageSend({id, dealer, text}) {
    const body = {
      id: id,
      dealer: dealer,
      text: text,
    };
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: body,
    });

    return this.request('/tva/message/post/', requestParams);
  },

  async reviewAdd({
    firstName,
    secondName,
    lastName,
    name,
    phone,
    email,
    rating,
    dealerId,
    publicAgree,
    messagePlus,
    messageMinus,
  }) {
    const body = {
      posting: 1,
      f_Source: SourceID,
      f_Dealer: dealerId,
      f_Name: name,
      f_FirstName: firstName,
      f_SecondName: secondName,
      f_LastName: lastName,
      f_Phone: phone,
      f_Email: email,
      f_Grade: rating,
      f_PublicAgree: publicAgree,
      f_TextPlus: messagePlus,
      f_TextMinus: messageMinus,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    return await this.request('/eko/review/post/', requestParams);
  },

  async carCostOrder(props) {
    let formData = new FormData();

    const formBody = _.compact([
      {name: 'f_Source', value: String(SourceID)},
      props.dealerId && {name: 'f_Dealer', value: String(props.dealerId)},
      props.date && {name: 'f_Date', value: String(props.date)},
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
      props.wheel && {name: 'f_Wheel', value: String(props.wheel)},
    ]);

    let formDataNew = [];

    formBody.map(val => {
      formData.append(val?.name, val?.value);
      formDataNew.push({name: val?.name, data: val?.value});
    });

    let cnt = 0;

    props.photos.map(photo => {
      const path = photo.path;
      const fileName = path.split('\\').pop().split('/').pop();
      formDataNew.push({
        name: 'f_Photo[' + cnt + ']',
        filename: fileName,
        type: photo.mime,
        data: photo.data,
      });
      formData.append('f_Photo[' + cnt + ']', {
        name: fileName,
        filename: fileName,
        type: photo.mime,
        uri: photo.path,
      });
      cnt++;
    });

    let headersNew = _.merge({}, headers, {
      'Content-Type': 'multipart/form-data; ',
      'x-auth': await JWTToken(),
    });

    // `${API_MAIN_URL[0]}/orders/usedbuy/post/`,
    return (async () => {
      const rawResponse = await RNFetchBlob.fetch(
        'POST',
        'https://atlantm-admin.zteam.pw/orders/usedbuy/post/',
        headersNew,
        formDataNew,
      );
      if (rawResponse) {
        let txt = await rawResponse.text();
        return JSON.parse(txt);
      }
    })();
  },

  fetchCars({token, userid}) {
    if (!token || !userid) {
      return false;
    }
    return this.request(
      `/lkk/cars/?userid=${userid}&token=${token}`,
      baseRequestParams,
    );
  },

  loginRequest({login, password}) {
    if (!login || !password) {
      return false;
    }
    return this.request(
      `/lkk/auth/login/?login=${login}&password=${password}`,
      baseRequestParams,
    );
  },

  registerRequest({dealerId, name, phone, email, carVIN, carNumber}) {
    const body = {
      posting: 1,
      f_Dealer: dealerId,
      f_Name: name,
      f_Phone: phone,
      f_Email: email,
      f_Source: SourceID,
      f_VIN: carVIN,
      f_Number: carNumber,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: body,
    });

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
  async loginWith(profile) {
    const {
      id,
      email,
      phone,
      personal_birthday,
      personal_gender,
      last_name,
      second_name,
      first_name,
      networkName,
      update,
    } = profile;

    const socialData = {
      XML_ID: id,
      EMAIL: typeof email !== 'undefined' ? email : '',
      SECOND_NAME: typeof second_name !== 'undefined' ? second_name : '',
      NAME: typeof first_name !== 'undefined' ? first_name : '',
      LAST_NAME: typeof last_name !== 'undefined' ? last_name : '',
      PHONE: typeof phone !== 'undefined' ? phone : '',
      PERSONAL_BIRTHDAY:
        typeof personal_birthday !== 'undefined' ? personal_birthday : '',
      PERSONAL_GENDER:
        typeof personal_gender !== 'undefined' ? personal_gender : '',
    };

    const body = {
      networkName: networkName,
      socialData,
      update: typeof update !== 'undefined' ? update : 0,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: body,
    });

    return await this.request('/lkk/auth/social/', requestParams)
      .then(response => {
        if (response.data && response.data.profile) {
          response.data.profile = profile;
        }
        return response;
      })
      .catch(err => {
        console.error('loginWith(profile) error', err);
      });
  },

  async loginWithPhone({phone, code, crmID}) {
    let body = {
      contact: phone ? phone : '',
    };
    if (code) {
      body.code = code ? code : '';
    }
    if (crmID) {
      body.crmID = crmID ? crmID : '';
    }

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: body,
    });

    return await this.request('/lkk/auth/validate/', requestParams)
      .then(response => {
        if (_.get(response, 'data.user')) {
          const userData = _.get(response, 'data.user', {});
          const userID = _.get(userData, 'ID', '');
          if (userID) {
            LogRocket.identify(userID.toString(), _.omitBy(
              {
                name: [_.get(userData, 'NAME', ''), _.get(userData, 'LAST_NAME', '')].join(' '),
                phone: _.get(userData, 'PHONE.0.VALUE', null),
                email: _.get(userData, 'EMAIL.0.VALUE', null),
              },
              _.isNil,
            ));
          }
        }
        return response;
      })
      .catch(err => {
        console.error('loginWithPhone error', err);
      });
  },

  async getProfile(id) {
    return await this.request(`/lkk/user/${id}/`, baseRequestParams)
      .then(response => {
        if (_.get(response, 'data')) {
          const userData = _.get(response, 'data', {});
          const userID = _.get(userData, 'ID', '');
          LogRocket.identify(userID.toString(), _.omitBy(
            {
              name: [_.get(userData, 'NAME', ''), _.get(userData, 'LAST_NAME', '')].join(' '),
              phone: _.get(userData, 'PHONE.0.VALUE', null),
              email: _.get(userData, 'EMAIL.0.VALUE', null),
            },
            _.isNil,
          ));
          return userData;
        }
        return _.get(response, 'data');
      })
      .catch(err => {
        console.error('getProfile error', err);
      });
  },

  async deleteProfile(profile) {
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'DELETE',
    });

    if (
      !profile.ID ||
      typeof profile.ID === 'undefined' ||
      profile.ID === '' ||
      profile.ID === null
    ) {
      console.error(
        'updateProfile error',
        'required param profile.ID has been not found',
      );
      return false;
    }

    return await this.request(`/lkk/user/${profile.ID}/`, requestParams)
      .then(response => {
        return response;
      })
      .catch(err => {
        console.error('updateProfile request error', err);
      });
  },

  async updateProfile(profile) {
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: profile,
    });

    if (
      !profile.ID ||
      typeof profile.ID === 'undefined' ||
      profile.ID === '' ||
      profile.ID === null
    ) {
      console.error(
        'updateProfile error',
        'required param profile.ID has been not found',
      );
      return false;
    }

    return await this.request(`/lkk/user/${profile.ID}/`, requestParams)
      .then(response => {
        return response;
      })
      .catch(err => {
        console.error('updateProfile request error', err);
      });
  },

  async fetchNotifications({userID}) {
    if (!userID) {
      return {
        status: 'success',
        data: [],
      };
    }
    const url =
      `/notifications/?` +
      new URLSearchParams(
        _.omitBy(
          {
            userID,
          },
          _.isNil,
        ),
      );

    return await this.request(url, baseRequestParams);
  },

  async toggleArchieveCar(car, userSAP) {
    if (!car || !userSAP) {
      return false;
    }
    let method = '';
    if (car.hidden === true) {
      method = 'DELETE';
    } else {
      method = 'PUT';
    }
    const requestParams = _.merge({}, baseRequestParams, {
      method,
      body: {
        vin: car.vin,
        userid: userSAP.ID,
        token: userSAP.TOKEN,
      },
    });

    try {
      const response = await this.request('/lkk/cars/', requestParams);
      return response;
    } catch (err) {
      console.error('toggleArchieveCar request error', err);
    }
  },

  async fetchServiceCalculation({dealerID, workType}) {
    if (!workType || !dealerID) {
      return false;
    }
    const url =
      `/service/online/${dealerID}/calculator/?` +
      new URLSearchParams(
        _.omitBy(
          {
            type: workType,
          },
          _.isNil,
        ),
      );

    return await this.request(url, baseRequestParams);
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

  getTimeForTestDrive({dealer, carID, date}) {
    return this.request(
      `/order/test-drive/?dealer=${dealer}&date=${date}&car=${carID}`,
      baseRequestParams,
    );
  },

  async getPeriodForServiceInfo({
    dealerID,
    date,
    dateTo = null,
    service,
    seconds,
  }) {
    // Дата в формате [YYYY-MM-DD] или [YYYYMMDD] или [DD.MM.YYYY]
    const url =
      `/service/online/${dealerID}/?` +
      new URLSearchParams(
        _.omitBy(
          {
            seconds,
            date,
            dateTo,
            type: service,
          },
          _.isNil,
        ),
      );
    return await this.request(url, baseRequestParams);
  },

  saveOrderToService(body) {
    const {dealer} = body;
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PUT',
      body: body,
    });

    return this.request(`/service/online/${dealer}/`, requestParams);
  },

  async request(path, requestParams = baseRequestParams) {
    const url = path.includes('https://') ? path : `${API_MAIN_URL[0]}${path}`;

    // Если включен debug режим, добавляем в каждый запрос заголовок `Debug`
    if (window.atlantmDebug) {
      requestParams.headers.Debug = 'app';
    } else {
      delete requestParams.headers.Debug;
    }
    return await this.apiGetData(url, requestParams);
  },

  async apiGetData(url, requestParams = baseRequestParams) {
    const method = requestParams.method.toString().toLowerCase();
    let body = requestParams?.body;
    if (!requestParams.noJWT || requestParams?.noJWT === false) {
      requestParams.headers['x-auth'] = await JWTToken();
    }

    if (body && typeof body === 'object') {
      if (
        requestParams?.headers['Content-Type'] !==
        'application/x-www-form-urlencoded'
      ) {
        body = JSON.stringify(body);
      } else {
        body = new URLSearchParams(body).toString();
      }
    }
    if (__DEV__) {
      console.info(
        new Date().toString() + '\tapiGetData\t',
        requestParams?.method,
        url,
        body ? body : '',
      );
    }
    if (
      method === 'delete' ||
      method === 'patch' ||
      method === 'put' ||
      method === 'delete'
    ) {
      const res = await fetch(url, {
        method: method,
        headers: requestParams?.headers,
        body: body,
      });
      const resText = await res.text();
      try {
        const resJson = JSON.parse(resText);
        return resJson;
      } catch (err) {
        console.error(
          new Date().toString() +
            '\tapiGetDataError ' +
            method +
            '\tURL: ' +
            url,
          err,
        );
        return resText;
      }
    } else {
      return await RNFetchBlob.config({
        timeout: requestParams.timeout,
        followRedirect: true,
        indicator: true,
      })
        .fetch(method, url, requestParams?.headers, body)
        .then(res => {
          let answer = '';
          switch (res.info().respType) {
            case 'json':
              answer = res.json();
              if (__DEV__) {
                console.info(
                  new Date().toString() + '\tapiGetData\tJSON result',
                  url,
                  '\r\n',
                  answer,
                );
              }
              break;
            case 'text':
              answer = res?.data;
              if (__DEV__) {
                console.info(
                  new Date().toString() + '\tapiGetData\tJSON text',
                  url,
                  '\r\n',
                  answer,
                );
              }
              break;
            default:
              if (res?.data) {
                answer = res?.data;
              }
              console.error(
                new Date().toString() +
                  '\tapiGetDataError res.info().respType: ' +
                  url,
                res,
              );
              break;
          }
          return answer;
        })
        .catch(err => {
          console.error(
            new Date().toString() + '\tapiGetDataError URL: ' + url,
            err,
          );
          return false;
        });
    }
  },
};
