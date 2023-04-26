/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';
import {Icon, Fab} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

// redux
import {connect} from 'react-redux';
import {
  actionFetchUsedCarByFilter,
  actionSaveUsedCarFilters,
} from '../../actions';

// components
import CarList from '../../components/CarList';
import LogoLoader from '../../../core/components/LogoLoader';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {EVENT_REFRESH} from '../../../core/actionTypes';
import {JIVO_CHAT} from '../../../core/const';

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

  const fabEnable = dealerSelected.region === 'by' ? true : false;

  const _fetchUsedCar = type => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }

    return actionFetchUsedCarByFilter({
      type,
      city: dealerSelected.city[0].id,
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
  }, [dealerSelected.city[0].id]);

  return (
    <View style={styles.content} testID="UserCarListSreen.Wrapper">
      <StatusBar hidden />
      {loading ? (
        <LogoLoader />
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
          {fabEnable ? (
            <Fab
              renderInPortal={false}
              size="sm"
              style={{backgroundColor: styleConst.new.blueHeader}}
              shadow={2}
              onPress={() =>
                navigation.navigate('ChatScreen', {
                  prevScreen: 'Список б/у авто',
                })
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

const mapDispatchToProps = {
  actionFetchUsedCarByFilter,
  actionSaveUsedCarFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarListScreen);
