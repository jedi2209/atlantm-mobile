/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Wrapper from './src/core/containers/Wrapper';

AppRegistry.registerComponent(appName, () => Wrapper);
