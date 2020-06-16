import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// components
import Imager from '../../core/components/Imager';

// helpers
import {get} from 'lodash';
import {connect} from 'react-redux';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '@utils/price';
import styleConst from '@core/style-const';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
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
  imageReal: {
    height: 300,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 2,
  },
  priceBackground: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 1,
    width: '80%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    bottom: 0,
  },
  common: {
    fontSize: 12,
    color: '#A8ABBE',
  },
  commonReal: {
    fontSize: 12,
    color: '#FFF',
  },
});

const mapStateToProps = ({dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
  };
};

class CarListItem extends Component {
  static propTypes = {
    car: PropTypes.object,
    prices: PropTypes.object,
    itemScreen: PropTypes.string,
    navigate: PropTypes.func,
    key: PropTypes.string,
  };

  static defaultProps = {
    car: null,
    prices: {},
    itemScreen: null,
    navigate: null,
    currency: 'руб',
    key: '',
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

    let CarImgReal = false;
    if (get(car, 'imgReal.thumb.0')) {
      CarImgReal = true;
    }

    const CarPrices = {
      sale: get(car, 'price.app.sale') || 0,
      standart: get(car, 'price.app.standart') || get(car, 'price.app'),
    };

    return (
      <View style={[styles.priceContainer, {marginBottom: CarImgReal ? 0 : 5}]}>
        {isSale ? (
          <Text
            style={[
              styles.price,
              styles.priceSpecial,
              {color: CarImgReal ? '#FFFFFF' : '#2A2A43'},
            ]}>
            {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
          </Text>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.price,
              isSale ? styles.priceDefault : null,
              {
                color: CarImgReal ? '#FFFFFF' : '#2A2A43',
              },
            ]}>
            {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
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
    const {car, prices, itemScreen} = this.props;
    let {resizeMode} = this.props;
    const modelName = get(car, 'model.name', '');
    const complectation = get(car, 'complectation.name', '');
    const engineVolume = get(car, 'engine.volume.full');
    const mileage = get(car, 'mileage');
    const gearbox = get(car, 'gearbox.name');
    const year = get(car, 'year');
    const isSale = car.sale === true;
    let CarImg = '';
    let CarImgReal = false;
    if (get(car, 'imgReal.thumb.0')) {
      CarImg = get(car, 'imgReal.thumb.0') + '1000x600c';
      CarImgReal = true;
      resizeMode = 'cover';
    } else {
      CarImg = get(car, 'img.10000x440.0');
    }
    console.log('itemScreen', itemScreen);
    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={[styleConst.shadow.light, styles.container]}
        underlayColor={styleConst.color.select}>
        <View style={styles.card} key={'carID-' + this.props.key}>
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
          <View style={styles.titleContainer}>
            <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
              {`${get(car, 'brand.name')} ${modelName || ''} ${complectation}`}
            </Text>
            {year ? <Text style={styles.year}>{`${year} г.в.`}</Text> : null}
          </View>
          {CarImg ? (
            <Imager
              resizeMode={resizeMode ? resizeMode : 'cover'}
              style={[CarImgReal ? styles.imageReal : styles.image]}
              source={{
                uri: CarImg,
              }}
            />
          ) : null}
          {CarImgReal ? (
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              useAngle
              angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
              // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
              colors={['rgba(51, 51, 51, 0.4)', 'rgba(51, 51, 51, 0)']}
              style={[
                styles.priceBackground,
                {height: isSale ? 80 : 60},
                itemScreen === 'NewCarItemScreen' ? {width: '100%'} : null,
              ]}
            />
          ) : null}
          <View
            style={[
              styles.price,
              itemScreen === 'NewCarItemScreen'
                ? {
                    marginTop:
                      (Platform.OS !== 'ios' ? -6 : 0) +
                      (CarImgReal ? (isSale ? -80 : -60) : -20),
                  }
                : null,
            ]}>
            {this.renderPrice({car, prices})}
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: 15,
              zIndex: 2,
            }}>
            <View>
              {engineVolume &&
              get(car, 'engine.id') &&
              get(car, 'engine.id') !== 4 ? (
                <View style={styles.extraTextContainer}>
                  <Text
                    style={
                      CarImgReal ? styles.commonReal : styles.common
                    }>{`${engineVolume} см³ `}</Text>
                </View>
              ) : null}
            </View>
            <View>
              {get(car, 'engine.type') || engineVolume ? (
                <View style={styles.extraTextContainer}>
                  <Text
                    style={
                      CarImgReal ? styles.commonReal : styles.common
                    }>{`${car.engine.type} `}</Text>
                </View>
              ) : null}
            </View>
            {mileage ? (
              <View style={styles.extraTextContainer}>
                <Text
                  style={
                    CarImgReal ? styles.commonReal : styles.common
                  }>{`пробег ${numberWithGap(mileage)} км. `}</Text>
              </View>
            ) : null}
            <View>
              {gearbox ? (
                <View style={styles.extraTextContainer}>
                  <Text
                    style={
                      CarImgReal ? styles.commonReal : styles.common
                    }>{`${gearbox.toLowerCase()} `}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default connect(mapStateToProps)(CarListItem);
