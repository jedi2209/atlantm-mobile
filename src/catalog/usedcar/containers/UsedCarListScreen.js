/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';
import {Icon, Fab} from 'native-base';

// redux
import {connect} from 'react-redux';
import {
  actionFetchUsedCarByFilter,
  actionSaveUsedCarFilters,
} from '../../actions';

// components
import CarList from '../../components/CarList';

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
    items: catalog.usedCar.items,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    dealerSelected: dealer.selected,
    filters: catalog.usedCar.filters,
  };
};

const UsedCarListScreen = ({
  pages,
  prices,
  isFetchItems,
  navigation,
  route,
  actionFetchUsedCarByFilter,
  actionSaveUsedCarFilters,
  dealerSelected,
  filters,
  items,
}) => {
  const [loading, setLoading] = useState(false);

  const _fetchUsedCar = type => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }

    return actionFetchUsedCarByFilter({
      type,
      city: dealerSelected.city.id,
      region: dealerSelected.region,
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
    _fetchUsedCar(EVENT_REFRESH);
  }, [filters.sorting?.sortDirection, filters.sorting?.sortBy]);

  useEffect(() => {
    actionSaveUsedCarFilters({
      filters: filters.filters,
      sorting: {
        sortBy: route?.params?.sortBy,
        sortDirection: route?.params?.sortDirection,
      },
    });
  }, [route.params.sortDirection, route.params.sortBy]);

  // Аналогично componentDidMount и componentDidUpdate:
  useEffect(() => {
    console.info('== UsedCarListScreen ==');
    Analytics.logEvent('screen', 'catalog/usedcar/list');
  }, [dealerSelected.city.id]);

  return (
    <View style={styles.content} testID="UserCarListSreen.Wrapper">
      <StatusBar hidden />
      {loading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      ) : (
        <>
          <CarList
            data={items}
            pages={pages}
            prices={prices}
            itemScreen="UsedCarItemScreen"
            dataHandler={_fetchUsedCar}
            dealerSelected={dealerSelected}
            isFetchItems={isFetchItems}
          />
          <Fab
            active={false}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: styleConst.new.blueHeader}}
            position="bottomRight"
            onPress={() =>
              navigation.navigate('ChatScreen', {chatType: 'tradein-cars'})
            }>
            <Icon type="Ionicons" name="chatbox-outline" />
          </Fab>
        </>
      )}
    </View>
  );
};

const mapDispatchToProps = {
  actionFetchUsedCarByFilter,
  actionSaveUsedCarFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarListScreen);
