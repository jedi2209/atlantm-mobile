import React, {useState, useEffect, useReducer} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionFetchUsedCarByFilter} from '../../actions';

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

const mapStateToProps = ({dealer, catalog}) => {
  return {
    city: catalog.usedCar.city,
    items: catalog.usedCar.items,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    needUpdate: catalog.usedCar.meta.needUpdate,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    isPriceFilterShow: catalog.usedCar.meta.isPriceFilterShow,
    dealerSelected: dealer.selected,
    filtersUsed: catalog.usedCar.filters.data,
  };
};

const mapDispatchToProps = {
  actionFetchUsedCarByFilter,
};

const initialSort = {sortBy: 'price', sortDirection: 'asc'};
const sortReducer = (state, action) => {
  console.log('state, action', state, action);
  switch (action.type) {
    case 'sortBy':
      return {sortBy: action.value, sortDirection: state.sortDirection};
    case 'sortDirection':
      return {sortBy: state.sortBy, sortDirection: action.value};
    case 'all':
      return action.value;
  }
};

const UsedCarListScreen = ({
  city,
  pages,
  prices,
  isFetchItems,
  navigation,
  route,
  actionFetchUsedCarByFilter,
  dealerSelected,
  filtersUsed,
  items,
}) => {
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useReducer(sortReducer, initialSort);

  const _fetchUsedCar = (type, priceRangeFromFilter) => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }
    return actionFetchUsedCarByFilter({
      type,
      city: city ? city.id : dealerSelected.city.id,
      nextPage: pages?.next || null,
      filters: filtersUsed.filters,
      sortBy: route?.params?.sortBy ? route.params.sortBy : sorting.sortBy,
      sortDirection: route?.params?.sortDirection
        ? route.params.sortDirection
        : sorting.sortDirection,
    }).then(res => {
      setLoading(false);
      return setTimeout(() => {
        navigation.setParams({
          total: get(items, 'total', get(res, 'payload.total')),
          itemsLength: items && items.length,
        });
      }, 150);
    });
  };

  useEffect(() => {
    console.log('== UsedCarListScreen ==');
    Analytics.logEvent('screen', 'catalog/usedcar/list');
    if (typeof route.params?.sortDirection !== 'undefined') {
      if (
        route.params?.sortDirection !== sorting.sortDirection ||
        route.params?.sortBy !== sorting.sortBy
      ) {
        setSorting({
          type: 'all',
          value: {
            sortDirection: route.params.sortDirection,
            sortBy: route.params.sortBy,
          },
        });
        setTimeout(() => {
          _fetchUsedCar(EVENT_REFRESH);
        }, 100);
      }
    }
  }, [route?.params]);
  // componentDidMount() {
  //   setTimeout(() => {
  //     this.props.navigation.setParams({
  //       total: this.props.total,
  //       itemsLength: this.props.items && this.props.items.length,
  //     });
  //   }, 200);
  // }

  // componentDidUpdate() {
  //   const {
  //     total,
  //     navigation,
  //     needUpdate,
  //     isFetchItems,
  //     actionSetStopNeedUpdateUsedCarList,
  //   } = this.props;

  //   if (needUpdate && !isFetchItems) {
  //     this.fetchUsedCar('default').then(() => {
  //       actionSetStopNeedUpdateUsedCarList();
  //       setTimeout(() => {
  //         this.props.navigation.setParams({
  //           total: this.props.total,
  //           itemsLength: this.props.items && this.props.items.length,
  //         });
  //       }, 200);
  //     });
  //   }
  // }

  // shouldComponentUpdate(nextProps) {
  //   const {
  //     total,
  //     items,
  //     needUpdate,
  //     isFetchItems,
  //     dealerSelected,
  //     isPriceFilterShow,
  //   } = this.props;

  //   const nav = nextProps.nav.newState;
  //   const isActiveScreen =
  //     nav.routes[nav.index].routeName === 'UsedCarListScreen';

  //   return (
  //     (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
  //     items.length !== nextProps.items.length ||
  //     isFetchItems !== nextProps.isFetchItems ||
  //     total.count !== nextProps.total.count ||
  //     isPriceFilterShow !== nextProps.isPriceFilterShow ||
  //     // city.id !== nextProps.city.id ||
  //     needUpdate !== nextProps.needUpdate ||
  //     this.props.priceRange !== nextProps.priceRange
  //   );
  // }

  return (
    <View style={styles.content} testID="UserCarListSreen.Wrapper">
      <StatusBar hidden />
      {loading ? (
        <Spinner visible={true} color={styleConst.color.blue} />
      ) : (
        <CarList
          data={items}
          pages={pages}
          prices={prices}
          itemScreen="UsedCarItemScreen"
          dataHandler={_fetchUsedCar}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchItems}
        />
      )}
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarListScreen);
