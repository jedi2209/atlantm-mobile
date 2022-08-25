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
import {store, storePersist} from '../store';

// components
import SplashScreen from 'react-native-splash-screen';

// components
import App from './App';
import {LogBox} from 'react-native';

import {SENTRY_DSN} from '../const';
import styleConst from '../style-const';

const colorScheme = Appearance.getColorScheme();

let sentryParams = {
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.2,
  integrations: [
    new Sentry.ReactNativeTracing({
      tracingOrigins: ['localhost', 'api.atlantm.com', 'cdn.atlantm.com'],
    }),
  ],
};

if (__DEV__) {
  LogBox.ignoreLogs([
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  ]);
  sentryParams = {
    dsn: SENTRY_DSN,
    debug: true,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['localhost', 'api.atlantm.com', 'cdn.atlantm.com'],
      }),
    ],
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
    Text.defaultProps.selectable = false;
    Sentry.init(sentryParams);
  }, []);

  return (
    // <Provider store={store}>
    //   <PersistGate
    //     onBeforeLift={_onBeforeLift}
    //     loading={<Loader />}
    //     persistor={storePersist}>
    //     <Sentry.TouchEventBoundary>
    //       <App colorScheme={colorScheme} />
    //     </Sentry.TouchEventBoundary>
    //   </PersistGate>
    // </Provider>
    <Provider store={store}>
      <PersistGate
        onBeforeLift={_onBeforeLift}
        loading={<Loader />}
        persistor={storePersist}>
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
