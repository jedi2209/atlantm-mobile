import _ from 'lodash';

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-fetch-blob';

const isAndroid = Platform.OS === 'android';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${isAndroid ? 'M8ttryMRXs6aTqfH4zNFSPUC78eKoVr3bw5cRwDe' : 'kZJt475LBU3B7aL82j43l7IBab165xbiuIqIqcv9'}`,
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
    return this.request(`/info/actions/get/?region=${region}&dealer=${dealer}`, baseRequestParams);
  },

  fetchInfoPost(infoID) {
    return this.request(`/info/actions/get/${infoID}/`, baseRequestParams);
  },

  fetchTva({ dealer, region, number, fcmToken, pushTracking }) {
    const url = `/tva/get/?number=${number}&region=${region}&dealer=${dealer}&token=${fcmToken}&notify=${pushTracking}&platform=${isAndroid ? 1 : 2}`;

    __DEV__ && console.log('API fetchTva url', url);

    return this.request(url, baseRequestParams);
  },

  fetchIndicators() {
    return this.request('/info/indicator/get/', baseRequestParams);
  },

  fetchBonus({ token }) {
    return this.request(`/lkk/bonus/list/?token=${token}`, baseRequestParams);
  },

  fetchDiscounts({ token }) {
    return this.request(`/lkk/actions/list/?token=${token}`, baseRequestParams);
  },

  fetchReviews({ dealerId, dateFrom, dateTo, ratingFrom, ratingTo, nextPageUrl }) {
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

  fetchDealerRating({ dealerId }) {
    return this.request(`/eko/rating/get/${dealerId}/`, baseRequestParams);
  },

  fetchUsedCar({ city, nextPageUrl, priceRange }) {
    let url = `/stock/trade-in/cars/get/city/${city}/`;

    if (priceRange) {
      url += `?price_from=${priceRange.minPrice}&price_to=${priceRange.maxPrice}`;
    }

    return this.request(nextPageUrl || url, baseRequestParams);
  },

  fetchUsedCarDetails(carId) {
    return this.request(`/stock/trade-in/cars/get/car/${carId}/`, baseRequestParams);
  },

  fetchNewCarDetails(carId) {
    return this.request(`/stock/new/cars/get/car/${carId}/`, baseRequestParams);
  },

  fetchNewCarFilterData({ city }) {
    return this.request(`/stock/new/cars/search/?city=${city}`, baseRequestParams);
  },

  fetchNewCarByFilter({
    searchUrl,
    filterBrands,
    filterModels,
    filterBody,
    filterGearbox,
    filterDrive,
    filterEngineType,
    filterPrice,
  }) {
    let url = searchUrl;
    let isAmp = false;
    const setParamDivider = () => isAmp ? '&' : '?';

    if (filterBrands) {
      filterBrands.forEach(id => {
        url += `${setParamDivider()}brand[]=${id}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterModels) {
      filterModels.forEach(item => {
        url += `${setParamDivider()}model[]=${item.modelId}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterGearbox) {
      filterGearbox.forEach(id => {
        url += `${setParamDivider()}gearbox[]=${id}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterBody) {
      filterBody.forEach(id => {
        url += `${setParamDivider()}body[]=${id}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterDrive) {
      filterDrive.forEach(id => {
        url += `${setParamDivider()}drive[]=${id}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterEngineType) {
      filterEngineType.forEach(id => {
        url += `${setParamDivider()}enginetype[]=${id}`;
        if (!isAmp) isAmp = true;
      });
    }

    if (filterPrice) {
      url += `${setParamDivider()}price_from=${filterPrice.minPrice}&price_to=${filterPrice.maxPrice}`;
      if (!isAmp) isAmp = true;
    }

    __DEV__ && console.log('API fetchNewCarByFilter url', url);

    return this.request(url, baseRequestParams);
  },

  callMe(props) {
    const {
      name,
      phone,
      email,
      action,
      dealerID,
    } = props;

    const body = `f_Dealer=${dealerID}&f_Name=${name}&f_Phone=${phone}&f_Action=${action}&f_Email=${email}&f_Text=&f_URL=&f_Source=3`;
    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  orderService(props) {
    const {
      car,
      date,
      name,
      email,
      phone,
      dealerID,
    } = props;

    const body = `f_Dealer=${dealerID}&f_Model=${car}&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Date=${date}&f_URL=&f_Source=3`;
    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/orders/service/post/', requestParams);
  },

  orderCar(props) {
    const {
      carId,
      comment,
      name,
      email,
      phone,
      dealerId,
      isNewCar,
    } = props;

    const body = `f_Dealer=${dealerId}&f_Car=${carId}&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Text=${comment}&f_Source=3`;
    const requestParams = _.merge(baseRequestParams, {
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

  tvaMessageSend({ id, dealer, text }) {
    const body = `id=${id}&dealer=${dealer}&text=${text}`;
    const requestParams = _.merge(baseRequestParams, {
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

    const requestParams = _.merge(baseRequestParams, {
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
    const formBody = [
      { name: 'f_Source', data: '3' },
      { name: 'f_Dealer', data: props.dealerId },
      { name: 'f_Name', data: props.name },
      { name: 'f_Phone', data: props.phone },
      { name: 'f_Email', data: props.email },
      { name: 'f_Text', data: props.comment },
      { name: 'f_VIN', data: props.vin },
      { name: 'f_Brand', data: props.brand },
      { name: 'f_Model', data: props.model },
      { name: 'f_Year', data: props.year },
      { name: 'f_Mileage', data: props.mileage },
      { name: 'f_Mileage_unit', data: props.mileageUnit },
      { name: 'f_Engine', data: props.engineVolume },
      { name: 'f_EngineType', data: props.engineType },
      { name: 'f_Gearbox', data: props.gearbox },
      { name: 'f_Color', data: props.color },
      { name: 'f_CarCondition', data: props.carCondition },
    ];

    const photosBody = props.photos.map(photo => {
      return {
        name: 'f_Photo[]',
        type: photo.mime,
        filename: photo.filename,
        data: RNFetchBlob.wrap(photo.path),
      };
    });

    const body = formBody.concat(photosBody);

    __DEV__ && console.log('API carcost body', body);

    return RNFetchBlob.fetch(
      'POST',
      'https://api.atlantm.com/orders/usedbuy/post/',
      _.merge(headers, {
        'Content-Type': 'multipart/form-data',
      }),
      body,
    );
  },

  fetchCars({ token }) {
    return this.request(`/lkk/cars/?token=${token}`, baseRequestParams);
  },

  loginRequest({ login, password }) {
    __DEV__ && console.log('API register login: %s, password: %s', login, password);

    return this.request(`/lkk/auth/login/?login=${login}&password=${password}`, baseRequestParams);
  },

  registerRequest({
    dealerId,
    name,
    phone,
    email,
    carVIN,
    carNumber,
  }) {
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

    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    __DEV__ && console.log('API register body', body);

    return this.request('/lkk/register/', requestParams);
  },

  updateFCMToken({ oldToken, newToken }) {
    const body = [
      `old=${oldToken}`,
      `new=${newToken}`,
    ].join('&');

    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    __DEV__ && console.log('API update FCM token body', body);

    return this.request('/mobile/token/update/', requestParams);
  },

  request(path, requestParams) {
    const url = `https://api.atlantm.com${path}`;

    return fetch(url, requestParams)
      .then(response => {
        console.log('response', response);
        return response.json();
      });
  },
};
