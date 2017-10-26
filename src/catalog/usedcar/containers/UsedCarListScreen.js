import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Container, Content, StyleProvider, Button } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchUsedCar, actionSetUsedCarCity } from '../../actions';

// components
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarList from '../../components/CarList';

// helpres
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    // justifyContent: 'center',
    flex: 1,
  },
});

const mapStateToProps = ({ dealer, nav, catalog }) => {
  return {
    nav,
    city: catalog.usedCar.city,
    items: catalog.usedCar.items,
    total: catalog.usedCar.total,
    pages: catalog.usedCar.pages,
    prices: catalog.usedCar.prices,
    isFetchItems: catalog.usedCar.meta.isFetchItems,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchUsedCar,
    actionSetUsedCarCity,
  }, dispatch);
};

class UserCarListScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Автомобили с пробегом',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, items, isFetchItems } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'UserCarListScreen';

    // console.log('Catalog this.props.navigation', this.props.navigation);
    // console.log('Catalog nextProps.navigation', nextProps.navigation);

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (items.length !== nextProps.items.length) ||
      (isFetchItems !== nextProps.isFetchItems);
  }

  fetchUsedCar = (type) => {
    const { actionFetchUsedCar, city, pages } = this.props;

    return actionFetchUsedCar(type, city, pages.next);
  }

  render() {
    const {
      city,
      items,
      total,
      pages,
      prices,
      navigation,
      isFetchItems,
      dealerSelected,
    } = this.props;

    console.log('== UsedCarListScreen ==');

    return (
      <View style={styles.content}>
        <CarList
          items={items}
          pages={pages}
          prices={prices}
          itemScreen="UsedCarItemScreen"
          dataHandler={this.fetchUsedCar}
          isFetchItems={isFetchItems}
          navigation={navigation}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCarListScreen);
