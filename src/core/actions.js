import API from '../utils/api';

import {
  APP_FCM_TOKEN__SET,
  APP_PUSH_GRANTED__SET,
  APP_PREVIOUS_FCM_TOKEN__SET,
  APP_PUSH_ACTION_SUBSCRIBE__SET,
} from './actionTypes';

export const actionSetFCMToken = token => {
  return dispatch => {
    dispatch({
      type: APP_FCM_TOKEN__SET,
      payload: token,
    });
  };
};

export const actionSetPreviousFCMToken = (oldToken, newToken) => {
  return dispatch => {
    dispatch({
      type: APP_PREVIOUS_FCM_TOKEN__SET,
      payload: oldToken,
    });

    API.updateFCMToken({ oldToken, newToken });
  };
};

export const actionSetPushGranted = isGranted => {
  return dispatch => {
    dispatch({
      type: APP_PUSH_GRANTED__SET,
      payload: isGranted,
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
