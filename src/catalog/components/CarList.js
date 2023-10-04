/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import BigList from 'react-native-big-list';

// redux
import {
  EVENT_LOAD_MORE,
  EVENT_REFRESH,
  EVENT_DEFAULT,
} from '../../core/actionTypes';

// components
import EmptyMessage from '../../core/components/EmptyMessage';
import CarListItem from './CarListItem';
import LogoLoader from '../../core/components/LogoLoader';

// helpers
import {strings} from '../../core/lang/const';
import {ActivityIndicator} from 'react-native-paper';
import styleConst from '../../core/style-const';
import {get} from 'lodash';

const _keyExtractor = item => {
  if (item && item.hash) {
    return item.hash.toString();
  } else {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * Math.floor(new Date().getTime())).toString()
    );
  }
};

const CarList = props => {
  const {
    data,
    pages,
    isFetchItems,
    dataHandler,
    itemScreen,
    prices,
    resizeMode,
  } = props;

  let ITEM_HEIGHT = 280;

  if (itemScreen === 'UsedCarItemScreen') {
    ITEM_HEIGHT = 320;
  }
  const [isRefreshing, setRefreshing] = useState(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  useEffect(() => {
    console.info('== CarList ==');

    if ((!data || data.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }, [data]);

  const _renderEmptyComponent = () =>
    isFetchItems ? (
      <LogoLoader />
    ) : (
      <EmptyMessage text={strings.CarList.emptyMessage} />
    );

  const _renderItem = ({item}) => {
    if (get(item, 'type') === 'empty') {
      return <EmptyMessage text={strings.CarList.emptyMessage} />;
    }
    return (
      <CarListItem
        resizeMode={resizeMode}
        key={item.hash ? item.hash : item.id.api}
        currency={get(prices, 'curr.name', '')}
        testID="CarListItem.Wrapper"
        car={item}
        prices={prices}
        itemScreen={itemScreen}
        {...props}
      />
    );
  };

  const _renderFooter = () => {
    if (!loadingNextPage) {
      return null;
    }

    return (
      <ActivityIndicator
        color={
          styleConst.color.blueNew
            ? styleConst.color.blueNew
            : styleConst.color.blue
        }
        marginTop={15}
      />
    );
  };

  const _onRefresh = () => {
    dataHandler(EVENT_REFRESH).then(() => {
      setRefreshing(false);
    });
  };

  const handleLoadMore = () => {
    if (!pages.next || data.length === 0 || loadingNextPage) {
      return false;
    }

    setLoadingNextPage(true);

    return dataHandler(EVENT_LOAD_MORE).then(() => {
      setLoadingNextPage(false);
    });
  };

  return (
    <BigList
      data={data}
      renderItem={_renderItem}
      renderFooter={_renderFooter}
      renderEmpty={_renderEmptyComponent}
      onEndReached={handleLoadMore}
      keyExtractor={_keyExtractor}
      itemHeight={ITEM_HEIGHT}
      footerHeight={100}
      onEndReachedThreshold={0.7}
    />
  );
};

CarList.propTypes = {
  pages: PropTypes.object,
  data: PropTypes.array,
  itemScreen: PropTypes.string,
  isFetchItems: PropTypes.bool,
  prices: PropTypes.object,
};

CarList.defaultProps = {
  pages: {},
  prices: {},
  data: null,
  itemScreen: null,
  isFetchItems: false,
  resizeMode: 'cover',
};

export default CarList;
