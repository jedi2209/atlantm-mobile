import _ from 'lodash';

import {Platform, Linking, Alert, BackHandler} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import {STORE_LINK, API_MAIN_URL} from '../core/const';
import {strings} from '../core/lang/const';

const isAndroid = Platform.OS === 'android';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${
    isAndroid
      ? 'M8ttryMRXs6aTqfH4zNFSPUC78eKoVr3bw5cRwDe'
      : 'kZJt475LBU3B7aL82j43l7IBab165xbiuIqIqcv9'
  }`,
  'App-Version': DeviceInfo.getVersion(),
  'App-Name': DeviceInfo.getApplicationName(),
};
const baseRequestParams = {
  method: 'GET',
  headers,
};

export default {
  headers,
  fetchDealers() {
    return this.request('/dealer/info/get/', baseRequestParams);
  },

  fetchDealer(id) {
    return this.request(`/dealer/info/get/${id}/`, baseRequestParams);
  },

  fetchBrands() {
    return this.request('/brands/info/get/', baseRequestParams);
  },

  fetchInfoList(region = 0, dealer = 0, type = null) {
    let url = `/info/actions/get/?region=${region}&dealer=${dealer}`;
    if (type) {
      url = url + `&type=${type}`;
    }
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
    return this.request(
      '/mobile/check/version/',
      baseRequestParams,
    ).then(res => {
      if (res && res.version) {
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
    });
  },

  chatAvailable() {
    return this.request(`/jivo/status/`, baseRequestParams);
  },

  chatData(session) {
    return this.request(`/jivo/status/${session}`, baseRequestParams);
  },

  chatSendMessage({user, message, session = null}) {
    const body = {
      "user": user,
      "message": {
          "text": message.text
      }
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let url = '/jivo/send/';

    if (session) {
      url = '/jivo/send/' + session + '/';
    }

    return this.request(url, requestParams);
  },

  fetchTva({dealer, region, number, pushTracking}) {
    const url = `/tva/get/?number=${number}&region=${region}&dealer=${dealer}&notify=${pushTracking}&platform=${
      isAndroid ? 1 : 2
    }`;
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

  fetchBonusInfo({region}) {
    if (!region) {
      return false;
    }
    return this.request(`/info/bonus/get/?region=${region}`, baseRequestParams);
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

  fetchUserAgreement(region) {
    return this.request(`/mobile/agreement/${region}/`, baseRequestParams);
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

    return this.request(url, baseRequestParams);
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
      vin,
      email,
      phone,
      dealerID,
      actionID,
      text,
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
      f_TradeIn: tradeIn ? tradeIn : false,
      f_Credit: credit ? credit : false,
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
      f_Source: 3,
    };

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const url = isNewCar ? '/order/test-drive/' : null;

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
    const body = [
      'posting=1',
      'f_Source=3',
      `f_Dealer=${dealerId}`,
      `f_Name=${name}`,
      `f_FirstName=${firstName}`,
      `f_SecondName=${secondName}`,
      `f_LastName=${lastName}`,
      `f_Phone=${phone}`,
      `f_Email=${email}`,
      `f_Grade=${rating}`,
      `f_PublicAgree=${publicAgree}`,
      `f_TextPlus=${messagePlus}`,
      `f_TextMinus=${messageMinus}`,
    ].join('&');

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return await this.request('/eko/review/post/', requestParams);
  },

  carCostOrder(props) {
    let formData = new FormData();

    const formBody = _.compact([
      {name: 'f_Source', value: '3'},
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
      formData.append(val.name, val.value);
      formDataNew.push({name: val.name, data: val.value});
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

    const headersNew = _.merge({}, headers, {
      'Content-Type': 'multipart/form-data; ',
    });

    // `${API_MAIN_URL}/orders/usedbuy/post/`,

    return (async () => {
      const rawResponse = await RNFetchBlob.fetch(
        'POST',
        'https://api-backend.atlantm.com/orders/usedbuy/post/',
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

    const body = [
      `networkName=${networkName}`,
      `socialData[XML_ID]=${id}`,
      `socialData[EMAIL]=${typeof email !== 'undefined' ? email : ''}`,
      `socialData[SECOND_NAME]=${
        typeof second_name !== 'undefined' ? second_name : ''
      }`,
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
      `update=${typeof update !== 'undefined' ? update : ''}`,
    ].join('&');

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
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
    let body = `contact=${phone ? phone : ''}`;
    if (code) {
      body = body + `&code=${code ? code : ''}`;
    }
    if (crmID) {
      body = body + `&crm_id=${crmID ? crmID : ''}`;
    }

    const requestParams = _.merge({}, baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return await this.request('/lkk/auth/validate/', requestParams)
      .then(response => {
        return response;
      })
      .catch(err => {
        console.error('loginWithPhone error', err);
      });
  },

  async getProfile(id) {
    return await this.request(`/lkk/user/${id}/`, baseRequestParams)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        console.error('getProfile error', err);
      });
  },

  async updateProfile(profile) {
    const requestParams = _.merge({}, baseRequestParams, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (
      !profile.ID ||
      typeof profile.ID === undefined ||
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
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vin: car.vin,
        userid: userSAP.ID,
        token: userSAP.TOKEN,
      }),
    });

    try {
      const response = await this.request('/lkk/cars/', requestParams);
      return response;
    } catch (err) {
      console.error('toggleArchieveCar request error', err);
    }
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

  getPeriodForServiceInfo({dealer, date, service, seconds}) {
    // Дата в формате [YYYY-MM-DD] или [YYYYMMDD] или [DD.MM.YYYY]
    return this.request(
      `/service/order/?dealer=${dealer}&date=${date}&serviceID=${service}&seconds=${seconds}`,
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

  async request(path, requestParams) {
    const url = `${API_MAIN_URL}${path}`;

    // Если включен debug режим, добавляем в каждый запрос заголовок `Debug`
    if (window.atlantmDebug) {
      requestParams.headers.Debug = 'app';
    } else {
      delete requestParams.headers.Debug;
    }
    return await this.apiGetData(url, requestParams);
  },

  async apiGetData(url, requestParams) {
    const response = await fetch(url, requestParams);
    const resText = await response.text();
    try {
      // console.warn('url + requestParams', url, requestParams, response);
      const resJson = JSON.parse(resText);
      return resJson;
    } catch (err) {
      console.info('apiGetDataError URL: ' + url, err);
      return resText;
    }
  },
};
