const amplitude = require('amplitude-js');

export default class Amplitude {
  static logEvent(category, action, params) {
    if (!__DEV__) {
      amplitude.getInstance().setUserId('XXXX');
      amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
