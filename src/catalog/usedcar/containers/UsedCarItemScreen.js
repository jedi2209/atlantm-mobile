import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {
  Col,
  Row,
  Icon,
  Grid,
  Footer,
  Button,
  Content,
  Segment,
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
} from '@catalog/actions';

// components
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '@core/components/PhotoSlider';
import PhotoViewer from '@core/components/PhotoViewer';

// helpers
import {get, find} from 'lodash';
import PropTypes from 'prop-types';
import Amplitude from '@utils/amplitude-analytics';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import numberWithGap from '@utils/number-with-gap';
import getTheme from '../../../../native-base-theme/components';
import showPrice from '@utils/price';

// styles
import styles from './UsedCarItemScreenStyles';
import stylesFooter from '@core/components/Footer/style';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
    prices: catalog.usedCar.prices,
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

class UserCarItemScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text style={stylesHeader.blueHeaderTitle}>
        {console.log('navigation', navigation)}
        {navigation.state.params.carDetails
          ? navigation.state.params.carDetails.brand.name +
            ' ' +
            navigation.state.params.carDetails.model.name
          : null}
      </Text>
    ),
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
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
    const {navigation, prices, carDetails} = this.props;
    navigation.navigate('OrderScreen', {
      car: {
        brand: carDetails.brand.name,
        model: carDetails.model,
        price: get(carDetails, 'price.app.standart'),
      },
      currency: prices.curr.name,
      dealerId: get(carDetails, 'dealer.id'),
      carId: carDetails.id.api,
    });
  };

  onClosePhoto = () => this.props.actionCloseUsedCarPhotoViewer();

  onPressPhoto = () => this.props.actionOpenUsedCarPhotoViewer();

  onChangePhotoIndex = index =>
    this.props.actionUpdateUsedCarPhotoViewerIndex(index);

  selectBaseTab = () => this.setState({tabName: 'base'});

  selectOptionsTab = () => this.setState({tabName: 'options'});

  renderPrice = ({carDetails, currency}) => {
    const price = showPrice(get(carDetails, 'price.app.standart'), 'BYN');

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
            textDecorationLine: 'none',
          }}>
          {`${price}`}
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
      prices,
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
        <SafeAreaView style={styles.spinnerContainer}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        </SafeAreaView>
      );
    }

    console.log('== UsedCarItemScreen ==');

    if (!this.logGuard) {
      Amplitude.logEvent('screen', 'catalog/usedcar/item', {
        id_api: get(carDetails, 'id.api'),
        id_sap: get(carDetails, 'id.sap'),
        brand_name: get(carDetails, 'brand.name'),
        model_name: get(carDetails, 'model.name'),
      });

      this.logGuard = true;
    }

    const photos = get(carDetails, 'img.original');
    const brandName = get(carDetails, 'brand.name');
    const modelName = get(carDetails, 'model.name');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="light-content" />
          <Content>
            <View style={styles.gallery}>
              <PhotoSlider
                photos={photos}
                onPressItem={this.onPressPhoto}
                onIndexChanged={this.onChangePhotoIndex}
              />
              <View
                style={{
                  position: 'relative',
                  top: -40,
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
                  <View style={{marginBottom: 10, flexShrink: 1}}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      {`${brandName} ${modelName}`}
                    </Text>
                    <Text style={{fontSize: 11, fontWeight: '600'}}>
                      {get(carDetails, 'year')}
                    </Text>
                  </View>
                  {this.renderPrice({carDetails}, 'BYN')}
                </View>
              </View>

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
                        {`${get(carDetails, 'city.name')}, ${get(
                          carDetails,
                          'dealer.name',
                        )}`}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : null}

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
                        <View style={styles.tabContent}>
                          <View style={styles.section}>
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
                                    <Text style={styles.sectionValueText}>{`${
                                      carDetails.year
                                    } г.`}</Text>
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
                                    <Text style={styles.sectionValueText}>{`${
                                      carDetails.engine.volume.full
                                    } см³`}</Text>
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
                        </View>
                      ),
                    },
                    {
                      title: 'Комплектация',
                      content: (
                        <View style={styles.tabContent}>
                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                              {get(carDetails, 'options.additional.1.name')}
                            </Text>
                            {get(
                              carDetails,
                              'options.additional.1.data',
                              [],
                            ).map(item => {
                              return (
                                <Grid key={item.id}>
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
                          // height: 200,
                          backgroundColor: '#fff',
                          paddingHorizontal: 16,
                        }}>
                        {item.content}
                      </View>
                    );
                  }}
                />
                {carDetails.text ? (
                  <View style={styles.descrContainer}>
                    <Text style={styles.descr}>{carDetails.text}</Text>
                  </View>
                ) : null}
              </View>
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
            <View
              style={[
                stylesFooter.orderPriceContainer,
                stylesFooter.orderPriceContainerNotSale,
              ]}>
              <Text
                style={[
                  styles.orderPriceText,
                  styles.orderPriceDefaultText,
                ]}>{`${numberWithGap(get(carDetails, 'price.app.standart'))} ${
                prices.curr.name
              }`}</Text>
            </View>
            <Button
              onPress={this.onPressOrder}
              full
              style={stylesFooter.button}>
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
)(UserCarItemScreen);
