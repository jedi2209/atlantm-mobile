import {
  APP_PUSH_GRANTED__SET,
  APP_PUSH_ACTION_SUBSCRIBE__SET,
  APP_MENU_OPENED_COUNTER,
  APP_ACTION_RATED,
  APP_LOADED,
  APP_STORE_UPDATED,
  APP_SETTINGS_LOADED,
  MAIN_SCREEN__REQUEST,
  MAIN_SCREEN__SUCCESS,
  MAIN_SCREEN__FAIL,
} from './actionTypes';

import API from '../utils/api';

import {APP_REGION} from './const';

export const actionSetPushGranted = isGranted => {
  return dispatch => {
    dispatch({
      type: APP_PUSH_GRANTED__SET,
      payload: isGranted,
    });
  };
};

export const actionMenuOpenedCount = reset => {
  return dispatch => {
    dispatch({
      type: APP_MENU_OPENED_COUNTER,
      payload: reset,
    });
  };
};

export const actionAppRated = () => {
  return dispatch => {
    dispatch({
      type: APP_ACTION_RATED,
    });
  };
};

export const actionAppLoaded = (status = false) => {
  return dispatch => {
    dispatch({
      type: APP_LOADED,
      payload: status,
    });
  };
};

export const actionStoreUpdated = LastUpdateDate => {
  return dispatch => {
    return dispatch({
      type: APP_STORE_UPDATED,
      payload: LastUpdateDate,
    });
  };
};

export const actionSettingsLoaded = settings => {
  return dispatch => {
    return dispatch({
      type: APP_SETTINGS_LOADED,
      payload: settings,
    });
  };
};

export const actionSetPushActionSubscribe = isSubscribe => {
  return dispatch => {
    dispatch({
      type: APP_PUSH_ACTION_SUBSCRIBE__SET,
      payload: isSubscribe,
    });
  };
};

export const actionFetchMainScreenSettings = (region = APP_REGION) => {
  return dispatch => {
    dispatch({type: MAIN_SCREEN__REQUEST});
    return API.fetchMainScreenSettings(region)
      .then(response => {
        const {data: settings, error} = response;

        if (error) {
          return dispatch({
            type: MAIN_SCREEN__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({
          type: MAIN_SCREEN__SUCCESS,
          payload: settings,
        });
      })
      .catch(error => {
        return dispatch({
          type: MAIN_SCREEN__FAIL,
          payload: {
            error: error?.message,
          },
        });
      });
  };
};
