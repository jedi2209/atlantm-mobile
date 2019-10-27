import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Wrapper from './src/core/containers/Wrapper';

YellowBox.ignoreWarnings([
  'Remote debugger',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RNDeviceInfo requires main queue setup since it overrides',
]);

Sentry.init({ 
  dsn: 'https://XXXX@sentry.io/219899', 
});

const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => AtlantmApplication);
