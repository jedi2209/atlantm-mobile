import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const KeyboardAvoidingView = (props) => {
  const mainRef = useRef(null);
  return (
    <KeyboardAwareScrollView
      ref={mainRef}
      enableOnAndroid={true}
      contentContainerStyle={styles.default}
      extraScrollHeight={30}
      // behavior={
      //   behavior ? behavior : Platform.select({ios: 'padding', android: null})
      // behavior={Platform.select({ios: 'height', android: null})}
      // }
      {...props}
      >
      <View style={styles.default}>
        {props.children}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
