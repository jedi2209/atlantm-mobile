/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  Col,
  Row,
  Icon,
  Grid,
  Footer,
  Button,
  Content,
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

// helpers
import getTheme from '../../../../native-base-theme/components';
import {get, find} from 'lodash';
import PropTypes from 'prop-types';
import Amplitude from '@utils/amplitude-analytics';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import stylesFooter from '@core/components/Footer/style';
import numberWithGap from '@utils/number-with-gap';

// styles
import styles from '@catalog/usedcar/containers/UsedCarItemScreenStyles';

const imgResize = '10000x440';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    filterData: catalog.newCar.filterData,
    carDetails: catalog.newCar.carDetails.data,
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

const OptionPlate = ({title, subtitle}) => (
  <View
    style={{
      borderRadius: 10,
      backgroundColor: '#0061ED',
      paddingHorizontal: 12,
      // paddingTop: 10,
      // paddingBottom: 10,
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

class NewCarItemScreen extends Component {
  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {tabName: 'base'};
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.blueHeader,
    headerTitle: (
      <Text style={stylesHeader.blueHeaderTitle}>
        {console.log('navigation', navigation)}
        {(navigation.state.params.carDetails ? 
            navigation.state.params.carDetails.brand.name + ' ' +
            navigation.state.params.carDetails.model.name + ' ' +
            navigation.state.params.carDetails.complectation.name
        : null)}
      </Text>
    ),
    headerLeft: (
      <View>
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen="NewCarListScreen"
        />
      </View>
    ),
    headerRight: <View />,
  });

  componentDidMount() {
    const carId = get(this.props.navigation, 'state.params.carId');

    this.props.actionFetchNewCarDetails(carId);
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
    console.log('cliced me');
    const {navigation, filterData, carDetails} = this.props;
    const currency = get(this.props.navigation, 'state.params.currency');

    navigation.navigate('OrderScreen', {
      car: {
        brand: get(carDetails, 'brand.name'),
        model: carDetails.model,
        isSale: carDetails.sale === true,
        price: get(carDetails, 'price.app.standart'),
        priceSpecial: get(carDetails, 'price.app.sale'),
        complectation: get(carDetails, 'complectation.name'),
      },
      currency,
      dealerId: carDetails.dealer.id,
      carId: carDetails.id.api,
      isNewCar: true,
    });
  };

  onClosePhoto = () => this.props.actionCloseNewCarPhotoViewer();

  onPressPhoto = () => this.props.actionOpenNewCarPhotoViewer();

  onChangePhotoIndex = index =>
    this.props.actionUpdateNewCarPhotoViewerIndex(index);

  selectBaseTab = () => this.setState({tabName: 'base'});

  selectOptionsTab = () => this.setState({tabName: 'options'});

  renderDealer = dealerName => {
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

  renderItem = (title, value, postfix) => {
    return value ? (
      <Row key={`${title} ${value} ${postfix}`} style={styles.sectionRow}>
        <View style={[styles.sectionProp, {flex: 1}]}>
          <Text style={styles.sectionPropText}>{title}</Text>
        </View>
        <View style={[styles.sectionValue, {alignItems: 'flex-end'}]}>
          <Text style={styles.sectionValueText}>{`${value} ${postfix ||
            ''}`}</Text>
        </View>
      </Row>
    ) : null;
  };

  renderComplectationItem = (title, data) => {
    if (data.length === 0) {
      return null;
    }

    return (
      <View key={title} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map(item => {
          return (
            <Grid key={`${item.name} ${item.id}`}>
              {item.name && item.value ? (
                <Row style={styles.sectionRow}>
                  <Col style={styles.sectionProp}>
                    <Text style={styles.sectionPropText}>{item.name}</Text>
                  </Col>
                  <Col style={styles.sectionValue}>
                    <Text style={styles.sectionValueText}>{item.value}</Text>
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

  renderPrice = ({carDetails, filterData = {}}) => {
    const isSale = carDetails.sale === true;

    return (
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            lineHeight: isSale ? 14 : 20,
            color: isSale ? '#D0021B' : '#000',
            textDecorationLine: isSale ? 'line-through' : 'none',
          }}>
          {/* TODO: RUB */}
          {`${numberWithGap(get(carDetails, 'price.app.standart'))} RUB`}
        </Text>
        {isSale && (
          <Text style={{fontSize: 14, fontWeight: '600'}}>
            {numberWithGap(get(carDetails, 'price.app.sale'))}
          </Text>
        )}
      </View>
    );
  };

  renderPriceFooter = ({carDetails, filterData, currency}) => {
    const isSale = carDetails.sale === true;

    const priceDefault = numberWithGap(get(carDetails, 'price.app.standart'));
    const priceSpecial = numberWithGap(get(carDetails, 'price.app.sale'));

    return (
      <View
        style={[
          stylesFooter.orderPriceContainer,
          !isSale ? stylesFooter.orderPriceContainerNotSale : null,
        ]}>
        {isSale ? (
          <Text style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
            {`${priceSpecial} ${currency}`}
          </Text>
        ) : null}
        <Text
          style={[
            styles.orderPriceText,
            !isSale ? styles.orderPriceDefaultText : styles.orderPriceSmallText,
          ]}>
          {`${priceDefault} ${currency}`}
        </Text>
      </View>
    );
  };

  onPressMap = () => {
    const {navigation, carDetails} = this.props;
    navigation.navigate('MapScreen', {
      name: get(carDetails, 'dealer.name'),
      city: get(carDetails, 'city.name'),
      address: get(carDetails, 'dealer.name'),
      coords: get(carDetails, 'coords'),
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
    const {brand, model, complectation} = carDetails;
    const brandName = brand.name || '';
    const modelName = model.name || '';
    const photos =
      get(carDetails, 'img.original') || get(carDetails, 'img.10000x220');

    let photosThumbs = [];
    for (var i = 0; i < photos.length; i++) {
      let path = photos[i].split('/');
      path[parseInt(path.length - 1, 10)] =
        imgResize + '/' + path[parseInt(path.length - 1, 10)];
      photosThumbs.push(path.join('/'));
    }
    if (!this.logGuard) {
      Amplitude.logEvent('screen', 'catalog/newcar/item', {
        id_api: get(carDetails, 'id.api'),
        id_sap: get(carDetails, 'id.sap'),
        brand_name: brandName,
        model_name: modelName,
      });

      this.logGuard = true;
    }

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <View>
              <PhotoSlider
                photos={photos}
                onPressItem={this.onPressPhoto}
                onIndexChanged={this.onChangePhotoIndex}
              />
            </View>

            <View
              style={{
                position: 'relative',
                top: -30,
                marginBottom: -30,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingTop: 20,
                paddingBottom: 14,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                }}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: '600'}}>
                    {`${brandName} ${modelName}`}
                  </Text>
                  <Text style={{fontSize: 11, fontWeight: '600'}}>
                    {get(complectation, 'name', '') +
                      ' ' +
                      get(carDetails, 'year')}
                  </Text>
                  <Text />
                </View>
                {this.renderPrice({carDetails, filterData})}
              </View>

              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    marginBottom: 24,
                  }}>
                  <OptionPlate
                    title="Комплектация"
                    subtitle={get(carDetails, 'complectation.name')}
                  />
                  <OptionPlate
                    title="Двигатель"
                    subtitle={
                      get(carDetails, 'engine.volume.short') +
                      ' ' +
                      get(carDetails, 'engine.type')
                    }
                  />
                  <OptionPlate
                    title="КПП"
                    subtitle={`${get(carDetails, 'gearbox.count')}-ст. ${
                      get(carDetails, 'gearbox.name')
                        .replace(/^(Механическая)/i, 'МКПП')
                        .replace(/^(Автоматическая)/i, 'АКПП')
                        .split('/')[0]
                    }`}
                  />
                  <OptionPlate
                    title="Привод"
                    subtitle={get(carDetails, 'gearbox.wheel').toLowerCase()}
                  />
                  <OptionPlate
                    title="Цвет"
                    subtitle={get(
                      carDetails,
                      'color.name.simple',
                    ).toLowerCase()}
                  />
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
                    <Text style={styles.mapCardDealer}>
                      {`${get(carDetails, 'city.name')}, ${get(
                        carDetails,
                        'dealer.name',
                      )}`}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View
              style={{
                borderBottomColor: '#d5d5e0',
                borderBottomWidth: 1,
              }}>
              <Accordion
                dataArray={[
                  {
                    title: 'Характеристики',
                    content: (
                      <Grid>
                        {this.renderItem(
                          'Максимальная скорость:',
                          get(carDetails, 'engine.speedmax'),
                          'км/ч.',
                        )}
                        {this.renderItem(
                          'Разгон с 0 до 100 км/ч:',
                          get(carDetails, 'engine.speed100'),
                          'сек.',
                        )}
                        {this.renderItem(
                          'Расход топлива (городской цикл):',
                          get(carDetails, 'fuel.city'),
                          'л.',
                        )}
                        {this.renderItem(
                          'Расход топлива (загородный цикл):',
                          get(carDetails, 'fuel.track'),
                          'л.',
                        )}
                        {this.renderItem(
                          'Расход топлива (смешанный цикл):',
                          get(carDetails, 'fuel.both'),
                          'л.',
                        )}
                      </Grid>
                    ),
                  },
                  {
                    title: 'Комплектация',
                    content: (
                      <Grid>
                        {this.renderItem(
                          'Длина:',
                          get(carDetails, 'body.width'),
                          'мм.',
                        )}
                        {this.renderItem(
                          'Ширина:',
                          get(carDetails, 'body.height'),
                          'мм.',
                        )}
                        {this.renderItem(
                          'Высота:',
                          get(carDetails, 'body.high'),
                          'мм.',
                        )}
                        {this.renderItem(
                          'Клиренс:',
                          get(carDetails, 'body.clirens'),
                          'мм.',
                        )}
                        {this.renderItem(
                          'Объём багажника:',
                          get(carDetails, 'body.trunk.min'),
                          'л.',
                        )}
                        {this.renderItem(
                          'Объём топливного бака:',
                          get(carDetails, 'fuel.fuel'),
                          'л.',
                        )}
                      </Grid>
                    ),
                  },
                ]}
                expanded={0}
                animation={true}
                renderHeader={(item, expanded) => (
                  <View
                    style={{
                      height: 64,
                      paddingHorizontal: 16,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      borderTopWidth: 1,
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
                        height: 200,
                        backgroundColor: '#fff',
                        paddingHorizontal: 16,
                      }}>
                      {item.content}
                    </View>
                  );
                }}
              />
            </View>
          </Content>
          {photoViewerItems.length ? (
            <PhotoViewer
              index={photoViewerIndex}
              visible={photoViewerVisible}
              items={photoViewerItems}
              onChange={this.onChangePhotoIndex}
              onPressClose={this.onClosePhoto}
            />
          ) : null}
          <Footer style={stylesFooter.footer}>
            {this.renderPriceFooter({
              carDetails,
              filterData,
              currency,
            })}
            <Button
              onPress={this.onPressOrder}
              full
              style={stylesFooter.button}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>ХОЧУ ЭТО АВТО!</Text>
            </Button>
          </Footer>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarItemScreen);
