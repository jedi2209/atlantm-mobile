/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Container, Row, Button, Icon, Segment, Content, Text, Card, CardItem, Right, StyleProvider} from 'native-base';
import getTheme from '../../../../native-base-theme/components';
import {verticalScale} from '../../../utils/scale';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styleConst from '../../../core/style-const';
// redux
import {connect} from 'react-redux';
import {
  actionFetchNewCarByFilter,
  actionFetchNewCarFilterData,
  actionShowNewCarFilterPrice,
  actionHideNewCarFilterPrice,
  actionSelectNewCarFilterPrice,
  actionSetNewCarFilterPriceSpecial,
  actionSaveCarFilters,
  // actionSelectNewCarFilterModels,
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import showPrice from '../../../utils/price';
import {ScrollView} from 'react-native-gesture-handler';

import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.accordeonGrey1,
    borderWidth: 0,
  },
  footer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  row: {
    backgroundColor: styleConst.color.white,
    marginBottom: 2,
    height: 65,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  cardItem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
    flex: 1,
  },
  segmentWrapper: {
    alignItems: 'center',
  },
  segmentTab: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 40,
  },
  segmentTabTwo: {
    width: '50%',
  },
  segmentButtonText: {
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  resultButton: {
    width: '90%',
    marginHorizontal: '5%',
    position: 'absolute',
    bottom: 30,
  },
  resultButtonText: {
    textTransform: 'uppercase',
  },
});

const mapStateToProps = ({catalog, dealer, nav}) => {
  const {
    brandFilters,
    bodyFilters,
    priceFilter,
    modelFilter,
  } = catalog.newCar.filters;

  let filterBrands, filterBody, filterPrice, filterModels, isNotFilterBrands;

  if (bodyFilters.length > 0) {
    filterBody = bodyFilters;
  } else {
    filterBody =
      catalog.newCar.filterData && catalog.newCar.filterData.data.body
        ? Object.keys(catalog.newCar.filterData.data.body).map((body) => ({
            id: body,
            name: catalog.newCar.filterData.data.body[body],
          }))
        : [];
  }

  if (brandFilters.length > 0) {
    filterBrands = brandFilters;
  } else {
    filterBrands = [];

    if (catalog.newCar.filterData) {
      if (!catalog.newCar.filterData.data.brand) {
        isNotFilterBrands = true;
      } else {
        filterBrands = Object.keys(catalog.newCar.filterData.data.brand).map(
          (body) => ({
            id: body,
            checked: false,
            name: catalog.newCar.filterData.data.brand[body].name,
            model: catalog.newCar.filterData.data.brand[body].model,
          }),
        );
      }
    } else {
      filterBrands = [];
    }
  }

  if (modelFilter && modelFilter.length > 0) {
    filterModels = modelFilter;
  } else if (filterBrands && filterBrands.length > 0) {
    filterModels = filterBrands.reduce((acc, brand) => {
      if (brand.checked) {
        Object.keys(brand.model).forEach((item) => {
          acc.push({
            id: item,
            checked: false,
            name: brand.model[item],
          });
        });
      }
      return acc;
    }, []);
  } else {
    filterModels = [];
  }

  if (Object.keys(priceFilter).length > 0) {
    filterPrice = priceFilter;
  } else {
    filterPrice = {
      min: catalog.newCar.filterData ? catalog.newCar.filterData.prices.min : 0,
      max: catalog.newCar.filterData ? catalog.newCar.filterData.prices.max : 0,
      step: catalog.newCar.filterData
        ? catalog.newCar.filterData.prices.step
        : 1,
      curr: catalog.newCar.filterData && catalog.newCar.filterData.prices.curr,
    };
  }

  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    isNotFilterBrands,
    filterBrands,
    filterModels,
    filterBody,
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPrice,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    city: catalog.newCar.city,
    region: catalog.newCar.region,
    needFetchFilterData: catalog.newCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity:
      catalog.newCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
};

const mapDispatchToProps = {
  actionFetchNewCarFilterData,
  actionFetchNewCarByFilter,
  actionShowNewCarFilterPrice,
  actionHideNewCarFilterPrice,
  actionSelectNewCarFilterPrice,
  actionSetNewCarFilterPriceSpecial,
  actionSaveCarFilters,
};

class BrandModelsFilterScreen extends Component {
    render() {
      return (
        <Container style={styles.container}>
          <Content>
            <Card noShadow style={[styles.row]}>
              <CardItem style={styles.cardItem}>
                <Text>Выбрать марку и модель</Text>
                <Right>
                  <Icon name="chevron-forward" />
                </Right>
              </CardItem>
            </Card>
            <Card noShadow style={[styles.row]}>
              <CardItem style={styles.cardItem}>
                <Text>Выбрать марку и модель</Text>
                <Right>
                  <Icon name="chevron-forward" />
                </Right>
              </CardItem>
            </Card>
          </Content>
        </Container>
      );
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(BrandModelsFilterScreen);