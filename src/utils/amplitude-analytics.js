const amplitude = require('amplitude-js');

export default class Amplitude {
  static logEvent(category, action, params) {
    if (!__DEV__) {
      amplitude.getInstance().setUserId('2716d7eebc63593e80e4fd172fc8b6f3');
      amplitude.getInstance().logEvent(`${category}:${action}`, params);
    }
  }
}
