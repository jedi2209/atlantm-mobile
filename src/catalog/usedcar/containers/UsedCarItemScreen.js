import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Col,
  Row,
  Icon,
  Grid,
  Button,
  StyleProvider,
  Accordion,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {
  actionFetchUsedCarDetails,
  actionOpenUsedCarPhotoViewer,
  actionCloseUsedCarPhotoViewer,
  actionUpdateUsedCarPhotoViewerIndex,
} from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '../../../core/components/PhotoSlider';
import PhotoViewer from '../../../core/components/PhotoViewer';
import ReadMore from 'react-native-read-more-text';
import Badge from '../../../core/components/Badge';

// helpers
import {get, find} from 'lodash';
import PropTypes from 'prop-types';
import Amplitude from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';
import numberWithGap from '../../../utils/number-with-gap';
import getTheme from '../../../../native-base-theme/components';
import showPrice from '../../../utils/price';

// styles
import styles from '../../CarStyles';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    carDetails: catalog.usedCar.carDetails.data,
    photoViewerItems: catalog.usedCar.carDetails.photoViewerItems,
    photoViewerVisible: catalog.usedCar.carDetails.photoViewerVisible,
    photoViewerIndex: catalog.usedCar.carDetails.photoViewerIndex,
    isFetchingCarDetails: catalog.usedCar.meta.isFetchingCarDetails,
  };
};

const mapDispatchToProps = {
  actionFetchUsedCarDetails,
  actionOpenUsedCarPhotoViewer,
  actionCloseUsedCarPhotoViewer,
  actionUpdateUsedCarPhotoViewerIndex,
};

const OptionPlate = ({title, subtitle}) => (
  <View
    style={{
      borderRadius: 10,
      backgroundColor: '#0061ED',
      paddingHorizontal: 12,
      marginRight: 8,
      height: 52,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        color: '#d8d8d8',
        fontSize: 14,
        fontWeight: '300',
        paddingBottom: 5,
      }}>
      {title}
    </Text>
    <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
      {subtitle}
    </Text>
  </View>
);

class UserCarItemScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTransparent: true,
    headerLeft: (
      <HeaderIconBack
        theme="white"
        ContainerStyle={styleConst.headerBackButton.ContainerStyle}
        IconStyle={styleConst.headerBackButton.IconStyle}
        navigation={navigation}
      />
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {tabName: 'base'};
  }

  componentDidMount() {
    const carId = get(this.props.navigation, 'state.params.carId');
    this.props.actionFetchUsedCarDetails(carId);

    Amplitude.logEvent('screen', 'catalog/usedcar/item', {
      id_api: get(this.props.carDetails, 'id.api'),
      id_sap: get(this.props.carDetails, 'id.sap'),
      brand_name: get(this.props.carDetails, 'brand.name'),
      model_name: get(this.props.carDetails, 'model.name'),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      carDetails,
      dealerSelected,
      photoViewerItems,
      photoViewerIndex,
      photoViewerVisible,
      isFetchingCarDetails,
    } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'UserCarItemScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      this.state.tabName !== nextState.tabName ||
      photoViewerIndex !== nextProps.photoViewerIndex ||
      photoViewerItems.length !== nextProps.photoViewerItems.length ||
      photoViewerVisible !== nextProps.photoViewerVisible ||
      isFetchingCarDetails !== nextProps.isFetchingCarDetails ||
      get(carDetails, 'id.api') !== get(nextProps, 'carDetails.id.api')
    );
  }

  logGuard = false;

  onPressDealer = () => {
    const {
      carDetails,
      navigation,
      listRussia,
      listUkraine,
      listBelarussia,
    } = this.props;

    const list = [].concat(listRussia, listBelarussia, listUkraine);
    const dealerBaseData = find(list, {id: carDetails.dealer.id});

    navigation.navigate('AboutDealerScreen', {dealerBaseData});
  };

  onPressOrder = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('OrderScreen', {
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

  onClosePhoto = () => this.props.actionCloseUsedCarPhotoViewer();

  onPressPhoto = () => this.props.actionOpenUsedCarPhotoViewer();

  onChangePhotoIndex = (index) =>
    this.props.actionUpdateUsedCarPhotoViewerIndex(index);

  selectBaseTab = () => this.setState({tabName: 'base'});

  selectOptionsTab = () => this.setState({tabName: 'options'});

  renderPrice = ({carDetails, currency}) => {
    const CarPrices = {
      sale: get(carDetails, 'price.app.sale') || 0,
      standart:
        get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
    };

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-end',
          minWidth: 100,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 20,
            color: '#000',
          }}>
          {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
        </Text>
      </View>
    );
  };

  _renderAddress() {
    const {carDetails} = this.props;

    let address;
    const location_name = get(carDetails, 'location.address');
    const city_name = get(carDetails, 'city.name');

    if (location_name) {
      address = city_name + ', ' + location_name;
    } else {
      address = city_name + ', ' + get(carDetails, 'dealer.name');
    }
    return `${address}`;
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        Показать полное описание...
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        selectable={false}
        style={styles.ShowFullDescriptionButton}
        onPress={handlePress}>
        Свернуть
      </Text>
    );
  };

  onPressMap = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('MapScreen', {
      name: get(carDetails, 'dealer.name'),
      city: get(carDetails, 'city.name'),
      address: get(carDetails, 'location.address'),
      coords: get(carDetails, 'location.coords'),
    });
  };

  render() {
    const {
      carDetails,
      photoViewerIndex,
      photoViewerItems,
      photoViewerVisible,
      isFetchingCarDetails,
    } = this.props;

    const currency = get(this.props.navigation, 'state.params.currency');
    this.props.navigation.setParams({
      carDetails: carDetails,
    });

    if (!carDetails || isFetchingCarDetails) {
      return (
        <SafeAreaView style={styles.spinnerContainer}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        </SafeAreaView>
      );
    }

    console.log('== UsedCarItemScreen ==');

    let photos = [];
    if (get(carDetails, 'img.original')) {
      get(carDetails, 'img.original').forEach((element) => {
        photos.push(element + '?d=440x400');
      });
    }
    const brandName = get(carDetails, 'brand.name');
    const modelName = get(carDetails, 'model.name');
    const additional = get(carDetails, 'options.additional.1.data', []);
    const badge = get(carDetails, 'badge', null);
    console.log('carDetails', carDetails);

    const CarPrices = {
      standart: get(carDetails, 'price.app.standart') || 0,
    };

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <ScrollView>
            <StatusBar hidden />
            <View style={{flex: 1, position: 'relative'}}>
              {badge ? (
                <View
                  key={'badgeContainer' + carDetails.id.api}
                  style={{
                    position: 'absolute',
                    right: 20,
                    top: 230,
                    width: '100%',
                    flexDirection: 'row',
                    flex: 1,
                    zIndex: 100,
                    alignContent: 'stretch',
                    justifyContent: 'flex-end',
                  }}>
                  {badge.map((item, index) => {
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
              <View style={[styles.gallery, {marginTop: 0}]}>
                <PhotoSlider
                  height={310}
                  resizeMode="cover"
                  dotColor="#fff"
                  photos={photos}
                  onPressItem={this.onPressPhoto}
                  paginationStyle={{marginBottom: 15}}
                  onIndexChanged={this.onChangePhotoIndex}
                />
                <View style={{backgroundColor: '#fff', zIndex: 100}}>
                  <View
                    style={[
                      {
                        position: 'relative',
                        top: -35,
                        marginBottom: -35,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingTop: 20,
                      },
                    ]}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                      }}>
                      <View style={{marginBottom: 10, flexShrink: 1}}>
                        <Text style={{fontSize: 16, fontWeight: '600'}}>
                          {`${brandName} ${modelName}`}
                        </Text>
                        <Text style={{fontSize: 11, fontWeight: '600'}}>
                          {get(carDetails, 'year')}
                        </Text>
                      </View>
                      {this.renderPrice({carDetails, currency})}
                    </View>
                  </View>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingHorizontal: '2%',
                        marginBottom: 10,
                      }}>
                      {get(carDetails, 'mileage') ? (
                        <OptionPlate
                          title="Пробег"
                          subtitle={
                            numberWithGap(get(carDetails, 'mileage')) + ' км.'
                          }
                        />
                      ) : null}
                      {get(carDetails, 'engine') ? (
                        <OptionPlate
                          title="Двигатель"
                          subtitle={
                            get(carDetails, 'engine.volume.short').toFixed(1) +
                            ' л. ' +
                            get(carDetails, 'engine.type')
                          }
                        />
                      ) : null}
                      {get(carDetails, 'gearbox.GearboxCount') &&
                      get(carDetails, 'gearbox.name') ? (
                        <OptionPlate
                          title="КПП"
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
                      {get(carDetails, 'gearbox.wheel') ? (
                        <OptionPlate
                          title="Привод"
                          subtitle={get(
                            carDetails,
                            'gearbox.wheel',
                          ).toLowerCase()}
                        />
                      ) : null}
                      {get(carDetails, 'color.name.simple') ? (
                        <OptionPlate
                          title="Цвет"
                          subtitle={get(
                            carDetails,
                            'color.name.simple',
                          ).toLowerCase()}
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
                            Автомобиль расположен по адресу
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
                    </View>
                  ) : null}
                  <Accordion
                    style={{
                      borderBottomColor: '#d5d5e0',
                      borderBottomWidth: 1,
                      marginBottom: 90,
                    }}
                    dataArray={[
                      {
                        title: 'Характеристики',
                        content: (
                          <View style={styles.tabContent}>
                            <Text style={styles.sectionTitle}>Основные</Text>
                            <Grid>
                              {carDetails.year ? (
                                <Row style={styles.sectionRow}>
                                  <Col style={styles.sectionProp}>
                                    <Text style={styles.sectionPropText}>
                                      Год выпуска:
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
                                    <Text style={styles.sectionPropText}>
                                      Пробег:
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
                                      Топливо:
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
                                    <Text style={styles.sectionPropText}>
                                      Двигатель:
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
                                    <Text style={styles.sectionPropText}>
                                      КПП:
                                    </Text>
                                  </Col>
                                  <Col style={styles.sectionValue}>
                                    <Text style={styles.sectionValueText}>
                                      {carDetails.gearbox.name}
                                    </Text>
                                  </Col>
                                </Row>
                              ) : null}
                              {carDetails.color &&
                              carDetails.color.name &&
                              carDetails.color.name.official ? (
                                <Row style={styles.sectionRow}>
                                  <Col style={styles.sectionProp}>
                                    <Text style={styles.sectionPropText}>
                                      Цвет:
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
                                    <Text style={styles.sectionPropText}>
                                      Тип кузова:
                                    </Text>
                                  </Col>
                                  <Col style={styles.sectionValue}>
                                    <Text style={styles.sectionValueText}>
                                      {carDetails.body.name}
                                    </Text>
                                  </Col>
                                </Row>
                              ) : null}
                              {carDetails.interior &&
                              carDetails.interior.name ? (
                                <Row style={styles.sectionRow}>
                                  <Col style={styles.sectionProp}>
                                    <Text style={styles.sectionPropText}>
                                      Салон:
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
                          title: 'Комплектация',
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
                    expanded={0}
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
                          backgroundColor: '#fff',
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
                    renderContent={(item) => {
                      return (
                        <View
                          style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: '3%',
                          }}>
                          {item.content}
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={stylesFooter.footer}>
            <View
              style={[
                styleConst.shadow.default,
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
            <Button
              onPress={this.onPressOrder}
              full
              style={[styleConst.shadow.default, stylesFooter.button]}>
              <Text style={styles.buttonText} selectable={false}>
                ХОЧУ ЭТО АВТО!
              </Text>
            </Button>
          </View>
          {photoViewerItems.length ? (
            <PhotoViewer
              index={photoViewerIndex}
              visible={photoViewerVisible}
              items={photoViewerItems}
              enableScale={true}
              onChange={this.onChangePhotoIndex}
              onPressClose={this.onClosePhoto}
            />
          ) : null}
        </View>
      </StyleProvider>
    );
  }
}

const stylesFooter = StyleSheet.create({
  footer: {
    height: 50,
    borderTopWidth: 0,
    paddingHorizontal: '5%',
    backgroundColor: 'rgba(0,0,0,0)',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    width: '55%',
    height: 48,
    flexDirection: 'row',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: styleConst.color.lightBlue,
    borderColor: styleConst.color.lightBlue,
    borderWidth: 1,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  orderPriceContainer: {
    height: 48,
    width: '45%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: styleConst.color.header,
    borderColor: styleConst.color.header,
    borderWidth: 1,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCarItemScreen);
