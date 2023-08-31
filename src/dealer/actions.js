import {
  DEALERS_REGION__SELECT,
  DEALERS__REQUEST,
  DEALERS__SUCCESS,
  DEALERS__FAIL,
  DEALERS_BY_CITIES__SET,
  DEALER__REQUEST,
  ALL_DEALERS__SUCCESS,
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  CLEAR_LOCAL_DEALER,
  DEALER__FAIL,
  BRANDS__REQUEST,
  BRANDS__SUCCESS,
  BRANDS__FAIL,
  CITIES__SUCCESS,
} from './actionTypes';

import {APP_LANG_SET} from '../core/lang/actionTypes';
import PushNotifications from '../core/components/PushNotifications';
import {fetchInfoList} from '../info/actions/';
import {strings} from '../core/lang/const';

import API from '../utils/api';
import {get} from 'lodash';

import {RUSSIA, BELARUSSIA, UKRAINE, APP_LANG} from '../core/const';

import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import styleConst from '../core/style-const';

export const selectRegion = region => {
  return dispatch => {
    return dispatch({
      type: DEALERS_REGION__SELECT,
      payload: region,
    });
  };
};

export const selectDealer = ({dealerBaseData, dealerSelected, isLocal}) => {
  return dispatch => {
    dispatch({
      type: DEALER__REQUEST,
    });

    if (isLocal) {
      PushNotifications.addTag('region', dealerBaseData.region);
      return dispatch({
        type: DEALER__SUCCESS__LOCAL,
        payload: {
          newDealer: dealerBaseData,
          prevDealer: dealerSelected,
        },
      });
    }

    return API.fetchDealer(dealerBaseData.id)
      .then(response => {
        if (get(response, 'error') || get(response, 'status') === 'error') {
          return dispatch({
            type: DEALER__FAIL,
            payload: {
              error: get(response, 'message', 'error.message'),
            },
          });
        }

        const dealer = {...response.data};

        dealer.id = dealer.id;
        dealer.region = dealer.region;
        dealer.brand = dealer.brand;
        dealer.divisionTypes = [];
        dealer.sites = [];
        dealer.addresses = [];
        dealer.phones = [];
        dealer.phonesMobile = [];
        dealer.socialNetworks = [];

        let phoneTmp = [],
          phoneMobileTmp = [],
          sitesTmp = [],
          addressesTmp = [],
          socialNetworksTmp = [];

        if (dealer && dealer.locations) {
          let i = 1;
          dealer.locations.map(dealerLocation => {
            get(dealerLocation, 'site', []).map((siteItem, indx) => {
              const link = siteItem
                .replace('https://', '')
                .replace('http://', '');
              if (!sitesTmp.includes(link)) {
                sitesTmp.push(link);
                dealer.sites.push({
                  priority: i,
                  id: 'websiteLocation' + dealerLocation.id + indx,
                  text: dealerLocation.name,
                  subtitle: link,
                  link: siteItem,
                });
              }
            });

            get(dealerLocation, 'socialLinks', []).map((siteItem, indx) => {
              let type = get(siteItem, 'type', false);
              if (type && type.includes('vk.message')) {
                return;
              }
              const link = siteItem?.url
                .replace('https://www.', '')
                .replace('http://www.', '')
                .replace('https://', '')
                .replace('http://', '');
              const socialName = siteItem?.type.split('.');
              const groupName = get(siteItem, 'name', link);
              let publicSocialName = socialName;
              let iconName = socialName[0];
              let iconColor = siteItem?.color
                ? siteItem?.color
                : styleConst.color.blue;
              switch (socialName[0]) {
                case 'tlgrm':
                  publicSocialName = 'Telegram';
                  iconName = 'telegram';
                  break;
                case 'ok':
                  publicSocialName = 'Одноклассники';
                  iconName = 'odnoklassniki';
                  break;
                case 'vk':
                  publicSocialName = 'ВКонтакте';
                  break;
                case 'facebook':
                  if (socialName[1] === 'message') {
                    iconName = 'facebook-messenger';
                  }
                  publicSocialName =
                    socialName[0].charAt(0).toUpperCase() +
                    socialName[0].slice(1);
                  break;
                default:
                  publicSocialName =
                    socialName[0].charAt(0).toUpperCase() +
                    socialName[0].slice(1);
                  break;
              }
              if (!socialNetworksTmp.includes(link)) {
                socialNetworksTmp.push(link);
                dealer.socialNetworks.push({
                  priority: i,
                  id: 'socialNetwork' + dealerLocation.id + indx,
                  text: publicSocialName,
                  icon: {
                    font: 'FontAwesome5Brands',
                    name: iconName,
                    color: iconColor,
                  },
                  subtitle: groupName,
                  // subtitle: link,
                  link: siteItem?.url,
                });
              }
            });

            if (!phoneTmp.includes(dealerLocation.phone[0])) {
              phoneTmp.push(dealerLocation.phone[0]);
              dealer.phones.push({
                priority: i,
                id: 'phoneLocation' + dealerLocation.id,
                text: dealerLocation.name,
                subtitle: dealerLocation.phone[0],
                link: 'tel:' + dealerLocation.phone[0].replace(/[^+\d]+/g, ''),
              });
            }

            if (!phoneMobileTmp.includes(dealerLocation.phoneMobile[0])) {
              phoneMobileTmp.push(dealerLocation.phoneMobile[0]);
              dealer.phonesMobile.push({
                priority: i,
                id: 'phoneMobileLocation' + dealerLocation.id,
                text: dealerLocation.name,
                subtitle: dealerLocation.phoneMobile[0],
                link:
                  'tel:' +
                  dealerLocation.phoneMobile[0].replace(/[^+\d]+/g, ''),
              });
            }

            if (!addressesTmp.includes(dealerLocation.address)) {
              addressesTmp.push(dealerLocation.address);
              dealer.addresses.push({
                priority: i,
                id: 'addressLocation' + dealerLocation.id,
                text: [get(dealerLocation, 'city.name'), dealerLocation.address]
                  .filter(Boolean)
                  .join(', '),
                city: get(dealerLocation, 'city'),
                address: dealerLocation.address,
                coords: dealerLocation.coords,
                navigate: 'MapScreen',
                navigateOptions: {
                  returnScreen: 'Home',
                  name: [
                    get(dealerLocation, 'city.name'),
                    dealerLocation.address,
                  ]
                    .filter(Boolean)
                    .join(', '),
                  city: get(dealerLocation, 'city.name'),
                  address: dealerLocation.address,
                  coords: dealerLocation.coords,
                },
              });
            }
            //   if (!get(division, 'phone[0]') || phoneTmp.includes(division.phone[0])) {
            //     return;
            //   }
            //   phoneTmp.push(division.phone[0]);
            //   phones.push({
            //     priority: i,
            //     id: 'call' + division.id,
            //     text: ' -- ' + division.name,
            //     subtitle: division.phone[0],
            //     tel: division.phone[0],
            //   });
            i = i + 1;

            dealerLocation.divisions.map(val => {
              if (val.type) {
                const divisionObj = val.type;
                Object.keys(divisionObj).map(el => {
                  const divisionType = divisionObj[el];
                  if (
                    typeof dealer.divisionTypes[divisionType] === 'undefined'
                  ) {
                    dealer.divisionTypes.push(divisionType);
                  }
                });
              }
              return dealer.divisionTypes;
            });
          });
          dealer.divisionTypes = dealer.divisionTypes.filter(
            (v, i, a) => a.indexOf(v) === i,
          );
        }

        if (dealer && dealer.region) {
          strings.setLanguage(dealer.region);
          moment.locale(APP_LANG);
          dispatch({
            type: APP_LANG_SET,
            payload: dealer.region,
          });
          // dispatch(fetchInfoList(dealer.region, dealer.id));
        }

        PushNotifications.addTag('region', dealer.region);

        if (!isLocal) {
          // обновляем дилера глобально
          return dispatch({
            type: DEALER__SUCCESS,
            payload: {
              newDealer: dealer,
              prevDealer: dealerSelected,
            },
          });
        } else {
          // обновляем дилера локально
          return dispatch({
            type: DEALER__SUCCESS__LOCAL,
            payload: {
              newDealer: dealer,
              prevDealer: dealerSelected,
            },
          });
        }
      })
      .catch(error => {
        console.error('selectDealer action catch error', error);
        return dispatch({
          type: DEALER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const localDealerClear = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_LOCAL_DEALER,
    });
  };
};

export const fetchDealers = isLocal => {
  return dispatch => {
    dispatch({type: DEALERS__REQUEST});
    return API.fetchDealers(isLocal)
      .then(response => {
        const {data: dealers, error} = response;

        if (error) {
          return dispatch({
            type: DEALERS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        const dealersByRegions = dealers.reduce(
          (result, dealer) => {
            result[dealer.region].push(dealer);
            return result;
          },
          {
            [RUSSIA]: [],
            [BELARUSSIA]: [],
            [UKRAINE]: [],
          },
        );

        const cities = dealers.reduce((result, dealer) => {
          result[dealer.city[0].id] = {
            region: dealer.region,
            name: dealer.city[0].name,
          };
          return result;
        }, {});

        dispatch({
          type: CITIES__SUCCESS,
          payload: cities,
        });

        let allDealers = {};
        dealers.forEach(element => {
          allDealers[element.id] = element;
        });

        dispatch({
          type: ALL_DEALERS__SUCCESS,
          payload: allDealers,
        });

        if (!isLocal) {
          return dispatch({
            type: DEALERS__SUCCESS,
            payload: dealersByRegions,
          });
        } else {
          return dispatch({
            type: DEALER__SUCCESS__LOCAL,
            payload: dealersByRegions,
          });
        }
      })
      .catch(error => {
        return dispatch({
          type: DEALERS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const fetchBrands = () => {
  return dispatch => {
    dispatch({type: BRANDS__REQUEST});

    return API.fetchBrands()
      .then(response => {
        const {data: brandsSource, error} = response;

        if (error) {
          return dispatch({
            type: BRANDS__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        let brands = {};
        brandsSource.map(val => {
          brands[val.id] = val;
        });

        return dispatch({
          type: BRANDS__SUCCESS,
          payload: brands,
        });
      })
      .catch(error => {
        return dispatch({
          type: BRANDS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSetDealersByCities = dealersByRegions => {
  return dispatch => {
    return dispatch({
      type: DEALERS_BY_CITIES__SET,
      payload: dealersByRegions,
    });
  };
};
