import _ from 'lodash';

import DeviceInfo from 'react-native-device-info';

// credentials
const token = 'old_secret_token';

const baseRequestParams = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'App-Version': DeviceInfo.getVersion(),
  },
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

  fetchTva({ dealer, region, number }) {
    return this.request(`/tva/get/?number=${number}&region=${region}&dealer=${dealer}`, baseRequestParams);
  },

  fetchIndicators() {
    return this.request('/info/indicator/get/', baseRequestParams);
  },

  fetchReviews({ dealerId, dateFrom, dateTo, nextPageUrl }) {
    let url = `/eko/review/get/${dealerId}/?date_from=${dateFrom}`;

    if (dateTo) {
      url += `&date_to=${dateTo}`;
    }

    return this.request(nextPageUrl || url, baseRequestParams);
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

  reviewAdd({ dealerId, name, phone, email, rating, messagePlus, messageMinus, publicAgree }) {
    const body = `f_Dealer=${dealerId}&posting=1&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Satisfy=${rating}&f_PublicAgree=${publicAgree}&f_IP=mobile_app&f_Plus=${messagePlus}&f_Minus=${messageMinus}`;
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

  request(path, requestParams) {
    const url = `https://api.atlantm.com${path}`;

    return fetch(url, requestParams)
      .then(response => {
        return response.json();
      });
  },
};
