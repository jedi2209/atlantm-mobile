/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Container,
  Content,
  Footer,
  Col,
  Row,
  Icon,
  Grid,
  Button,
  Accordion,
} from 'native-base';

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

class UsedCarItemScreen extends Component {
  static propTypes = {
    dealerSelected: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.platesScrollView = React.createRef();
    this.state = {tabName: 'base'};
    this.openStatus = getStatusWorktime(this.props.dealerSelected, 'RC', true);
  }

  componentDidMount() {
    const carId = get(this.props.route, 'params.carId');
    this.props.actionFetchUsedCarDetails(carId);

    Analytics.logEvent('screen', 'catalog/usedcar/item', {
      id_api: get(this.props.carDetails, 'id.api'),
      id_sap: get(this.props.carDetails, 'id.sap'),
      brand_name: get(this.props.carDetails, 'brand.name'),
      model_name: get(this.props.carDetails, 'model.name'),
    });

    if (
      this.props.carDetails &&
      !this.props.isFetchingCarDetails &&
      this.platesScrollView
    ) {
      setTimeout(() => {
        this.platesScrollView &&
          this.platesScrollView.scrollToEnd({duration: 500});
        setTimeout(() => {
          this.platesScrollView &&
            this.platesScrollView.scrollTo({x: 0, y: 0, animated: true});
        }, 500);
      }, 3000);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {carDetails, dealerSelected, isFetchingCarDetails} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'UsedCarItemScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      this.state.tabName !== nextState.tabName ||
      isFetchingCarDetails !== nextProps.isFetchingCarDetails ||
      get(carDetails, 'id.api') !== get(nextProps, 'carDetails.id.api')
    );
  }

  logGuard = false;

  onPressOrder = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('OrderScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        dealer: get(carDetails, 'dealer'),
      },
      region: this.props.dealerSelected.region,
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  onPressMyPrice = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('OrderMyPriceScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
      },
      region: this.props.dealerSelected.region,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  onPressCredit = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('OrderCreditScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        price:
          get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
      },
      region: this.props.dealerSelected.region,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  onPressTestDrive = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('TestDriveScreen', {
      car: {
        brand: get(carDetails, 'brand.name', ''),
        model: get(carDetails, 'model', ''),
        complectation: get(carDetails, 'complectation.name'),
        year: get(carDetails, 'year'),
        dealer: get(carDetails, 'dealer'),
      },
      region: this.props.dealerSelected.region,
      carId: carDetails.id.api,
      isNewCar: false,
    });
  };

  onPressCallMe = phone => {
    const {navigation, carDetails, listDealers} = this.props;
    if (!this.openStatus) {
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

  selectBaseTab = () => this.setState({tabName: 'base'});

  selectOptionsTab = () => this.setState({tabName: 'options'});

  renderPrice = ({carDetails, currency}) => {
    const CarPrices = {
      sale: get(carDetails, 'price.app.sale', 0),
      standart: get(
        carDetails,
        'price.app.standart',
        get(carDetails, 'price.app'),
      ),
    };
    const isSale = carDetails.sale === true;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-start',
          minWidth: 100,
          marginBottom: 12,
          marginTop: 10,
        }}>
        {isSale && (
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#D0021B',
            }}>
            {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
          </Text>
        )}
        <Text
          style={{
            fontSize: isSale ? 16 : 24,
            fontWeight: '600',
            lineHeight: isSale ? 18 : 30,
            color: '#000',
            textDecorationLine: isSale ? 'line-through' : 'none',
          }}>
          {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
        </Text>
      </View>
    );
  };

  renderAdditionalServices = element => {
    if (!element) {
      return false;
    }

    return (
      <View style={{flexDirection: 'row', width: '90%'}}>
        <Icon
          type="MaterialCommunityIcons"
          name="check"
          style={styles.additionalServiceIcon}
        />
        <Text
          // numberOfLines={1}
          // ellipsizeMode="tail"
          style={styles.additionalServiceText}>
          {element.name}
        </Text>
      </View>
    );
  };

  renderCarCostBlock = () => {
    const {navigation, carDetails} = this.props;
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
        style={{
          height: 150,
          width: '96%',
          marginHorizontal: '2%',
          marginBottom: 90,
          marginTop: 10,
          backgroundColor: styleConst.color.greyBlue,
          borderRadius: 5,
          paddingHorizontal: 20,
          paddingVertical: 10,
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
          type="MaterialCommunityIcons"
          name="car-multiple"
          style={{
            position: 'absolute',
            fontSize: 102,
            right: 10,
            top: 30,
            color: styleConst.color.white,
          }}
        />
      </Pressable>
    );
  };

  _renderAddress() {
    const {carDetails, listCities} = this.props;

    let address;
    const location_name = get(carDetails, 'location.address');
    const cityID = get(carDetails, 'location.city.id');
    let city_name = get(carDetails, 'location.city.name');
    if (cityID) {
      city_name = listCities[cityID].name;
    }

    if (location_name) {
      address = city_name + ', ' + location_name;
    } else {
      address = city_name + ', ' + get(carDetails, 'dealer.name');
    }
    return `${address}`;
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        {strings.UsedCarItemScreen.showFull}
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        {strings.UsedCarItemScreen.showLess}
      </Text>
    );
  };

  onPressMap = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('MapScreen', {
      name: get(carDetails, 'dealer.name'),
      city: get(carDetails, 'location.city.name'),
      address: get(carDetails, 'location.address'),
      coords: get(carDetails, 'location.coords'),
    });
  };

  render() {
    const {carDetails, isFetchingCarDetails, listDealers} = this.props;

    const currency = get(this.props.route, 'params.currency');
    this.props.navigation.setParams({
      carDetails: carDetails,
    });

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

    console.info('== UsedCarItemScreen ==');

    let photos = [];
    if (get(carDetails, 'img.original')) {
      get(carDetails, 'img.original').forEach(element => {
        photos.push(element + '?d=440x400');
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
      'carDetails.phone.manager',
      get(listDealers[carDetails.dealer.id], 'phone', null),
    );

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
        <Container testID="UsedCarItemScreen.Wrapper">
          <Content>
            <StatusBar hidden />
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
                height={290}
                photos={photosData}
                resizeMode={'cover'}
                dotColor={styleConst.color.white}
              />
            </View>
            <View
              style={[
                styleConst.shadow.default,
                styles.carTopWrapper,
                {
                  marginTop: -25,
                },
              ]}>
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={true}
                  testID="NewCarItemScreen.PlatesWrapper"
                  ref={ref => {
                    this.platesScrollView = ref;
                  }}>
                  <View style={styles.platesWrapper}>
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
                  </View>
                </ScrollView>
                {carDetails.dealer && carDetails.dealer.name ? (
                  <TouchableWithoutFeedback
                    onPress={this.onPressMap}
                    style={styles.mapCard}>
                    <View style={styles.mapCardContainer}>
                      <Icon
                        type="MaterialCommunityIcons"
                        name="map-marker-outline"
                        style={styles.mapCardIcon}
                      />
                      <View style={styles.mapCardTextContainer}>
                        <Text style={styles.mapCardTitle}>
                          {strings.NewCarItemScreen.carLocation}
                        </Text>
                        <Text
                          style={styles.mapCardDealer}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {this._renderAddress()}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
                {carDetails.text ? (
                  <View style={styles.descrContainer}>
                    <ReadMore
                      numberOfLines={4}
                      renderTruncatedFooter={this._renderTruncatedFooter}
                      renderRevealedFooter={this._renderRevealedFooter}
                      onReady={this._handleTextReady}>
                      <Text style={styles.descr}>{carDetails.text}</Text>
                    </ReadMore>
                    {get(carDetails, 'additionalServices', []).map((el, i) =>
                      this.renderAdditionalServices(el),
                    )}
                  </View>
                ) : null}
                {carDetails.creditAvailable ||
                carDetails.customPriceAvailable ? (
                  <View style={styles.bodyButtonsContainer}>
                    {carDetails.creditAvailable ? (
                      <Button
                        block
                        iconRight
                        transparent
                        activeOpacity={0.5}
                        onPress={this.onPressCredit}
                        style={[styles.bodyButton, styles.bodyButtonLeft]}>
                        <Text
                          selectable={false}
                          style={[
                            styles.bodyButtonText,
                            styles.bodyButtonTextLeft,
                          ]}>
                          {strings.UsedCarItemScreen.creditCalculate}
                        </Text>
                        <Icon
                          type="Octicons"
                          name="credit-card"
                          selectable={false}
                          style={[
                            styles.bodyButtonIcon,
                            styles.bodyButtonIconLeft,
                          ]}
                        />
                      </Button>
                    ) : null}
                    {carDetails.customPriceAvailable ? (
                      <Button
                        block
                        iconLeft
                        transparent
                        activeOpacity={0.5}
                        onPress={this.onPressMyPrice}
                        style={[styles.bodyButton, styles.bodyButtonRight]}>
                        <Icon
                          type="Entypo"
                          name="price-tag"
                          selectable={false}
                          style={[
                            styles.bodyButtonIcon,
                            styles.bodyButtonIconRight,
                          ]}
                        />
                        <Text
                          selectable={false}
                          style={[
                            styles.bodyButtonText,
                            styles.bodyButtonTextRight,
                          ]}>
                          {strings.UsedCarItemScreen.myPrice}
                        </Text>
                      </Button>
                    ) : null}
                  </View>
                ) : null}
              </View>
              <Accordion
                style={styles.accordion}
                dataArray={[
                  {
                    title: strings.NewCarItemScreen.tech.title,
                    content: (
                      <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>
                          {strings.NewCarItemScreen.tech.base}
                        </Text>
                        <Grid>
                          {carDetails.year ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.tech.year}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text
                                  style={
                                    styles.sectionValueText
                                  }>{`${carDetails.year} г.`}</Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.mileage ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.plates.mileage}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text
                                  style={
                                    styles.sectionValueText
                                  }>{`${numberWithGap(
                                  carDetails.mileage,
                                )} км.`}</Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.engine && carDetails.engine.type ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.tech.engine.fuel}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text style={styles.sectionValueText}>
                                  {carDetails.engine.type}
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.engine &&
                          carDetails.engine.volume &&
                          carDetails.engine.volume.full ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.tech.engine.title}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text
                                  style={
                                    styles.sectionValueText
                                  }>{`${carDetails.engine.volume.full} см³`}</Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.gearbox && carDetails.gearbox.name ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.plates.gearbox.name}
                                  :
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text style={styles.sectionValueText}>
                                  {gearboxName}
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.color &&
                          carDetails.color.name &&
                          carDetails.color.name.official ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.plates.color}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text style={styles.sectionValueText}>
                                  {carDetails.color.name.official}
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.body && carDetails.body.name ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.tech.body.type}:
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text style={styles.sectionValueText}>
                                  {bodyName}
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                          {carDetails.interior && carDetails.interior.name ? (
                            <Row style={styles.sectionRow}>
                              <Col style={styles.sectionProp}>
                                <Text
                                  selectable={false}
                                  style={styles.sectionPropText}>
                                  {strings.NewCarItemScreen.tech.interior.title}
                                  :
                                </Text>
                              </Col>
                              <Col style={styles.sectionValue}>
                                <Text style={styles.sectionValueText}>
                                  {carDetails.interior.name}
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                        </Grid>
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
                          {additional.map((item, num) => {
                            return (
                              <Grid key={'OptionsAdditional-' + num}>
                                {item.name && item.value ? (
                                  <Row style={styles.sectionRow}>
                                    <Col style={styles.sectionProp}>
                                      <Text style={styles.sectionPropText}>
                                        {item.name}
                                      </Text>
                                    </Col>
                                    <Col style={styles.sectionValue}>
                                      <Text style={styles.sectionValueText}>
                                        {item.value}
                                      </Text>
                                    </Col>
                                  </Row>
                                ) : (
                                  <Text
                                    style={[
                                      styles.sectionPropText,
                                      styles.sectionRow,
                                    ]}>
                                    {item.name}
                                  </Text>
                                )}
                              </Grid>
                            );
                          })}
                        </View>
                      ),
                    },
                ].filter(Boolean)}
                expanded={[0]}
                animation={true}
                renderHeader={(item, expanded) => (
                  <View
                    style={{
                      height: 64,
                      paddingHorizontal: '2%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: styleConst.color.white,
                      borderTopWidth: 0.75,
                      borderColor: '#d5d5e0',
                    }}>
                    <Text style={{fontSize: 18}}>{item.title}</Text>
                    {expanded ? (
                      <Icon
                        type="FontAwesome5"
                        style={{color: '#0061ED', fontWeight: 'normal'}}
                        name="angle-down"
                      />
                    ) : (
                      <Icon
                        type="FontAwesome5"
                        style={{color: '#131314', fontWeight: 'normal'}}
                        name="angle-right"
                      />
                    )}
                  </View>
                )}
                renderContent={item => {
                  return (
                    <View
                      style={{
                        backgroundColor: styleConst.color.white,
                        paddingHorizontal: '3%',
                      }}>
                      {item.content}
                    </View>
                  );
                }}
              />
              {this.renderCarCostBlock()}
            </View>
          </Content>
        </Container>
        <View style={[styleConst.shadow.default, stylesFooter.footer]}>
          {isSale ? (
            <View
              style={[
                stylesFooter.orderPriceContainer,
                stylesFooter.orderPriceContainerSale,
              ]}>
              <Text
                style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
                {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
              </Text>
              <Text
                style={[
                  styles.orderPriceText,
                  styles.orderPriceDefaultText,
                  styles.orderPriceSmallText,
                ]}>
                {showPrice(
                  CarPrices.standart,
                  this.props.dealerSelected.region,
                )}
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
                {showPrice(
                  CarPrices.standart,
                  this.props.dealerSelected.region,
                )}
              </Text>
            </View>
          )}
          <View style={[stylesFooter.footerButtons]}>
            <Button
              testID="UsedCarItemScreen.Button.TestDrive"
              onPress={this.onPressTestDrive}
              full
              style={[
                stylesFooter.button,
                stylesFooter.buttonLeft,
                phone ? stylesFooter.buttonThree : stylesFooter.buttonTwo,
              ]}
              activeOpacity={0.8}>
              <Icon
                type="MaterialCommunityIcons"
                name="steering"
                selectable={false}
                style={stylesFooter.iconTDButton}
              />
              <Text style={styles.buttonText} selectable={false}>
                {strings.NewCarItemScreen.show}
              </Text>
            </Button>
            {phone ? (
              <Button
                testID="UsedCarItemScreen.Button.CallMe"
                onPress={() => this.onPressCallMe(phone)}
                full
                style={[stylesFooter.button, stylesFooter.buttonCenter]}
                activeOpacity={0.8}>
                <Icon
                  type="MaterialCommunityIcons"
                  name="phone"
                  selectable={false}
                  style={stylesFooter.iconCallButton}
                />
              </Button>
            ) : null}
            <Button
              testID="UsedCarItemScreen.Button.Order"
              onPress={this.onPressOrder}
              full
              style={[
                stylesFooter.button,
                stylesFooter.buttonRight,
                phone ? stylesFooter.buttonThree : stylesFooter.buttonTwo,
              ]}
              activeOpacity={0.8}>
              <Text style={styles.buttonText} selectable={false}>
                {strings.NewCarItemScreen.wannaCar}
              </Text>
            </Button>
          </View>
        </View>
      </>
    );
  }
}

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
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    height: 40,
    borderWidth: 1,
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
  iconTDButton: {
    color: styleConst.color.white,
    fontSize: 20,
    marginTop: -2,
    marginRight: 2,
    marginLeft: 0,
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
