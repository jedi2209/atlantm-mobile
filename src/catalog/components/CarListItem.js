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
import priceSet from '../../utils/price-set';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.systemGray,
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
    navigate(itemScreen, { carId: car.id.api });
  }

  shouldComponentUpdate(nextProps) {
    const { car } = this.props;

    return (car.id.api !== nextProps.car.id.api);
  }

  render() {
    const { car, prices } = this.props;

    // console.log('== CarListItem ==');

    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={styles.container}
        underlayColor={styleConst.color.select}
      >
        <View style={styles.card}>
          <Imager
            style={styles.image}
            source={{ uri: get(car, 'img.10000x300.0') }}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{`${car.brand.name} ${car.model}`}</Text>
            <Text style={styles.price}>{`${priceSet(car.price.app)} ${prices.curr.name}`}</Text>
            <View style={styles.extra}>
              <View style={styles.extraItem}>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{car.engine.type}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.engine.volume.short} л`}</Text></View>
              </View>
              <View style={styles.extraItem}>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.year} г.в.`}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`пробег ${car.mileage}`}</Text></View>
                <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${car.gearbox.name || ''}`}</Text></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
