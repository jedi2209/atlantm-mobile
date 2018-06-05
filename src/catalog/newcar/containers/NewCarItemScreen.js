import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableHighlight,
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
} from 'native-base';

// redux
import { connect } from 'react-redux';
import {
  actionFetchNewCarDetails,
  actionOpenPhotoViewer,
  actionClosePhotoViewer,
  actionUpdatePhotoViewerIndex,
} from '@catalog/actions';

// components
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '@core/components/PhotoSlider';
import PhotoViewer from '@core/components/PhotoViewer';

// helpers
import getTheme from '../../../../native-base-theme/components';
import { get, find } from 'lodash';
import PropTypes from 'prop-types';
import Amplitude from '@utils/amplitude-analytics';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import numberWithGap from '@utils/number-with-gap';

// styles
import styles from '@catalog/usedcar/containers/UsedCarItemScreenStyles';

const mapStateToProps = ({ catalog, dealer, nav }) => {
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
  actionOpenPhotoViewer,
  actionClosePhotoViewer,
  actionUpdatePhotoViewerIndex,
};

class NewCarItemScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Новые автомобили',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = { tabName: 'base' };
  }

  componentDidMount() {
    const carId = get(this.props.navigation, 'state.params.carId');
    this.props.actionFetchNewCarDetails(carId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { dealerSelected, carDetails, isFetchingCarDetails, photoViewerVisible, photoViewerItems } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'NewCarItemScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (this.state.tabName !== nextState.tabName) ||
      (photoViewerItems.length !== nextProps.photoViewerItems.length) ||
      (photoViewerVisible !== nextProps.photoViewerVisible) ||
      (isFetchingCarDetails !== nextProps.isFetchingCarDetails) ||
      (get(carDetails, 'id.api') !== get(nextProps, 'carDetails.id.api'));
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
    const dealerBaseData = find(list, { id: carDetails.dealer.id });

    navigation.navigate('AboutDealerScreen', { dealerBaseData });
  }

  onPressOrder = () => {
    const { navigation, filterData, carDetails } = this.props;

    navigation.navigate('OrderScreen', {
      car: {
        brand: get(carDetails, 'brand.name'),
        model: carDetails.model,
        isSale: carDetails.sale === true,
        price: get(carDetails, 'price.app.standart'),
        priceSpecial: get(carDetails, 'price.app.sale'),
        complectation: get(carDetails, 'complectation.name'),
      },
      currency: filterData.prices.curr.name,
      dealerId: carDetails.dealer.id,
      carId: carDetails.id.api,
      isNewCar: true,
    });
  }

  onClosePhoto = () => this.props.actionClosePhotoViewer()

  onPressPhoto = () => this.props.actionOpenPhotoViewer()

  onChangePhotoIndex = index => this.props.actionUpdatePhotoViewerIndex(index)

  selectBaseTab = () => this.setState({ tabName: 'base' })

  selectOptionsTab = () => this.setState({ tabName: 'options' })

  renderDealer = (dealerName) => {
    return (
      dealerName ?
        (
          <TouchableHighlight
            onPress={this.onPressDealer}
            underlayColor={styleConst.color.select}
          >
            <Grid style={styles.section}>
              <Col><Text style={styles.sectionTitle}>Где</Text></Col>
              <Col>
                <View style={styles.dealerContainer} >
                  <Text style={styles.sectionTitleValue}>{dealerName}</Text>
                  <Icon name="arrow-forward" style={styles.iconArrow} />
                </View>
              </Col>
            </Grid>
          </TouchableHighlight>
        ) :
        null
    );
  }

  renderItem = (title, value, postfix) => {
    return (
      value ?
        (
          <Row key={`${title} ${value} ${postfix}`} style={styles.sectionRow}>
            <Col style={styles.sectionProp}>
              <Text style={styles.sectionPropText}>{title}</Text>
            </Col>
            <Col style={styles.sectionValue}>
              <Text style={styles.sectionValueText}>{`${value} ${postfix || ''}`}</Text>
            </Col>
          </Row>
        ) : null
    );
  }

  renderComplectationItem = (title, data) => {
    if (data.length === 0) return null;

    return (
      <View key={title} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {
          data.map(item => {
            return (
              <Grid key={`${item.name} ${item.id}`}>
                {
                  item.name && item.value ?
                    (
                      <Row style={styles.sectionRow}>
                        <Col style={styles.sectionProp}>
                          <Text style={styles.sectionPropText}>{item.name}</Text>
                        </Col>
                        <Col style={styles.sectionValue}>
                          <Text style={styles.sectionValueText}>{item.value}</Text>
                        </Col>
                      </Row>
                    ) :
                    (
                      <Text style={[styles.sectionPropText, styles.sectionRow]}>{item.name}</Text>
                    )
                }
              </Grid>
            );
          })
        }
      </View>
    );
  }

  renderPrice = ({ carDetails, filterData }) => {
    const isSale = carDetails.sale === true;
    const currency = get(filterData, 'prices.curr.name');
    const priceDefault = numberWithGap(get(carDetails, 'price.app.standart'));
    const priceSpecial = numberWithGap(get(carDetails, 'price.app.sale'));

    return (
      <View style={styles.orderPriceContainer}>
        {
          isSale ?
            <Text style={[styles.orderPriceText, styles.orderPriceSpecialText]}>
              {`${priceSpecial} ${currency}`}
            </Text> :
            null
        }
        <Text style={[styles.orderPriceText, isSale ? styles.orderPriceDefaultText : '']}>
          {`${priceDefault} ${currency}`}
        </Text>
      </View>
    );
  }

  render() {
    const { tabName } = this.state;
    const isActiveBaseTab = tabName === 'base';
    const isActiveOptionsTab = tabName === 'options';

    const {
      filterData,
      carDetails,
      photoViewerIndex,
      photoViewerItems,
      photoViewerVisible,
      isFetchingCarDetails,
    } = this.props;

    if (!carDetails || isFetchingCarDetails) {
      return (
        <View style={styles.spinnerContainer} >
          <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
        </View>
      );
    }

    console.log('== NewCarItemScreen ==');

    const { brand, model, complectation } = carDetails;
    const brandName = brand.name || '';
    const modelName = model.name || '';
    const stock = get(carDetails, 'options.stock', {});
    const stockKeys = Object.keys(stock);
    const additional = get(carDetails, 'options.additional', {});
    const additionalKeys = Object.keys(additional);
    const photos = get(carDetails, 'img.10000x300') || get(carDetails, 'foto.10000x300');

    Amplitude.logEvent('screen', 'catalog/newcar/item', {
      id_api: get(carDetails, 'id.api'),
      id_sap: get(carDetails, 'id.sap'),
      brand_name: brandName,
      model_name: modelName,
    });

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>

            <View style={styles.gallery}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{`${brandName} ${modelName} ${get(complectation, 'name', '')}`}</Text>
              </View>
              <PhotoSlider
                photos={photos}
                onPressItem={this.onPressPhoto}
                onIndexChanged={this.onChangePhotoIndex}
              />
            </View>

            <Segment style={styles.segment}>
              <Button
                first
                active={isActiveBaseTab}
                onPress={this.selectBaseTab}
                style={isActiveBaseTab ? styles.tabButtonActive : styles.tabButton}
              >
                <Text style={isActiveBaseTab ? styles.tabTextActive : styles.tabText}>Характеристики</Text>
              </Button>
              <Button
                last
                active={isActiveOptionsTab}
                onPress={this.selectOptionsTab}
                style={isActiveOptionsTab ? styles.tabButtonActive : styles.tabButton}
              >
                <Text style={isActiveOptionsTab ? styles.tabTextActive : styles.tabText}>Комплектация</Text>
              </Button>
            </Segment>

            {
              isActiveBaseTab ?
                (
                  <View style={styles.tabContent}>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Основные</Text>
                      <Grid>
                        {this.renderItem('Цвет:', get(carDetails, 'color.name.official'))}
                        {this.renderItem('Тип кузова:', get(carDetails, 'body.name'))}
                        {this.renderItem('Год выпуска:', get(carDetails, 'year'), 'г.')}
                      </Grid>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Двигатель</Text>
                      <Grid>
                        {this.renderItem('Тип:', get(carDetails, 'engine.type'))}
                        {this.renderItem('Рабочий объём:', get(carDetails, 'engine.volume.full'), 'см³')}
                        {this.renderItem('Мощность:', get(carDetails, 'power.hp'), 'л.с.')}
                      </Grid>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Трансмиссия</Text>
                      <Grid>
                        {this.renderItem('Тип:', get(carDetails, 'gearbox.name'))}
                        {this.renderItem('Количество передач:', get(carDetails, 'gearbox.count'))}
                        {this.renderItem('Привод:', get(carDetails, 'gearbox.wheel'))}
                      </Grid>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Кузов</Text>
                      <Grid>
                        {this.renderItem('Длина:', get(carDetails, 'body.high'), 'мм.')}
                        {this.renderItem('Ширина:', get(carDetails, 'body.width'), 'мм.')}
                        {this.renderItem('Высота:', get(carDetails, 'body.height'), 'мм.')}
                        {this.renderItem('Клиренс:', get(carDetails, 'body.clirens'), 'мм.')}
                        {this.renderItem('Объём багажника:', get(carDetails, 'body.trunk.min'), 'л.')}
                        {this.renderItem('Объём топливного бака:', get(carDetails, 'fuel.fuel'), 'л.')}
                      </Grid>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Эксплуатационные характеристики</Text>
                      <Grid>
                        {this.renderItem('Максимальная скорость:', get(carDetails, 'speed.max'), 'км/ч.')}
                        {this.renderItem('Разгон с 0 до 100 км/ч:', get(carDetails, 'speed.dispersal'), 'сек.')}
                        {this.renderItem('Расход топлива (городской цикл):', get(carDetails, 'fuel.city'), 'л.')}
                        {this.renderItem('Расход топлива (загородный цикл):', get(carDetails, 'fuel.track'), 'л.')}
                        {this.renderItem('Расход топлива (смешанный цикл):', get(carDetails, 'fuel.both'), 'л.')}
                      </Grid>
                    </View>

                    {this.renderDealer(get(carDetails, 'dealer.name'))}
                  </View>
                ) :
                (
                  <View style={styles.tabContent}>
                    {
                      stockKeys ?
                        (
                          <View>
                            {
                              stockKeys.map(key => {
                                const item = stock[key];

                                return this.renderComplectationItem(item.name, item.data);
                              })
                            }
                          </View>
                        ) : null
                    }

                    {
                      additionalKeys ?
                      (
                        <View>
                          {
                            additionalKeys.map(key => {
                              const item = additional[key];

                              return this.renderComplectationItem(item.name, item.data);
                            })
                          }
                        </View>
                      ) : null
                    }

                    {
                      carDetails.text ?
                        (
                          <View style={styles.descrContainer}>
                            <Text style={styles.descr}>{carDetails.text}</Text>
                          </View>
                        ) :
                        null
                    }
                  </View>
                )
            }
          </Content>

          <Footer style={styles.footer}>
            {this.renderPrice({ carDetails, filterData })}
            <Button
              onPress={this.onPressOrder}
              full
              style={styles.button}
            >
              <Text style={styles.buttonText}>ХОЧУ ЭТО АВТО!</Text>
            </Button>
          </Footer>
          {
            photoViewerItems.length ?
              <PhotoViewer
                index={photoViewerIndex}
                visible={photoViewerVisible}
                items={photoViewerItems}
                onChange={this.onChangePhotoIndex}
                onPressClose={this.onClosePhoto}
              /> : null
          }
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarItemScreen);
