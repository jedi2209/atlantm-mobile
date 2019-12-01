import amplitude from 'amplitude-js';
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

export default class Amplitude {
  static getInstance() {
    if (!this.instance) {
      this.instance = new amplitude('XXXX');
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
      // this.getGATracker().trackEvent(category, action, params);
    }
  }
}
