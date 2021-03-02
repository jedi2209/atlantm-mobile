import {CommonActions, StackActions} from '@react-navigation/native';
import {navigationChange} from '../../navigation/actions';

let _navigator;
const mainScreen = 'BottomTabNavigation';

function setTopLevelNavigator(navigatorRef) {
  console.log('setTopLevelNavigator navigatorRef', navigatorRef);
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    CommonActions.navigate({
      routeName,
      params,
    }),
  );
}

function onNavigationStateChange(prevState, newState) {
  navigationChange({
    prevState,
    newState,
  });
}

function goBack() {
  _navigator.dispatch(CommonActions.back());
}

function reset(returnScreen, returnState) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      CommonActions.navigate({
        routeName: returnScreen || mainScreen,
        params: returnState,
      }),
    ],
  });
  _navigator.dispatch(resetAction);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  onNavigationStateChange,
  goBack,
  reset,
};
