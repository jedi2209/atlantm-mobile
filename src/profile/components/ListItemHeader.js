import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Icon } from 'native-base';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  icon: {
    color: styleConst.color.systemBlue,
    marginRight: 10,
    marginTop: 1,
  },
});

export default class ListItemHeader extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    radio: PropTypes.bool,
    radioSelected: PropTypes.bool,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    textStyle: {},
    text: '',
    radio: false,
    radioSelected: false,
  }

  render() {
    const { text, radio, radioSelected, textStyle, onPress } = this.props;

    return (
      <View>
        <ListItem onPress={onPress} itemHeader>
          {
              radio ?
                (
                  <Icon
                    name={radioSelected ? 'md-radio-button-on' : 'md-radio-button-off'}
                    style={[
                      styles.icon,
                    ]}
                  />
                ) : null
            }
          <Text style={textStyle}>{this.props.text}</Text>
        </ListItem>
      </View>
    );
  }
}
