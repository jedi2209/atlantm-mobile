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
      <Text style={[styles.label, isActive && styles.labelActive]}>
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
    paddingTop: 16,
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 15,
    fontSize: 18,
    color: '#bababa',
  },
  labelActive: {
    top: 0,
    fontSize: 14,
    color: '#808080',
  },
});
