import React from 'react';
import {View} from 'native-base';
import * as Animatable from 'react-native-animatable';

const TransitionView = ({index, duration, delay, wrapperStyle, ...rest}) => {
  // const children = rest.children;
  // delete rest.children;
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
