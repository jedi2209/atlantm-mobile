import Reactotron from 'reactotron-react-native';
import ReactotronFlipper from "reactotron-react-native/dist/flipper";
import {reactotronRedux as reduxPlugin} from 'reactotron-redux'; // https://github.com/infinitered/reactotron/blob/master/docs/plugin-redux.md#options
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: "Atlant-M",
    createSocket: path => new ReactotronFlipper(path),
  }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reduxPlugin()) // add redux plugin
  .connect();  // let's connect!

  console.tron = reactotron;

export default reactotron