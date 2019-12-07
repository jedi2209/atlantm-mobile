import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
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
    headerRight: <View />,
    tabBarLabel: 'Поиск',
    tabBarIcon: ({focused}) => (
      <Icon
        name="search"
        type="FontAwesome5"
        style={{
          fontSize: 24,
          color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
        }}
      />
    ),
  });

  componentDidMount() {
    const search_url = '/stock/new/cars/get/city/1/';
    this.props.filterData;

    Amplitude.logEvent('screen', 'catalog/newcar/list', {
      search_url: '/stock/new/cars/get/city/1/', //get(this.props, 'filterData.search_url'),
    });
  }

  componentDidUpdate() {
    const {navigation, items} = this.props;

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
      isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter
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
        searchUrl: '/stock/new/cars/get/city/1/', //filterData.search_url,
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
      searchUrl: '/stock/new/cars/get/city/1/', //filterData.search_url,
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

    console.log('== NewCarListScreen ==');

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
