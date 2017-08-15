import React from 'react';
import { Icon } from 'react-native-elements';
import styleVars from '../../core/styleVars';

const GoBack = props => {
  return (
    <Icon
      size={33}
      type="material-community"
      color={styleVars.color.brandBlue}
      name="chevron-left"
      onPress={() => props.goBack()}
    />
  );
};

export default GoBack;
