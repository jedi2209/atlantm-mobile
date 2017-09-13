import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// component
import Wrapper from './src/core/containers/Wrapper';

class AtlantmAndroidApplication extends Component {
  render() {
    return <Wrapper />;
  }
}

AppRegistry.registerComponent('atlantm', () => AtlantmAndroidApplication);

console.ignoredYellowBox = ['Remote debugger'];
