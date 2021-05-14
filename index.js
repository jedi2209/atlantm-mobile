import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Wrapper from './src/core/containers/Wrapper';

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://2e35f2a2455b4a3d97a1687270845d33@sentry.io/219899',
  });
}

AppRegistry.registerComponent('atlantm', () => Wrapper);
