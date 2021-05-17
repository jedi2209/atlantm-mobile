/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionFetchUsedCar,
  actionSetUsedCarCity,
  actionShowPriceFilter,
  actionHidePriceFilter,
  actionResetUsedCarList,
  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
  actionSetStopNeedUpdateUsedCarList,
} from '../../actions';

// components
import CarList from '../../components/CarList';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.header,
  },
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({dealer, nav, catalog}) => {
  return {
    nav,
    city: catalog.usedCar.city,
    items: catalog.usedCar.items,
    total: catalog.usedCar.total,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    priceRange: catalog.usedCar.priceRange,
    needUpdate: catalog.usedCar.meta.needUpdate,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    isPriceFilterShow: catalog.usedCar.meta.isPriceFilterShow,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionFetchUsedCar,
  actionSetUsedCarCity,
  actionShowPriceFilter,
  actionHidePriceFilter,
  actionResetUsedCarList,
  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
  actionSetStopNeedUpdateUsedCarList,
};

class UsedCarListScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.setParams({
        total: this.props.total,
        itemsLength: this.props.items && this.props.items.length,
      });
    }, 200);

    Analytics.logEvent('screen', 'catalog/usedcar/list');
  }

  componentDidUpdate() {
    const {
      total,
      navigation,
      needUpdate,
      isFetchItems,
      actionSetStopNeedUpdateUsedCarList,
    } = this.props;

    if (needUpdate && !isFetchItems) {
      this.fetchUsedCar('default').then(() => {
        actionSetStopNeedUpdateUsedCarList();
        setTimeout(() => {
          this.props.navigation.setParams({
            total: this.props.total,
            itemsLength: this.props.items && this.props.items.length,
          });
        }, 200);
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      total,
      items,
      needUpdate,
      isFetchItems,
      dealerSelected,
      isPriceFilterShow,
    } = this.props;

    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'UsedCarListScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      items.length !== nextProps.items.length ||
      isFetchItems !== nextProps.isFetchItems ||
      total.count !== nextProps.total.count ||
      isPriceFilterShow !== nextProps.isPriceFilterShow ||
      // city.id !== nextProps.city.id ||
      needUpdate !== nextProps.needUpdate ||
      this.props.priceRange !== nextProps.priceRange
    );
  }

  fetchUsedCar = (type, priceRangeFromFilter) => {
    const {
      city,
      total,
      pages,
      priceRange,
      navigation,
      actionFetchUsedCar,
      dealerSelected,
    } = this.props;

    return actionFetchUsedCar({
      type,
      priceRange: priceRangeFromFilter || priceRange,
      city: city ? city.id : dealerSelected.city.id,
      nextPage: pages.next,
    }).then(() => {
      return setTimeout(() => {
        navigation.setParams({
          total: total,
          itemsLength: this.props.items && this.props.items.length,
        });
      }, 100);
    });
  };

  render() {
    const {
      items,
      pages,
      prices,
      navigation,
      isFetchItems,
      dealerSelected,
    } = this.props;

    console.log('== UsedCarListScreen ==');

    return (
      <View style={styles.content}>
        <StatusBar hidden />
        <CarList
          data={items}
          pages={pages}
          prices={prices}
          itemScreen="UsedCarItemScreen"
          dataHandler={this.fetchUsedCar}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchItems}
          navigation={navigation}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarListScreen);
