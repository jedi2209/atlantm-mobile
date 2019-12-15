import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

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
import {debounce} from 'lodash';
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

export default class CarList extends Component {
  static propTypes = {
    pages: PropTypes.object,
    items: PropTypes.array,
    itemScreen: PropTypes.string,
    isFetchItems: PropTypes.bool,
    navigation: PropTypes.object,
    prices: PropTypes.object,
  };

  static defaultProps = {
    pages: {},
    prices: {},
    items: null,
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
    const {items, isFetchItems, dataHandler} = this.props;

    if ((!items || items.length === 0) && !isFetchItems) {
      dataHandler(EVENT_DEFAULT);
    }
  }

  renderEmptyComponent = () => {
    //    const { isFetchItems } = this.props;
    const isFetchItems = true;
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
    console.log(this.props, 'this.props');
    return (
      <CarListItem
        currency={this.props.prices.curr.name} //TODO: что-то может пойти не так ?
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

    // this.setState({
    //   bounces: false,
    //   isRefreshing: true,
    // });

    dataHandler(EVENT_REFRESH).then(() => {
      this.setState({
        bounces: true,
        isRefreshing: false,
      });
    });
  };

  //getOnEndReached = () => debounce(this.handleLoadMore, 1000)

  handleLoadMore = () => {
    const {items, pages, dataHandler} = this.props;

    if (!pages.next || items.length === 0 || this.state.loadingNextPage) {
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
    const {items} = this.props;

    console.log('== CarList ==');

    return (
      <FlatList
        onEndReachedThreshold={0.4}
        initialNumToRender={10}
        maxToRenderPerBatch={10} // Reduce number in each render batch
        // eslint-disable-next-line react/jsx-no-duplicate-props
        maxToRenderPerBatch={20} // Increase time between renders
        data={items}
        onRefresh={this.onRefresh}
        refreshing={this.state.isRefreshing}
        ListEmptyComponent={this.renderEmptyComponent}
        ListFooterComponent={this.renderFooter}
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id.api.toString()}`}
        onEndReached={this.handleLoadMore}
      />
    );
  }
}
