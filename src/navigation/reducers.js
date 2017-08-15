import { NAVIGATION__CHANGE } from './actionTypes';

const navReducer = (state = '', action) => {
  switch (action.type) {
    case NAVIGATION__CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default navReducer;
