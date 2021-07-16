import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAvoidingNativeView,
  Platform,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';

export const KeyboardAvoidingView = ({children}) => {
  const headerHeight = useHeaderHeight();
  const offset = headerHeight - 28;
  return (
    <KeyboardAvoidingNativeView
      style={{flex: 1}}
      contentContainerStyle={{flex: 1}}
      behavior={Platform.select({ios: 'position', android: 'position'})}
      keyboardVerticalOffset={-offset}>
      {children}
    </KeyboardAvoidingNativeView>
  );
};
