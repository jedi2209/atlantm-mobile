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

  callMe(dealerID, name, phone, device) {
    console.log('dealerID', typeof dealerID);
    console.log('name', typeof name);
    console.log('phone', typeof phone);
    console.log('device', typeof device);

    const requestParams = _.merge(baseRequestParams, {
      method: 'POST',
      body: JSON.stringify({
        f_Dealer: dealerID,
        f_Name: name,
        f_Phone: '' + phone,
        f_Source: device,
      }),
    });

    console.log('requestParams', requestParams);

    return this.request('/orders/callme/post/', requestParams);
  },

  request(path, requestParams) {
    const url = `https://api.atlantm.com${path}`;

    return fetch(url, requestParams)
      .then(response => response.json());
  },
};
