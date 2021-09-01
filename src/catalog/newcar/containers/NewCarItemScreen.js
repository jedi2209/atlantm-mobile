/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  Col,
  Row,
  Icon,
  Grid,
  Button,
  Accordion,
} from 'native-base';
import * as NavigationService from '../../../navigation/NavigationService';

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
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    carDetails: catalog.newCar.carDetails.data,
    profile,
    isFetchingCarDetails: catalog.newCar.meta.isFetchingCarDetails,
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

class NewCarItemScreen extends PureComponent {
  static propTypes = {
    dealerSelected: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabName: 'base',
    };
    this.platesScrollView = React.createRef();
    this.colorbox = React.createRef();
  }

  componentDidMount() {
    const carId = get(this.props.route, 'params.carId');

    this.props.actionFetchNewCarDetails(carId).then(res => {
      if (res && res.type && res.payload) {
        switch (res.type) {
          case 'NEW_CAR_DETAILS__SUCCESS':
            const carDetails = res.payload;
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
      }
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

  onScroll = event => {
    const {navigation, route} = this.props;
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);

    if (dif < 0) {
      navigation.setParams({showTabBar: true}) ||
        NavigationService.dispatch({showTabBar: true});
    } else {
      navigation.setParams({showTabBar: false}) ||
        NavigationService.dispatch({showTabBar: false});
    }
    this.offset = currentOffset;
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
                region: this.props.dealerSelected.region,
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
        region: this.props.dealerSelected.region,
        carId: carDetails.id.api,
        isNewCar: true,
      });
    }
  };

  onPressTestDrive = () => {
    const {navigation, carDetails} = this.props;

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
      region: this.props.dealerSelected.region,
      carId: carDetails.id.api,
      testDriveCars: carDetails.testDriveCars,
      isNewCar: true,
    });
  };

  // renderDealer = (dealerName) => {
  //   return dealerName ? (
  //     <TouchableHighlight
  //       onPress={this.onPressDealer}
  //       underlayColor={styleConst.color.select}>
  //       <Grid style={styles.section}>
  //         <Col>
  //           <Text style={styles.sectionTitle}>Где</Text>
  //         </Col>
  //         <Col>
  //           <View style={styles.dealerContainer}>
  //             <Text style={styles.sectionTitleValue}>{dealerName}</Text>
  //             <Icon name="arrow-forward" style={styles.iconArrow} />
  //           </View>
  //         </Col>
  //       </Grid>
  //     </TouchableHighlight>
  //   ) : null;
  // };

  renderTechData = (title, data) => {
    const {carDetails} = this.props;
    if (typeof data === 'object' && data.length) {
      let resRaw = data.map(element => {
        let name = '';
        if (element.alternate) {
          name = element.alternate;
        } else {
          name = get(carDetails, element.value, null);
        }
        return this.renderItem(element.name + ':', name, element.postfix);
      });
      let res = resRaw.filter(el => {
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

    // return data ? (
    //   <View style={styles.sectionOptions}>
    //     <Text
    //       style={styles.sectionTitle}
    //       ellipsizeMode="tail"
    //       numberOfLines={1}>
    //       {title}
    //     </Text>
    //     <Grid>
    //       {data.map((element) => {
    //         return this.renderItem(
    //           element.name + ':',
    //           get(carDetails, element.value, element.value),
    //           element.postfix,
    //         );
    //       })}
    //     </Grid>
    //   </View>
    // ) : null;
  };

  renderItem = (title, value, postfix) => {
    const key = md5(title + value + postfix);
    return value ? (
      <Row key={key} style={styles.sectionRow}>
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
      </Row>
    ) : null;
  };

  renderComplectationItem = (title, data) => {
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
            <Grid key={key}>
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

  renderPrice = ({carDetails, currency}) => {
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

  renderPriceFooter = ({carDetails, currency}) => {
    const isSale = carDetails.sale === true;

    const CarPrices = {
      sale: get(carDetails, 'price.app.sale') || 0,
      standart:
        get(carDetails, 'price.app.standart') || get(carDetails, 'price.app'),
    };

    if (CarPrices.standart.standart == 0) {
      return <View style={stylesFooter.orderPriceContainer}></View>;
    }

    return (
      <View
        style={[
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
    const {carDetails, photoViewerItems, isFetchingCarDetails, route} = this.props;

    const badge = get(carDetails, 'badge', []);

    const stock = get(carDetails, 'options.stock', {});
    const stockKeys = Object.keys(stock);
    const additional = get(carDetails, 'options.additional', {});
    const additionalKeys = Object.keys(additional);

    if (!carDetails || isFetchingCarDetails) {
      return (
        <Container style={styles.spinnerContainer}>
          <Content>
            <ActivityIndicator
              color={styleConst.color.blue}
              style={styleConst.spinner}
            />
          </Content>
        </Container>
      );
    }

    console.info('== NewCarItemScreen ==');
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

    let photos = [];
    let isCarImgReal = false;
    if (get(carDetails, 'imgReal.thumb.0')) {
      // 105
      isCarImgReal = true;
      get(carDetails, 'imgReal.thumb').forEach(element => {
        photos.push(element + '1000x1000');
      });
    } else {
      get(carDetails, 'img.thumb').forEach(element => {
        photos.push(element + '1000x440');
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

    return (
      <>
        <Container testID="NewCarItemScreen.Wrapper">
          <Content>
            <StatusBar hidden />
            <View>
              {get(carDetails, 'color.picker.codes.hex', null) ? (
                <ColorBox
                  containerStyle={styles.colorboxContainer}
                  color={get(carDetails, 'color')}
                />
              ) : null}
              {badge && badge.length ? (
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
                </View>
              ) : null}
              <PhotoSlider
                height={290}
                photos={photosData}
                resizeMode={isCarImgReal ? 'cover' : 'contain'}
                dotColor={!isCarImgReal ? styleConst.color.black : null}
              />
            </View>
            <View style={[styleConst.shadow.default, styles.carTopWrapper]}>
              <View>
                <View style={styles.modelBrandView}>
                  <View style={{marginBottom: 10, flexShrink: 1}}>
                    <Text style={styles.modelBrandText}>
                      {[brandName, modelName, generationName].join(' ')}
                    </Text>
                    <Text style={styles.complectationText}>
                      {[
                        get(carDetails, 'complectation.name', ''),
                        get(carDetails, 'year'),
                      ].join(', ')}
                    </Text>
                  </View>
                  {/* {generationName ? (
                    <Text style={styles.modelBrandText}>{generationName}</Text>
                  ) : null} */}
                  {this.renderPrice({carDetails, currency})}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={true}
                  testID="NewCarItemScreen.PlatesWrapper"
                  ref={ref => {
                    this.platesScrollView = ref;
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingHorizontal: '2%',
                      marginBottom: 10,
                    }}>
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
                  </View>
                </ScrollView>
                {get(carDetails, 'location.coords') ? (
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
                          {[
                            get(carDetails, 'location.city.name'),
                            get(carDetails, 'location.name'),
                          ].join(', ')}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
              <Accordion
                style={styles.accordion}
                dataArray={[
                  {
                    title: strings.NewCarItemScreen.tech.title,
                    content: (
                      <View testID="NewCarItemScreen.TechWrapper">
                        {this.renderTechData(
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
                        )}
                        {this.renderTechData(
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
                                name: strings.NewCarItemScreen.tech.engine
                                  .volume,
                                value: 'engine.volume.full',
                                postfix: 'см³',
                              };
                            })(),
                            {
                              name: strings.NewCarItemScreen.tech.engine.power
                                .hp,
                              value: 'power.hp',
                              postfix: strings.NewCarItemScreen.shortUnits.hp,
                            },
                          ],
                        )}
                        {this.renderTechData(
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
                        )}
                        {this.renderTechData(
                          strings.NewCarItemScreen.tech.body.title,
                          [
                            {
                              name: strings.NewCarItemScreen.tech.body.width,
                              value: 'body.width',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.milimetrs,
                            },
                            {
                              name: strings.NewCarItemScreen.tech.body.height,
                              value: 'body.height',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.milimetrs,
                            },
                            {
                              name: strings.NewCarItemScreen.tech.body.high,
                              value: 'body.high',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.milimetrs,
                            },
                            {
                              name: strings.NewCarItemScreen.tech.body.clirens,
                              value: 'body.clirens',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.milimetrs,
                            },
                            {
                              name: strings.NewCarItemScreen.tech.body.trunk,
                              value: 'body.trunk.min',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.litres,
                            },
                            {
                              name: strings.NewCarItemScreen.tech.body.fuel,
                              value: 'fuel.fuel',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.litres,
                            },
                          ],
                        )}
                        {this.renderTechData(
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
                              postfix:
                                strings.NewCarItemScreen.shortUnits.litres,
                            },
                            {
                              name: strings.NewCarItemScreen.techData.fuel
                                .track,
                              value: 'fuel.track',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.litres,
                            },
                            {
                              name: strings.NewCarItemScreen.techData.fuel.both,
                              value: 'fuel.both',
                              postfix:
                                strings.NewCarItemScreen.shortUnits.litres,
                            },
                          ],
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
                              return this.renderComplectationItem(
                                stock[key].name,
                                stock[key].data,
                              );
                            })}
                          </View>
                        ) : null}

                        {additionalKeys.length ? (
                          <View>
                            {additionalKeys.map(key => {
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
                expanded={[0]}
                animation={true}
                renderHeader={(item, expanded) => (
                  <View
                    testID={'NewCarItemScreen.AccordionTitle_' + item.title}
                    style={styles.accordionHeader}>
                    <Text style={styles.accordionHeaderTitle}>
                      {item.title}
                    </Text>
                    {expanded ? (
                      <Icon
                        type="FontAwesome5"
                        style={{
                          color: styleConst.color.greyText4,
                          fontWeight: 'normal',
                        }}
                        name="angle-down"
                      />
                    ) : (
                      <Icon
                        type="FontAwesome5"
                        style={{
                          color: styleConst.color.greyText,
                          fontWeight: 'normal',
                        }}
                        name="angle-right"
                      />
                    )}
                  </View>
                )}
                renderContent={item => {
                  return (
                    <View style={styles.accordionContent}>{item.content}</View>
                  );
                }}
              />
            </View>
          </Content>
        </Container>
        <View style={[styleConst.shadow.default, stylesFooter.footer]}>
          {this.renderPriceFooter({
            carDetails,
            currency,
          })}
          <View style={[stylesFooter.footerButtons]}>
            {/* {carDetails.testDriveCars &&
            carDetails.testDriveCars.length > 0 ? ( */}
            <Button
              testID="NewCarItemScreen.Button.TestDrive"
              onPress={this.onPressTestDrive}
              full
              iconLeft
              style={[stylesFooter.button, stylesFooter.buttonLeft]}
              activeOpacity={0.8}>
              <Icon
                type="MaterialCommunityIcons"
                name="steering"
                selectable={false}
                style={{
                  color: styleConst.color.white,
                  fontSize: 24,
                  marginTop: -2,
                }}
              />
              <Text style={styles.buttonText} selectable={false}>
                {strings.NewCarItemScreen.testDrive}
              </Text>
            </Button>
            {/* ) : null} */}
            <Button
              testID="NewCarItemScreen.Button.Order"
              onPress={this.onPressOrder}
              full
              style={[
                stylesFooter.button,
                stylesFooter.buttonRight,
                // !carDetails.testDriveCars ||
                // carDetails.testDriveCars.length === 0
                //   ? stylesFooter.buttonOnlyOne
                //   : null,
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarItemScreen);

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
    flexDirection: 'column',
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
