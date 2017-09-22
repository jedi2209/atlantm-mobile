import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// component
import { Wrapper } from './src/core/containers/Wrapper';

import { Sentry } from 'react-native-sentry';

Sentry.config("https://2e35f2a2455b4a3d97a1687270845d33:4df609d533fd4ce3be4fa721e6583c87@sentry.io/219899").install();


class AtlantmIOSApplication extends Component {
  render() {
    return <Wrapper />;
  }
}

AppRegistry.registerComponent('atlantm', () => AtlantmIOSApplication);

console.ignoredYellowBox = ['Remote debugger'];
