import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAvoidingNativeView,
  Platform,
  StyleSheet,
} from 'react-native';

export const KeyboardAvoidingView = ({children, behavior}) => {
  return (
    <KeyboardAvoidingNativeView
      style={styles.default}
      contentContainerStyle={styles.default}
      behavior={
        behavior ? behavior : Platform.select({ios: 'position', android: null})
      }
      keyboardVerticalOffset={10}>
      {children}
    </KeyboardAvoidingNativeView>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
