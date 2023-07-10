import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';
import {createNavigationContainerRef} from '@react-navigation/native';
// import {navigationChange} from './actions';

let _navigator;
const mainScreen = 'BottomTabNavigation';
const timeOut = 500;

const navigationRef = createNavigationContainerRef();

const setTopLevelNavigator = navigatorRef => {
  _navigator = navigatorRef;
};

const navigate = (name, params) => {
  if (_navigator && _navigator.isReady()) {
    // Perform navigation if the react navigation is ready to handle actions
    _navigator.navigate(name, params);
  } else {
    setTimeout(() => {
      navigate(name, params);
    }, timeOut);
  }
};

const dispatch = params => {
  if (_navigator && _navigator.isReady()) {
    _navigator.dispatch(CommonActions.setParams(params));
  } else {
    setTimeout(() => {
      dispatch(params);
    }, timeOut);
  }
};

const goBack = () => {
  if (_navigator && _navigator.isReady()) {
    _navigator.dispatch(CommonActions.goBack());
  } else {
    setTimeout(() => {
      goBack(params);
    }, timeOut);
  }
};

const reset = (returnScreen, returnState) => {
  const resetAction = CommonActions.reset({
    index: 0,
    routes: [
      {
        name: returnScreen || mainScreen,
        params: returnState,
      },
    ],
  });
  if (_navigator && _navigator.isReady()) {
    _navigator.dispatch(resetAction);
  } else {
    setTimeout(() => {
      reset(returnScreen, returnState);
    }, timeOut);
  }
};

// add other navigation functions that you need and export them

export {
  navigationRef,
  navigate,
  dispatch,
  setTopLevelNavigator,
  // onNavigationStateChange,
  goBack,
  reset,
};
