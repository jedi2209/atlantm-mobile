import React from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleProp, ViewStyle } from 'react-native';

interface TransitionViewProps {
  index?: number;
  duration?: number;
  delay?: number;
  wrapperStyle?: StyleProp<ViewStyle>;
  [key: string]: any; // For rest props
}

const TransitionView: React.FC<TransitionViewProps> = ({
  index = 0,
  duration = 500,
  delay,
  ...rest
}) => {
  return (
    <Animatable.View
      delay={
        delay ? delay : index ? index * duration - duration / (index * 3) : 0
      }
      {...rest}
    />
  );
};

export default TransitionView;
