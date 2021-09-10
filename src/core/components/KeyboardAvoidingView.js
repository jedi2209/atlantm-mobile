import React from 'react';
import {
  KeyboardAvoidingView as KeyboardAwareScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const KeyboardAvoidingView = ({children, behavior}) => {
  // return <View style={styles.default}>{children}</View>;
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
