import React, { Component } from 'react';
import { View } from 'react-native';

// redux
import { connect } from 'react-redux';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../../core/components/SelectListByCountry';

// helpers
import stylesHeader from '../../../core/components/Header/style';

// actions
import {
  actionSelectUsedCarCity,
  actionSelectUsedCarRegion,
  actionResetUsedCarList,
  actionSetNeedUpdateUsedCarList,
} from '../../actions';

const mapStateToProps = ({ catalog, dealer }) => {
  return {
    city: catalog.usedCar.city,
    region: catalog.usedCar.region,
    listRussia: dealer.listRussiaByCities,
    listBelarussia: dealer.listBelarussiaByCities,
    listUkraine: dealer.listUkraineByCities,
  };
};

const mapDispatchToProps = {
  actionSelectUsedCarCity,
  actionSelectUsedCarRegion,
  actionResetUsedCarList,
  actionSetNeedUpdateUsedCarList,
};

class UsedCarCityScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Выбор города',
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
    } = this.props;

    return (region !== nextProps.region) ||
        (listRussia.length !== nextProps.listRussia.length) ||
          (listBelarussia.length !== nextProps.listBelarussia.length) ||
            (listUkraine.length !== nextProps.listUkraine.length);
  }

  selectItem = (item) => {
    this.props.actionResetUsedCarList();
    this.props.actionSetNeedUpdateUsedCarList();
    this.props.actionSelectUsedCarCity(item);
  }

  render() {
    const {
      city,
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      navigation,
      actionSelectUsedCarRegion,
      actionSelectUsedCarCity,
    } = this.props;

    console.log('== UsedCarCityScreen ==');

    return <SelectListByCountry
      itemLayout="city"
      region={region}
      selectedItem={city}
      navigation={navigation}
      listRussia={listRussia}
      listUkraine={listUkraine}
      listBelarussia={listBelarussia}
      selectRegion={actionSelectUsedCarRegion}
      selectItem={this.selectItem}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsedCarCityScreen);
