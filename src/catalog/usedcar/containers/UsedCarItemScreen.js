import React, { Component } from 'react';
import {
  View,
  Text,
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
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchUsedCarDetails } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '../../../core/components/PhotoSlider';

// helpers
import PropTypes from 'prop-types';
import { get, find } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import priceSet from '../../../utils/price-set';

// styles
import styles from './UsedCarItemScreenStyles';

const mapStateToProps = ({ catalog, dealer, nav }) => {
  return {
    nav,
    prices: catalog.usedCar.prices,
    dealerSelected: dealer.selected,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    carDetails: catalog.usedCar.carDetails,
    isFetchingCarDetails: catalog.usedCar.meta.isFetchingCarDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchUsedCarDetails,
  }, dispatch);
};

class UserCarItemScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Автомобили с пробегом',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
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
    this.props.actionFetchUsedCarDetails(carId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { dealerSelected, carDetails, isFetchingCarDetails } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'UserCarItemScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (this.state.tabName !== nextState.tabName) ||
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
    const { navigation, prices, carDetails } = this.props;

    navigation.navigate('OrderScreen', {
      car: {
        brand: carDetails.brand.name,
        model: carDetails.model,
        price: carDetails.price.app,
      },
      currency: prices.curr.name,
      dealerId: carDetails.dealer.id,
      carId: carDetails.id.api,
    });
  }

  selectBaseTab = () => this.setState({ tabName: 'base' })

  selectOptionsTab = () => this.setState({ tabName: 'options' })

  render() {
    const { tabName } = this.state;
    const isActiveBaseTab = tabName === 'base';
    const isActiveOptionsTab = tabName === 'options';

    const { prices, carDetails, isFetchingCarDetails } = this.props;

    if (!carDetails || isFetchingCarDetails) {
      return (
        <View style={styles.spinnerContainer} >
          <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
        </View>
      );
    }

    // console.log('car', car);

    console.log('== UsedCarItemScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

            <View style={styles.gallery}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{`${carDetails.brand.name} ${carDetails.model}`}</Text>
              </View>
              <PhotoSlider photos={carDetails.img['10000x300']} />
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
              tabName === 'base' ?
                (
                  <View style={styles.tabContent}>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Основные</Text>
                      <Grid>
                        {
                          carDetails.year &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Год выпуска:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{`${carDetails.year} г.`}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.mileage &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Пробег:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{`${priceSet(carDetails.mileage)} км.`}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.engine && carDetails.engine.type &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Топливо:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{carDetails.engine.type}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.engine && carDetails.engine.volume && carDetails.engine.volume.short &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Двигатель:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{`${carDetails.engine.volume.short} л.`}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.gearbox && carDetails.gearbox.name &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>КПП:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{carDetails.gearbox.name}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.color && carDetails.color.name && carDetails.color.name.simple &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Цвет:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{carDetails.color.name.simple}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          carDetails.body && carDetails.body.name &&
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Тип кузова:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{carDetails.body.name}</Text>
                                </Col>
                              </Row>
                            )
                        }
                        {
                          (carDetails.interior && carDetails.interior.name) ?
                            (
                              <Row style={styles.sectionRow}>
                                <Col style={styles.sectionProp}>
                                  <Text style={styles.sectionPropText}>Салон:</Text>
                                </Col>
                                <Col style={styles.sectionValue}>
                                  <Text style={styles.sectionValueText}>{carDetails.interior.name}</Text>
                                </Col>
                              </Row>
                            ) : null
                        }
                      </Grid>
                    </View>

                    {
                      (carDetails.dealer && carDetails.dealer.name) ?
                        (
                          <TouchableHighlight
                            onPress={this.onPressDealer}
                            underlayColor={styleConst.color.select}
                          >
                            <Grid style={styles.section}>
                              <Col><Text style={styles.sectionTitle}>Где</Text></Col>
                              <Col>
                                <View style={styles.dealerContainer} >
                                  <Text style={styles.sectionTitleValue}>{carDetails.dealer.name}</Text>
                                  <Icon name="arrow-forward" style={styles.iconArrow} />
                                </View>
                              </Col>
                            </Grid>
                          </TouchableHighlight>
                        ) :
                        null
                    }
                  </View>
                ) :
                (
                  <View style={styles.tabContent}>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>{get(carDetails, 'options.additional.1.name')}</Text>
                      {
                        get(carDetails, 'options.additional.1.data', []).map(item => {
                          return (
                            <Grid key={item.id}>
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
            <View style={styles.orderPriceContainer}>
              <Text style={styles.orderPriceText}>{`${priceSet(carDetails.price.app)} ${prices.curr.name}`}</Text>
            </View>
            <Button
              onPress={this.onPressOrder}
              full
              style={styles.button}
            >
              <Text style={styles.buttonText}>ХОЧУ ЭТО АВТО!</Text>
            </Button>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCarItemScreen);
