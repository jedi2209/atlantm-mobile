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
import Badge from '../../core/components/Badge';

// helpers
import {get} from 'lodash';
import {connect} from 'react-redux';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '../../utils/price';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  containerSpecial: {
    // backgroundColor: '#1f1f1f',
  },
  ordered: {
    opacity: 0.6,
  },
  card: {
    flexDirection: 'column',
    paddingBottom: 10,
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
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titleContainer: {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    marginVertical: 5,
    marginHorizontal: '1%',
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
    color: '#afafaf',
  },
  priceSpecial: {
    color: 'red',
    marginRight: 10,
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
    fontSize: 14,
    color: '#A8ABBE',
  },
  commonReal: {
    fontSize: 14,
    color: '#FFF',
  },
  saleContainer: {
    marginTop: 2,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    paddingTop: 3,
    backgroundColor: 'red',
    borderRadius: 5,
    textAlign: 'center',
    alignContent: 'center',
    width: 65,
    height: 15,
  },
  priceSpecialText: {
    color: 'white',
    fontSize: 10,
    lineHeight: 10,
  },
  brandLogo: {
    height: 30,
    width: 40,
    zIndex: 2,
    alignContent: 'flex-start',
    flex: 1,
    marginRight: 7,
    marginLeft: 3,
    marginBottom: 2,
  },
  carTechContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    zIndex: 2,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = ({dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    brands: dealer.listBrands,
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

  onPressOrder = () => {
    const {navigate, itemScreen, car} = this.props;
    const isNewCar = itemScreen === 'NewCarItemScreen';
    navigate('OrderScreen', {
      car: {
        brand: get(car, 'brand.name', ''),
        model: get(car, 'model', ''),
        complectation: get(car, 'complectation.name'),
        year: get(car, 'year'),
        ordered: true,
      },
      region: this.props.dealerSelected.region,
      dealerId: get(car, 'dealer.id'),
      carId: car.id.api,
      isNewCar: isNewCar,
    });
  };

  shouldComponentUpdate(nextProps) {
    const {car} = this.props;

    return car.id.api !== nextProps.car.id.api;
  }

  renderPrice = ({car}) => {
    const isSale = car.sale === true;
    const badge = get(car, 'badge', []);

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
        <View style={{flex: 1, flexDirection: 'row'}}>
          {isSale ? (
            <>
              <Text
                style={[
                  styles.price,
                  {color: CarImgReal ? '#FFFFFF' : '#2A2A43'},
                  styles.priceSpecial,
                ]}>
                {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
              </Text>
              {badge &&
                badge.map((item, index) => {
                  return (
                    <Badge
                      id={car.id.api}
                      key={'badgeItem' + car.id.api + index}
                      index={index}
                      bgColor={item.background}
                      name={item.name}
                      textColor={item.textColor}
                    />
                  );
                })}
            </>
          ) : null}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.price,
              {
                color: CarImgReal ? '#FFFFFF' : '#2A2A43',
                marginRight: 10,
              },
              isSale ? styles.priceDefault : null,
            ]}>
            {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
          </Text>
          {!isSale &&
            badge &&
            badge.map((item, index) => {
              return (
                <Badge
                  id={car.id.api}
                  key={'badgeItem' + car.id.api + index}
                  index={index}
                  bgColor={item.background}
                  name={item.name}
                  textColor={item.textColor}
                />
              );
            })}
        </View>
      </View>
    );
  };

  render() {
    const {car, prices, itemScreen, brands} = this.props;
    let {resizeMode} = this.props;
    const modelName = get(car, 'model.name', '');
    const complectation = get(car, 'complectation.name', '');
    const engineVolume = get(car, 'engine.volume.full');
    const mileage = get(car, 'mileage');
    const gearbox = get(car, 'gearbox.name');
    const year = get(car, 'year');
    const ordered = get(car, 'ordered', 0);
    const idSAP = get(car, 'id.sap', null);
    const isSale = car.sale === true;
    const isNewCar = itemScreen === 'NewCarItemScreen';
    const carBrandImage =
      itemScreen === 'NewCarItemScreen' && brands[get(car, 'brand.id')];
    let CarImg = '';
    let CarImgReal = false;
    if (get(car, 'imgReal.thumb.0')) {
      CarImg = get(car, 'imgReal.thumb.0') + '1000x600c';
      CarImgReal = true;
      resizeMode = 'cover';
    } else {
      CarImg = get(car, 'img.10000x440.0');
    }
    return (
      <TouchableHighlight
        onPress={!ordered ? this.onPress : this.onPressOrder}
        style={[
          !ordered ? styleConst.shadow.light : null,
          styles.container,
          isSale ? styles.containerSpecial : null,
        ]}
        underlayColor={styleConst.color.select}>
        <View style={styles.card} key={'carID-' + this.props.key}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            useAngle
            angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
            // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
            colors={['rgba(51, 51, 51, 0.75)', 'rgba(51, 51, 51, 0.25)']}
            style={styles.titleBackground}
          />
          <View style={[styles.titleContainer]}>
            {carBrandImage ? (
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '12%', minWidth: 50,}}>
                  <Imager
                    style={styles.brandLogo}
                    resizeMode={'contain'}
                    source={{
                      uri: brands[get(car, 'brand.id')].logo,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'column', width: '88%'}}>
                  <Text
                    style={styles.title}
                    ellipsizeMode="tail"
                    selectable={false}
                    numberOfLines={1}>
                    {`${modelName || ''} ${complectation}`}
                  </Text>
                  {year ? (
                    <Text
                      style={styles.year}
                      selectable={false}>{`${year} г.в.`}</Text>
                  ) : null}
                </View>
              </View>
            ) : (
              <>
                <Text
                  style={styles.title}
                  ellipsizeMode="tail"
                  selectable={false}
                  numberOfLines={1}>
                  {`${get(car, 'brand.name')} ${
                    modelName || ''
                  } ${complectation}`}
                </Text>
                {year ? (
                  <Text style={styles.year}>{`${year} г.в.`}</Text>
                ) : null}
              </>
            )}
          </View>
          {CarImg ? (
            <Imager
              resizeMode={resizeMode ? resizeMode : 'cover'}
              style={[
                CarImgReal ? styles.imageReal : styles.image,
                ordered ? styles.ordered : null,
              ]}
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
              ordered ? styles.ordered : null,
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
          <View style={styles.carTechContainer}>
            {engineVolume &&
            get(car, 'engine.id') &&
            get(car, 'engine.id') !== 4 ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${engineVolume} см³ `}</Text>
            ) : null}
            {get(car, 'engine.type') || engineVolume ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${car.engine.type} `}</Text>
            ) : null}
            {mileage ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`пробег ${numberWithGap(mileage)} км. `}</Text>
            ) : null}
            {gearbox ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${gearbox.toLowerCase()} `}</Text>
            ) : null}
            {idSAP && isNewCar ? (
              <Text style={CarImgReal ? styles.commonReal : styles.common}>
                {`#${idSAP}`}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default connect(mapStateToProps)(CarListItem);
