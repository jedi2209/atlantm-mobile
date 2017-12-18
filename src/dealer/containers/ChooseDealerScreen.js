import React, { Component } from 'react';
import { View } from 'react-native';

// redux
import { connect } from 'react-redux';

// components
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../core/components/SelectListByCountry';

// helpers
import stylesHeader from '../../core/components/Header/style';

// actions
import { fetchDealers, selectDealer, selectRegion } from '../actions';

const mapStateToProps = ({ dealer, nav, }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    isFetchDealersList: dealer.meta.isFetchDealersList,
    isFetchDealer: dealer.meta.isFetchDealer,
  };
};

const mapDispatchToProps = {
  fetchDealers,
  selectDealer,
  selectRegion,
};

class ChooseDealerScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Мой автоцентр',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ChooseDealerScreen';

    return isActiveScreen;
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      isFetchDealer,
      navigation,
      fetchDealers,
      selectRegion,
      selectDealer,
      dealerSelected,
      isFetchDealersList,
      isGoBack,
    } = this.props;

    console.log('== ChooseDealer ==');

    return <SelectListByCountry
      itemLayout="dealer"
      region={region}
      dataHandler={fetchDealers}
      isFetchList={isFetchDealersList || isFetchDealer}
      listRussia={listRussia}
      listUkraine={listUkraine}
      listBelarussia={listBelarussia}
      selectRegion={selectRegion}
      navigation={navigation}
      selectItem={selectDealer}
      selectedItem={dealerSelected}
      isGoBack={isGoBack}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
