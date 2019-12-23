/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {
  actionFetchUsedCar,
  actionSetUsedCarCity,
  actionShowPriceFilter,
  actionHidePriceFilter,
  actionResetUsedCarList,
  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
  actionSetStopNeedUpdateUsedCarList,
} from '../../actions';

// components
import FooterFilter from '../components/FooterFilter';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import declOfNum from '../../../utils/decl-of-num';
import {EVENT_DEFAULT} from '../../actionTypes';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.header,
  },
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
    city: catalog.usedCar.city,
    items: catalog.usedCar.items,
    total: catalog.usedCar.total,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    priceRange: catalog.usedCar.priceRange,
    needUpdate: catalog.usedCar.meta.needUpdate,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    isPriceFilterShow: catalog.usedCar.meta.isPriceFilterShow,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionFetchUsedCar,
  actionSetUsedCarCity,
  actionShowPriceFilter,
  actionHidePriceFilter,
  actionResetUsedCarList,
  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
  actionSetStopNeedUpdateUsedCarList,
};

class UserCarListScreen extends Component {
  // static navigationOptions = ({navigation}) => {
  //   const {params = {total: {}}} = navigation.state;
  //   const count = params.total.count;
  //   const titleVariants = ['автомобиль', 'автомобиля', 'автомобилей'];

  //   return {
  //     headerTitle: count ? `${count} ${declOfNum(count, titleVariants)}` : null,
  //     headerStyle: stylesHeader.common,
  //     headerTitleStyle: stylesHeader.title,
  //     headerLeft: <HeaderIconBack navigation={navigation} />,
  //     headerRight: <HeaderIconMenu navigation={navigation} />,
  //   };
  // };
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'поддержанные автомобили',
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
          navigation.navigate('UsedCarFilterScreen');
        }}>
        <Icon type="Octicons" name="settings" style={styles.iconFilter} />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.setParams({total: this.props.total});
    }, 200);

    Amplitude.logEvent('screen', 'catalog/usedcar');
  }

  componentDidUpdate() {
    const {
      total,
      navigation,
      needUpdate,
      isFetchItems,
      actionSetStopNeedUpdateUsedCarList,
    } = this.props;

    if (needUpdate && !isFetchItems) {
      this.fetchUsedCar('default').then(() => {
        actionSetStopNeedUpdateUsedCarList();
        setTimeout(() => {
          this.props.navigation.setParams({total: this.props.total});
        }, 200);
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      total,
      items,
      needUpdate,
      isFetchItems,
      dealerSelected,
      isPriceFilterShow,
    } = this.props;

    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'UserCarListScreen';

    return (
      (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      items.length !== nextProps.items.length ||
      isFetchItems !== nextProps.isFetchItems ||
      total.count !== nextProps.total.count ||
      isPriceFilterShow !== nextProps.isPriceFilterShow ||
      // city.id !== nextProps.city.id ||
      needUpdate !== nextProps.needUpdate ||
      this.props.priceRange !== nextProps.priceRange
    );
  }

  fetchUsedCar = (type, priceRangeFromFilter) => {
    const {
      city,
      total,
      pages,
      priceRange,
      navigation,
      actionFetchUsedCar,
      dealerSelected,
    } = this.props;

    return actionFetchUsedCar({
      type,
      priceRange: priceRangeFromFilter || priceRange,
      city: city ? city.id : dealerSelected.city.id,
      nextPage: pages.next,
    }).then(() => {
      return setTimeout(() => {
        this.props.navigation.setParams({total: this.props.total});
      }, 100);
    });
  };

  onPressCity = () => {
    const {navigation} = this.props;
    const returnScreenKey = navigation.state.key;
    navigation.navigate('UsedCarCityScreen', {returnScreen: returnScreenKey});
  };

  onPressPrice = () => {
    this.props.actionShowPriceFilter();
  };

  onClosePrice = priceRange => {
    const {
      fetchUsedCar,
      actionHidePriceFilter,
      actionResetUsedCarList,
      actionSelectUsedCarPriceRange,
      actionSetNeedUpdateUsedCarList,
    } = this.props;

    actionHidePriceFilter();

    if (priceRange) {
      actionResetUsedCarList();
      actionSetNeedUpdateUsedCarList();
      actionSelectUsedCarPriceRange(priceRange);
      this.fetchUsedCar(EVENT_DEFAULT, priceRange);
    }
  };

  render() {
    const {
      items,
      pages,
      prices,
      navigation,
      priceRange,
      isFetchItems,
      dealerSelected,
    } = this.props;

    const showPriceFilterIcon = get(items, '0.type') !== 'empty';

    console.log('== UsedCarListScreen ==');

    return (
      <View style={styles.content}>
        <CarList
          items={items}
          pages={pages}
          prices={prices}
          itemScreen="UsedCarItemScreen"
          dataHandler={this.fetchUsedCar}
          dealerSelected={dealerSelected}
          isFetchItems={isFetchItems}
          navigation={navigation}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserCarListScreen);
