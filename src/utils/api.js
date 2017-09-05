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

  callMe(dealerID, name, phone, device, action) {
    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `f_Dealer=${dealerID}&f_Name=${name}&f_Phone=${phone}&f_Action=${action}&f_Email=&f_Text=&f_URL=&f_Source=${device}`,
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  callMeForInfo(dealerID, name, phone, device) {
    const requestParams = _.merge(baseRequestParams, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `f_Dealer=${dealerID}&f_Name=${name}&f_Phone=${phone}&f_Email=&f_Text=&f_URL=&f_Source=${device}`,
    });

    return this.request('/orders/callme/post/', requestParams);
  },

  request(path, requestParams) {
    const url = `https://api.atlantm.com${path}`;

    return fetch(url, requestParams)
      .then(response => response.json());
  },
};
