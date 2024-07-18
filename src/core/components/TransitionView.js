import React from 'react';
import * as Animatable from 'react-native-animatable';

const TransitionView = ({
  index = 0,
  duration,
  delay,
  wrapperStyle,
  ...rest
}) => {
  return (
    <Animatable.View
      animation="bounceInRight"
      duration={duration}
      useNativeDriver={true}
      delay={
        delay ? delay : index ? index * duration - duration / (index * 3) : 0
      }
      {...rest}
    />
  );
};

export default TransitionView;
