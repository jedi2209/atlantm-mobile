import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { StyleProvider } from 'native-base';

// redux
import { EVENT_LOAD_MORE, EVENT_REFRESH, EVENT_DEFAULT } from '../actionTypes';

// components
import CarListItem from './CarListItem';

// helpers
import { debounce } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({
  list: {
    // backgroundColor: 'red',
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  message: {
    fontFamily: styleConst.font.regular,
    fontSize: 18,
    alignSelf: 'center',
    marginTop: verticalScale(60),
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

  componentDidMount() {
    const { dataHandler, dealerSelected } = this.props;

    dataHandler(EVENT_DEFAULT);
  }

  renderEmptyComponent = () => {
    return this.props.isFetchItems ?
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
      <Text style={styles.message}>На данный момент в онлайн-складе нет подержанных авто</Text>;
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
    const { items, dataHandler } = this.props;

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

    console.log('== CarList ==');

    return (
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        extraData={items}
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
