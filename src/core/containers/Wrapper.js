import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  ActivityIndicator,
} from 'react-native';
import * as Sentry from '@sentry/react-native';

// redux
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistStore} from '../store';

// components
import SplashScreen from 'react-native-splash-screen';

// components
import App from './App';
import {LogBox} from 'react-native';

import {SENTRY_DSN} from '../const';
import styleConst from '../style-const';

const colorScheme = Appearance.getColorScheme();

if (__DEV__) {
  LogBox.ignoreAllLogs();
}

const _defaultHandler = ErrorUtils.getGlobalHandler();

const _wrapGlobalHandler = async (error, isFatal) => {
  if (isFatal && !__DEV__) {
    console.error('_wrapGlobalHandler error', error, isFatal);
    persistStore.purge();
  }
  _defaultHandler(error, isFatal);
};

const _onBeforeLift = () => {
  SplashScreen.hide();
};

const Loader = () => (
  <View style={styles.loader}>
    <ActivityIndicator
      animating
      size={'large'}
      style={[styleConst.spinner]}
      color={styleConst.color.white}
    />
  </View>
);

const Wrapper = () => {
  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    ErrorUtils.setGlobalHandler(_wrapGlobalHandler.bind(this));

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps.maxFontSizeMultiplier = 0;
    Text.defaultProps.selectable = true;
    Sentry.init({dsn: SENTRY_DSN});
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={_onBeforeLift}
        loading={<Loader />}
        persistor={persistStore}>
        <App colorScheme={colorScheme} />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: styleConst.color.blue,
  },
});

export default Sentry.wrap(Wrapper);
