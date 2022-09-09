/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImageCarousel from './ImageCarousel';

// components
import Badge from '../../core/components/Badge';
import BrandLogo from '../../core/components/BrandLogo';

// helpers
import {get} from 'lodash';
import {connect} from 'react-redux';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '../../utils/price';
import UserData from '../../utils/user';
import getStatusWorktime from '../../utils/worktime-status';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const {width: screenWidth} = Dimensions.get('window');

const mapStateToProps = ({dealer, profile}) => {
  return {
    dealerList: dealer.listDealers,
    dealerSelected: dealer.selected,
    profile,
  };
};

const CarListItem = ({
  car,
  prices,
  itemScreen,
  resizeMode,
  dealerSelected,
  dealerList,
  profile,
  currency,
  testID,
  key,
}) => {
  const navigation = useNavigation();

  const modelName = get(car, 'model.name', '');
  const complectationName = get(car, 'complectation.name', '');
  const engineVolume = get(car, 'engine.volume.full');
  const mileage = get(car, 'mileage');

  const statusID = get(car, 'status.id', '');
  let statusName = '';
  if (statusID) {
    statusName = get(strings.CarParams.statusDelivery, statusID, '');
  }

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
      showPrice: !prices?.hidden,
    });
  };

  const _onPressOrder = () => {
    navigation.navigate('OrderScreen', {
      car: {
        brand: get(car, 'brand.name', ''),
        model: get(car, 'model.name', ''),
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

  const _renderPrice = ({car, prices}) => {
    if (prices?.hidden) {
      return;
    }
    const isSale = car.sale === true;
    const badge = get(car, 'badge', []);

    const CarPrices = {
      sale: get(car, 'price.app.sale', 0),
      standart: get(car, 'price.app.standart', get(car, 'price.app'), null),
    };

    return (
      <View
        style={[
          styles.priceContainer,
          {
            marginTop: CarImgReal ? 0 : 5,
          },
        ]}>
        {isSale ? (
          <View style={styles.flexRow}>
            <Text
              style={[
                styles.price,
                {
                  color: CarImgReal ? styleConst.color.white : '#2A2A43',
                },
                styles.priceSpecial,
              ]}>
              {showPrice(CarPrices.sale, dealerSelected.region)}
            </Text>
          </View>
        ) : null}
        <View style={styles.flexRow}>
          <Text
            style={[
              styles.price,
              car.ordered ? styles.ordered : {},
              {
                color: CarImgReal ? styleConst.color.white : '#2A2A43',
                marginRight: 10,
              },
              isSale ? styles.priceDefault : null,
            ]}>
            {CarPrices.standart
              ? showPrice(CarPrices.standart, dealerSelected.region)
              : strings.CarList.price.byRequest}
          </Text>
        </View>
      </View>
    );
  };

  const _renderImage = ({ordered}) => {
    let CarImgs = get(car, 'img.thumb', false);
    let CarImgsReal = get(car, 'imgReal.thumb', false);
    const isSale = car.sale === true;
    let photos = [];
    let carPhotos = CarImgs;
    if (CarImgsReal) {
      carPhotos = CarImgsReal;
    }
    let i = 0;
    carPhotos.forEach((element, index) => {
      switch (i) {
        case 0:
        case 2:
        case 3:
        case 4:
        case 5:
          photos.push({
            type: 'image',
            index: i,
            url: element + '1000x440',
          });
          break;
        case 1:
          photos.unshift({
            type: 'image',
            index: i,
            url: element + '1000x440',
          });
          break;
        default:
          return false;
      }
      ++i;
    });
    if (itemScreen === 'NewCarItemScreen') {
      photos.push({
        type: 'order',
        index: 99,
        name: 'newCar',
        onPressTD: () => {
          navigation.navigate('TestDriveScreen', {
            car: {
              brand: get(car, 'brand.name'),
              model: get(car, 'model.name'),
              isSale: car.sale === true,
              price: car.standart,
              priceSpecial: car.sale,
              complectation: get(car, 'complectation.name'),
              year: get(car, 'year'),
              dealer: get(car, 'dealer'),
            },
            region: dealerSelected.region,
            carId: car.id.api,
            testDriveCars: car.testDriveCars,
            isNewCar: true,
          });
        },
        onPressWantACar: () => {
          const onlineLink = get(car, 'onlineLink');
          const CarPrices = {
            sale: get(car, 'price.app.sale') || 0,
            standart: get(car, 'price.app.standart') || get(car, 'price.app'),
          };

          if (get(car, 'online') && onlineLink) {
            let userLink = '';
            if (
              profile &&
              profile.login &&
              profile.login.SAP &&
              profile.login.SAP.id
            ) {
              userLink = '&userID=' + profile.login.SAP.id;
            }
            const urlLink =
              onlineLink +
              '&phone=' +
              UserData.get('PHONE') +
              '&name=' +
              UserData.get('NAME') +
              '&secondname=' +
              UserData.get('SECOND_NAME') +
              '&lastname=' +
              UserData.get('LAST_NAME') +
              '&email=' +
              UserData.get('EMAIL') +
              '&utm_campaign=' +
              Platform.OS +
              '&utm_content=button' +
              userLink;
            Alert.alert(
              strings.NewCarItemScreen.Notifications.buyType.title,
              strings.NewCarItemScreen.Notifications.buyType.text,
              [
                {
                  text: strings.NewCarItemScreen.sendQuery,
                  onPress: () => {
                    navigation.navigate('OrderScreen', {
                      car: {
                        brand: get(car, 'brand.name'),
                        model: get(car, 'model.name'),
                        isSale: car.sale === true,
                        price: CarPrices.standart,
                        priceSpecial: CarPrices.sale,
                        complectation: get(car, 'complectation.name'),
                        year: get(car, 'year'),
                        dealer: get(car, 'dealer'),
                      },
                      region: dealerSelected.region,
                      carId: car.id.api,
                      isNewCar: true,
                    });
                  },
                },
                {
                  text: strings.NewCarItemScreen.makeOrder,
                  onPress: () => {
                    Linking.openURL(urlLink);
                  },
                },
                {
                  text: strings.Base.cancel.toLowerCase(),
                  style: 'destructive',
                },
              ],
              {
                cancelable: true,
              },
            );
          } else {
            navigation.navigate('OrderScreen', {
              car: {
                brand: get(car, 'brand.name'),
                model: get(car, 'model.name'),
                isSale: car.sale === true,
                price: CarPrices.standart,
                priceSpecial: CarPrices.sale,
                complectation: get(car, 'complectation.name'),
                year: get(car, 'year'),
                dealer: get(car, 'dealer'),
              },
              region: dealerSelected.region,
              carId: car.id.api,
              isNewCar: true,
            });
          }
        },
      });
    } else {
      photos.push({
        type: 'order',
        index: 99,
        name: 'usedCar',
        onPressCallMe: () => {
          navigation.navigate('CallMeBackScreen', {
            dealerCustom: dealerList[car.dealer.id],
            goBack: true,
            car: {
              brand: get(car, 'brand.name', ''),
              model: get(car, 'model', ''),
              complectation: get(car, 'complectation.name'),
              year: get(car, 'year'),
              dealer: get(car, 'dealer'),
            },
            region: dealerSelected.region,
            carId: car.id.api,
            isNewCar: false,
          });
        },
        onPressTD: () => {
          navigation.navigate('TestDriveScreen', {
            car: {
              brand: get(car, 'brand.name', ''),
              model: get(car, 'model', ''),
              complectation: get(car, 'complectation.name'),
              year: get(car, 'year'),
              dealer: get(car, 'dealer'),
            },
            region: dealerSelected.region,
            carId: car.id.api,
            isNewCar: false,
          });
        },
        onPressCall: () => {
          const openStatus = getStatusWorktime(
            dealerList[car.dealer.id],
            'RC',
            true,
          );
          let phone = get(car, 'location.phone[0]');
          if (car?.manager?.phone) {
            phone = car.manager.phone;
          }
          if (!phone || phone === '') {
            return false;
          }
          Linking.openURL('tel:' + phone.replace(/[^+\d]+/g, ''));
        },
        onPressWantACar: () => {
          navigation.navigate('OrderScreen', {
            car: {
              brand: get(car, 'brand.name', ''),
              model: get(car, 'model', ''),
              complectation: get(car, 'complectation.name'),
              year: get(car, 'year'),
              dealer: get(car, 'dealer'),
            },
            region: dealerSelected.region,
            carId: car.id.api,
            isNewCar: false,
          });
        },
      });
    }
    return (
      <View
        style={{
          height: itemScreen === 'NewCarItemScreen' ? 175 : 170,
          position: 'relative',
          marginTop:
            itemScreen === 'NewCarItemScreen' ? (isSale ? 60 : 45) : 75,
          backgroundColor: styleConst.color.white,
        }}>
        <ImageCarousel
          style={[
            ordered ? styles.ordered : {},
            {
              paddingVertical: itemScreen === 'NewCarItemScreen' ? 5 : 0,
            },
          ]}
          resizeMode={resizeMode}
          height={itemScreen === 'NewCarItemScreen' ? 150 : 170}
          data={photos}
          onPressCustom={!ordered ? _onPress : _onPressOrder}
        />
        {CarImgsReal ? (
          <LinearGradient
            start={{
              x: 1,
              y: 0,
            }}
            end={{
              x: 0,
              y: 0,
            }}
            useAngle
            angle={itemScreen === 'NewCarItemScreen' ? 60 : 170}
            // colors={['rgba(15, 102, 178, 1)', 'rgba(0, 97, 237, 0)']}
            colors={['rgba(51, 51, 51, .4)', 'rgba(51, 51, 51, 0)']}
            style={[
              styles.priceBackground,
              {
                height: isSale ? 80 : 60,
              },
              itemScreen === 'NewCarItemScreen'
                ? {
                    width: '100%',
                  }
                : null,
            ]}
          />
        ) : null}
      </View>
    );
  };

  const _renderBadges = () => {
    const badge = get(car, 'badge', []);
    return (
      <>
        {badge.map((item, index) => {
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
        {statusName ? (
          <Badge
            id={'badgeItemStatus' + car.id.api}
            key={'badgeItemStatus' + car.id.api}
            bgColor={styleConst.color.green}
            name={statusName.toLowerCase()}
            textColor={'#fff'}
          />
        ) : null}
      </>
    );
  };

  return (
    <View
      testID={testID + '-' + key}
      accessibilityLabel={testID}
      accessibilityRole="button"
      style={[
        styles.container,
        !ordered
          ? styleConst.shadow.light
          : {
              backgroundColor: styleConst.color.white,
            },
        isSale ? styles.containerSpecial : null,
      ]}
      underlayColor={styleConst.color.select}>
      <View style={styles.card} key={'carID-' + key}>
        <Pressable
          onPress={!ordered ? _onPress : _onPressOrder}
          style={[ordered ? styles.ordered : {}, styles.titleContainer]}>
          {isNewCar ? (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '12%',
                  minWidth: 50,
                }}>
                <BrandLogo
                  brand={get(car, 'brand.id')}
                  width={45}
                  style={styles.brandLogo}
                  key={'brandLogo' + get(car, 'brand.id')}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  width: '88%',
                }}>
                <Text
                  style={styles.title}
                  ellipsizeMode="tail"
                  selectable={false}
                  numberOfLines={1}>
                  {[modelName, complectationName, year].join(' ')}
                </Text>
                {_renderPrice({
                  car,
                  prices,
                })}
              </View>
            </View>
          ) : (
            <View>
              <Text
                style={styles.title}
                ellipsizeMode="tail"
                selectable={false}
                numberOfLines={1}>
                {`${get(car, 'brand.name')} ${modelName} ${complectationName} `}
                {year
                  ? year + ' ' + strings.NewCarItemScreen.shortUnits.year
                  : null}
              </Text>
              {_renderPrice({
                car,
                prices,
              })}
            </View>
          )}
        </Pressable>
        {_renderImage({
          ordered,
        })}
        <Pressable
          onPress={!ordered ? _onPress : _onPressOrder}
          style={[
            styles.price,
            itemScreen === 'NewCarItemScreen'
              ? {
                  marginTop:
                    (Platform.OS !== 'ios' ? -6 : 0) +
                    (CarImgReal ? (isSale ? -80 : -60) : -20),
                }
              : null,
          ]}></Pressable>
        <View style={styles.carBadgeContainer}>{_renderBadges()}</View>
        <Pressable
          onPress={!ordered ? _onPress : _onPressOrder}
          style={styles.carTechContainer}>
          {mileage ? (
            <Text
              selectable={false}
              style={CarImgReal ? styles.commonReal : styles.common}>
              {`${numberWithGap(mileage)} км.`}
            </Text>
          ) : null}
          {engineVolume &&
          get(car, 'engine.id') &&
          get(car, 'engine.id') !== 4 ? (
            <Text
              selectable={false}
              style={CarImgReal ? styles.commonReal : styles.common}>
              {`${engineVolume} см³`}
            </Text>
          ) : null}
          {get(car, 'engine.type') ? (
            <Text
              selectable={false}
              style={CarImgReal ? styles.commonReal : styles.common}>
              {`${engineName.toLowerCase()}`}
            </Text>
          ) : null}
          {gearboxName ? (
            <Text
              selectable={false}
              style={CarImgReal ? styles.commonReal : styles.common}>
              {`${gearboxName.toLowerCase()}`}
            </Text>
          ) : null}
          {idSAP ? (
            <Text
              style={[
                CarImgReal ? styles.commonReal : styles.common,
                styles.carID,
              ]}>
              {`#${idSAP}`}
            </Text>
          ) : null}
        </Pressable>
      </View>
    </View>
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
    marginVertical: 5,
    backgroundColor: styleConst.color.white,
  },
  containerSpecial: {},
  ordered: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'column',
    paddingBottom: 10,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    height: 150,
    width: screenWidth / 1.7,
    zIndex: 1,
    paddingVertical: 10,
  },
  imageReal: {
    height: 300,
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
  },
  titleBackground: {
    flex: 1,
    zIndex: 15,
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 1,
    height: 50,
    width: '100%',
  },
  titleContainer: {
    flex: 1,
    zIndex: 20,
    position: 'absolute',
    marginVertical: 5,
    marginHorizontal: '5%',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceDefault: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    marginTop: 2,
    color: styleConst.color.greyText2,
  },
  priceSpecial: {
    color: '#e63946',
    marginRight: 10,
  },
  year: {
    color: styleConst.color.greyText4,
    fontSize: 15,
    zIndex: 10,
    marginVertical: 5,
  },
  title: {
    color: styleConst.color.greyText4,
    fontSize: 15,
    fontWeight: '500',
    zIndex: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    zIndex: 10,
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
    fontSize: 14,
    color: styleConst.color.greyText4,
  },
  commonReal: {
    fontSize: 14,
    color: styleConst.color.white,
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
    marginLeft: '5%',
    marginTop: 10,
    zIndex: 20,
    justifyContent: 'space-between',
  },
  carBadgeContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: '5%',
    marginTop: 5,
    height: 20,
    zIndex: 20,
    justifyContent: 'flex-start',
  },
  carID: {
    color: styleConst.color.greyText2,
    marginRight: 3,
  },
});

export default connect(mapStateToProps)(CarListItem);
