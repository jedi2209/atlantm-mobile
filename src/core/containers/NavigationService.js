import {NavigationActions, StackActions} from 'react-navigation';

let _navigator;
const mainScreen = 'BottomTabNavigation';

function setTopLevelNavigator(navigatorRef) {
  console.log('setTopLevelNavigator navigatorRef', navigatorRef);
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

function reset(returnScreen, returnState) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
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
  goBack,
  reset,
};
