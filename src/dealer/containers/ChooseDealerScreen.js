import React, { Component } from 'react';
import { View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// components
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../core/components/SelectListByCountry';

// helpers
import stylesHeader from '../../core/components/Header/style';

// actions
import { fetchDealers, selectDealer, selectRegion } from '../actions';

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    isFetchDealersList: dealer.meta.isFetchDealersList,
    isFetchDealer: dealer.meta.isFetchDealer,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchDealers,
    selectDealer,
    selectRegion,
  }, dispatch);
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
    const {
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      isFetchDealer,
    } = this.props;

    return (isFetchDealer !== nextProps.isFetchDealer) ||
      (region !== nextProps.region) ||
        (listRussia.length !== nextProps.listRussia.length) ||
          (listBelarussia.length !== nextProps.listBelarussia.length) ||
            (listUkraine.length !== nextProps.listUkraine.length);
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
    } = this.props;

    console.log('== ChooseDealer ==');

    return <SelectListByCountry
      itemLayout="dealer"
      region={region}
      dataHandler={fetchDealers}
      isFetchList={isFetchDealer}
      listRussia={listRussia}
      listUkraine={listUkraine}
      listBelarussia={listBelarussia}
      selectRegion={selectRegion}
      navigation={navigation}
      selectItem={selectDealer}
      selectedItem={dealerSelected}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
