import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { Sentry } from 'react-native-sentry';

// YellowBox.ignoreWarnings([
//   'Remote debugger',
//   'Warning: componentWillMount is deprecated',
//   'Warning: componentWillReceiveProps is deprecated',
//   'Module AIRGoogleMapManager requires main queue setup since it overrides',
//   'Module RCTImageLoader requires main queue setup since it overrides',
//   'Module RNFetchBlob requires main queue setup since it overrides',
//   'Module ImageCropPicker requires main queue setup since it overrides',
// ]);

import Wrapper from './src/core/containers/Wrapper';

console.log('Sentry', Sentry);

Sentry
  .config('https://XXXX:4df609d533fd4ce3be4fa721e6583c87@sentry.io/219899')
  .install();

const AtlantmApplication = () => <Wrapper />;

AppRegistry.registerComponent('atlantm', () => AtlantmApplication);
