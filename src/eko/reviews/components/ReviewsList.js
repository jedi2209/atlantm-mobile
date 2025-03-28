import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';

// components
import Review from './Review';
import EmptyMessage from '../../../core/components/EmptyMessage';
import LogoLoader from '../../../core/components/LogoLoader';
import FlatListFooter from '../../../core/components/FlatListFooter';

// helpers
import {
  EVENT_DEFAULT,
  EVENT_LOAD_MORE,
  EVENT_REFRESH,
} from '../../../core/actionTypes';

import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
  },
});

const ReviewsList = props => {
  const {
    pages = {},
    items = null,
    isFetchItems = false,
    onPressItemHandler = null,
    extraData,
    dataHandler,
  } = props;

  const [bounces, setBounces] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  useEffect(() => {
    if ((!items || items.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }, []);

  const _renderEmptyComponent = () => {
    return isFetchItems ? (
      <LogoLoader mode={'relative'} />
    ) : (
      <EmptyMessage text={strings.EkoScreen.empty.text} />
    );
  };

  const _renderItem = ({item}) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={strings.EkoScreen.empty.text} />;
    }
    return (
      <Review inList={true} review={item} onPressHandler={onPressItemHandler} />
    );
  };

  const _renderFooter = () => {
    if (!loadingNextPage) {
      return null;
    }

    return <FlatListFooter />;
  };

  const _onRefresh = () => {
    setBounces(false);
    setIsRefreshing(true);

    dataHandler(EVENT_REFRESH).then(() => {
      setBounces(true);
      setIsRefreshing(false);
    });
  };

  const _handleLoadMore = () => {
    if (!pages.next || items.length === 0 || loadingNextPage) {
      return false;
    }
    setBounces(false);
    setLoadingNextPage(true);

    return dataHandler(EVENT_LOAD_MORE).then(() => {
      setBounces(true);
      setLoadingNextPage(false);
    });
  };

  return (
    <FlatList
      windowSize={3}
      removeClippedSubviews={true}
      onEndReachedThreshold={10}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      data={items}
      extraData={extraData}
      onRefresh={_onRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={_renderEmptyComponent}
      ListFooterComponent={_renderFooter}
      renderItem={_renderItem}
      keyExtractor={item => `${item.hash.toString()}`}
      onEndReached={_handleLoadMore}
    />
  );
};

export default ReviewsList;
