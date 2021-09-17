import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAwareScrollView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

export const KeyboardAvoidingView = ({children, behavior}) => {
  return (
    <KeyboardAwareScrollView
      style={styles.default}
      contentContainerStyle={styles.default}
      behavior={
        behavior ? behavior : Platform.select({ios: 'padding', android: null})
      }
      keyboardVerticalOffset={10}>
      {children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
