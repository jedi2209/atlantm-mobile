import React from 'react';
import {AppRegistry, YellowBox} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Wrapper from './src/core/containers/Wrapper';

YellowBox.ignoreWarnings([
  'left was given',
  'right was given',
  'Remote debugger',
  'Warning: componentWillUpdate has been renamed',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps',
  'Module RNDeviceInfo requires main queue setup since it overrides',
]);

Sentry.init({
  dsn: 'https://2e35f2a2455b4a3d97a1687270845d33@sentry.io/219899',
});

// const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => Wrapper);
