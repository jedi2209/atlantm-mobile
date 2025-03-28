import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Appearance, StatusBar} from 'react-native';
import * as Sentry from '@sentry/react-native';
import LogRocket from '@logrocket/react-native';

// redux
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, storePersist} from '../store';

// components
import SplashScreenComponent from './SplashScreenComponent';

// components
import App from './App';
import {LogBox} from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import {SENTRY_DSN, LOG_ROCKET_ID} from '../const';
import styleConst from '../style-const';

const colorScheme = Appearance.getColorScheme();

let sentryParams = {
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  // integrations: [
  //   new Sentry.ReactNativeTracing({
  //     tracingOrigins: ['localhost', 'api.atlantm.com', 'cdn.atlantm.com'],
  //   }),
  // ],
  _experiments: {
    profilesSampleRate: 1.0,
  },
};

if (__DEV__) {
  LogBox.ignoreLogs([
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    'If you do not provide children, you must specify an aria-label for accessibility',
  ]);
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  sentryParams = {
    dsn: SENTRY_DSN,
    debug: true,
    tracesSampleRate: 1.0,
    // integrations: [
    //   new Sentry.ReactNativeTracing({
    //     tracingOrigins: ['localhost', 'api.atlantm.com', 'cdn.atlantm.com'],
    //   }),
    // ],
    _experiments: {
      profilesSampleRate: 1.0,
    },
  };
}

const _defaultHandler = ErrorUtils.getGlobalHandler();

const _wrapGlobalHandler = async (error, isFatal) => {
  if (isFatal && !__DEV__) {
    console.error('_wrapGlobalHandler error', error, isFatal);
    storePersist.purge();
  }
  _defaultHandler(error, isFatal);
};

const _onBeforeLift = () => {};

const Wrapper = () => {
  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    ErrorUtils.setGlobalHandler(_wrapGlobalHandler.bind(this));

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps.maxFontSizeMultiplier = 0;
    Text.defaultProps.selectable = false;
    Sentry.init(sentryParams);
    LogRocket.init(LOG_ROCKET_ID, {
      network: {
        requestSanitizer: request => {
          if (request.headers['x-api-key']) {
            request.headers['x-api-key'] = 'MOBILE_APP';
          }
          return request;
        },
      },
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={_onBeforeLift}
        loading={<View style={styles.loader} flex={1} />}
        persistor={storePersist}>
        <StatusBar animated={true} backgroundColor="#61dafb" hidden={true} />
        <SplashScreenComponent />
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

export default Wrapper;
