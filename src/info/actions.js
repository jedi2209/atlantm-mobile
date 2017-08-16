import _ from 'lodash';

import {
  INFO_LIST__REQUEST,
  INFO_LIST__SUCCESS,
  INFO_LIST__FAIL,

  INFO_POST__REQUEST,
  INFO_POST__SUCCESS,
  INFO_POST__FAIL,

} from './actionTypes';

import API from '../utils/api';

export const fetchInfoList = (region, dealer) => {
  return dispatch => {
    dispatch({
      type: INFO_LIST__REQUEST,
      payload: {
        region,
        dealer,
      },
    });

    return API.fetchInfoList(region, dealer)
      .then(response => {
        const { data, error } = response;

        if (error) {
          return dispatch({
            type: INFO_LIST__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        dispatch({
          type: INFO_LIST__SUCCESS,
          payload: data || [],
        });
      })
      .catch(error => {
        return dispatch({
          type: INFO_LIST__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const fetchInfoPost = (infoID) => {
  return dispatch => {
    dispatch({
      type: INFO_POST__REQUEST,
      payload: {
        infoID,
      },
    });

    return API.fetchInfoPost(infoID)
      .then(response => {
        const { data, error } = response;

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
