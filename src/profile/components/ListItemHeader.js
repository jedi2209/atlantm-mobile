import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem } from 'native-base';

export default class ListItemHeader extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
  }

  static defaultProps = {
    text: '',
  }

  render() {
    return (
      <View>
        <ListItem itemHeader>
          <Text>{this.props.text}</Text>
        </ListItem>
      </View>
    );
  }
}
