// import Bugsnag from '@bugsnag/react-native';
import * as Sentry from '@sentry/react-native';

export default class TraceInfo {
  static captureException(error) {
    Sentry.captureException(error);
    // Bugsnag.notify(new Error(error));
  }

  static captureMessage(message) {
    Sentry.captureMessage(message);
  }
}
