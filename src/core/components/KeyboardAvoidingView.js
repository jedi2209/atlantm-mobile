import React, {useRef} from 'react';
import {
  // KeyboardAvoidingView as KeyboardAwareScrollView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const KeyboardAvoidingView = ({children, behavior}) => {
  const mainRef = useRef(null);
  const innerRef = useRef(null);
  return (
    // <KeyboardAwareScrollView
    //   // ref={mainRef}
    //   style={styles.default}
    //   enableOnAndroid={true}
    //   contentContainerStyle={styles.default}
    //   // behavior={
    //   //   behavior ? behavior : Platform.select({ios: 'padding', android: null})
    //   // }
    //   >
      <View style={styles.default}>
        {children}
      </View>
    // </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
