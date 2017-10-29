import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  actionFetchUsedCar,
  actionSetUsedCarCity,
  actionShowPriceFilter,
  actionHidePriceFilter,
  actionResetUsedCarList,
  actionSelectUsedCarPriceRange,
} from '../../actions';

// components
import FooterFilter from '../components/FooterFilter';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

// helpers
import { get } from 'lodash';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import declOfNum from '../../../utils/decl-of-num';
import { EVENT_DEFAULT } from '../../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ dealer, nav, catalog }) => {
  return {
    nav,
    city: catalog.usedCar.city,
    items: catalog.usedCar.items,
    total: catalog.usedCar.total,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    priceRange: catalog.usedCar.priceRange,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    isPriceFilterShow: catalog.usedCar.meta.isPriceFilterShow,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchUsedCar,
    actionSetUsedCarCity,
    actionShowPriceFilter,
    actionHidePriceFilter,
    actionResetUsedCarList,
    actionSelectUsedCarPriceRange,
  }, dispatch);
};

class UserCarListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { total: {} } } = navigation.state;
    const count = params.total.count;

    const titleVariants = ['автомобиль', 'автомобиля', 'автомобилей'];
    const title = count ?
      `${count} ${declOfNum(count, titleVariants)}` :
      'Автомобили с пробегом';

    return {
      headerTitle: title,
      headerStyle: styleHeader.common,
      headerTitleStyle: styleHeader.title,
      headerLeft: <HeaderIconBack navigation={navigation} returnScreen="CatalogScreen" />,
      headerRight: <HeaderIconMenu navigation={navigation} />,
    };
  }

  componentWillUpdate() {
    const { navigation, total } = this.props;
    navigation.setParams({ total });
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, items, isFetchItems, total, isPriceFilterShow } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'UserCarListScreen';

    // console.log('Catalog this.props.navigation', this.props.navigation);
    // console.log('Catalog nextProps.navigation', nextProps.navigation);

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (items.length !== nextProps.items.length) ||
      (isFetchItems !== nextProps.isFetchItems) ||
      (total.count !== nextProps.total.count) ||
      (isPriceFilterShow !== nextProps.isPriceFilterShow);
  }

  fetchUsedCar = (type, priceRangeFromFilter) => {
    const {
      city,
      total,
      pages,
      priceRange,
      navigation,
      actionFetchUsedCar,
    } = this.props;

    return actionFetchUsedCar({
      type,
      priceRange: priceRangeFromFilter || priceRange,
      city: city.id,
      nextPage: pages.next,
    })
      .then(() => {
        return setTimeout(() => {
          this.props.navigation.setParams({ total: this.props.total });
        }, 100);
      });
  }

  onPressCity = () => {
    this.props.navigation.navigate('UsedCarCityScreen', { returnScreen: 'UsedCarListScreen' });
  }

  onPressPrice = () => {
    this.props.actionShowPriceFilter();
  }

  onClosePrice = (priceRange) => {
    const {
      fetchUsedCar,
      actionHidePriceFilter,
      actionResetUsedCarList,
      actionSelectUsedCarPriceRange,
    } = this.props;

    actionHidePriceFilter();

    if (priceRange) {
      actionResetUsedCarList();
      actionSelectUsedCarPriceRange(priceRange);
      this.fetchUsedCar(EVENT_DEFAULT, priceRange);
    }
  }

  render() {
    const {
      items,
      pages,
      prices,
      navigation,
      priceRange,
      isFetchItems,
      dealerSelected,
      isPriceFilterShow,
    } = this.props;

    console.log('== UsedCarListScreen ==');

    return (
      <View style={styles.content}>
        <CarList
          items={items}
          pages={pages}
          prices={prices}
          itemScreen="UsedCarItemScreen"
          dataHandler={this.fetchUsedCar}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchItems}
          navigation={navigation}
        />

        <FooterFilter
          currency={get(prices, 'curr.name')}
          min={prices.min}
          max={prices.max}
          step={prices.step}
          currentMinPrice={priceRange && priceRange.minPrice}
          currentMaxPrice={priceRange && priceRange.maxPrice}
          onPressCity={this.onPressCity}
          onPressPrice={this.onPressPrice}
          onClosePrice={this.onClosePrice}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCarListScreen);
