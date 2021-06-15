import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionFetchNewCarByFilter} from '../../actions';

// components
import CarList from '../../components/CarList';

import Spinner from 'react-native-loading-spinner-overlay';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {EVENT_REFRESH} from '../../../core/actionTypes';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({dealer, nav, catalog}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    brands: dealer.listBrands,
    city: catalog.newCar.city,
    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,

    filterModels: catalog.newCar.filters.modelFilter,
    filterBody: catalog.newCar.filters.bodyFilters,
    filterPrice: catalog.newCar.filters.priceFilter,

    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    filters: catalog.newCar.filters,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarByFilter,
};

class NewCarListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const {dealerSelected, filterData} = this.props;
    const defaultSearchUrl = `/stock/new/cars/get/city/${dealerSelected.city.id}/`;

    const searchUrl = filterData.search_url || defaultSearchUrl;

    Analytics.logEvent('screen', 'catalog/newcar/list', {
      search_url: searchUrl,
    });
  }

  componentDidUpdate() {
    const {items} = this.props;

    if (items.total) {
      return setTimeout(() => {
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 200);
    }
  }

  shouldComponentUpdate(nextProps) {
    const {dealerSelected, items, isFetchingNewCarByFilter} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'NewCarListScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      items.length !== nextProps.items.length ||
      isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter ||
      this.props.filters !== nextProps.filters
    );
  }

  fetchNewCar = (type) => {
    const {
      items,
      filterData,
      actionFetchNewCarByFilter,

      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterPriceSpecial,
    } = this.props;

    const onResult = () => {
      return setTimeout(() => {
        this.setState({
          isRefreshing: false,
        });
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 150);
    };

    if (type === EVENT_REFRESH) {
      this.setState({
        isRefreshing: true,
      });
      return actionFetchNewCarByFilter({
        searchUrl:
          filterData.search_url ||
          `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
        filterBrands,
        filterModels,
        filterBody,
        filterGearbox,
        filterDrive,
        filterEngineType,
        filterPrice,
        filterPriceSpecial,
      }).then(onResult);
    }

    return actionFetchNewCarByFilter({
      type,
      searchUrl:
        filterData.search_url ||
        `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
      nextPage: get(items, 'pages.next'),
    }).then(onResult);
  };

  render() {
    const {
      items,
      navigation,
      dealerSelected,
      isFetchingNewCarByFilter,
    } = this.props;

    const {data, pages, prices} = items;

    return (
      <View style={styles.content} testID="NewCarsListSreen.Wrapper">
        <StatusBar hidden />
        {this.state.loading ? (
          <Spinner visible={true} color={styleConst.color.blue} />
        ) : (
          <CarList
            data={data}
            pages={pages}
            prices={prices}
            navigation={navigation}
            resizeMode="contain"
            itemScreen="NewCarItemScreen"
            dataHandler={this.fetchNewCar}
            dealerSelected={dealerSelected}
            isFetchItems={isFetchingNewCarByFilter}
          />
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarListScreen);
