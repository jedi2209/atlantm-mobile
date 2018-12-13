import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { Sentry } from 'react-native-sentry';
import Wrapper from './src/core/containers/Wrapper';

YellowBox.ignoreWarnings([
  'Remote debugger',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RNDeviceInfo requires main queue setup since it overrides',
]);

Sentry
  .config('https://2e35f2a2455b4a3d97a1687270845d33:4df609d533fd4ce3be4fa721e6583c87@sentry.io/219899')
  .install();

const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => AtlantmApplication);
