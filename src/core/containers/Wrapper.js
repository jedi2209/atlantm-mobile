import React, {useState, useEffect} from 'react';
import {View, Text, Appearance, ActivityIndicator} from 'react-native';


// redux
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react'
import {store, persistStore} from '../store';

// components
import SplashScreen from 'react-native-splash-screen';

// components
import App from './App';

import styleConst from '../style-const';

const colorScheme = Appearance.getColorScheme();

if (!__DEV__) {
 // eslint-disable-line no-undef
 [
  'assert',
  'clear',
  'count',
  'debug',
  'dir',
  'dirxml',
  'error',
  'exception',
  'group',
  'groupCollapsed',
  'groupEnd',
  'info',
  'log',
  'profile',
  'profileEnd',
  'table',
  'time',
  'timeEnd',
  'timeStamp',
  'trace',
  'warn',
  ].forEach((methodName) => {
    console[methodName] = () => {
      /* noop */
    };
  });
}

const _defaultHandler = ErrorUtils.getGlobalHandler();

const _wrapGlobalHandler = async (error, isFatal) => {
  console.log('Wrapper ====>', 'wrapGlobalHandler', error, isFatal);
  if (isFatal && !__DEV__) {
    persistStore.purge();
  }
  _defaultHandler(error, isFatal);
}

const _onBeforeLift = () => {
  console.log('_onBeforeLift');
  SplashScreen.hide();
}

const Loader = () => (
  <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor: styleConst.color.blue}}>
    <ActivityIndicator animating size={'large'} style={[styleConst.spinner]} color={styleConst.color.white} />
  </View>
);

const Wrapper = () => {
  const [rehydrated, setRehydrated] = useState(false);

  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    console.log('Wrapper ====>', 'componentDidMount useEffect');    
    ErrorUtils.setGlobalHandler(_wrapGlobalHandler.bind(this));

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps.maxFontSizeMultiplier = 0;
    Text.defaultProps.selectable = true;
  });

  return (
    <Provider store={store}>
      <PersistGate onBeforeLift={_onBeforeLift} loading={<Loader />} persistor={persistStore}>
        <App colorScheme={colorScheme} />
      </PersistGate>
    </Provider>
  );
}

export default Wrapper;
