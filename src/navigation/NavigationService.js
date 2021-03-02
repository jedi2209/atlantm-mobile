import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';
// import {navigationChange} from './actions';

let _navigator;
const mainScreen = 'BottomTabNavigation';

const navigationRef = React.createRef();

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

const navigate = (name, params) => {
  _navigator.current?.navigate(name, params);
};

// const onNavigationStateChange = (newState) => {
//   navigationChange({
//     newState,
//   });
// };

const goBack = () => {
  _navigator.current?.dispatch(CommonActions.goBack());
};

const reset = (returnScreen, returnState) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      CommonActions.navigate({
        routeName: returnScreen || mainScreen,
        params: returnState,
      }),
    ],
  });
  _navigator.current?.dispatch(resetAction);
};

// add other navigation functions that you need and export them

export {
  navigationRef,
  navigate,
  setTopLevelNavigator,
  // onNavigationStateChange,
  goBack,
  reset,
};
