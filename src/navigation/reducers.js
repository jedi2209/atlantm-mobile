import { NAVIGATION__CHANGE } from './actionTypes';

const nav = (state = '', action) => {
  switch (action.type) {
    case NAVIGATION__CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default nav;
