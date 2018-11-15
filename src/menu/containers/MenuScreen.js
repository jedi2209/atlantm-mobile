import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Container, Text, Grid, Col, Row } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionMenuOpenedCount } from '../../core/actions';

// components
import HeaderLogo from '../../core/components/HeaderLogo/HeaderLogo';

// helpers
import styleConst from '../../core/style-const';
import { scale, verticalScale } from '../../utils/scale';
import stylesHeader from '../../core/components/Header/style';
import RateThisApp from "../../core/components/RateThisApp";

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'space-around',
    flex: 1,
  },
  menu: {
    marginTop: verticalScale(25),
    marginBottom: verticalScale(40),
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  text: {
    color: styleConst.color.greyText,
    fontSize: 14,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
    letterSpacing: styleConst.ui.letterSpacing,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain',
    width: scale(60),
    height: scale(60),
    marginBottom: verticalScale(5),
  },
});

const mapStateToProps = ({ core }) => {
    return {
        menuOpenedCount: core.menuOpenedCount
    };
};

const mapDispatchToProps = {
    actionMenuOpenedCount,
};

class MenuScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderLogo />,
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      isShowRateApp: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.props.actionMenuOpenedCount();
  }

  componentDidMount() { }

  shouldComponentUpdate(nextProps, nextState) {
      console.log('this.props.menuOpenedCount', this.props.menuOpenedCount);
     if (nextProps.menuOpenedCount > 15 && this.state.isShowRateApp != true) {
         setTimeout(() => {
             this.setState({isShowRateApp: true});
         }, 1000);
         this.props.actionMenuOpenedCount(0);
         return true;
     }
     return false;
 }

  onPressContacts = () => this.props.navigation.navigate('ContactsScreen')
  onPressInfoList = () => this.props.navigation.navigate('InfoListScreen')
  onPressProfile = () => this.props.navigation.navigate('Profile2Screen')
  onPressService = () => this.props.navigation.navigate('ServiceScreen')
  onPressCatalog = () => this.props.navigation.navigate('Catalog2Screen')
  onPressTva = () => this.props.navigation.navigate('Tva2Screen')
  onPressEko = () => this.props.navigation.navigate('Eko2Screen')
  onPressIndicators = () => this.props.navigation.navigate('IndicatorsScreen')

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    console.log('== Menu ==');

    return (
      <Container style={styles.container}>
        {this.state.isShowRateApp ? <RateThisApp/> : null}
        <Grid style={styles.menu} >
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressContacts}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/contacts.png')}
                />
                <Text style={styles.text}>Контакты</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressInfoList}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/info.png')}
                />
                <Text style={styles.text}>Акции</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressService}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/service.png')}
                />
                <Text style={styles.text}>Заявка на СТО</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressTva}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/car_delivery.png')}
                />
                <Text style={styles.text}>Табло выдачи авто</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressCatalog}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/catalog_auto.png')}
                />
                <Text style={styles.text}>Каталог автомобилей</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressIndicators}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/indicators.png')}
                />
                <Text style={styles.text}>Индикаторы</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressEko}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/reviews.png')}
                />
                <Text style={styles.text}>Отзывы и предложения</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressProfile}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/profile.png')}
                />
                <Text style={styles.text}>Личный кабинет</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);