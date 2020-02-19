import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// components
import Imager from '../../core/components/Imager';

// helpers
import {get} from 'lodash';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '@utils/price';
import styleConst from '../../core/style-const';
import {Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#c1c1c1',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 3,
  },
  card: {
    flexDirection: 'column',
    paddingBottom: 15,
  },
  image: {
    height: 220,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  titleBackgroundold: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
    height: 50,
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  titleBackground: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 1,
    height: 50,
    width: '80%',
    borderTopLeftRadius: 5,
  },
  titleContainer: {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  priceContainer: {
    flexDirection: 'column',
    marginHorizontal: 15,
    marginBottom: 5,
    marginTop: 10,
  },
  priceDefault: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    marginTop: 4,
  },
  priceSpecial: {
    color: '#D0021B',
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
    color: '#fff',
    fontSize: 12,
    zIndex: 2,
    marginVertical: 5,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 2,
    // marginBottom: 10,
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
    currency: 'руб',
  };

  onPress = () => {
    const {navigate, itemScreen, car, currency, prices} = this.props;

    navigate(itemScreen, {carId: car.id.api, currency, code: prices.curr.code});
  };

  shouldComponentUpdate(nextProps) {
    const {car} = this.props;

    return car.id.api !== nextProps.car.id.api;
  }

  renderPrice = ({car, prices}) => {
    const isSale = car.sale === true;
    const currency = get(prices, 'curr.name');

    const CarPrices = {
      sale: get(car, 'price.app.sale') || 0,
      standart: get(car, 'price.app.standart') || get(car, 'price.app'),
    };

    return (
      <View style={styles.priceContainer}>
        {isSale ? (
          <Text style={[styles.price, styles.priceSpecial]}>{`${numberWithGap(
            CarPrices.sale,
          )} ${currency.toUpperCase()}`}</Text>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.price, isSale ? styles.priceDefault : null]}>
            {`${numberWithGap(CarPrices.standart)} ${currency.toUpperCase()}`}
          </Text>
          {isSale ? (
            <View
              style={{
                marginTop: 2,
                marginHorizontal: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
                backgroundColor: 'red',
                borderRadius: 5,
                textAlign: 'center',
                alignContent: 'center',
                width: 65,
                height: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  lineHeight: 10,
                }}>
                Спец.цена
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  render() {
    const {car, prices, itemScreen, resizeMode} = this.props;
    const modelName = get(car, 'model.name', '');
    const complectation = get(car, 'complectation.name', '');
    const engineVolume = get(car, 'engine.volume.full');
    const mileage = get(car, 'mileage');
    const gearbox = get(car, 'gearbox.name');
    const year = get(car, 'year');
    console.log('itemScreen', itemScreen);
    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={styles.container}
        underlayColor={styleConst.color.select}>
        <View style={styles.card}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            useAngle
            angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
            // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
            colors={['rgba(51, 51, 51, 0.75)', 'rgba(51, 51, 51, 0)']}
            style={[
              styles.titleBackground,
              itemScreen === 'NewCarItemScreen' ? {width: '100%'} : null,
            ]}
          />
          {/* <View style={styles.titleBackgroundold} /> */}
          <View style={styles.titleContainer}>
            <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
              {`${get(car, 'brand.name')} ${modelName || ''} ${complectation}`}
            </Text>
            {year ? <Text style={styles.year}>{`${year} г.в.`}</Text> : null}
          </View>
          <Imager
            resizeMode={resizeMode ? resizeMode : 'cover'}
            style={[styles.image]}
            source={{
              uri: get(car, 'img.10000x440.0'),
            }}
          />
          <View
            style={[
              styles.price,
              itemScreen === 'NewCarItemScreen' ? {marginTop: -20} : null,
            ]}>
            {this.renderPrice({car, prices})}
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: 15,
            }}>
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
      </TouchableHighlight>
    );
  }
}
