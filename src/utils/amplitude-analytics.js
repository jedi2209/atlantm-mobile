import RNAmplitute from 'react-native-amplitude-analytics';

export default class Amplitude {
  static getInstance() {
    if (!this.instance) {
      this.instance = new RNAmplitute('2716d7eebc63593e80e4fd172fc8b6f3');
    }
    return this.instance;
  }

  static logEvent(name, params) {
    // if (!__DEV__) {
      this.getInstance().logEvent(name, params);
    // }
  }
}
