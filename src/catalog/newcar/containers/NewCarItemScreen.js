/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  StyleSheet,
  Linking,
  Platform,
  Alert,
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
  actionFetchNewCarDetails,
  actionOpenNewCarPhotoViewer,
  actionCloseNewCarPhotoViewer,
  actionUpdateNewCarPhotoViewerIndex,
} from '@catalog/actions';

// components
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '@core/components/PhotoSlider';
import PhotoViewer from '@core/components/PhotoViewer';
import ColorBox from '../../../core/components/ColorBox';

// helpers
import getTheme from '../../../../native-base-theme/components';
import {get, find} from 'lodash';
import PropTypes from 'prop-types';
import Amplitude from '@utils/amplitude-analytics';
import styleConst from '@core/style-const';
import showPrice from '@utils/price';

// styles
import styles from '@catalog/CarStyles';

const imgResize = '10000x440';

const mapStateToProps = ({catalog, dealer, profile, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    filterData: catalog.newCar.filterData,
    carDetails: catalog.newCar.carDetails.data,
    profile,
    photoViewerItems: catalog.newCar.carDetails.photoViewerItems,
    photoViewerVisible: catalog.newCar.carDetails.photoViewerVisible,
    photoViewerIndex: catalog.newCar.carDetails.photoViewerIndex,
    isFetchingCarDetails: catalog.newCar.meta.isFetchingCarDetails,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarDetails,
  actionOpenNewCarPhotoViewer,
  actionCloseNewCarPhotoViewer,
  actionUpdateNewCarPhotoViewerIndex,
};

const ActiveComponentPlate = ({onPress, children}) => {
  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor="#DDDDDD">
      {children}
    </TouchableOpacity>
  ) : (
    <View>{children}</View>
  );
};

const OptionPlate = ({
  onPress,
  title,
  subtitle,
  viewStyle,
  titleStyle,
  textStyle,
}) => {
  return (
    <ActiveComponentPlate onPress={onPress}>
      <View
        style={[
          {
            borderRadius: 10,
            backgroundColor: '#0061ED',
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
          style={[{color: '#fff', fontSize: 14, fontWeight: '600'}, textStyle]}>
          {subtitle}
        </Text>
      </View>
    </ActiveComponentPlate>
  );
};

class NewCarItemScreen extends Component {
  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabName: 'base',
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerTransparent: true,
    headerLeft: navigation.state.params.carDetails ? (
      <HeaderIconBack
        theme="white"
        ContainerStyle={styleConst.headerBackButton.ContainerStyle}
        IconStyle={styleConst.headerBackButton.IconStyle}
        navigation={navigation}
        returnScreen="NewCarListScreen"
      />
    ) : null,
  });

  componentDidMount() {
    const carId = get(this.props.navigation, 'state.params.carId');

    this.props.actionFetchNewCarDetails(carId);

    Amplitude.logEvent('screen', 'catalog/newcar/item', {
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
      nav.routes[nav.index].routeName === 'NewCarItemScreen';

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
    const {navigation, carDetails, profile} = this.props;

    const CarPrices = {
      sale: get(carDetails, 'price.app.sale') || 0,
      standart:
        get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
    };

    const onlineLink = get(carDetails, 'onlineLink');

    if (get(carDetails, 'online') && onlineLink) {
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
        '&utm_campaign=' +
        Platform.OS +
        '&utm_content=button' +
        userLink;
      Alert.alert(
        'Вариант покупки авто',
        'Вы хотите забронировать авто или просто отправить запрос?\r\n\r\n' +
          'Бронирование позволяет вам гарантированно получить автомобиль, внеся небольшую предоплату.\r\n\r\n' +
          'Разумеется, эта сумма засчитывается в стоимость авто.',
        [
          {
            text: '📄 Отправить запрос',
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
                },
                region: this.props.dealerSelected.region,
                dealerId: carDetails.dealer.id,
                carId: carDetails.id.api,
                isNewCar: true,
              });
            },
          },
          {
            text: '🧾 Забронировать',
            onPress: () => {
              Linking.openURL(urlLink);
            },
          },
          {
            text: 'Отмена',
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
        },
        region: this.props.dealerSelected.region,
        dealerId: carDetails.dealer.id,
        carId: carDetails.id.api,
        isNewCar: true,
      });
    }
  };

  onClosePhoto = () => this.props.actionCloseNewCarPhotoViewer();

  onPressPhoto = () => this.props.actionOpenNewCarPhotoViewer();

  onChangePhotoIndex = (index) =>
    this.props.actionUpdateNewCarPhotoViewerIndex(index);

  renderDealer = (dealerName) => {
    return dealerName ? (
      <TouchableHighlight
        onPress={this.onPressDealer}
        underlayColor={styleConst.color.select}>
        <Grid style={styles.section}>
          <Col>
            <Text style={styles.sectionTitle}>Где</Text>
          </Col>
          <Col>
            <View style={styles.dealerContainer}>
              <Text style={styles.sectionTitleValue}>{dealerName}</Text>
              <Icon name="arrow-forward" style={styles.iconArrow} />
            </View>
          </Col>
        </Grid>
      </TouchableHighlight>
    ) : null;
  };

  renderTechData = (title, data) => {
    const {carDetails} = this.props;
    const _this = this;
    if (typeof data === 'object' && data.length) {
      let resRaw = data.map((element) => {
        return _this.renderItem(
          element.name + ':',
          get(carDetails, element.value),
          element.postfix,
        );
      });
      let res = resRaw.filter((el) => {
        return el != null;
      });
      return res ? (
        <View style={styles.sectionOptions}>
          <Text
            style={styles.sectionTitle}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {title}
          </Text>
          <Grid>{res}</Grid>
        </View>
      ) : null;
    }

    return data ? (
      <View style={styles.sectionOptions}>
        <Text
          style={styles.sectionTitle}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Text>
        <Grid>
          {data.map((element) => {
            return _this.renderItem(
              element.name + ':',
              get(carDetails, element.value),
              element.postfix,
            );
          })}
        </Grid>
      </View>
    ) : null;
  };

  renderItem = (title, value, postfix) => {
    return value ? (
      <Row key={`${title} ${value} ${postfix}`} style={styles.sectionRow}>
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
            numberOfLines={1}>{`${value} ${postfix || ''}`}</Text>
        </View>
      </Row>
    ) : null;
  };

  renderComplectationItem = (title, data) => {
    if (data.length === 0) {
      return null;
    }

    return (
      <View key={title} style={{marginBottom: 10}}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((item) => {
          return (
            <Grid key={`${item.name} ${item.id}`}>
              {item.name && item.value ? (
                <Row style={styles.sectionRow}>
                  <Col style={styles.sectionProp}>
                    <Text
                      style={styles.sectionPropText}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {item.name}
                    </Text>
                  </Col>
                  <Col style={styles.sectionValue}>
                    <Text
                      style={styles.sectionValueText}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {item.value}
                    </Text>
                  </Col>
                </Row>
              ) : (
                <Text style={[styles.sectionPropText, styles.sectionRow]}>
                  {item.name}
                </Text>
              )}
            </Grid>
          );
        })}
      </View>
    );
  };

  renderPrice = ({carDetails, filterData = {}, currency}) => {
    const isSale = carDetails.sale === true;

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
        {isSale && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#D0021B',
            }}>
            {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
          </Text>
        )}
        <Text
          style={{
            fontSize: isSale ? 12 : 14,
            fontWeight: '600',
            lineHeight: isSale ? 14 : 20,
            color: '#000',
            textDecorationLine: isSale ? 'line-through' : 'none',
          }}>
          {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
        </Text>
      </View>
    );
  };

  renderPriceFooter = ({carDetails, filterData, currency}) => {
    const isSale = carDetails.sale === true;

    const CarPrices = {
      sale: get(carDetails, 'price.app.sale') || 0,
      standart:
        get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
    };

    return (
      <View
        style={[
          styleConst.shadow.default,
          stylesFooter.orderPriceContainer,
          !isSale ? stylesFooter.orderPriceContainerNotSale : null,
        ]}>
        {isSale ? (
          <Text style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
            {showPrice(CarPrices.sale, this.props.dealerSelected.region)}
          </Text>
        ) : null}
        <Text
          style={[
            styles.orderPriceText,
            !isSale ? styles.orderPriceDefaultText : styles.orderPriceSmallText,
          ]}>
          {showPrice(CarPrices.standart, this.props.dealerSelected.region)}
        </Text>
      </View>
    );
  };

  onPressMap = () => {
    const {navigation, carDetails} = this.props;
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

  render() {
    const {
      filterData,
      carDetails,
      photoViewerIndex,
      photoViewerItems,
      photoViewerVisible,
      isFetchingCarDetails,
    } = this.props;

    this.props.navigation.setParams({
      carDetails: carDetails,
    });

    const stock = get(carDetails, 'options.stock', {});
    const stockKeys = Object.keys(stock);
    const additional = get(carDetails, 'options.additional', {});
    const additionalKeys = Object.keys(additional);

    if (!carDetails || isFetchingCarDetails) {
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        </View>
      );
    }

    console.log('== NewCarItemScreen ==');

    const currency = get(this.props.navigation, 'state.params.currency');
    const brandName = get(carDetails, 'brand.name');
    const modelName = get(carDetails, 'model.name');
    let photos = [];
    let CarImgReal = false;
    if (get(carDetails, 'imgReal.thumb.0')) {
      get(carDetails, 'imgReal.thumb').forEach((element) => {
        photos.push(element + '1000x1000');
      });
      CarImgReal = true;
    } else {
      photos =
        get(carDetails, 'img.10000x220') || get(carDetails, 'img.original');
    }

    let photosThumbs = [];
    for (var i = 0; i < photos.length; i++) {
      let path = photos[i].split('/');
      path[parseInt(path.length - 1, 10)] =
        imgResize + '/' + path[parseInt(path.length - 1, 10)];
      photosThumbs.push(path.join('/'));
    }

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <ScrollView>
            <StatusBar hidden />
            <View style={{flex: 1, position: 'relative'}}>
              <View
                style={{
                  position: 'absolute',
                  height: 400,
                  width: '100%',
                  zIndex: 100,
                  marginTop: CarImgReal ? -12 : -12,
                }}>
                <ColorBox
                  ref={(input) => {
                    return (this.ColorBox = input);
                  }}
                  containerStyle={{
                    position: 'absolute',
                    right: 0,
                    top: 280,
                    zIndex: 1000,
                    padding: 20,
                  }}
                  color={get(carDetails, 'color')}
                />
                <PhotoSlider
                  height={370}
                  photos={photos}
                  resizeMode={CarImgReal ? 'cover' : null}
                  paginationStyle={{marginBottom: 35}}
                  dotColor={CarImgReal ? '#fff' : null}
                  onPressItem={this.onPressPhoto}
                  onIndexChanged={this.onChangePhotoIndex}
                />
              </View>

              <View
                style={[
                  styleConst.shadow.light,
                  {
                    position: 'relative',
                    marginTop: CarImgReal ? 335 : 335,
                    marginBottom: -5,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingTop: 20,
                    paddingBottom: 14,
                  },
                ]}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: '2%',
                  }}>
                  <View style={{marginBottom: 10, flexShrink: 1}}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      {`${brandName} ${modelName}`}
                    </Text>
                    <Text style={{fontSize: 11, fontWeight: '600'}}>
                      {get(carDetails, 'complectation.name', '') +
                        ' ' +
                        get(carDetails, 'year')}
                    </Text>
                  </View>
                  {this.renderPrice({carDetails, filterData, currency})}
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingHorizontal: '2%',
                      marginBottom: 10,
                    }}>
                    <OptionPlate
                      title="Комплектация"
                      subtitle={get(carDetails, 'complectation.name')}
                    />
                    {get(carDetails, 'engine.id') &&
                    get(carDetails, 'engine.id') !== 4 ? (
                      <OptionPlate
                        title="Двигатель"
                        subtitle={
                          get(carDetails, 'engine.volume.short') +
                          ' ' +
                          get(carDetails, 'engine.type')
                        }
                      />
                    ) : null}
                    <OptionPlate
                      title="КПП"
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
                        onPress={() => {
                          this.ColorBox.click();
                        }}
                        title="Цвет"
                        subtitle={get(
                          carDetails,
                          'color.name.simple',
                        ).toLowerCase()}
                      />
                    ) : null}
                  </View>
                </ScrollView>

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
                        {`${get(carDetails, 'city.name')}, ${get(
                          carDetails,
                          'dealer.name',
                        )}`}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>

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
                      <View>
                        {this.renderTechData('Основные', [
                          {
                            name: 'Тип кузова',
                            value: 'body.name',
                          },
                          {
                            name: 'Год выпуска',
                            value: 'year',
                          },
                        ])}
                        {this.renderTechData('Двигатель', [
                          {
                            name: 'Тип',
                            value: 'engine.type',
                          },
                          (() => {
                            if (
                              get(carDetails, 'engine.id') &&
                              get(carDetails, 'engine.id') === 4
                            ) {
                              return false;
                            }
                            return {
                              name: 'Рабочий объём',
                              value: 'engine.volume.full',
                              postfix: 'см³',
                            };
                          })(),
                          {
                            name: 'Мощность',
                            value: 'power.hp',
                            postfix: 'л.с.',
                          },
                        ])}
                        {this.renderTechData('Трансмиссия', [
                          {
                            name: 'Тип',
                            value: 'gearbox.name',
                          },
                          {
                            name: 'Количество передач',
                            value: 'gearbox.count',
                          },
                          {
                            name: 'Привод',
                            value: 'gearbox.wheel',
                          },
                        ])}
                        {this.renderTechData('Кузов', [
                          {
                            name: 'Длина',
                            value: 'body.width',
                            postfix: 'мм.',
                          },
                          {
                            name: 'Ширина',
                            value: 'body.height',
                            postfix: 'мм.',
                          },
                          {
                            name: 'Высота',
                            value: 'body.high',
                            postfix: 'мм.',
                          },
                          {
                            name: 'Клиренс',
                            value: 'body.clirens',
                            postfix: 'мм.',
                          },
                          {
                            name: 'Объём багажника',
                            value: 'body.trunk.min',
                            postfix: 'л.',
                          },
                          {
                            name: 'Объём топливного бака',
                            value: 'fuel.fuel',
                            postfix: 'л.',
                          },
                        ])}
                        {this.renderTechData(
                          'Эксплуатационные характеристики',
                          [
                            {
                              name: 'Максимальная скорость',
                              value: 'speed.max',
                              postfix: 'км/ч.',
                            },
                            {
                              name: 'Разгон с 0 до 100 км/ч',
                              value: 'speed.dispersal',
                              postfix: 'сек.',
                            },
                            {
                              name: 'Расход топлива (город)',
                              value: 'fuel.city',
                              postfix: 'л.',
                            },
                            {
                              name: 'Расход топлива (трасса)',
                              value: 'fuel.track',
                              postfix: 'л.',
                            },
                            {
                              name: 'Расход топлива (смешанный)',
                              value: 'fuel.both',
                              postfix: 'л.',
                            },
                          ],
                        )}
                      </View>
                    ),
                  },
                  {
                    title: 'Комплектация',
                    content: (
                      <View style={styles.tabContent}>
                        {stockKeys.length ? (
                          <View>
                            {stockKeys.map((key) => {
                              return this.renderComplectationItem(
                                stock[key].name,
                                stock[key].data,
                              );
                            })}
                          </View>
                        ) : null}

                        {additionalKeys.length ? (
                          <View>
                            {additionalKeys.map((key) => {
                              return this.renderComplectationItem(
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
                ]}
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
                        // height: 200,
                        backgroundColor: '#fff',
                        paddingHorizontal: '3%',
                      }}>
                      {item.content}
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
          <View style={stylesFooter.footer}>
            {this.renderPriceFooter({
              carDetails,
              filterData,
              currency,
            })}
            <Button
              onPress={this.onPressOrder}
              full
              style={[styleConst.shadow.default, stylesFooter.button]}
              activeOpacity={0.8}>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarItemScreen);

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
    zIndex: 10,
  },
  button: {
    width: '55%',
    height: 48,
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
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: styleConst.color.header,
    borderColor: styleConst.color.header,
    borderWidth: 1,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
