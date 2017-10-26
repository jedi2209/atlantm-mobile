import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

// components
import Imager from '../../core/components/Imager';

// helpers
import { get } from 'lodash';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({
  container: {
    margin: styleConst.ui.horizontalGap,
  },
  card: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 70,
    marginRight: styleConst.ui.horizontalGap,
  },
  title: {
    fontSize: 15,
    fontFamily: styleConst.font.medium,
  },
  price: {
    fontSize: 14,
    fontFamily: styleConst.font.regular,
    marginBottom: 5,
  },
  info: {
    marginTop: -4,
  },
  extra: {
    flexDirection: 'row',
  },
  extraItem: {
    marginRight: 10,
  },
  extraText: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
    color: styleConst.color.greyText3,
    flexDirection: 'column',
  },
});

export default class CarListItem extends Component {
  static propTypes = {
    car: PropTypes.object,
    prices: PropTypes.object,
    itemScreen: PropTypes.string,
    navigate: PropTypes.func,
  }

  static defaultProps = {
    car: null,
    prices: {},
    itemScreen: null,
    navigate: null,
  }

  onPress = () => {
    const { navigate, itemScreen, car } = this.props;
    navigate(itemScreen, { car });
  };

  render() {
    const { car, prices } = this.props;

    console.log('== CarListItem ==');

    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={styles.container}
        underlayColor={styleConst.color.lightBlue}
      >
        <View style={styles.card}>
          <Imager
            style={styles.image}
            source={{ uri: get(car, 'img.0') }}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{`${car.brand.name} ${car.model}`}</Text>
            <Text style={styles.price}>{`${car.price.rec} ${prices.curr.name}`}</Text>
            <View style={styles.extra}>
              <View style={styles.extraItem}>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{car.engine.type}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.engine.volume} л.c.`}</Text></View>
              </View>
              <View style={styles.extraItem}>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.year} г.в.`}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`пробег ${car.mileage}`}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.gearbox.name}`}</Text></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
