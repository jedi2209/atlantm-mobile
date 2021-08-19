import API from '../utils/api';

import {
  CALL_ME__REQUEST,
  CALL_ME__SUCCESS,
  CALL_ME__FAIL,
  CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST,
  CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE,
} from './actionTypes';

export const callMe = props => {
  return dispatch => {
    dispatch({
      type: CALL_ME__REQUEST,
      payload: {...props},
    });

    return API.callMe(props)
      .then(res => {
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: CALL_ME__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: CALL_ME__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: CALL_ME__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};

export const actionRequestCheckAvailableNaviApps = () => {
  return dispatch => {
    return dispatch({
      type: CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__REQUEST,
    });
  };
};

export const actionDoneCheckAvailableNaviApps = () => {
  return dispatch => {
    return dispatch({
      type: CONTACTS_MAP_CHECK_AVAILABLE_NAVIAPPS__DONE,
    });
  };
};

export const actionSetAvailableNaviApps = availableNaviApps => {
  return dispatch => {
    return dispatch({
      type: CONTACTS_MAP_AVAILABLE_NAVIAPPS__SET,
      payload: availableNaviApps,
    });
  };
};
