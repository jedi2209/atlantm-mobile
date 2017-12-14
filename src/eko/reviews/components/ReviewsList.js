import React, { Component } from 'react';
import { FlatList, Platform, View, StyleSheet } from 'react-native';

// components
import Review from './Review';
import EmptyMessage from '../../../core/components/EmptyMessage';
import SpinnerView from '../../../core/components/SpinnerView';
import FlatListFooter from '../../../core/components/FlatListFooter';

// helpers
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { EVENT_DEFAULT, EVENT_LOAD_MORE, EVENT_REFRESH } from '../../../core/actionTypes';

const TEXT_EMPTY = 'Нет отзывов для отображения';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
  },
});

export default class ReviewsList extends Component {
  static propTypes = {
    pages: PropTypes.object,
    items: PropTypes.array,
    dataHandler: PropTypes.func,
    isFetchItems: PropTypes.bool,
    onPressItemHandler: PropTypes.func,
  }

  static defaultProps = {
    pages: {},
    items: null,
    isFetchItems: false,
    onPressItemHandler: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      bounces: true,
      isRefreshing: false,
      loadingNextPage: false,
    };
  }

  componentDidMount() {
    const { items, isFetchItems, dataHandler } = this.props;

    if ((!items || items.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }

  renderEmptyComponent = () => {
    const { isFetchItems } = this.props;

    return isFetchItems ?
      <SpinnerView /> :
      <EmptyMessage text={TEXT_EMPTY} />;
  }

  renderItem = ({ item }) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={TEXT_EMPTY} />;
    }

    const { onPressItemHandler } = this.props;
    return <Review
      inList={true}
      review={item}
      onPressHandler={onPressItemHandler}
    />;
  }

  renderFooter = () => {
    if (!this.state.loadingNextPage) return null;

    return <FlatListFooter />;
  }

  onRefresh = () => {
    const { dataHandler } = this.props;

    this.setState({
      bounces: false,
      isRefreshing: true,
    });

    dataHandler(EVENT_REFRESH).then(() => {
      this.setState({
        bounces: true,
        isRefreshing: false,
      });
    });
  }

  getOnEndReached = () => debounce(this.handleLoadMore, 1000)

  handleLoadMore = () => {
    const { items, pages, dataHandler } = this.props;

    if (!pages.next || items.length === 0 || this.state.loadingNextPage) return false;

    __DEV__ && console.log('handleLoadMore');

    this.setState({
      loadingNextPage: true,
      bounces: false,
    });

    return dataHandler(EVENT_LOAD_MORE).then(() => {
      this.setState({
        loadingNextPage: false,
        bounces: true,
      });
    });
  }

  render() {
    const { items } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          onEndReachedThreshold={1}
          initialNumToRender={7}
          data={items}
          onRefresh={this.onRefresh}
          refreshing={this.state.isRefreshing}
          ListEmptyComponent={this.renderEmptyComponent}
          ListFooterComponent={this.renderFooter}
          renderItem={this.renderItem}
          keyExtractor={item => item.hash}
          onEndReached={this.getOnEndReached()}
          scrollEventThrottle={100}
        />
      </View>
    );
  }
}
