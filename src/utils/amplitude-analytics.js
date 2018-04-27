import RNAmplitute from 'react-native-amplitude-analytics';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

export default class Amplitude {
  static getInstance() {
    if (!this.instance) {
      this.instance = new RNAmplitute('2716d7eebc63593e80e4fd172fc8b6f3');
    }
    return this.instance;
  }

  static getGATracker() {
    if (!this.gatracker) {
      this.gatracker = new GoogleAnalyticsTracker('UA-118347995-1');
    }

    return this.gatracker;
  }

  static logEvent(category, action, params) {
    if (!__DEV__) {
      this.getInstance().logEvent(`${category}:${action}`, params);
      this.getGATracker().trackEvent(category, action, params);
    }
  }
}
