import {
  APP_PUSH_GRANTED__SET,
  APP_PUSH_ACTION_SUBSCRIBE__SET,
  APP_MENU_OPENED_COUNTER,
  APP_ACTION_RATED,
  APP_STORE_UPDATED,
  APP_SETTINGS_LOADED,
} from './actionTypes';

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
