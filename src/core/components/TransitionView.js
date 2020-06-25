import React, {PureComponent} from 'react';
import * as Animatable from 'react-native-animatable';

export default class TransitionView extends PureComponent {
  render() {
    const {index, duration, ...rest} = this.props;
    return (
      <Animatable.View
        animation="bounceInRight"
        duration={duration}
        delay={index ? index * duration - duration / (index * 3) : 0}
        useNativeDriver
        {...rest}
      />
    );
  }
}
