import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAvoidingNativeView,
  Platform,
} from 'react-native';
import {Header} from '@react-navigation/stack';

const offset = Header.HEIGHT + 28;

export const KeyboardAvoidingView = ({children}) => (
  <KeyboardAvoidingNativeView
    style={{flex: 1}}
    contentContainerStyle={{flex: 1}}
    behavior={Platform.select({ios: 'position', android: null})}
    keyboardVerticalOffset={-offset}>
    {children}
  </KeyboardAvoidingNativeView>
);
