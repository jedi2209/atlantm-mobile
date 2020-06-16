import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchNewCarByFilter} from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

import Spinner from 'react-native-loading-spinner-overlay';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import {EVENT_REFRESH} from '../../../core/actionTypes';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  iconFilter: {
    color: '#fff',
    fontSize: 25,
    marginRight: 20,
  },
});

const mapStateToProps = ({dealer, nav, catalog}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    city: catalog.newCar.city,
    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,

    filterBrands: catalog.newCar.filters.brandFilters,
    filterModels: catalog.newCar.filters.modelFilter,
    filterBody: catalog.newCar.filters.bodyFilters,
    filterPrice: catalog.newCar.filters.priceFilter,

    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    filters: catalog.newCar.filters,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarByFilter,
};

class NewCarListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      (navigation.state.params && navigation.state.params.returnScreen) ||
      'BottomTabNavigation';

    console.log('navigation.state.params >>>>>>', returnScreen);

    return {
      headerTitle: (
        <Text style={stylesHeader.blueHeaderTitle}>Новые автомобили</Text>
      ),
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: <View />,
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NewCarFilterScreen');
            }}>
            <Icon type="FontAwesome" name="filter" style={styles.iconFilter} />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    const {dealerSelected, filterData} = this.props;
    const defaultSearchUrl = `/stock/new/cars/get/city/${dealerSelected.city.id}/`;

    const searchUrl = filterData.search_url || defaultSearchUrl;

    Amplitude.logEvent('screen', 'catalog/newcar/list', {
      search_url: searchUrl,
    });
  }

  componentDidUpdate() {
    const {items} = this.props;

    if (items.total) {
      return setTimeout(() => {
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 200);
    }
  }

  shouldComponentUpdate(nextProps) {
    const {dealerSelected, items, isFetchingNewCarByFilter} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'NewCarListScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      items.length !== nextProps.items.length ||
      isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter ||
      this.props.filters !== nextProps.filters
    );
  }

  fetchNewCar = (type) => {
    const {
      items,
      filterData,
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

    const onResult = () => {
      return setTimeout(() => {
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 150);
    };

    if (type === EVENT_REFRESH) {
      console.log('EVENT_REFRESH');
      return actionFetchNewCarByFilter({
        searchUrl:
          filterData.search_url ||
          `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
        filterBrands,
        filterModels,
        filterBody,
        filterGearbox,
        filterDrive,
        filterEngineType,
        filterPrice,
        filterPriceSpecial,
      }).then(onResult);
    }

    return actionFetchNewCarByFilter({
      type,
      searchUrl:
        filterData.search_url ||
        `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
      nextPage: get(items, 'pages.next'),
    }).then(onResult);
  };

  render() {
    const {
      items,
      navigation,
      dealerSelected,
      isFetchingNewCarByFilter,
    } = this.props;

    const {data, pages, prices} = items;

    return (
      <View style={styles.content}>
        <StatusBar barStyle="light-content" />
        {this.state.loading ? (
          <Spinner visible={true} color={styleConst.color.blue} />
        ) : (
          <CarList
            items={data}
            pages={pages}
            prices={prices}
            navigation={navigation}
            resizeMode="contain"
            itemScreen="NewCarItemScreen"
            dataHandler={this.fetchNewCar}
            dealerSelected={dealerSelected}
            isFetchItems={isFetchingNewCarByFilter}
          />
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarListScreen);
