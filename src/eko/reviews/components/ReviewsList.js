import React, {Component} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';

// components
import Review from './Review';
import EmptyMessage from '../../../core/components/EmptyMessage';
import LogoLoader from '../../../core/components/LogoLoader';
import FlatListFooter from '../../../core/components/FlatListFooter';

// helpers
import PropTypes from 'prop-types';
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

export default class ReviewsList extends Component {
  static propTypes = {
    pages: PropTypes.object,
    items: PropTypes.array,
    dataHandler: PropTypes.func,
    isFetchItems: PropTypes.bool,
    onPressItemHandler: PropTypes.func,
  };

  static defaultProps = {
    pages: {},
    items: null,
    isFetchItems: false,
    onPressItemHandler: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      bounces: true,
      isRefreshing: false,
      loadingNextPage: false,
    };
  }

  componentDidMount() {
    const {items, isFetchItems, dataHandler} = this.props;

    if ((!items || items.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }

  renderEmptyComponent = () => {
    const {isFetchItems} = this.props;

    return isFetchItems ? (
      <LogoLoader mode={'relative'} />
    ) : (
      <EmptyMessage text={strings.EkoScreen.empty.text} />
    );
  };

  renderItem = ({item}) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={strings.EkoScreen.empty.text} />;
    }

    const {onPressItemHandler} = this.props;
    return (
      <Review inList={true} review={item} onPressHandler={onPressItemHandler} />
    );
  };

  renderFooter = () => {
    if (!this.state.loadingNextPage) {
      return null;
    }

    return <FlatListFooter />;
  };

  onRefresh = () => {
    const {dataHandler} = this.props;

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
  };

  handleLoadMore = () => {
    const {items, pages, dataHandler} = this.props;

    if (!pages.next || items.length === 0 || this.state.loadingNextPage) {
      return false;
    }

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
  };

  render() {
    const {items} = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          windowSize={3}
          removeClippedSubviews={true}
          onEndReachedThreshold={10}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          data={items}
          onRefresh={this.onRefresh}
          refreshing={this.state.isRefreshing}
          ListEmptyComponent={this.renderEmptyComponent}
          ListFooterComponent={this.renderFooter}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.hash.toString()}`}
          onEndReached={this.handleLoadMore}
        />
      </View>
    );
  }
}
