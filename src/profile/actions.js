import {
  PROFILE_NAME__FILL,
  PROFILE_PHONE__FILL,
  PROFILE_EMAIL__FILL,
} from './actionTypes';

export const nameFill = (name) => {
  return dispatch => {
    dispatch({
      type: PROFILE_NAME__FILL,
      payload: name ? name.trim() : '',
    });
  };
};

export const phoneFill = (phone) => {
  return dispatch => {
    dispatch({
      type: PROFILE_PHONE__FILL,
      payload: phone ? phone.trim() : '',
    });
  };
};

export const emailFill = (email) => {
  return dispatch => {
    dispatch({
      type: PROFILE_EMAIL__FILL,
      payload: email ? email.trim() : '',
    });
  };
};
