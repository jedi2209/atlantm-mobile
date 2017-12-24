import { APP_FCM_TOKEN__SET, APP_PUSH_GRANTED__SET } from './actionTypes';

export const actionSetFCMToken = token => {
  return dispatch => {
    dispatch({
      type: APP_FCM_TOKEN__SET,
      payload: token,
    });
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
