import { APP_VERSION__SET } from './actionTypes';

export const setAppVersion = (version) => {
  return dispatch => {
    dispatch({
      type: APP_VERSION__SET,
      payload: version,
    });
  };
};
