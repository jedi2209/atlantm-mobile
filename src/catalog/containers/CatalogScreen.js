import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Icon, Button, Content } from 'native-base';

// redux
import { connect } from 'react-redux';
import {
  actionSelectUsedCarCity,
  actionSelectUsedCarRegion,
  actionSelectUsedCarPriceRange,

  actionSelectNewCarCity,
  actionSelectNewCarRegion,
} from '../actions';
import { actionSetDealersByCities } from '../../dealer/actions';

// components
import DeviceInfo from 'react-native-device-info';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import { verticalScale } from '../../utils/scale';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import { RUSSIA, BELARUSSIA, UKRAINE } from '../../core/const';

const isTablet = DeviceInfo.isTablet();
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    height: 70,
    marginLeft: styleConst.ui.horizontalGap * 2,
    marginRight: styleConst.ui.horizontalGap * 2,
    marginBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  imageDividerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  imageDivider: {
    borderTopWidth: 1,
    borderTopColor: '#e2e2e2',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width,
    height: 2,
  },
  image: {
    width: 120,
    height: 125,
  },
  buttonText: {
    color: '#fff',
    fontFamily: styleConst.font.medium,
    fontWeight: '500',
    fontSize: 18,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

const mapStateToProps = ({ dealer, nav }) => {
  return {
    nav,
    listRussiaByCities: dealer.listRussiaByCities,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionSelectUsedCarCity,
  actionSelectUsedCarRegion,
  actionSetDealersByCities,
  actionSelectUsedCarPriceRange,

  actionSelectNewCarCity,
  actionSelectNewCarRegion,
};

class CatalogScreen extends Component {
  static navigationOptions = () => ({
    tabBarLabel: 'Поиск',
    tabBarIcon: ({focused}) => (
      <Icon
        name="search"
        type="FontAwesome5"
        style={{
          fontSize: 24,
          color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
        }}
      />
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {};

    if (!isTablet) {
      this.state.itemWidth = width;
    }
  }

  componentDidMount() {
    Amplitude.logEvent('screen', 'catalog');
  }

  componentWillMount() {
    const {
      dealerSelected,
      listRussiaByCities,
      listRussia,
      listUkraine,
      listBelarussia,
      actionSelectUsedCarCity,
      actionSelectUsedCarRegion,
      actionSetDealersByCities,
      actionSelectUsedCarPriceRange,

      actionSelectNewCarCity,
      actionSelectNewCarRegion,
    } = this.props;

    const { city, region } = dealerSelected;

    actionSelectUsedCarCity(city);
    actionSelectUsedCarRegion(region);
    actionSelectUsedCarPriceRange(null);

    actionSelectNewCarCity(city);
    actionSelectNewCarRegion(region);

    // для перехода с версии 4.1.0 -> 4.2.0, когда еще нет данных
    // с дилерами по городам
    if (listRussiaByCities.length === 0) {
      actionSetDealersByCities({
        [RUSSIA]: listRussia,
        [BELARUSSIA]: listBelarussia,
        [UKRAINE]: listUkraine,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'CatalogScreen';

    // console.log('Catalog this.props.navigation', this.props.navigation);
    // console.log('Catalog nextProps.navigation', nextProps.navigation);

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen);
  }

  onPressButtonNewCar = () => this.props.navigation.navigate('NewCarFilterScreen')
  onPressButtonUsedCar = () => this.props.navigation.navigate('UsedCarListScreen')
  onPressButtonCarCost = () => this.props.navigation.navigate('CarCostScreen')

  onLayout = (e) => {
    if (!isTablet) return false;

    const { width: contentWidth } = e.nativeEvent.layout;

    this.setState({ itemWidth: contentWidth });
  }

  render() {
    const {
      dealerSelected,
      navigation,
    } = this.props;

    console.log('== Catalog ==');

    return (
        <SafeAreaView style={styles.safearea}>
          <Content>
            <View style={styles.buttonGroup} onLayout={this.onLayout}>
              <View style={[styles.imageContainer, { width: this.state.itemWidth }]}>
                <View style={styles.imageDividerContainer}>
                  <View style={styles.imageDivider} />
                </View>
                <Image resizeMode="contain" source={require('../assets/catalog.png')} style={styles.image} />
              </View>
              <Button full onPress={this.onPressButtonNewCar} style={[styles.button, styles.buttonTop]}>
                <Text style={styles.buttonText}>НОВЫЕ АВТОМОБИЛИ</Text>
              </Button>
              <Button full onPress={this.onPressButtonUsedCar} style={[styles.button, styles.buttonBottom]}>
                <Text style={styles.buttonText}>АВТОМОБИЛИ С ПРОБЕГОМ</Text>
              </Button>
              <Button full onPress={this.onPressButtonCarCost} style={[styles.button, styles.buttonBottom]}>
                <Text style={styles.buttonText}>ОЦЕНИТЬ МОЙ АВТОМОБИЛЬ</Text>
              </Button>
            </View>
          </Content>
        </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogScreen);
