
import DeviceInfo from 'react-native-device-info';

import { NAVIGATION__CHANGE } from './actionTypes';

const nav = (state = {
  prevState: {
    index: 0,
    routes: [],
  },
  newState: {
    index: 0,
    routes: [
      {
        index: 0,
        routeName: DeviceInfo.isTablet() ? 'ContactsScreen' : 'BottomTabNavigation',
      },
    ],
  },
}, action) => {
  switch (action.type) {
    case NAVIGATION__CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default nav;
