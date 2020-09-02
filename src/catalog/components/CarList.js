import React, {PureComponent} from 'react';
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
import {verticalScale} from '../../utils/scale';
import {TEXT_EMPTY_CAR_LIST} from '../constants';

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default class CarList extends PureComponent {
  static propTypes = {
    pages: PropTypes.object,
    data: PropTypes.array,
    itemScreen: PropTypes.string,
    isFetchItems: PropTypes.bool,
    navigation: PropTypes.object,
    prices: PropTypes.object,
  };

  static defaultProps = {
    pages: {},
    prices: {},
    data: null,
    navigation: {},
    itemScreen: null,
    isFetchItems: false,
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
    const {data, isFetchItems, dataHandler} = this.props;

    if ((!data || data.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }

  renderEmptyComponent = () => {
    const {isFetchItems} = this.props;

    return isFetchItems ? (
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
    ) : (
      <EmptyMessage text={TEXT_EMPTY_CAR_LIST} />
    );
  };

  renderItem = ({item}) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={TEXT_EMPTY_CAR_LIST} />;
    }

    const {itemScreen, navigation, prices} = this.props;
    return (
      <CarListItem
        resizeMode={this.props.resizeMode}
        key={item.hash ? item.hash : item.id.api}
        currency={this.props.prices.curr.name}
        car={item}
        prices={prices}
        navigate={navigation.navigate}
        itemScreen={itemScreen}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loadingNextPage) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator animating color={styleConst.color.blue} />
      </View>
    );
  };

  onRefresh = () => {
    const {dataHandler} = this.props;

    dataHandler(EVENT_REFRESH).then(() => {
      this.setState({
        bounces: true,
        isRefreshing: false,
      });
    });
  };

  handleLoadMore = () => {
    const {data, pages, dataHandler} = this.props;

    if (!pages.next || data.length === 0 || this.state.loadingNextPage) {
      return false;
    }

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
  };

  render() {
    console.log('== CarList ==');

    return (
      <FlatList
        onEndReachedThreshold={0.4}
        initialNumToRender={10}
        maxToRenderPerBatch={20} // Increase time between renders
        onRefresh={this.onRefresh}
        refreshing={this.state.isRefreshing}
        ListEmptyComponent={this.renderEmptyComponent}
        ListFooterComponent={this.renderFooter}
        renderItem={this.renderItem}
        keyExtractor={(item) => {
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
        onEndReached={this.handleLoadMore}
        {...this.props}
      />
    );
  }
}
