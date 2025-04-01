import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, LogBox } from 'react-native';
import * as Sentry from '@sentry/react-native';
import LogRocket from '@logrocket/react-native';

// redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, storePersist } from '../store';

// components
import SplashScreenComponent from './SplashScreenComponent';
import App from './App';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { SENTRY_DSN, LOG_ROCKET_ID } from '../const';
import styleConst from '../style-const';

interface SentryParams {
  dsn: string | undefined;
  tracesSampleRate: number;
  debug?: boolean;
  _experiments: {
    profilesSampleRate: number;
  };
}

let sentryParams: SentryParams = {
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
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
    _experiments: {
      profilesSampleRate: 1.0,
    },
  };
}

const _defaultHandler = ErrorUtils.getGlobalHandler();

const _wrapGlobalHandler = async (error: Error, isFatal?: boolean): Promise<void> => {
  if (isFatal && !__DEV__) {
    console.error('_wrapGlobalHandler error', error, isFatal);
    storePersist.purge();
  }
  _defaultHandler(error, isFatal);
};

const _onBeforeLift = (): void => {};

const Wrapper: React.FC = () => {
  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    ErrorUtils.setGlobalHandler(_wrapGlobalHandler);

    // Apply default props using type assertion
    (Text as any).defaultProps = (Text as any).defaultProps || {};
    (Text as any).defaultProps.allowFontScaling = false;
    (Text as any).defaultProps.maxFontSizeMultiplier = 0;
    (Text as any).defaultProps.selectable = false;
    Sentry.init(sentryParams);
    if (LOG_ROCKET_ID) {
        LogRocket.init(LOG_ROCKET_ID, {
            network: {
                requestSanitizer: (request: any) => {
                    if (request.headers['x-api-key']) {
                        request.headers['x-api-key'] = 'MOBILE_APP';
                    }
                    return request;
                },
            },
        });
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={_onBeforeLift}
        loading={<View style={styles.loader} />}
        persistor={storePersist}>
        <StatusBar animated={true} backgroundColor="#61dafb" hidden={true} />
        <SplashScreenComponent />
        <App />
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
