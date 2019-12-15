/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import {get} from 'lodash';

import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// redux
import {connect} from 'react-redux';
import {actionFetchNewCarByFilter} from '../../actions';

import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

import {TEXT_EMPTY_CAR_LIST} from '../../constants';

// components
import EmptyMessage from '../../../core/components/EmptyMessage';
import CarListItem from '../../components/CarListItem';

const mapStateToProps = ({dealer, nav, catalog}) => {
  // console.log('>>> catalog newcarlistscrasdasdasdasdasd', catalog.newCar.filters)

  return {
    nav,
    dealerSelected: dealer.selected,
    city: catalog.newCar.city,
    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,

    // для pull-to-refresh
    filterBrands: catalog.newCar.filterBrands,
    filterModels: catalog.newCar.filterModels,
    filterBody: catalog.newCar.filterBody,
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPrice: catalog.newCar.filterPrice,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    filters: catalog.newCar.filters,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarByFilter,
};

class NewCarListScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'новые автомобили',
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <HeaderIconBack
        theme="white"
        navigation={navigation}
        returnScreen="MenuScreen"
      />
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewCarFilterScreen');
        }}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 14,
          }}
          source={require('./filter.png')}
        />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    const {dealerSelected, filterData} = this.props;
    const defaultSearchUrl = `/stock/new/cars/get/city/${
      dealerSelected.city.id
    }/`;
    const searchUrl = filterData.search_url || defaultSearchUrl;

    // Amplitude.logEvent('screen', 'catalog/newcar/list', {
    //   search_url: searchUrl,
    // });
    this.fetchNewCar();
  }

  componentDidUpdate(nextProps) {
    // console.log('=========>', this.props.filterData.search_url);
    const {navigation, items} = this.props;

    if (items.total) {
      return setTimeout(() => {
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 200);
    }

    // console.log(">>>>> GIVE ME A  DATA", this.props.filters !== nextProps.filters)
    // if (this.props.filters !== nextProps.filters) {
    // }
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

  shouldComponentUpdate(nextProps) {
    const {dealerSelected, items, isFetchingNewCarByFilter} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'NewCarListScreen';

    console.log(
      items.length !== nextProps.items.length ||
        isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter ||
        this.props.filters !== nextProps.filters,
      'тут работает',
    );
    return (
      items.length !== nextProps.items.length ||
      isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter ||
      this.props.filters !== nextProps.filters
    );
  }

  renderItem = ({item}) => {
    if (item.type === 'empty') {
      return <EmptyMessage text={TEXT_EMPTY_CAR_LIST} />;
    }

    const {itemScreen, navigation, prices} = this.props;
    return (
      <CarListItem
        car={item}
        prices={prices}
        navigate={navigation.navigate}
        itemScreen={itemScreen}
      />
    );
  };

  renderFooter = () => {
    //if (!this.state.loadingNextPage) {return null;}

    return (
      <View style={styles.footer}>
        <ActivityIndicator animating color={styleConst.color.blue} />
      </View>
    );
  };

  fetchNewCar = type => {
    const {
      items,
      filterData,
      navigation,
      actionFetchNewCarByFilter,

      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterPriceSpecial,
    } = this.props;

    // const onResult = () => {
    //   return setTimeout(() => {
    //     this.props.navigation.setParams({
    //       total: get(this.props.items, 'total'),
    //     });
    //   }, 150);
    // };

    // if (type === EVENT_REFRESH) {
    //   return actionFetchNewCarByFilter({
    //     searchUrl:
    //       filterData.search_url ||
    //       `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
    //     filterBrands,
    //     filterModels,
    //     filterBody,
    //     filterGearbox,
    //     filterDrive,
    //     filterEngineType,
    //     filterPrice,
    //     filterPriceSpecial,
    //   }).then(onResult);
    // }

    console.log('>>>> FETCH NEW CAR');

    return actionFetchNewCarByFilter({
      type,
      searchUrl:
        filterData.search_url ||
        `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
      nextPage: get(items, 'pages.next'),
    });
    //.then(onResult);
  };

  render() {
    const {
      items,
      navigation,
      dealerSelected,
      isFetchingNewCarByFilter,
    } = this.props;

    const {data, pages, prices} = items;

    console.log(
      ' == NewCarListScreen ===========>',
      data,
      this.props.filters,
    );

    return (
      <View>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id.api.toString()}`}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarListScreen);
