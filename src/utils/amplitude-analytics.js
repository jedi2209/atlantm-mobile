import RNAmplitute from 'react-native-amplitude-analytics';

export default class Amplitude {
  static getInstance() {
    if (!this.instance) {
      this.instance = new RNAmplitute('XXXX');
    }
    return this.instance;
  }

  static logEvent(name, params) {
    if (!__DEV__) {
      this.getInstance().logEvent(name, params);
    }
  }
}
