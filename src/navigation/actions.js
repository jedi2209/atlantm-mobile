import { NAVIGATION__CHANGE } from './actionTypes';

export const navigationChange = (routeName) => {
  return dispatch => {
    return dispatch({
      type: NAVIGATION__CHANGE,
      payload: routeName,
    });
  };
};
