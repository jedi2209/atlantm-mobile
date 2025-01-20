/**
 * @format
 */
import 'react-native-url-polyfill/auto';
// import BugsnagPerformance from '@bugsnag/react-native-performance';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Wrapper from './src/core/containers/Wrapper';
import {BUGSNAG_ID} from './src/core/const';

// BugsnagPerformance.start({apiKey: BUGSNAG_ID});
AppRegistry.registerComponent(appName, () => Wrapper);
