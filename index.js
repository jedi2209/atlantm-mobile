import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Wrapper from './src/core/containers/Wrapper';

LogBox.ignoreLogs([
  'left was given',
  'right was given',
  'Remote debugger',
  'Warning: componentWillUpdate has been renamed',
  'Warning: componentWillReceiveProps',
  'Module RNDeviceInfo requires main queue setup since it overrides',
]);

Sentry.init({
  dsn: 'https://XXXX@sentry.io/219899',
});

// const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => Wrapper);
