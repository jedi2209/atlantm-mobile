/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {DEFAULT_CITY} from '../../../core/const';
import {EVENT_REFRESH} from '../../../core/actionTypes';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({dealer, catalog}) => {
  return {
    items: get(catalog, 'usedCar.items', null),
    pages: get(catalog, 'usedCar.pages', null),
    prices: get(catalog, 'usedCar.prices', null),
    isFetchItems: get(catalog, 'usedCar.meta.isFetchItems', false),
    region: dealer.region,
    filters: get(catalog, 'usedCar.filters', null),
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
  region,
  filters,
  items,
}) => {
  const [loading, setLoading] = useState(false);

  const fabEnable = region === 'by' ? true : false;

  const _fetchUsedCar = type => {
    if (type === EVENT_REFRESH) {
      setLoading(true);
    }

    return actionFetchUsedCarByFilter({
      type,
      city: DEFAULT_CITY[region].id,
      region: region,
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
  }, [DEFAULT_CITY[region].id]);

  return (
    <View style={styles.content} testID="UserCarListSreen.Wrapper">
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
            isFetchItems={isFetchItems}
          />
          {fabEnable ? (
            <Fab
              renderInPortal={false}
              size="sm"
              style={{backgroundColor: styleConst.new.blueHeader}}
              shadow={2}
              onPress={() =>
                navigation.navigateDeprecated('ChatScreen', {
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
