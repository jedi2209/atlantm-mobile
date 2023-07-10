import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

// components
import {Pressable} from 'native-base';
import RadioIcon from '../../core/components/RadioIcon';

export default class ListItemHeader extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    radio: PropTypes.bool,
    radioSelected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    textStyle: {},
    text: '',
    radio: false,
    radioSelected: false,
  };

  render() {
    const {text, radio, radioSelected, textStyle, onPress} = this.props;

    return (
      <View>
        <Pressable onPress={onPress}>
          {radio ? (
            <RadioIcon
              containerStyle={{
                marginRight: 10,
                marginTop: 1,
              }}
              selected={radioSelected}
            />
          ) : null}
          <Text style={textStyle}>{text}</Text>
        </Pressable>
      </View>
    );
  }
}
