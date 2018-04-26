import React from 'react';
import { NativeModules, AppRegistry, YellowBox } from 'react-native';
import { Sentry } from 'react-native-sentry';

YellowBox.ignoreWarnings([
  'Remote debugger',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module AIRGoogleMapManager requires main queue setup since it overrides',
  'Module RCTImageLoader requires main queue setup since it overrides',
  'Module RNFetchBlob requires main queue setup since it overrides',
  'Module ImageCropPicker requires main queue setup since it overrides',
]);

// For RN < 0.43
if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

import RNAmplitute from 'react-native-amplitude-analytics';

const amplitude = new RNAmplitute('2716d7eebc63593e80e4fd172fc8b6f3');

amplitude.logEvent('from react native android');

import Wrapper from './src/core/containers/Wrapper';

Sentry
  .config('https://2e35f2a2455b4a3d97a1687270845d33:4df609d533fd4ce3be4fa721e6583c87@sentry.io/219899')
  .install();

const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => AtlantmApplication);
