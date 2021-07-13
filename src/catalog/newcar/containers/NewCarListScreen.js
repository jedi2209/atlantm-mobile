import React, {useState, useEffect, useReducer} from 'react';
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

const mapStateToProps = ({dealer, catalog}) => {
  return {
    dealerSelected: dealer.selected,
    brands: dealer.listBrands,
    items: catalog.newCar.items,
    filters: catalog.newCar.filters,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
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

const NewCarListScreen = ({
  items,
  navigation,
  route,
  filters,
  actionFetchNewCarByFilter,
  dealerSelected,
  isFetchingNewCarByFilter,
}) => {
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useReducer(sortReducer, initialSort);

  const {data, pages, prices} = items;

  const _fetchNewCars = type => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }

    return actionFetchNewCarByFilter({
      type,
      city: dealerSelected.city.id,
      nextPage: pages?.next || null,
      filters: filters.filters,
      sortBy: route?.params?.sortBy ? route.params.sortBy : sorting.sortBy,
      sortDirection: route?.params?.sortDirection
        ? route.params.sortDirection
        : sorting.sortDirection,
    }).then(res => {
      return setTimeout(() => {
        setLoading(false);
        navigation.setParams({
          total: get(items, 'total', get(res, 'payload.total')),
        });
      }, 150);
    });
  };

  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    if (typeof route.params?.sortDirection !== 'undefined') {
      if (
        route.params?.sortDirection != sorting.sortDirection ||
        route.params?.sortBy != sorting.sortBy
      ) {
        setSorting({
          type: 'all',
          value: {
            sortDirection: route.params.sortDirection,
            sortBy: route.params.sortBy,
          },
        });
        setTimeout(() => {
          _fetchNewCars(EVENT_REFRESH);
        }, 100);
      }
    }

    const searchUrl = `/stock/new/cars/get/city/${dealerSelected.city.id}/`;
    Analytics.logEvent('screen', 'catalog/newcar/list', {
      search_url: searchUrl,
    });
  }, [route?.params?.sortBy, route?.params?.sortDirection]);
  return (
    <View style={styles.content} testID="NewCarsListSreen.Wrapper">
      <StatusBar hidden />
      {loading ? (
        <Spinner visible={true} color={styleConst.color.blue} />
      ) : (
        <CarList
          data={data}
          pages={pages}
          prices={prices}
          resizeMode="contain"
          itemScreen="NewCarItemScreen"
          dataHandler={_fetchNewCars}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchingNewCarByFilter}
        />
      )}
    </View>
  );
};

const mapDispatchToProps = {
  actionFetchNewCarByFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCarListScreen);
