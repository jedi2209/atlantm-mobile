import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchNewCarByFilter } from '../../actions';

// components
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

// helpers
import { get } from 'lodash';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import declOfNum from '../../../utils/decl-of-num';
import { EVENT_DEFAULT } from '../../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ dealer, nav, catalog }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    city: catalog.newCar.city,
    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchNewCarByFilter,
  }, dispatch);
};

class NewCarListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { total: {} } } = navigation.state;
    const count = get(params, 'total.count');
    const titleVariants = ['автомобиль', 'автомобиля', 'автомобилей'];

    return {
      headerTitle: count ? `${count} ${declOfNum(count, titleVariants)}` : null,
      headerStyle: styleHeader.common,
      headerTitleStyle: styleHeader.title,
      headerLeft: <HeaderIconBack navigation={navigation} />,
      headerRight: <HeaderIconMenu navigation={navigation} />,
    };
  }

  componentWillUpdate() {
    const { navigation, items } = this.props;

    if (items.total) {
      navigation.setParams({ total: items.total });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, items, isFetchingNewCarByFilter } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'NewCarListScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (items.length !== nextProps.items.length) ||
      (isFetchingNewCarByFilter !== nextProps.isFetchingNewCarByFilter);
  }

  fetchNewCar = (type) => {
    const {
      items,
      filterData,
      navigation,
      actionFetchNewCarByFilter,
    } = this.props;

    return actionFetchNewCarByFilter({
      type,
      searchUrl: filterData.search_url,
      nextPage: get(items, 'pages.next'),
    })
      .then(() => {
        return setTimeout(() => {
          navigation.setParams({ total: get(this.props.items, 'total') });
        }, 100);
      });
  }

  render() {
    const {
      items,
      navigation,
      dealerSelected,
      isFetchingNewCarByFilter,
    } = this.props;

    const { data, pages, prices } = items;

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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarListScreen);
