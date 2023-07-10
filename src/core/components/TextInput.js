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
        selectable={false}
        onPress={() => {
          if (ref && ref.current) {
            ref.current.focus();
          }
        }}
        style={[
          styles.label,
          isActive && styles.labelActive,
          {
            // textDecorationLine:
            //   props.required && !isActive ? 'underline' : 'none',
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
    paddingTop: 3,
    paddingLeft: 15,
    fontSize: 15,
    lineHeight: 18,
    color: '#bababa',
    backgroundColor: 'white',
    zIndex: 10,
    width: '100%',
  },
  labelActive: {
    top: 0,
    fontSize: 12,
    color: '#808080',
    paddingBottom: 3,
    paddingTop: 0,
  },
});
