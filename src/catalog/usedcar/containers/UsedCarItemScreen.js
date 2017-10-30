import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { Container, Content, StyleProvider, Footer, Button, Grid, Row, Col } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import PhotoSlider from '../../../core/components/PhotoSlider';

// helpers
import { get, find } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import priceSet from '../../../utils/price-set';

const FOOTER_HEIGHT = 50;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  gallery: {
    // marginBottom: 20,
    position: 'relative',
  },
  titleContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: styleConst.color.header,
  },
  title: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingLeft: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    fontSize: 20,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  descrContainer: {
    padding: styleConst.ui.horizontalGap,
  },
  descr: {
    lineHeight: 18,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    marginBottom: 4,
  },
  sectionRow: {
    marginBottom: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    color: styleConst.color.greyText,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  sectionTitleValue: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.light,
    fontSize: 18,
    color: styleConst.color.greyText4,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    height: FOOTER_HEIGHT,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  orderPriceContainer: {
    height: FOOTER_HEIGHT,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderPriceText: {
    fontFamily: styleConst.font.regular,
    fontSize: 19,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  footer: {
    height: FOOTER_HEIGHT,
  },
});

const mapStateToProps = ({ catalog, dealer, nav }) => {
  return {
    nav,
    prices: catalog.usedCar.prices,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

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

  shouldComponentUpdate(nextProps) {
    const { dealerSelected } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'UserCarItemScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen);
  }

  onPressDealer = () => {
    const {
      navigation,
      listRussia,
      listUkraine,
      listBelarussia,
    } = this.props;

    const car = get(navigation, 'state.params.car');
    const list = [].concat(listRussia, listBelarussia, listUkraine);
    const dealerBaseData = find(list, { id: car.dealer.id });

    navigation.navigate('AboutDealerScreen', { dealerBaseData });
  }

  onPressOrder = () => {
    const { navigation, prices } = this.props;
    const car = get(navigation, 'state.params.car');

    console.log('car', car);

    navigation.navigate('OrderScreen', {
      car: {
        brand: car.brand.name,
        model: car.model,
        price: car.price.app,
      },
      currency: prices.curr.name,
      dealerId: car.dealer.id,
    });
  }

  render() {
    const { navigation, prices } = this.props;

    const car = get(navigation, 'state.params.car');

    // console.log('car', car);

    console.log('== UsedCarItemScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

          <View style={styles.gallery}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`${car.brand.name} ${car.model}`}</Text>
            </View>
            <PhotoSlider photos={car.img['10000x300']} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Основные</Text>
            <Grid>
              {
                car.year &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Год выпуска:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{`${car.year} г.`}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.mileage &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Пробег:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{`${priceSet(car.mileage)} км.`}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.engine && car.engine.type &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Топливо:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.engine.type}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.engine && car.engine.volume && car.engine.volume.short &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Двигатель:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{`${car.engine.volume.short} л.`}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.gearbox && car.gearbox.name &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>КПП:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.gearbox.name}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.color && car.color.name && car.color.name.simple &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Цвет:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.color.name.simple}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                car.body && car.body.name &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Тип кузова:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.body.name}</Text>
                      </Col>
                    </Row>
                  )
              }
              {
                (car.interior && car.interior.name) ?
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>Салон:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.interior.name}</Text>
                      </Col>
                    </Row>
                  ) : null
              }
              {
                car.vin &&
                  (
                    <Row style={styles.sectionRow}>
                      <Col style={styles.sectionProp}>
                        <Text style={styles.sectionPropText}>VIN:</Text>
                      </Col>
                      <Col style={styles.sectionValue}>
                        <Text style={styles.sectionValueText}>{car.vin}</Text>
                      </Col>
                    </Row>
                  )
              }
            </Grid>
          </View>

          {
            (car.dealer && car.dealer.name) ?
              (
                <TouchableHighlight
                  onPress={this.onPressDealer}
                  underlayColor={styleConst.color.select}
                >
                  <Grid style={styles.section}>
                    <Col><Text style={styles.sectionTitle}>Где</Text></Col>
                    <Col>
                      <View>
                        <Text style={styles.sectionTitleValue}>{car.dealer.name}</Text>
                      </View>
                    </Col>
                  </Grid>
                </TouchableHighlight>
              ) :
              null
          }

          {
            car.text ?
              (
                <View style={styles.descrContainer}>
                  <Text style={styles.descr}>{car.text}</Text>
                </View>
              ) :
              null
          }
          </Content>

          <Footer style={styles.footer}>
            <View style={styles.orderPriceContainer}>
              <Text style={styles.orderPriceText}>{`${priceSet(car.price.app)} ${prices.curr.name}`}</Text>
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
