import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Button } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
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
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpres
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { RUSSIA, BELARUSSIA, UKRAINE } from '../../core/const';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    height: 70,
    marginLeft: styleConst.ui.horizontalGap * 2,
    marginRight: styleConst.ui.horizontalGap * 2,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    width,
    paddingVertical: 10,
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
  buttonGroup: {
    alignItems: 'center',
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectUsedCarCity,
    actionSelectUsedCarRegion,
    actionSetDealersByCities,
    actionSelectUsedCarPriceRange,

    actionSelectNewCarCity,
    actionSelectNewCarRegion,
  }, dispatch);
};

class CatalogScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Каталог авто',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
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

  render() {
    const {
      dealerSelected,
      navigation,
    } = this.props;

    console.log('== Catalog ==');

    return (
      <View style={styles.content}>
        <View style={styles.buttonGroup}>
            <Button full onPress={this.onPressButtonNewCar} style={[styles.button, styles.buttonTop]}>
              <Text style={styles.buttonText}>НОВЫЕ АВТОМОБИЛИ</Text>
            </Button>
            <View style={styles.imageContainer}>
              <View style={styles.imageDividerContainer}>
                <View style={styles.imageDivider} />
              </View>
              <Image resizeMode="contain" source={require('../assets/catalog.png')} style={styles.image} />
            </View>
            <Button full onPress={this.onPressButtonUsedCar} style={[styles.button, styles.buttonBottom]}>
              <Text style={styles.buttonText}>АВТОМОБИЛИ С ПРОБЕГОМ</Text>
            </Button>
          </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogScreen);
