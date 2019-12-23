import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

// components
import Imager from '../../core/components/Imager';

// helpers
import {get} from 'lodash';
import numberWithGap from '../../utils/number-with-gap';
import styleConst from '../../core/style-const';
import {Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 60 + 20;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    shadowColor: '#c1c1c1',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  card: {
    flexDirection: 'column',
  },
  image: {
    width: cardWidth,
    height: 200,
    marginLeft: -15,
    marginRight: -15,
  },
  titleContainer: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 10,
  },
  priceDefault: {
    textDecorationLine: 'line-through',
  },
  priceSpecial: {
    color: styleConst.color.red,
  },
  extra: {
    borderColor: 'red',
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
  },
  extraItem: {
    marginRight: 10,
  },
  extraText: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
    color: styleConst.color.greyText3,
  },
  year: {
    color: '#A8ABBE',
    fontSize: 12,
  },
  title: {
    color: '#2A2A43',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    marginBottom: 10,
  },
  price: {
    color: '#2A2A43',
    fontSize: 18,
    fontWeight: 'bold',
  },
  common: {
    fontSize: 12,
    color: '#A8ABBE',
  },
});

export default class CarListItem extends Component {
  static propTypes = {
    car: PropTypes.object,
    prices: PropTypes.object,
    itemScreen: PropTypes.string,
    navigate: PropTypes.func,
  };

  static defaultProps = {
    car: null,
    prices: {},
    itemScreen: null,
    navigate: null,
    currency: 'рубс',
  };

  onPress = () => {
    const {navigate, itemScreen, car, currency} = this.props;

    navigate(itemScreen, {carId: car.id.api, currency});
  };

  shouldComponentUpdate(nextProps) {
    const {car} = this.props;

    return car.id.api !== nextProps.car.id.api;
  }

  renderPrice = ({car, prices}) => {
    const isSale = car.sale === true;
    const currency = get(prices, 'curr.name');
    const priceDefault = numberWithGap(get(car, 'price.app.standart'));
    const priceSpecial = numberWithGap(get(car, 'price.app.sale'));

    return (
      <View style={styles.priceContainer}>
        <Text style={[styles.price, isSale ? styles.priceDefault : '']}>
          {`${priceDefault} ${currency}`}
        </Text>
        {isSale ? (
          <Text
            style={[
              styles.price,
              styles.priceSpecial,
            ]}>{`${priceSpecial} ${currency}`}</Text>
        ) : null}
      </View>
    );
  };

  render() {
    const {car, prices, itemScreen} = this.props;
    const modelName = get(car, 'model.name', '');
    const complectation = get(car, 'complectation.name', '');
    const engineVolume = get(car, 'engine.volume.full');
    const mileage = get(car, 'mileage');
    const gearbox = get(car, 'gearbox.name');
    const year = get(car, 'year');

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.container}
        underlayColor={styleConst.color.select}>
        <View style={styles.card}>
          {year ? (
            <View style={styles.extraTextContainer}>
              <Text style={styles.year}>{`${year} г.в.`}</Text>
            </View>
          ) : null}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {`${get(car, 'brand.name')} ${modelName || ''} ${complectation}`}
            </Text>
          </View>
          <Imager
            resizeMode="cover"
            style={styles.image}
            source={{
              uri: get(car, 'img.10000x440.0'),
            }}
          />
          <View style={styles.price}>{this.renderPrice({car, prices})}</View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View>
              {engineVolume ? (
                <View style={styles.extraTextContainer}>
                  <Text style={styles.common}>{`${engineVolume} см³ `}</Text>
                </View>
              ) : null}
            </View>
            <View>
              {get(car, 'engine.type') || engineVolume ? (
                <View style={styles.extraTextContainer}>
                  <Text style={styles.common}>{`${car.engine.type} `}</Text>
                </View>
              ) : null}
            </View>
            {mileage ? (
              <View style={styles.extraTextContainer}>
                <Text style={styles.common}>{`пробег ${numberWithGap(
                  mileage,
                )} км. `}</Text>
              </View>
            ) : null}
            <View>
              {gearbox ? (
                <View style={styles.extraTextContainer}>
                  <Text style={styles.common}>{`${gearbox} `}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
