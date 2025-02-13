import * as Sentry from '@sentry/react-native';

export default class TraceInfo {
  static captureException(error) {
    Sentry.captureException(error);
  }

  static captureMessage(message) {
    Sentry.captureMessage(message);
  }
}
