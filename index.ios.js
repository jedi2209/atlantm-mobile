import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// component
import App from './src/core/containers/App';

class AtlantmIOSApplication extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('atlantm', () => AtlantmIOSApplication);

console.ignoredYellowBox = ['Remote debugger'];
