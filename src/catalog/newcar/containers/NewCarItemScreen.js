/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {
  Icon,
  Button,
  Fab,
  View,
  VStack,
  HStack,
  ScrollView,
  Pressable,
} from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import * as NavigationService from '../../../navigation/NavigationService';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import {connect} from 'react-redux';
import {actionFetchNewCarDetails} from '../../actions';

// components
import PhotoSlider from '../../../core/components/PhotoSlider';
import PhotoViewer from '../../../core/components/PhotoViewer';
import ColorBox from '../../../core/components/ColorBox';
import Badge from '../../../core/components/Badge';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import UserData from '../../../utils/user';
import Analytics from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import md5 from '../../../utils/md5';
import {strings} from '../../../core/lang/const';

// styles
import styles from '../../CarStyles';

const imgResize = '10000x440';

const mapStateToProps = ({catalog, dealer, profile, nav}) => {
  return {
    nav,
    dealersList: {
      ru: dealer.listRussia,
      by: dealer.listBelarussia,
      ua: dealer.listUkraine,
    },
    dealerSelected: dealer.selected,
    carDetails: catalog.newCar.carDetails.data,
    profile,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarDetails,
};

const ActiveComponentPlate = ({testID, onPress, children}) => {
  return onPress ? (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor="#DDDDDD">
      {children}
    </TouchableOpacity>
  ) : (
    <View testID={testID}>{children}</View>
  );
};

const OptionPlate = ({
  onPress,
  title,
  subtitle,
  viewStyle,
  titleStyle,
  textStyle,
  testID,
}) => {
  return (
    <ActiveComponentPlate testID={testID} onPress={onPress}>
      <View
        style={[
          {
            borderRadius: 10,
            backgroundColor: styleConst.color.blue,
            paddingHorizontal: 12,
            marginRight: 8,
            height: 52,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
          viewStyle,
        ]}>
        <Text
          style={[
            {
              color: '#d8d8d8',
              fontSize: 14,
              fontWeight: '300',
              paddingBottom: 5,
            },
            titleStyle,
          ]}>
          {title}
        </Text>
        <Text
          style={[
            {color: styleConst.color.white, fontSize: 14, fontWeight: '600'},
            textStyle,
          ]}>
          {subtitle}
        </Text>
      </View>
    </ActiveComponentPlate>
  );
};

const _renderOptionPlates = params => {
  const {
    platesScrollViewRef,
    carDetails,
    engineId,
    engineVolumeShort,
    wheelName,
    colorName,
  } = params;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={true}
      testID="NewCarItemScreen.PlatesWrapper"
      ref={platesScrollViewRef}>
      <HStack px="2%" mb="4" mr="10">
        <OptionPlate
          title={strings.NewCarItemScreen.plates.complectation}
          testID="NewCarItemScreen.Plates.Complectation"
          subtitle={get(carDetails, 'complectation.name')}
        />
        {engineId && engineId !== 4 ? (
          <OptionPlate
            title={strings.NewCarItemScreen.plates.engine}
            testID="NewCarItemScreen.Plates.Engine"
            subtitle={
              engineVolumeShort
                ? engineVolumeShort.toFixed(1) + ' л. '
                : '' + get(carDetails, 'engine.type')
            }
          />
        ) : null}
        <OptionPlate
          title={strings.NewCarItemScreen.plates.gearbox.name}
          testID="NewCarItemScreen.Plates.Gearbox"
          subtitle={`${
            get(carDetails, 'gearbox.count')
              ? get(carDetails, 'gearbox.count') + '-ст.'
              : ''
          } ${
            get(carDetails, 'gearbox.name')
              .replace(/^(Механическая)/i, 'МКПП')
              .replace(/^(Автоматическая)/i, 'АКПП')
              .split('/')[0]
          }`}
        />
        {wheelName ? (
          <OptionPlate
            title={strings.NewCarItemScreen.plates.wheel}
            testID="NewCarItemScreen.Plates.Wheel"
            subtitle={wheelName.toLowerCase()}
          />
        ) : null}
        {get(carDetails, 'color.name.simple') ? (
          <OptionPlate
            // onPress={() => {
            //   this.ColorBox.click();
            // }}
            title={strings.NewCarItemScreen.plates.color}
            testID="NewCarItemScreen.Plates.Color"
            subtitle={colorName}
          />
        ) : null}
      </HStack>
    </ScrollView>
  );
};

const _renderItem = (title, value, postfix) => {
  const key = md5(title + value + postfix);
  return value ? (
    <HStack key={key} style={styles.sectionRow}>
      <View style={[styles.sectionProp, {flex: 1}]}>
        <Text
          style={styles.sectionPropText}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={[styles.sectionValue, {alignItems: 'flex-end'}]}>
        <Text
          style={styles.sectionValueText}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {value} {postfix || null}
        </Text>
      </View>
    </HStack>
  ) : null;
};

const _renderTechData = (title, data, carDetails) => {
  if (typeof data === 'object' && data.length) {
    let resRaw = data.map(element => {
      let name = '';
      if (element.alternate) {
        name = element.alternate;
      } else {
        name = get(carDetails, element.value, null);
      }
      return _renderItem(element.name + ':', name, element.postfix);
    });
    let res = resRaw.filter(el => {
      return el != null;
    });
    return res ? (
      <VStack style={styles.sectionOptions}>
        <Text
          style={styles.sectionTitle}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Text>
        <View>{res}</View>
      </VStack>
    ) : null;
  }
};

const _renderComplectationItem = (title, data) => {
  if (data.length === 0) {
    return null;
  }

  switch (title.toLowerCase()) {
    case 'заводская комплектация':
      title = strings.NewCarItemScreen.complectation.main;
      break;
    case 'дополнительные опции':
      title = strings.NewCarItemScreen.complectation.additional;
      break;
  }

  return (
    <View key={title} style={{marginBottom: 10}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map(item => {
        const key = md5(item.name + item.id);
        return (
          <View key={key}>
            {item.name && item.value ? (
              <HStack style={styles.sectionRow}>
                <View style={styles.sectionProp}>
                  <Text
                    style={styles.sectionPropText}
                    ellipsizeMode="tail"
                    numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.sectionValue}>
                  <Text
                    style={styles.sectionValueText}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
              </HStack>
            ) : (
              <Text style={[styles.sectionPropText, styles.sectionRow]}>
                {item.name}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const _renderPrice = ({carDetails, currency, isPriceShow, dealerSelected}) => {
  if (!isPriceShow) {
    return;
  }
  const isSale = carDetails.sale === true;

  const CarPrices = {
    sale: get(carDetails, 'price.app.sale', 0),
    standart: get(
      carDetails,
      'price.app.standart',
      get(carDetails, 'price.app'),
    ),
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        minWidth: 100,
      }}>
      {isSale && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#D0021B',
          }}>
          {showPrice(CarPrices.sale, dealerSelected.region)}
        </Text>
      )}
      <Text
        style={{
          fontSize: isSale ? 12 : 16,
          fontWeight: '600',
          lineHeight: isSale ? 16 : 22,
          color: '#000',
          textDecorationLine: isSale ? 'line-through' : 'none',
        }}>
        {showPrice(CarPrices.standart, dealerSelected.region)}
      </Text>
    </View>
  );
};

const _renderPriceFooter = ({
  carDetails,
  currency,
  isPriceShow,
  dealerSelected,
}) => {
  if (!isPriceShow) {
    return;
  }
  const isSale = carDetails.sale === true;

  const CarPrices = {
    sale: get(carDetails, 'price.app.sale') || 0,
    standart:
      get(carDetails, 'price.app.standart') ||
      get(carDetails, 'price.ust') ||
      get(carDetails, 'price.rec'),
  };

  // if (!CarPrices.standart) {
  //   return false;
  // }

  return (
    <View
      style={[
        stylesFooter.orderPriceContainer,
        !isSale ? stylesFooter.orderPriceContainerNotSale : null,
      ]}>
      {isSale ? (
        <Text style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
          {showPrice(CarPrices.sale, dealerSelected.region)}
        </Text>
      ) : null}
      <Text
        style={[
          styles.orderPriceText,
          !isSale ? styles.orderPriceDefaultText : styles.orderPriceSmallText,
        ]}>
        {CarPrices.standart
          ? showPrice(CarPrices.standart, dealerSelected.region)
          : strings.CarList.price.byRequest}
      </Text>
    </View>
  );
};

const _onPressMap = ({carDetails, navigation}) => {
  let coords = get(carDetails, 'location.coords');
  if (!coords) {
    coords = get(carDetails, 'coords');
  }
  navigation.navigate('MapScreen', {
    name: get(carDetails, 'dealer.name'),
    city: get(carDetails, 'city.name'),
    address: get(carDetails, 'dealer.name'),
    coords: coords,
  });
};

const _onPressOrder = ({carDetails, profile, navigation, dealerSelected}) => {
  const CarPrices = {
    sale: get(carDetails, 'price.app.sale') || 0,
    standart:
      get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
  };

  const onlineLink = get(carDetails, 'onlineLink');

  if (get(carDetails, 'online') && onlineLink) {
    let userLink = '';
    if (profile && profile.login && profile.login.SAP && profile.login.SAP.id) {
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
                brand: get(carDetails, 'brand.name'),
                model: get(carDetails, 'model.name'),
                isSale: carDetails.sale === true,
                price: CarPrices.standart,
                priceSpecial: CarPrices.sale,
                complectation: get(carDetails, 'complectation.name'),
                year: get(carDetails, 'year'),
                dealer: get(carDetails, 'dealer'),
              },
              region: dealerSelected.region,
              carId: carDetails.id.api,
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
      {cancelable: true},
    );
  } else {
    navigation.navigate('OrderScreen', {
      car: {
        brand: get(carDetails, 'brand.name'),
        model: get(carDetails, 'model.name'),
        isSale: carDetails.sale === true,
        price: CarPrices.standart,
        priceSpecial: CarPrices.sale,
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        dealer: get(carDetails, 'dealer'),
      },
      region: dealerSelected.region,
      carId: carDetails.id.api,
      isNewCar: true,
    });
  }
};

const _onPressTestDrive = ({carDetails, navigation, dealerSelected}) => {
  const CarPrices = {
    sale: get(carDetails, 'price.app.sale') || 0,
    standart:
      get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
  };

  return navigation.navigate('TestDriveScreen', {
    car: {
      brand: get(carDetails, 'brand.name'),
      model: get(carDetails, 'model.name'),
      isSale: carDetails.sale === true,
      price: CarPrices.standart,
      priceSpecial: CarPrices.sale,
      complectation: get(carDetails, 'complectation.name'),
      year: get(carDetails, 'year'),
      dealer: get(carDetails, 'dealer'),
    },
    region: dealerSelected.region,
    carId: carDetails.id.api,
    testDriveCars: carDetails.testDriveCars,
    isNewCar: true,
  });
};

const NewCarItemScreen = ({
  navigation,
  route,
  carDetails,
  profile,
  dealerSelected,
  actionFetchNewCarDetails,
}) => {
  const [tabName, setTabName] = useState('base');
  const platesScrollViewRef = useRef(null);
  const [isLoading, setLoading] = useState(true);

  const [sectionActive, setSectionActive] = useState([0]);

  const carId = get(route, 'params.carId');

  const badge = get(carDetails, 'badge', []);
  const statusID = get(carDetails, 'status.id', '');
  let statusName = '';
  if (statusID) {
    statusName = get(strings.CarParams.statusDelivery, statusID, '');
  }

  const stock = get(carDetails, 'options.stock', {});
  const stockKeys = Object.keys(stock);
  const additional = get(carDetails, 'options.additional', {});
  const additionalKeys = Object.keys(additional);

  const isPriceShow = get(route, 'params.showPrice');

  const currency = get(route, 'params.currency');
  const brandName = get(carDetails, 'brand.name');
  const modelName = get(carDetails, 'model.name');
  const generationName = get(carDetails, 'model.generation.name');

  const gearboxId = get(carDetails, 'gearbox.id');
  let gearboxName = get(carDetails, 'gearbox.name');
  if (gearboxId) {
    gearboxName = strings.CarParams.gearbox[gearboxId];
  }

  const engineId = get(carDetails, 'engine.id');
  let engineName = get(carDetails, 'engine.type');
  if (engineId) {
    engineName = strings.CarParams.engine[engineId];
  }

  const engineVolumeShort = get(carDetails, 'engine.volume.short');

  const bodyId = get(carDetails, 'body.id');
  let bodyName = get(carDetails, 'body.name');
  if (bodyId) {
    bodyName = strings.CarParams.body[bodyId];
  }

  const wheelId = get(carDetails, 'gearbox.wheel.id');
  let wheelName = get(carDetails, 'gearbox.wheel.name');
  if (wheelId) {
    wheelName = strings.CarParams.wheels[wheelId];
  }

  const warrantyText = get(carDetails, 'guarantee', null);

  let photos = [];
  let photosFull = [];
  let isCarImgReal = false;
  if (get(carDetails, 'imgReal.thumb.0')) {
    // 105
    isCarImgReal = true;
    get(carDetails, 'imgReal.thumb', []).forEach(element => {
      if (!element) {
        return false;
      }
      photos.push(element + '1000x1000');
      photosFull.push({uri: element + '1000x1000'});
    });
  } else {
    get(carDetails, 'img.thumb', []).forEach(element => {
      if (!element) {
        return false;
      }
      photos.push(element + '1000x440');
      photosFull.push({uri: element + '1000x1000'});
    });
  }

  let colorName = strings.Colors[Number(get(carDetails, 'color.picker.id'))];
  if (!colorName) {
    colorName = get(carDetails, 'color.name.simple', null);
  }
  if (colorName) {
    colorName = colorName.toLowerCase();
  }

  let photosData = [];
  if (photos && photos.length) {
    photos.map((el, index) => {
      photosData.push({
        url: el,
        type: 'image',
        index,
      });
    });
  }

  useEffect(() => {
    console.info('== NewCarItemScreen ==');
    setLoading(true);
    actionFetchNewCarDetails(carId).then(res => {
      if (res && res.type && res.payload) {
        switch (res.type) {
          case 'NEW_CAR_DETAILS__SUCCESS':
            // const carDetails = res.payload;
            // const carName = [
            //   get(carDetails, 'brand.name'),
            //   get(carDetails, 'model.name'),
            //   get(carDetails, 'model.year'),
            //   get(carDetails, 'complectation.name'),
            // ];

            // this.props.navigation.setOptions({
            //   headerTitle: carName.join(' '),
            // });
            NavigationService.dispatch(carDetails);

            Analytics.logEvent('screen', 'catalog/newcar/item', {
              id_api: get(carDetails, 'id.api'),
              id_sap: get(carDetails, 'id.sap'),
              brand_name: get(carDetails, 'brand.name'),
              model_name: get(carDetails, 'model.name'),
            });
            break;
          default:
            break;
        }
        setLoading(false);
      }
    });

    if (carDetails && !isLoading && platesScrollViewRef) {
      setTimeout(() => {
        platesScrollViewRef?.current.scrollToEnd({duration: 500});
        setTimeout(() => {
          platesScrollViewRef?.current.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
      }, 3000);
    }
    return () => {};
  }, []);

  if (!carDetails || isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
    );
  }

  const priceFooterContainer = _renderPriceFooter({
    carDetails,
    currency,
    isPriceShow,
    dealerSelected,
  });

  const SECTIONS = [
    {
      title: strings.NewCarItemScreen.tech.title,
      content: (
        <View testID="NewCarItemScreen.TechWrapper">
          {_renderTechData(
            strings.NewCarItemScreen.tech.base,
            [
              {
                name: strings.NewCarItemScreen.tech.body.type,
                value: 'body.name',
                alternate: bodyName,
              },
              {
                name: strings.NewCarItemScreen.tech.year,
                value: 'year',
              },
            ],
            carDetails,
          )}
          {_renderTechData(
            strings.NewCarItemScreen.tech.engine.title,
            [
              {
                name: strings.NewCarItemScreen.tech.engine.type,
                value: 'engine.type',
                alternate: engineName,
              },
              (() => {
                if (
                  get(carDetails, 'engine.id') &&
                  get(carDetails, 'engine.id') === 4
                ) {
                  return false;
                }
                return {
                  name: strings.NewCarItemScreen.tech.engine.volume,
                  value: 'engine.volume.full',
                  postfix: 'см³',
                };
              })(),
              {
                name: strings.NewCarItemScreen.tech.engine.power.hp,
                value: 'power.hp',
                postfix: strings.NewCarItemScreen.shortUnits.hp,
              },
            ],
            carDetails,
          )}
          {_renderTechData(
            strings.NewCarItemScreen.tech.gearbox.title,
            [
              {
                name: strings.NewCarItemScreen.tech.gearbox.type,
                value: 'gearbox.name',
                alternate: gearboxName,
              },
              {
                name: strings.NewCarItemScreen.tech.gearbox.count,
                value: 'gearbox.count',
              },
              {
                name: strings.NewCarItemScreen.tech.gearbox.wheel,
                value: 'gearbox.wheel.name',
                alternate: wheelName,
              },
            ],
            carDetails,
          )}
          {_renderTechData(
            strings.NewCarItemScreen.tech.body.title,
            [
              {
                name: strings.NewCarItemScreen.tech.body.width,
                value: 'body.width',
                postfix: strings.NewCarItemScreen.shortUnits.milimetrs,
              },
              {
                name: strings.NewCarItemScreen.tech.body.height,
                value: 'body.height',
                postfix: strings.NewCarItemScreen.shortUnits.milimetrs,
              },
              {
                name: strings.NewCarItemScreen.tech.body.high,
                value: 'body.high',
                postfix: strings.NewCarItemScreen.shortUnits.milimetrs,
              },
              {
                name: strings.NewCarItemScreen.tech.body.clirens,
                value: 'body.clirens',
                postfix: strings.NewCarItemScreen.shortUnits.milimetrs,
              },
              {
                name: strings.NewCarItemScreen.tech.body.trunk,
                value: 'body.trunk.min',
                postfix: strings.NewCarItemScreen.shortUnits.litres,
              },
              {
                name: strings.NewCarItemScreen.tech.body.fuel,
                value: 'fuel.fuel',
                postfix: strings.NewCarItemScreen.shortUnits.litres,
              },
            ],
            carDetails,
          )}
          {_renderTechData(
            strings.NewCarItemScreen.techData.title,
            [
              {
                name: strings.NewCarItemScreen.techData.maxSpeed,
                value: 'speed.max',
                postfix: 'км/ч.',
              },
              {
                name: strings.NewCarItemScreen.techData.dispersal,
                value: 'speed.dispersal',
                postfix: 'сек.',
              },
              {
                name: strings.NewCarItemScreen.techData.fuel.city,
                value: 'fuel.city',
                postfix: strings.NewCarItemScreen.shortUnits.litres,
              },
              {
                name: strings.NewCarItemScreen.techData.fuel.track,
                value: 'fuel.track',
                postfix: strings.NewCarItemScreen.shortUnits.litres,
              },
              {
                name: strings.NewCarItemScreen.techData.fuel.both,
                value: 'fuel.both',
                postfix: strings.NewCarItemScreen.shortUnits.litres,
              },
            ],
            carDetails,
          )}
        </View>
      ),
    },
    {
      title: strings.NewCarItemScreen.complectation.title,
      content: (
        <View
          style={styles.tabContent}
          testID="NewCarItemScreen.ComplectationWrapper">
          {stockKeys.length ? (
            <View>
              {stockKeys.map(key => {
                return _renderComplectationItem(
                  stock[key].name,
                  stock[key].data,
                );
              })}
            </View>
          ) : null}

          {additionalKeys.length ? (
            <View>
              {additionalKeys.map(key => {
                return _renderComplectationItem(
                  additional[key].name,
                  additional[key].data,
                );
              })}
            </View>
          ) : null}

          {carDetails.text ? (
            <View style={styles.descrContainer}>
              <Text style={styles.descr}>{carDetails.text}</Text>
            </View>
          ) : null}
        </View>
      ),
    },
  ];

  const fabEnable = dealerSelected.region === 'by' ? true : false;

  return (
    <>
      <ScrollView backgroundColor="white" testID="NewCarItemScreen.Wrapper">
        <View>
          {get(carDetails, 'color.picker.codes.hex', null) ? (
            <ColorBox
              containerStyle={styles.colorboxContainer}
              color={get(carDetails, 'color')}
            />
          ) : null}
          {(badge && badge.length) || statusName ? (
            <View
              testID="NewCarItemScreen.BadgesWrapper"
              style={styles.badgesView}>
              {badge.map((item, index) => {
                if (item.name.toLowerCase() === 'спец.цена') {
                  item.name = strings.CarList.badges.specialPrice;
                }
                return (
                  <Badge
                    id={carDetails.id.api}
                    key={'badgeItem' + carDetails.id.api + index}
                    index={index}
                    bgColor={item.background}
                    name={item.name}
                    textColor={item.textColor}
                  />
                );
              })}
              {statusName ? (
                <Badge
                  id={'badgeItemStatus' + carDetails.id.api}
                  key={'badgeItemStatus' + carDetails.id.api}
                  bgColor={styleConst.color.green}
                  name={statusName.toLowerCase()}
                  textColor={'#fff'}
                />
              ) : null}
            </View>
          ) : null}
          <PhotoSlider
            height={290}
            photosFull={photosFull}
            themeFull={'white'}
            photos={photosData}
            resizeMode={isCarImgReal ? 'cover' : 'contain'}
            dotColor={!isCarImgReal ? styleConst.color.black : null}
          />
        </View>
        <View
          shadow={7}
          mb={'1/5'}
          style={[styles.carTopWrapper, {marginTop: -20}]}>
          <View>
            <View style={styles.modelBrandView}>
              <View style={{marginBottom: 10, flexShrink: 1}}>
                <Text style={styles.modelBrandText}>
                  {[brandName, modelName].join(' ')}
                </Text>
                <Text style={styles.complectationText}>
                  {[
                    generationName,
                    get(carDetails, 'complectation.name', ''),
                    get(carDetails, 'year'),
                  ].join(', ')}
                </Text>
              </View>
              {_renderPrice({
                carDetails,
                currency,
                isPriceShow,
                dealerSelected,
              })}
            </View>

            {_renderOptionPlates({
              platesScrollViewRef,
              carDetails,
              engineId,
              engineVolumeShort,
              wheelName,
              colorName,
            })}
            {warrantyText ? (
              <HStack pl={'2%'} pr={'4%'} mb={4} alignItems="center">
                <Icon
                  as={MaterialCommunityIcons}
                  name="shield-car"
                  size={12}
                  color={styleConst.color.green}
                />
                <Text style={styles.warrantyText}>
                  {[strings.NewCarItemScreen.warranty, warrantyText].join(' ')}
                </Text>
              </HStack>
            ) : null}
            {get(carDetails, 'location.coords') ? (
              <Pressable
                onPress={() => _onPressMap({carDetails, navigation})}
                style={styles.mapCard}>
                <VStack style={styles.mapCardContainer}>
                  <Icon
                    as={MaterialCommunityIcons}
                    name="map-marker-outline"
                    size={12}
                    color={styleConst.color.blue}
                  />
                  <View justifyContent={'space-around'}>
                    <Text style={styles.mapCardTitle}>
                      {strings.NewCarItemScreen.carLocation}
                    </Text>
                    <Text
                      style={styles.mapCardDealer}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {[
                        get(carDetails, 'location.city.name'),
                        get(carDetails, 'location.name'),
                      ].join(', ')}
                    </Text>
                  </View>
                </VStack>
              </Pressable>
            ) : null}
          </View>
          <Accordion
            sections={SECTIONS}
            activeSections={sectionActive}
            // renderSectionTitle={this._renderSectionTitle}
            renderHeader={(item, index, expanded) => (
              <HStack
                justifyContent={'space-between'}
                alignItems={'center'}
                px="2%"
                backgroundColor="white"
                testID={'NewCarItemScreen.AccordionTitle_' + item.title}
                style={styles.accordionHeader}>
                <Text style={styles.accordionHeaderTitle}>{item.title}</Text>
                {expanded ? (
                  <Icon
                    as={FontAwesome5}
                    style={{
                      color: styleConst.color.greyText4,
                      fontWeight: 'normal',
                    }}
                    name="angle-down"
                  />
                ) : (
                  <Icon
                    as={FontAwesome5}
                    style={{
                      color: styleConst.color.greyText,
                      fontWeight: 'normal',
                    }}
                    name="angle-right"
                  />
                )}
              </HStack>
            )}
            renderContent={section => {
              return (
                <View style={styles.accordionContent}>{section.content}</View>
              );
            }}
            onChange={setSectionActive}
          />
        </View>
        <View height={90} />
      </ScrollView>
      <VStack
        position="absolute"
        style={[
          styleConst.shadow.default,
          stylesFooter.footer,
          !isPriceShow || !priceFooterContainer
            ? stylesFooter.footerHidePrice
            : null,
        ]}>
        {priceFooterContainer}
        <HStack>
          <Button.Group isAttached>
            <Button
              testID="NewCarItemScreen.Button.TestDrive"
              onPress={() =>
                _onPressTestDrive({carDetails, navigation, dealerSelected})
              }
              size="full"
              _text={styles.buttonText}
              leftIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="steering"
                  size={6}
                  color="white"
                />
              }
              style={[
                stylesFooter.button,
                stylesFooter.buttonLeft,
                !isPriceShow || !priceFooterContainer
                  ? stylesFooter.buttonNoPriceLeft
                  : null,
              ]}
              activeOpacity={0.8}>
              {strings.NewCarItemScreen.testDrive}
            </Button>
            <Button
              testID="NewCarItemScreen.Button.Order"
              onPress={() =>
                _onPressOrder({carDetails, profile, navigation, dealerSelected})
              }
              size="sm"
              _text={styles.buttonText}
              style={[
                stylesFooter.button,
                stylesFooter.buttonRight,
                !isPriceShow || !priceFooterContainer
                  ? stylesFooter.buttonNoPriceRight
                  : null,
                // !carDetails.testDriveCars ||
                // carDetails.testDriveCars.length === 0
                //   ? stylesFooter.buttonOnlyOne
                //   : null,
              ]}
              activeOpacity={0.8}>
              {strings.NewCarItemScreen.wannaCar}
            </Button>
          </Button.Group>
        </HStack>
      </VStack>
      {fabEnable ? (
        <Fab
          renderInPortal={false}
          style={{backgroundColor: styleConst.new.blueHeader, marginBottom: 60}}
          shadow={7}
          size="xs"
          icon={
            <Icon
              size={5}
              as={Ionicons}
              name="chatbox-outline"
              color="warmGray.50"
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
          placement="bottom-right"
          onPress={() =>
            navigation.navigate('ChatScreen', {
              chatType: 'newcars',
              carID: carDetails.id.api,
            })
          }
        />
      ) : null}
    </>
  );
};

NewCarItemScreen.propTypes = {
  dealerSelected: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCarItemScreen);

const stylesFooter = StyleSheet.create({
  footer: {
    height: 85,
    borderTopWidth: 0,
    marginHorizontal: '5%',
    width: '90%',
    marginBottom: 20,
    bottom: 0,
  },
  footerHidePrice: {
    height: 45,
    marginBottom: 20,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    width: '50%',
    height: 40,
    borderWidth: 1,
  },
  buttonLeft: {
    borderBottomLeftRadius: 5,
    backgroundColor: styleConst.color.orange,
    borderColor: styleConst.color.orange,
  },
  buttonRight: {
    borderBottomRightRadius: 5,
    backgroundColor: styleConst.color.lightBlue,
    borderColor: styleConst.color.lightBlue,
  },
  buttonNoPriceLeft: {
    borderTopLeftRadius: 5,
  },
  buttonNoPriceRight: {
    borderTopRightRadius: 5,
  },
  buttonOnlyOne: {
    width: '100%',
    borderBottomLeftRadius: 5,
  },
  orderPriceContainer: {
    height: 45,
    width: '100%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 5,
    backgroundColor: styleConst.color.bg,
    borderColor: styleConst.color.bg,
    borderWidth: 1,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
