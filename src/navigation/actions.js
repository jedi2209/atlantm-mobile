export const navigationChange = (navigationState) => {
  return (dispatch) => {
    return dispatch({
      type: 'NAVIGATION__CHANGE',
      payload: navigationState,
    });
  };
};
