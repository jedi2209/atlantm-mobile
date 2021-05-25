import _ from 'lodash';

import {
  INFO_LIST__REQUEST,
  INFO_LIST__SUCCESS,
  INFO_LIST__FAIL,
  INFO_POST__REQUEST,
  INFO_POST__SUCCESS,
  INFO_POST__FAIL,
  INFO_LIST__RESET,
  CALL_ME_INFO__REQUEST,
  CALL_ME_INFO__SUCCESS,
  CALL_ME_INFO__FAIL,
} from './actionTypes';

import {ERROR_NETWORK} from '../core/const';

import API from '../utils/api';

export const fetchInfoList = (region, dealer, type) => {
  return dispatch => {
    dispatch({
      type: INFO_LIST__REQUEST,
      payload: {
        region,
        dealer,
        type,
      },
    });

    return API.fetchInfoList(region, dealer, type)
      .then(res => {
        if (!res) {
          return dispatch({
            type: INFO_LIST__FAIL,
            payload: {
              message: ERROR_NETWORK,
            },
          });
        }
        if (res && res.error) {
          return dispatch({
            type: INFO_LIST__FAIL,
            payload: {
              code: res.error.code,
              message: res.error.message,
            },
          });
        }

        if (res) {
          return dispatch({
            type: INFO_LIST__SUCCESS,
            payload: {data: res.data || [], filters: res.filters || []},
          });
        }
      })
      .catch(error => {
        return dispatch({
          type: INFO_LIST__FAIL,
          payload: {
            message: error.message,
          },
        });
      });
  };
};

export const fetchInfoPost = infoID => {
  return dispatch => {
    dispatch({
      type: INFO_POST__REQUEST,
      payload: {
        infoID,
      },
    });

    return API.fetchInfoPost(infoID)
      .then(res => {
        const {data, error} = res;

        if (error) {
          return dispatch({
            type: INFO_POST__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        dispatch({
          type: INFO_POST__SUCCESS,
          payload: {
            id: infoID,
            text: _.get(data, '0.text', ''),
            date: _.get(data, '0.date', ''),
            dealers: _.get(data, '0.dealers', ''),
            img: _.get(data, '0.img', ''),
            type: _.get(data, '0.type', ''),
            imgCropAvailable: _.get(data, '0.imgCropAvailable', ''),
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: INFO_POST__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const callMeForInfo = props => {
  return dispatch => {
    dispatch({
      type: CALL_ME_INFO__REQUEST,
      payload: {...props},
    });

    return API.callMe(props)
      .then(res => {
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: CALL_ME_INFO__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: CALL_ME_INFO__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: CALL_ME_INFO__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};

export const actionListReset = () => {
  return dispatch => {
    return dispatch({type: INFO_LIST__RESET});
  };
};
