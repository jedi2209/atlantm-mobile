import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Wrapper from './src/core/containers/Wrapper';

AppRegistry.registerComponent('atlantm', () =>
  Sentry.withTouchEventBoundary(Wrapper),
);
