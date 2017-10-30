import _ from 'lodash';

// credentials
const token = 'secret token in the future';

const baseRequestParams = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
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

  fetchNewCarFilterData({ city }) {
    return this.request(`/stock/new/cars/search/?city=${city}`, baseRequestParams);
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
    } = props;

    const body = `f_Dealer=${dealerId}&f_Car=${carId}&f_Name=${name}&f_Phone=${phone}&f_Email=${email}&f_Text=${comment}&f_Source=3`;
    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return this.request('/orders/trade-in/post/', requestParams);
  },

  request(path, requestParams) {
    const url = `https://api.atlantm.com${path}`;

    return fetch(url, requestParams)
      .then(response => {
        return response.json();
      });
  },
};
