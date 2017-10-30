import React, { Component } from 'react';
import { View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../../core/components/SelectListByCountry';

// helpers
import styleHeader from '../../../core/components/Header/style';

// actions
import {
  actionSelectNewCarCity,
  actionSelectNewCarRegion,
} from '../../actions';

const mapStateToProps = ({ catalog, dealer }) => {
  return {
    city: catalog.newCar.city,
    region: catalog.newCar.region,
    listRussia: dealer.listRussiaByCities,
    listBelarussia: dealer.listBelarussiaByCities,
    listUkraine: dealer.listUkraineByCities,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarCity,
    actionSelectNewCarRegion,
  }, dispatch);
};

class NewCarCityScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Выбор города',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
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
    this.props.actionSelectNewCarCity(item);
  }

  render() {
    const {
      city,
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      navigation,
      actionSelectNewCarRegion,
    } = this.props;

    console.log('== NewCarCityScreen ==');

    return <SelectListByCountry
      itemLayout="city"
      region={region}
      selectedItem={city}
      navigation={navigation}
      listRussia={listRussia}
      listUkraine={listUkraine}
      listBelarussia={listBelarussia}
      selectRegion={actionSelectNewCarRegion}
      selectItem={this.selectItem}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarCityScreen);
