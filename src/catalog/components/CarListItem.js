import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StyleProvider } from 'native-base';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({

});

export default class CarListItem extends Component {
  static propTypes = {
    car: PropTypes.object,
    itemScreen: PropTypes.string,
    navigate: PropTypes.func,
  }

  static defaultProps = {
    car: null,
    itemScreen: null,
    navigate: null,
  }

  onPress = () => {
    const { navigate, itemScreen, car } = this.props;
    navigate(itemScreen, { car });
  };

  render() {
    const { car } = this.props;

    console.log('== CarListItem ==');

    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <Text>{car.brand.name}</Text>
      </TouchableOpacity>
    );
  }
}
