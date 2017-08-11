import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// component
import App from './src/core/containers/App';

class AtlantmAndroidApplication extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('atlantm', () => AtlantmAndroidApplication);

console.ignoredYellowBox = ['Remote debugger'];
