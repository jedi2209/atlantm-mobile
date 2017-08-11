import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';

import IntroScreen from '../intro/container/IntroScreen';

export default StackNavigator({
    Intro: { screen: IntroScreen },
});
