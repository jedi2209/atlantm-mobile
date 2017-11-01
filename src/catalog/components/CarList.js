import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

// redux
import { EVENT_LOAD_MORE, EVENT_REFRESH, EVENT_DEFAULT } from '../actionTypes';

// components
import CarListItem from './CarListItem';

// helpers
import { debounce, isObject } from 'lodash';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  messageContainer: {
    marginTop: verticalScale(60),
  },
  message: {
    fontFamily: styleConst.font.regular,
    fontSize: 18,
    alignSelf: 'center',
    letterSpacing: styleConst.ui.letterSpacing,
    textAlign: 'center',
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
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
  }

  static defaultProps = {
    pages: {},
    prices: {},
    items: null,
    navigation: {},
    itemScreen: null,
    isFetchItems: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      bounces: true,
      isRefreshing: false,
      loadingNextPage: false,
    };
  }

  // shouldComponentUpdate(nextProps) {
  //   const { items } = this.props;

  //   // console.log('Catalog this.props.navigation', this.props.navigation);
  //   // console.log('Catalog nextProps.navigation', nextProps.navigation);

  //   return (items.length !== nextProps.items.length);
  // }

  componentDidMount() {
    this.props.dataHandler(EVENT_DEFAULT);
  }

  renderEmptyComponent = () => {
    const { isFetchItems } = this.props;
    return isFetchItems ?
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
      (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>На онлайн-складе</Text>
          <Text style={styles.message}>нет авто</Text>
        </View>
      );
  }

  renderItem = ({ item }) => {
    const { itemScreen, navigation, prices } = this.props;
    return <CarListItem car={item} prices={prices} navigate={navigation.navigate} itemScreen={itemScreen} />;
  }

  renderFooter = () => {
    if (!this.state.loadingNextPage) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator animating color={styleConst.color.blue} />
      </View>
    );
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
    const {
      items,
      pages,
      dataHandler,
    } = this.props;

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

    // console.log('== CarList ==');

    return (
      <FlatList
        onEndReachedThreshold={0}
        initialNumToRender={10}
        data={items}
        onRefresh={this.onRefresh}
        refreshing={this.state.isRefreshing}
        ListEmptyComponent={this.renderEmptyComponent}
        ListFooterComponent={this.renderFooter}
        renderItem={this.renderItem}
        keyExtractor={item => item.id.api}
        onEndReached={this.getOnEndReached()}
      />
    );
  }
}
