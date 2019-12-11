import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import {Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchNewCarByFilter} from '../../actions';

// components
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import declOfNum from '../../../utils/decl-of-num';
import {EVENT_REFRESH} from '../../../core/actionTypes';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

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
  // static navigationOptions = ({ navigation }) => {
  //   const { params = { total: {} } } = navigation.state;
  //   const count = get(params, 'total.count');
  //   const titleVariants = ['автомобиль', 'автомобиля', 'автомобилей'];

  //   return {
  //     headerTitle: count ? `${count} ${declOfNum(count, titleVariants)}` : null,
  //     headerStyle: stylesHeader.common,
  //     headerTitleStyle: stylesHeader.title,
  //     headerLeft: <HeaderIconBack navigation={navigation} />,
  //     headerRight: <HeaderIconMenu navigation={navigation} />,
  //   };
  // }
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
    const defaultSearchUrl = `/stock/new/cars/get/city/${dealerSelected.city.id}/`;
    const searchUrl = filterData.search_url || defaultSearchUrl;

    Amplitude.logEvent('screen', 'catalog/newcar/list', {
      search_url: searchUrl,
    });
    // this.fetchCars();
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

  // fetchCars() {
  //   this.props.actionFetchNewCarByFilter({
  //     type: 'EVENT_DEFAULT',
  //     searchUrl:
  //       this.props.filterData.search_url ||
  //       `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
  //     // nextPage: get(items, 'pages.next'),
  //     // filterBrands: [6],
  //     filterModels: this.props.filters.brandFilters.map(filter => filter.id),
  //     // filterBody
  //     // filterGearbox
  //     // filterDrive
  //     // filterEngineType
  //     // filterPrice
  //     // filterPriceSpecial
  //   });
  //     // .then(onResult);
  // }

  shouldComponentUpdate(nextProps) {
    const {dealerSelected, items, isFetchingNewCarByFilter} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'NewCarListScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      items.length !== nextProps.items.length ||
      isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter
      // || this.props.filters !== nextProps.filters
    );
  }

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

    const onResult = () => {
      return setTimeout(() => {
        this.props.navigation.setParams({
          total: get(this.props.items, 'total'),
        });
      }, 150);
    };

    if (type === EVENT_REFRESH) {
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

    // console.log('>>>> FETCH NEW CAR')

    return actionFetchNewCarByFilter({
      type,
      searchUrl:
        filterData.search_url ||
        `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
      nextPage: get(items, 'pages.next'),
      // filterBrands: [6],
      // filterModels: this.props.filters.brandFilters.map(filter => filter.id),
      // filterBody
      // filterGearbox
      // filterDrive
      // filterEngineType
      // filterPrice
      // filterPriceSpecial
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

    console.log('== NewCarListScreen ==');
    console.log('=========>', this.props.filterData);

    return (
      <View style={styles.content}>
        <CarList
          items={data}
          pages={pages}
          prices={prices}
          navigation={navigation}
          itemScreen="NewCarItemScreen"
          dataHandler={this.fetchNewCar}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchingNewCarByFilter}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarListScreen);
