/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';

export const TextInput = React.forwardRef((props, ref) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || Boolean(props.value);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          isActive && styles.labelActive,
          {
            textDecorationLine:
              props.required && !isActive ? 'underline' : 'none',
            textDecorationStyle: 'solid',
          },
        ]}>
        {props.label}
      </Text>
      <NativeTextInput
        {...props}
        ref={ref}
        value={props.value || ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  label: {
    position: 'absolute',
    left: 0,
    paddingTop: 5,
    fontSize: 18,
    lineHeight: 20,
    color: '#bababa',
    backgroundColor: 'white',
    zIndex: 10,
    width: '100%',
    paddingBottom: 5,
  },
  labelActive: {
    top: 0,
    fontSize: 14,
    color: '#808080',
  },
});
