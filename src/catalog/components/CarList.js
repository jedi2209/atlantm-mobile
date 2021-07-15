import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

// redux
import {
  EVENT_LOAD_MORE,
  EVENT_REFRESH,
  EVENT_DEFAULT,
} from '../../core/actionTypes';

// components
import EmptyMessage from '../../core/components/EmptyMessage';
import CarListItem from './CarListItem';

// helpers
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  footer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

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
  const [isRefreshing, setRefreshing] = useState(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  useEffect(() => {
    console.log('== CarList ==');

    if ((!data || data.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }, [data]);

  const _renderEmptyComponent = () =>
    isFetchItems ? (
      <ActivityIndicator
        color={styleConst.color.blue}
        style={styleConst.spinner}
      />
    ) : (
      <EmptyMessage text={strings.CarList.emptyMessage} />
    );

  const _renderItem = ({item}) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={strings.CarList.emptyMessage} />;
    }
    return (
      <CarListItem
        resizeMode={resizeMode}
        key={item.hash ? item.hash : item.id.api}
        currency={prices.curr.name}
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
      <View style={styles.footer}>
        <ActivityIndicator
          animating
          size="large"
          color={styleConst.color.blue}
        />
      </View>
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

    __DEV__ && console.log('handleLoadMore');
    setLoadingNextPage(true);

    return dataHandler(EVENT_LOAD_MORE).then(() => {
      setLoadingNextPage(false);
    });
  };

  return (
    <FlatList
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.7}
      testID="CarList.Wrapper"
      initialNumToRender={10}
      maxToRenderPerBatch={20} // Increase time between renders
      onRefresh={_onRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={_renderEmptyComponent}
      ListFooterComponent={_renderFooter}
      renderItem={_renderItem}
      keyExtractor={item => {
        if (item && item.hash) {
          return item.hash.toString();
        } else {
          return (
            new Date().getTime().toString() +
            Math.floor(
              Math.random() * Math.floor(new Date().getTime()),
            ).toString()
          );
        }
      }}
      {...props}
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
