/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
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
    marginRight: 15,
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
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Text style={stylesHeader.blueHeaderTitle}>Подержанные автомобили</Text>
      ),
      headerStyle: [stylesHeader.headerStyle, stylesHeader.blueHeader],
      headerTitleStyle: [
        stylesHeader.headerTitleStyle,
        stylesHeader.blueHeaderTitle,
      ],
      headerLeft: null,
      headerRight: (
        <View style={stylesHeader.headerRightStyle}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UsedCarFilterScreen');
            }}>
            <Icon type="FontAwesome" name="filter" style={styles.iconFilter} />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.setParams({total: this.props.total});
    }, 200);

    Amplitude.logEvent('screen', 'catalog/usedcar/list');
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

  onPressPrice = () => {
    this.props.actionShowPriceFilter();
  };

  onClosePrice = (priceRange) => {
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
        <StatusBar hidden />
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
