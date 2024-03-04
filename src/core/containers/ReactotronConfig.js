import Reactotron, {asyncStorage, networking} from 'reactotron-react-native';
import ReactotronFlipper from 'reactotron-react-native/dist/flipper';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux'; // https://github.com/infinitered/reactotron/blob/master/docs/plugin-redux.md#options
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_NAME} from '../const';

const tron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: APP_NAME,
    createSocket: path => new ReactotronFlipper(path),
  }) // controls connection & communication settings
  .use(asyncStorage())
  .use(networking())
  .useReactNative() // add all built-in react native plugins
  .use(reduxPlugin()) // add redux plugin
  .connect(); // let's connect!

console.tron = tron;
console.tron.warn = Reactotron.log;
console.tron.log = Reactotron.log;

tron.clear();
console.tron.log('Reactotron Configured!');

export default tron;
