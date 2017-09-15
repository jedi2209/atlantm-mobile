import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// component
import { Wrapper } from './src/core/containers/Wrapper';

class AtlantmIOSApplication extends Component {
  render() {
    return <Wrapper />;
  }
}

AppRegistry.registerComponent('atlantm', () => AtlantmIOSApplication);

console.ignoredYellowBox = ['Remote debugger'];
