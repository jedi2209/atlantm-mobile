/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  Text,
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

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';

// redux
import {connect} from 'react-redux';
import {actionFetchUsedCarDetails} from '../../actions';

// components
import PhotoSlider from '../../../core/components/PhotoSlider';
import ReadMore from 'react-native-read-more-text';
import Badge from '../../../core/components/Badge';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import Analytics from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';
import numberWithGap from '../../../utils/number-with-gap';
import showPrice from '../../../utils/price';
import {strings} from '../../../core/lang/const';
import getStatusWorktime from '../../../utils/worktime-status';

// styles
import styles from '../../CarStyles';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listCities: dealer.listCities,
    listDealers: dealer.listDealers,
    carDetails: catalog.usedCar.carDetails.data,
    photoViewerItems: catalog.usedCar.carDetails.photoViewerItems,
    photoViewerVisible: catalog.usedCar.carDetails.photoViewerVisible,
    photoViewerIndex: catalog.usedCar.carDetails.photoViewerIndex,
    isFetchingCarDetails: catalog.usedCar.meta.isFetchingCarDetails,
  };
};

const mapDispatchToProps = {
  actionFetchUsedCarDetails,
};

const OptionPlate = ({title, subtitle}) => (
  <View style={styles.plateUsed}>
    <Text selectable={false} style={styles.plateUsedText}>
      {title}
    </Text>
    <Text selectable={false} style={styles.plateUsedText2}>
      {subtitle}
    </Text>
  </View>
);

const UsedCarItemScreen = props => {
  const {
    navigation,
    carDetails,
    dealerSelected,
    listDealers,
    listCities,
    isFetchingCarDetails,
    route,
  } = props;

  const platesScrollView = useRef(null);
  const [sectionActive, setSectionActive] = useState([0]);

  const carId = get(route, 'params.carId');
  const isPriceShow = get(route, 'params.showPrice');

  const onPressOrder = () => {
    navigation.navigate('OrderScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        dealer: get(carDetails, 'dealer'),
      },
      region: dealerSelected.region,
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  const onPressMyPrice = () => {
    navigation.navigate('OrderMyPriceScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
      },
      region: dealerSelected.region,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  const onPressCredit = () => {
    navigation.navigate('OrderCreditScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        price:
          get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
      },
      region: dealerSelected.region,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
      isNewCar: false,
      isPriceShow: isPriceShow,
    });
  };

  const onPressTestDrive = () => {
    navigation.navigate('TestDriveScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        dealer: [get(carDetails, 'dealer')],
      },
      region: dealerSelected.region,
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  const onPressCall = phone => {
    if (!getStatusWorktime(dealerSelected, 'RC', true)) {
      Alert.alert(
        strings.ContactsScreen.closedDealer.title,
        strings.ContactsScreen.closedDealer.text,
        [
          {
            text: strings.ContactsScreen.closedDealer.no,
            style: 'cancel',
          },
          {
            text: strings.ContactsScreen.closedDealer.yes,
            onPress: () => {
              navigation.navigate('CallMeBackScreen', {
                dealerCustom: listDealers[carDetails.dealer.id],
                goBack: true,
              });
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      Linking.openURL('tel:' + phone);
    }
  };

  const onPressCallMe = () => {
    navigation.navigate('CallMeBackScreen', {
      dealerCustom: listDealers[carDetails.dealer.id],
      goBack: true,
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
      },
      region: dealerSelected.region,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  const renderAdditionalServices = element => {
    if (!element && !element?.name) {
      return false;
    }

    return (
      <HStack w="90%" alignItems="center">
        <Icon
          as={MaterialCommunityIcons}
          name="check"
          color={styleConst.color.blue}
          size={6}
          mr="2"
          mt="0.5"
        />
        <Text
          // numberOfLines={1}
          // ellipsizeMode="tail"
          style={styles.additionalServiceText}>
          {element?.name}
        </Text>
      </HStack>
    );
  };

  const renderCarCostBlock = () => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('CarCostScreen', {
            Text:
              'Интересует обмен на ' +
              [
                get(carDetails, 'brand.name'),
                get(carDetails, 'model.name'),
                get(carDetails, 'model.generation.name'),
                '#' + get(carDetails, 'id.sap', null),
              ].join(' '),
          });
        }}
        mx="2%"
        mt="1"
        mb="32"
        backgroundColor={styleConst.color.purple}
        px="6"
        py="6"
        style={{
          width: '96%',
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: styleConst.font.medium,
            color: styleConst.color.white,
            width: '60%',
            marginBottom: 20,
          }}>
          Обменяйте свой автомобиль на этот
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: styleConst.font.regular,
            color: styleConst.color.bg,
            width: '70%',
          }}>
          Оставьте заявку на трейд-ин и мы примем ваш авто в зачёт этого
        </Text>
        <Icon
          as={MaterialCommunityIcons}
          name="car-multiple"
          color="white"
          size="6xl"
          style={{
            position: 'absolute',
            right: 20,
            top: 30,
          }}
        />
      </Pressable>
    );
  };

  const _renderAddress = () => {
    let address;
    const location_name = get(carDetails, 'location.address');
    const cityID = get(carDetails, 'location.city.id');
    let city_name = get(carDetails, 'location.city.name');
    if (cityID && listCities[cityID]) {
      city_name = listCities[cityID].name;
    }

    if (location_name) {
      address = city_name + ', ' + location_name;
    } else {
      address = city_name + ', ' + get(carDetails, 'dealer.name');
    }
    return `${address}`;
  };

  const _renderTruncatedFooter = handlePress => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        {strings.UsedCarItemScreen.showFull}
      </Text>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        {strings.UsedCarItemScreen.showLess}
      </Text>
    );
  };

  const onPressMap = () => {
    navigation.navigate('MapScreen', {
      name: get(carDetails, 'dealer.name'),
      city: get(carDetails, 'location.city.name'),
      address: get(carDetails, 'location.address'),
      coords: get(carDetails, 'location.coords'),
    });
  };

  useEffect(() => {
    console.info('== UsedCarItemScreen ==');

    props.actionFetchUsedCarDetails(carId);

    Analytics.logEvent('screen', 'catalog/usedcar/item', {
      id_api: get(carDetails, 'id.api'),
      id_sap: get(carDetails, 'id.sap'),
      brand_name: get(carDetails, 'brand.name'),
      model_name: get(carDetails, 'model.name'),
    });

    if (carDetails && !isFetchingCarDetails && platesScrollView?.current) {
      const currency = get(route, 'params.currency');
      navigation.setParams({
        carDetails: carDetails,
      });
      setTimeout(() => {
        platesScrollView &&
          platesScrollView?.current.scrollToEnd({duration: 500});
        setTimeout(() => {
          platesScrollView &&
            platesScrollView?.current.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
      }, 3000);
    }
  }, []);

  if (!carDetails || isFetchingCarDetails) {
    return (
      <SafeAreaView style={styles.spinnerContainer}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </SafeAreaView>
    );
  }

  let photos = [];
  let photosFull = [];
  if (get(carDetails, 'img.thumb')) {
    get(carDetails, 'img.thumb').forEach(element => {
      photos.push(element + '1200x600');
      photosFull.push({uri: element + '1600x1600'});
    });
  }
  const brandName = get(carDetails, 'brand.name');
  const modelName = get(carDetails, 'model.name');
  const generationName = get(carDetails, 'model.generation.name');
  const additional = get(carDetails, 'options.additional.1.data', []);
  const badge = get(carDetails, 'badge', null);
  const isSale = carDetails.sale === true;

  const CarPrices = {
    sale: get(carDetails, 'price.app.sale', 0),
    standart: get(
      carDetails,
      'price.app.standart',
      get(carDetails, 'price.app'),
    ),
  };

  const phone = get(
    carDetails,
    'phone.manager',
    get(
      carDetails,
      'location.phoneMobile[0]',
      get(carDetails, 'location.phone[0]'),
    ),
  ).replace(/[^+\d]+/g, '');

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
    bodyName = strings.CarParams.body[Number(bodyId)];
  }

  const wheelId = get(carDetails, 'gearbox.wheel.id');
  let wheelName = get(carDetails, 'gearbox.wheel.name');
  if (wheelId) {
    wheelName = strings.CarParams.wheels[wheelId];
  }

  let colorName = strings.Colors[Number(get(carDetails, 'color.id'))];
  if (!colorName) {
    colorName = get(carDetails, 'color.name.simple', null);
  }
  if (colorName) {
    colorName = colorName.toLowerCase();
  }

  let photosData = [];
  photos.map((el, index) => {
    photosData.push({
      url: el,
      type: 'image',
      index,
    });
  });

  return (
    <>
      <ScrollView backgroundColor="white" testID="UsedCarItemScreen.Wrapper">
        <View>
          <View
            style={[
              styles.modelBrandView,
              {marginTop: 70, flexDirection: 'column'},
            ]}>
            <View
              style={{
                flexShrink: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.modelBrandText,
                  {fontSize: 22, maxWidth: '90%'},
                ]}>
                {[brandName, modelName].join(' ')}
              </Text>
              <Text
                style={[
                  styles.modelBrandText,
                  {fontSize: 22, minWidth: '10%'},
                ]}>
                {[
                  get(carDetails, 'year'),
                  strings.NewCarItemScreen.shortUnits.year,
                ].join(' ')}
              </Text>
            </View>
            {generationName ? (
              <Text style={styles.modelBrandText}>{generationName}</Text>
            ) : null}
          </View>
          <View style={{marginTop: 10}}>
            {badge && badge.length ? (
              <View
                testID="NewCarItemScreen.BadgesWrapper"
                style={[styles.badgesView, {left: 15}]}>
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
              </View>
            ) : null}
            <PhotoSlider
              height={300}
              photosFull={photosFull}
              photos={photosData}
              resizeMode={'cover'}
              dotColor={styleConst.color.white}
              paginationStyle={{bottom: -20}}
            />
          </View>
          <View mt={4} shadow={7} style={[styles.carTopWrapper]}>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={true}
                testID="NewCarItemScreen.PlatesWrapper"
                ref={platesScrollView}>
                <HStack px="2%" mb="3">
                  {get(carDetails, 'mileage') ? (
                    <OptionPlate
                      title={strings.NewCarItemScreen.plates.mileage}
                      subtitle={
                        numberWithGap(get(carDetails, 'mileage')) + ' км.'
                      }
                    />
                  ) : null}
                  {engineName ? (
                    <OptionPlate
                      title={strings.NewCarItemScreen.plates.engine}
                      subtitle={
                        engineVolumeShort
                          ? engineVolumeShort.toFixed(1) + ' л. '
                          : '' + engineName
                      }
                    />
                  ) : null}
                  {get(carDetails, 'gearbox.GearboxCount') &&
                  get(carDetails, 'gearbox.name') ? (
                    <OptionPlate
                      title={strings.NewCarItemScreen.plates.gearbox.name}
                      subtitle={`${
                        get(carDetails, 'gearbox.GearboxCount.Value')
                          ? get(carDetails, 'gearbox.GearboxCount.Value') +
                            '-ст.'
                          : ''
                      } ${
                        get(carDetails, 'gearbox.name')
                          .replace(/^(Механическая)/i, 'МКПП')
                          .replace(/^(Автоматическая)/i, 'АКПП')
                          .split('/')[0]
                      }`}
                    />
                  ) : null}
                  {wheelName ? (
                    <OptionPlate
                      title={strings.NewCarItemScreen.plates.wheel}
                      subtitle={wheelName.toLowerCase()}
                    />
                  ) : null}
                  {get(carDetails, 'color.name.simple') ? (
                    <OptionPlate
                      title={strings.NewCarItemScreen.plates.color}
                      subtitle={colorName}
                    />
                  ) : null}
                </HStack>
              </ScrollView>
              {carDetails.dealer && carDetails.dealer.name ? (
                <Pressable onPress={onPressMap}>
                  <VStack style={styles.mapCardContainer}>
                    <Icon
                      as={MaterialCommunityIcons}
                      name="map-marker-outline"
                      color="blue.100"
                      size={12}
                    />
                    <View justifyContent="space-around">
                      <Text style={styles.mapCardTitle}>
                        {strings.NewCarItemScreen.carLocation}
                      </Text>
                      <Text
                        style={styles.mapCardDealer}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {_renderAddress()}
                      </Text>
                    </View>
                  </VStack>
                </Pressable>
              ) : null}
              <HStack
                mx="2%"
                justifyContent={phone ? 'space-between' : 'center'}>
                <Button
                  onPress={() => {
                    onPressCallMe();
                  }}
                  variant="solid"
                  size="md"
                  leftIcon={
                    <Icon
                      as={MaterialCommunityIcons}
                      name="phone-incoming"
                      size={6}
                    />
                  }
                  _text={{fontSize: 16, color: 'white'}}
                  style={[
                    !phone ? stylesFooter.buttonOnlyOne : null,
                    styles.itemOrderCallBack,
                    {width: phone ? '48%' : '100%'},
                  ]}>
                  {strings.ContactsScreen.callOrder}
                </Button>
                {phone ? (
                  <Button
                    onPress={() => {
                      onPressCall(phone);
                    }}
                    variant="solid"
                    size="md"
                    leftIcon={
                      <Icon
                        as={MaterialCommunityIcons}
                        name="phone-outgoing"
                        size={6}
                      />
                    }
                    _text={{fontSize: 16, color: 'white'}}
                    style={[styles.itemOrderCall, {width: '48%'}]}>
                    {strings.ContactsScreen.call}
                  </Button>
                ) : null}
              </HStack>
              <View style={styles.descrContainer}>
                {carDetails.text ? (
                  <>
                    <ReadMore
                      numberOfLines={4}
                      renderTruncatedFooter={_renderTruncatedFooter}
                      renderRevealedFooter={_renderRevealedFooter}>
                      <Text style={styles.descr}>{carDetails.text}</Text>
                    </ReadMore>
                    {get(carDetails, 'additionalServices', []).map((el, i) =>
                      renderAdditionalServices(el),
                    )}
                  </>
                ) : null}
              </View>
              {carDetails.creditAvailable || carDetails.customPriceAvailable ? (
                <View style={styles.bodyButtonsContainer}>
                  {carDetails.creditAvailable ? (
                    <Button
                      variant="outline"
                      activeOpacity={0.5}
                      onPress={onPressCredit}
                      style={[styles.bodyButton, styles.bodyButtonLeft]}
                      leftIcon={
                        <Icon
                          as={Octicons}
                          name="credit-card"
                          size={6}
                          color="red.600"
                        />
                      }
                      _text={{
                        fontSize: 'sm',
                        lineHeight: '14',
                        color: 'red.600',
                      }}>
                      {strings.UsedCarItemScreen.creditCalculate}
                    </Button>
                  ) : null}
                  {carDetails.customPriceAvailable ? (
                    <Button
                      variant="outline"
                      activeOpacity={0.5}
                      onPress={onPressMyPrice}
                      style={[styles.bodyButton, styles.bodyButtonRight]}
                      rightIcon={
                        <Icon
                          as={Entypo}
                          name="price-tag"
                          size={6}
                          color="blue.600"
                        />
                      }
                      _text={{
                        fontSize: 'sm',
                        lineHeight: '14',
                        color: 'blue.600',
                      }}>
                      {strings.UsedCarItemScreen.myPrice}
                    </Button>
                  ) : null}
                </View>
              ) : null}
            </View>
            <Accordion
              sections={[
                {
                  title: strings.NewCarItemScreen.tech.title,
                  content: (
                    <View style={styles.tabContent}>
                      <Text style={styles.sectionTitle}>
                        {strings.NewCarItemScreen.tech.base}
                      </Text>
                      <VStack>
                        {carDetails.year ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.tech.year}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text
                                style={
                                  styles.sectionValueText
                                }>{`${carDetails.year} г.`}</Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.mileage ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.plates.mileage}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text
                                style={
                                  styles.sectionValueText
                                }>{`${numberWithGap(
                                carDetails.mileage,
                              )} км.`}</Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.engine && carDetails.engine.type ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.tech.engine.fuel}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text style={styles.sectionValueText}>
                                {carDetails.engine.type}
                              </Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.engine &&
                        carDetails.engine.volume &&
                        carDetails.engine.volume.full ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.tech.engine.title}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text
                                style={
                                  styles.sectionValueText
                                }>{`${carDetails.engine.volume.full} см³`}</Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.gearbox && carDetails.gearbox.name ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.plates.gearbox.name}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text style={styles.sectionValueText}>
                                {gearboxName}
                              </Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.color &&
                        carDetails.color.name &&
                        carDetails.color.name.official ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.plates.color}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text style={styles.sectionValueText}>
                                {carDetails.color.name.official}
                              </Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.body && carDetails.body.name ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.tech.body.type}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text style={styles.sectionValueText}>
                                {bodyName}
                              </Text>
                            </View>
                          </HStack>
                        ) : null}
                        {carDetails.interior && carDetails.interior.name ? (
                          <HStack style={styles.sectionRow}>
                            <View style={styles.sectionProp}>
                              <Text
                                selectable={false}
                                style={styles.sectionPropText}>
                                {strings.NewCarItemScreen.tech.interior.title}:
                              </Text>
                            </View>
                            <View style={styles.sectionValue}>
                              <Text style={styles.sectionValueText}>
                                {carDetails.interior.name}
                              </Text>
                            </View>
                          </HStack>
                        ) : null}
                      </VStack>
                    </View>
                  ),
                },
                additional &&
                  additional.length && {
                    title: strings.NewCarItemScreen.plates.complectation,
                    content: (
                      <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>
                          {get(carDetails, 'options.additional.1.name')}
                        </Text>
                        <VStack>
                          {additional.map((item, num) => {
                            return (
                              <View key={'OptionsAdditional-' + num}>
                                {item.name && item.value ? (
                                  <HStack style={styles.sectionRow}>
                                    <View style={styles.sectionProp}>
                                      <Text style={styles.sectionPropText}>
                                        {item.name}
                                      </Text>
                                    </View>
                                    <View style={styles.sectionValue}>
                                      <Text style={styles.sectionValueText}>
                                        {item.value}
                                      </Text>
                                    </View>
                                  </HStack>
                                ) : (
                                  <Text
                                    style={[
                                      styles.sectionPropText,
                                      styles.sectionRow,
                                    ]}>
                                    {item.name}
                                  </Text>
                                )}
                              </View>
                            );
                          })}
                        </VStack>
                      </View>
                    ),
                  },
              ].filter(Boolean)}
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
            {renderCarCostBlock()}
          </View>
        </View>
      </ScrollView>
      <VStack
        position="absolute"
        style={[
          styleConst.shadow.default,
          stylesFooter.footer,
          !isPriceShow ? stylesFooter.footerSmall : null,
        ]}>
        {isPriceShow ? (
          isSale ? (
            <View
              style={[
                stylesFooter.orderPriceContainer,
                stylesFooter.orderPriceContainerSale,
              ]}>
              <Text
                style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
                {showPrice(CarPrices.sale, dealerSelected.region)}
              </Text>
              <Text style={[styles.orderPriceText, styles.orderPriceSmallText]}>
                {showPrice(CarPrices.standart, dealerSelected.region)}
              </Text>
            </View>
          ) : (
            <View
              style={[
                stylesFooter.orderPriceContainer,
                stylesFooter.orderPriceContainerNotSale,
              ]}>
              <Text
                style={[styles.orderPriceText, styles.orderPriceDefaultText]}>
                {showPrice(CarPrices.standart, dealerSelected.region)}
              </Text>
            </View>
          )
        ) : null}
        <HStack>
          <Button.Group isAttached>
            <Button
              testID="UsedCarItemScreen.Button.TestDrive"
              onPress={onPressTestDrive}
              size="md"
              style={[stylesFooter.buttonTwo]}
              activeOpacity={0.8}
              backgroundColor={styleConst.color.orange}
              leftIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="steering"
                  color="white"
                  size={6}
                />
              }
              _text={styles.buttonText}>
              {strings.NewCarItemScreen.show}
            </Button>
            <Button
              testID="UsedCarItemScreen.Button.Order"
              onPress={onPressOrder}
              size="md"
              backgroundColor={styleConst.color.lightBlue}
              style={[stylesFooter.buttonTwo]}
              activeOpacity={0.8}
              _text={styles.buttonText}>
              {strings.NewCarItemScreen.wannaCar}
            </Button>
          </Button.Group>
        </HStack>
      </VStack>
      <Fab
        renderInPortal={false}
        shadow={7}
        size="xs"
        containerStyle={{marginBottom: 100}}
        style={{backgroundColor: styleConst.new.blueHeader, marginBottom: 60}}
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
            chatType: 'tradein-cars',
            carID: carDetails.id.api,
          })
        }
      />
    </>
  );
};

UsedCarItemScreen.propTypes = {
  dealerSelected: PropTypes.object,
};

const stylesFooter = StyleSheet.create({
  footer: {
    height: 85,
    borderTopWidth: 0,
    marginHorizontal: '5%',
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0)',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    zIndex: 10,
  },
  footerSmall: {
    marginBottom: 0,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonTwo: {
    width: '50%',
  },
  buttonThree: {
    width: '38%',
  },
  buttonLeft: {
    borderBottomLeftRadius: 5,
    backgroundColor: styleConst.color.orange,
    borderColor: styleConst.color.orange,
  },
  buttonCenter: {
    width: '24%',
    backgroundColor: styleConst.color.green,
    borderColor: styleConst.color.green,
  },
  buttonRight: {
    borderBottomRightRadius: 5,
    backgroundColor: styleConst.color.lightBlue,
    borderColor: styleConst.color.lightBlue,
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
  orderPriceContainerSale: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  iconCallButton: {
    color: styleConst.color.white,
    fontSize: 24,
    marginTop: -2,
    marginRight: 0,
    marginLeft: 0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarItemScreen);
