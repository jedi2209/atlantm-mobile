import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAvoidingNativeView,
  Platform,
} from 'react-native';

export const KeyboardAvoidingView = ({children}) => (
  <KeyboardAvoidingNativeView
    behavior={Platform.select({ios: 'position', android: null})}
    keyboardVerticalOffset={0}>
    {children}
  </KeyboardAvoidingNativeView>
);
