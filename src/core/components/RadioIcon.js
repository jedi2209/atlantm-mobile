import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Icon } from 'native-base';

// helpers
import styleConst from '../style-const';

const styles = StyleSheet.create({
  icon: {
    color: styleConst.color.systemBlue,
  },
});

export default class RadioIcon extends Component {
  static propTypes = {
    selected: PropTypes.bool,
  }

  static defaultProps = {
    selected: false,
    containerStyle: null,
  }

  render() {
    const { containerStyle, selected } = this.props;

    return (
      <Icon
        name={selected ? 'md-radio-button-on' : 'md-radio-button-off'}
        style={[
          styles.icon,
          containerStyle,
        ]}
      />
    );
  }
}
