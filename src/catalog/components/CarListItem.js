import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Platform,
} from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import LinearGradient from 'react-native-linear-gradient';

// components
import Imager from '../../core/components/Imager';
import Badge from '../../core/components/Badge';
import BrandLogo from '../../core/components/BrandLogo';
import PhotoSlider from '../../core/components/PhotoSlider';

// helpers
import {get} from 'lodash';
import {connect} from 'react-redux';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '../../utils/price';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const mapStateToProps = ({dealer}) => {
  return {
    dealerSelected: dealer.selected,
  };
};

const CarListItem = ({
  car,
  prices,
  itemScreen,
  resizeMode,
  dealerSelected,
  currency,
  testID,
  key,
}) => {
  const navigation = useNavigation();

  const modelName = get(car, 'model.name', '');
  const complectationName = get(car, 'complectation.name', '');
  const engineVolume = get(car, 'engine.volume.full');
  const mileage = get(car, 'mileage');

  const gearboxId = get(car, 'gearbox.id');
  let gearboxName = get(car, 'gearbox.name');
  if (gearboxId) {
    gearboxName = strings.CarParams.gearbox[gearboxId];
  }

  const engineId = get(car, 'engine.id');
  let engineName = get(car, 'engine.type');
  if (engineId) {
    engineName = strings.CarParams.engine[engineId];
  }

  const year = get(car, 'year');
  let ordered = get(car, 'ordered', 1);
  switch (ordered) {
    case 2:
    case 3:
      ordered = true;
      break;
  }
  const idSAP = get(car, 'id.sap', null);
  const isSale = car.sale === true;
  const isNewCar = itemScreen === 'NewCarItemScreen';
  let CarImgReal = get(car, 'imgReal.thumb', false);

  const _onPress = () => {
    navigation.navigate(itemScreen, {
      carId: car.id.api,
      currency,
      code: prices.curr.code,
    });
  };

  const _onPressOrder = () => {
    const isNewCar = itemScreen === 'NewCarItemScreen';
    navigation.navigate('OrderScreen', {
      car: {
        brand: get(car, 'brand.name', ''),
        model: get(car, 'model', ''),
        complectation: complectationName,
        year,
        ordered,
        dealer: get(car, 'dealer'),
      },
      region: dealerSelected.region,
      carId: car.id.api,
      isNewCar: isNewCar,
    });
  };

  const _renderPrice = ({car}) => {
    const isSale = car.sale === true;
    const badge = get(car, 'badge', []);

    const CarPrices = {
      sale: get(car, 'price.app.sale', 0),
      standart: get(car, 'price.app.standart', get(car, 'price.app')),
    };

    return (
      <View style={[styles.priceContainer, {marginBottom: CarImgReal ? 0 : 5}]}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {isSale ? (
            <>
              <Text
                style={[
                  styles.price,
                  {color: CarImgReal ? styleConst.color.white : '#2A2A43'},
                  styles.priceSpecial,
                ]}>
                {showPrice(CarPrices.sale, dealerSelected.region)}
              </Text>
              {badge &&
                badge.map((item, index) => {
                  if (item.name.toLowerCase() === 'спец.цена') {
                    item.name = strings.CarList.badges.specialPrice;
                  }
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
                color: CarImgReal ? styleConst.color.white : '#2A2A43',
                marginRight: 10,
              },
              isSale ? styles.priceDefault : null,
            ]}>
            {showPrice(CarPrices.standart, dealerSelected.region)}
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

  const _renderImage = ({ordered}) => {
    let CarImgs = get(car, 'img.thumb');
    let CarImgsReal = get(car, 'imgReal.thumb');
    const isNewCar = itemScreen === 'NewCarItemScreen';
    const isSale = car.sale === true;

    if (typeof CarImgs !== 'undefined' && CarImgs.length === 1) {
      let path = CarImgsReal ? CarImgsReal[0] : CarImgs[0];
      path += '1000x440';
      return (
        <>
          <Imager
            resizeMode={resizeMode}
            style={[
              CarImgsReal ? styles.imageReal : styles.image,
              ordered ? styles.ordered : null,
            ]}
            source={{
              uri: path,
            }}
          />
          {CarImgsReal ? (
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              useAngle
              angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
              // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
              colors={['rgba(51, 51, 51, .4)', 'rgba(51, 51, 51, 0)']}
              style={[
                styles.priceBackground,
                {height: isSale ? 80 : 60},
                itemScreen === 'NewCarItemScreen' ? {width: '100%'} : null,
              ]}
            />
          ) : null}
        </>
      );
    } else {
      let photos = [];
      if (get(car, 'img.thumb')) {
        get(car, 'img.thumb').forEach(element => {
          photos.push(element + '1000x440');
        });
      }
      return (
        <PhotoSlider
          height={CarImgsReal ? 300 : 220}
          resizeMode={resizeMode}
          style={[
            CarImgsReal ? styles.imageReal : styles.image,
            car?.ordered ? styles.ordered : null,
          ]}
          dotColor={styleConst.color.white}
          photos={photos}
          paginationStyle={{marginBottom: CarImgsReal ? 25 : -15}}
          onPressItem={!ordered ? _onPress : _onPressOrder}
        />
      );
    }
  };

  return (
    <RNBounceable
      onPress={!ordered ? _onPress : _onPressOrder}
      testID={testID + '-' + key}
      accessibilityLabel={testID}
      accessibilityRole="button">
      <View
        style={[
          !ordered ? styleConst.shadow.light : null,
          styles.container,
          isSale ? styles.containerSpecial : null,
        ]}
        underlayColor={styleConst.color.select}>
        <View style={styles.card} key={'carID-' + key}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            useAngle
            angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
            colors={['rgba(51, 51, 51, 0.75)', 'rgba(51, 51, 51, 0.25)']}
            style={styles.titleBackground}
          />
          <View style={[styles.titleContainer]}>
            {isNewCar ? (
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '12%', minWidth: 50}}>
                  <BrandLogo
                    brand={get(car, 'brand.id')}
                    width={45}
                    type="white"
                    style={styles.brandLogo}
                    key={'brandLogo' + get(car, 'brand.id')}
                  />
                </View>
                <View style={{flexDirection: 'column', width: '88%'}}>
                  <Text
                    style={styles.title}
                    ellipsizeMode="tail"
                    selectable={false}
                    numberOfLines={1}>
                    {`${modelName || ''} ${complectationName}`}
                  </Text>
                  {year ? (
                    <Text style={styles.year} selectable={false}>
                      {year + ' ' + strings.NewCarItemScreen.shortUnits.year}{' '}
                    </Text>
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
                  } ${complectationName}`}
                </Text>
                {year ? (
                  <Text style={styles.year}>
                    {year + ' ' + strings.NewCarItemScreen.shortUnits.year}
                  </Text>
                ) : null}
              </>
            )}
          </View>
          {_renderImage({ordered})}
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
            {_renderPrice({car, prices})}
          </View>
          <View style={styles.carTechContainer}>
            {mileage ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${numberWithGap(mileage)} км.`}</Text>
            ) : null}
            {engineVolume &&
            get(car, 'engine.id') &&
            get(car, 'engine.id') !== 4 ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${engineVolume} см³`}</Text>
            ) : null}
            {get(car, 'engine.type') ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${engineName.toLowerCase()}`}</Text>
            ) : null}
            {gearboxName ? (
              <Text
                selectable={false}
                style={
                  CarImgReal ? styles.commonReal : styles.common
                }>{`${gearboxName.toLowerCase()}`}</Text>
            ) : null}
            {idSAP && isNewCar ? (
              <Text style={CarImgReal ? styles.commonReal : styles.common}>
                {`#${idSAP}`}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </RNBounceable>
  );
};

CarListItem.propTypes = {
  car: PropTypes.object,
  prices: PropTypes.object,
  itemScreen: PropTypes.string,
  key: PropTypes.string,
};

CarListItem.defaultProps = {
  car: null,
  prices: {},
  itemScreen: null,
  currency: 'руб',
  resizeMode: 'cover',
  key: '',
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    marginVertical: 10,
    backgroundColor: styleConst.color.white,
    borderRadius: 5,
  },
  containerSpecial: {},
  ordered: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'column',
    paddingBottom: 10,
  },
  image: {
    height: 220,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    width: '100%',
    zIndex: 1,
  },
  imageReal: {
    height: 300,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 10,
  },
  titleBackgroundold: {
    flex: 1,
    position: 'absolute',
    zIndex: 15,
    backgroundColor: 'black',
    opacity: 0.5,
    height: 50,
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  titleBackground: {
    flex: 1,
    zIndex: 15,
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
    zIndex: 20,
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
    color: '#8d99ae',
  },
  priceSpecial: {
    color: '#e63946',
    marginRight: 10,
  },
  year: {
    color: styleConst.color.white,
    fontSize: 12,
    zIndex: 10,
    marginVertical: 5,
  },
  title: {
    color: styleConst.color.white,
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 20,
  },
  priceBackground: {
    flex: 1,
    zIndex: 20,
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 1,
    width: '80%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    bottom: 0,
  },
  common: {
    fontSize: 13,
    color: '#2b2d42',
    marginRight: 7,
  },
  commonReal: {
    fontSize: 13,
    color: styleConst.color.white,
    marginRight: 7,
  },
  saleContainer: {
    marginTop: 2,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    paddingTop: 3,
    backgroundColor: '#e63946',
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
    zIndex: 2,
    alignContent: 'flex-start',
    flex: 1,
    marginBottom: 2,
  },
  carTechContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    zIndex: 20,
    justifyContent: 'flex-start',
  },
});

export default connect(mapStateToProps)(CarListItem);
