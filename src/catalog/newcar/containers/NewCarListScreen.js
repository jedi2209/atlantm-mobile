/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useReducer} from 'react';
import {StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionFetchNewCarByFilter,
  actionSaveNewCarFilters,
} from '../../actions';

// components
import CarList from '../../components/CarList';
import {Icon, Fab} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const NewCarListScreen = ({
  items,
  navigation,
  route,
  filters,
  actionFetchNewCarByFilter,
  actionSaveNewCarFilters,
  dealerSelected,
  isFetchingNewCarByFilter,
}) => {
  const [loading, setLoading] = useState(true);

  const {data, pages, prices} = items;

  const fabEnable = dealerSelected.region === 'by' ? true : false;

  const _fetchNewCars = type => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }

    return actionFetchNewCarByFilter({
      type,
      city: dealerSelected.city.id,
      nextPage: pages?.next || null,
      filters: filters.filters,
      sortBy: filters.sorting.sortBy,
      sortDirection: filters.sorting.sortDirection,
    }).then(res => {
      return setTimeout(() => {
        setLoading(false);
        navigation.setParams({
          total: get(items, 'total', get(res, 'payload.total')),
        });
      }, 150);
    });
  };

  useEffect(() => {
    _fetchNewCars(EVENT_REFRESH);
  }, [filters.sorting.sortDirection, filters.sorting.sortBy]);

  useEffect(() => {
    actionSaveNewCarFilters({
      filters: filters.filters,
      sorting: {
        sortBy: route?.params?.sortBy,
        sortDirection: route?.params?.sortDirection,
      },
    });
  }, [route.params.sortDirection, route.params.sortBy]);

  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    Analytics.logEvent('screen', 'catalog/newcar/list', {
      search_url: `/stock/new/cars/get/city/${dealerSelected.city.id}/`,
    });
  }, [dealerSelected.city.id]);

  return (
    <View style={styles.content} testID="NewCarsListSreen.Wrapper">
      <StatusBar hidden />
      {loading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      ) : (
        <>
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
          {fabEnable ? (
            <Fab
              renderInPortal={false}
              size="sm"
              style={{backgroundColor: styleConst.new.blueHeader}}
              onPress={() =>
                navigation.navigate('ChatScreen', {chatType: 'newcars'})
              }
              icon={
                <Icon
                  size={7}
                  as={Ionicons}
                  name="chatbox-outline"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                />
              }
            />
          ) : null}
        </>
      )}
    </View>
  );
};

// navigation.navigate('ChatScreen');

const mapDispatchToProps = {
  actionFetchNewCarByFilter,
  actionSaveNewCarFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCarListScreen);
