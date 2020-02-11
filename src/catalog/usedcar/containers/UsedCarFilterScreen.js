/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
import {Icon, Button, Accordion} from 'native-base';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
} from '../../actions';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import {get, find} from 'lodash';
import stylesHeader from '@core/components/Header/style';
import {TouchableWithoutFeedback} from 'react-native';

const mapStateToProps = ({catalog, dealer, nav}) => {
  const {priceFilter} = catalog.newCar.filters;

  let filterPrice;

  if (Object.keys(priceFilter).length > 0) {
    filterPrice = priceFilter;
  } else {
    filterPrice = {
      // currentMin
      currentMin: catalog.usedCar.priceRange
        ? catalog.usedCar.priceRange.minPrice
        : catalog.usedCar.prices.min,
      // currentMax
      currentMax: catalog.usedCar.priceRange
        ? catalog.usedCar.priceRange.maxPrice
        : catalog.usedCar.prices.max,

      $min: catalog.usedCar.prices.min,
      $max: catalog.usedCar.prices.max,

      step: catalog.usedCar.prices.step,
      curr: catalog.usedCar.prices.curr,
    };
  }

  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData,
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPrice,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    city: catalog.usedCar.city,
    // city: catalog.newCar.city,
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

  actionSelectUsedCarPriceRange,
  actionSetNeedUpdateUsedCarList,
};

class NewCarFilterScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Фильтры',
    headerStyle: stylesHeader.common,
    headerTitleStyle: {fontWeight: '200', color: '#000'},
    headerLeft: <View />,
    headerRight: (
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{width: 18, height: 18, marginRight: 14}}
            source={require('./close.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 'key1',
      priceFilter: props.filterPrice,
    };
  }

  componentDidMount() {
    const {actionFetchNewCarFilterData, dealerSelected} = this.props;

    actionFetchNewCarFilterData({city: dealerSelected.city.id});

    Amplitude.logEvent('screen', 'catalog/newcar');
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      filterData,
      filterPrice,
      needFetchFilterData,
      actionFetchNewCarByFilter,
      // обновление экрана после выбора города
      needFetchFilterDataAfterCity,
      actionFetchNewCarFilterData,
      filters,
    } = this.props;

    if (needFetchFilterDataAfterCity) {
      return actionFetchNewCarFilterData({
        city: this.props.dealerSelected.city.id,
      });
    }

    if (needFetchFilterData) {
      return actionFetchNewCarByFilter({
        filters,
        searchUrl: filterData.search_url,
        filterPrice,
      });
    }

    if (this.props.filterPrice !== prevProps.filterPrice) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        priceFilter: this.props.filterPrice,
      });
    }

    if (this.props.city !== prevProps.city) {
      console.log('1');
      actionFetchNewCarFilterData({city: this.props.dealerSelected.city.id});
    }
  }

  getCityData = () => {
    const {
      dealerSelected,
      listRussiaByCities,
      listUkraineByCities,
      listBelarussiaByCities,
    } = this.props;

    const list = [].concat(
      listRussiaByCities,
      listUkraineByCities,
      listBelarussiaByCities,
    );

    return find(list, {id: dealerSelected.city.id});
  };

  onPressFilterButton = () => {
    this.props.navigation.navigate('UsedCarListScreen');
    this.props.actionSelectUsedCarPriceRange({
      minPrice: this.state.priceFilter.currentMin,
      maxPrice: this.state.priceFilter.currentMax,
    });
    this.props.actionSetNeedUpdateUsedCarList();
  };

  getCount = () => {
    const {filterData} = this.props;
    const filterDataCount = get(filterData, 'total.count');

    return filterDataCount;
  };

  render() {
    console.log(
      'this.props.filterPrice.$min || this.props.filterPrice.$max',
      this.props.filterPrice.$min || this.props.filterPrice.$max,
    );

    const dataForAccordion = [
      {
        title: 'Город',
        content: (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('UsedCarCityScreen', {
                returnScreen: 'UsedCarFilterScreen',
              });
            }}>
            <Text>
              {this.props.city ? this.props.city.name : 'Выберите город'}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];

    if (this.props.filterPrice.$min || this.props.filterPrice.$max) {
      dataForAccordion.unshift({
        title: 'Цена',
        content: (
          <View
            style={{
              paddingLeft: '5%',
            }}>
            <MultiSlider
              values={[
                this.state.priceFilter.currentMin,
                this.state.priceFilter.currentMax,
              ]}
              step={this.props.filterPrice.step}
              min={this.props.filterPrice.$min}
              max={this.props.filterPrice.$max}
              onValuesChange={e => {
                this.setState({
                  priceFilter: {
                    step: this.props.filterPrice.step,
                    curr: this.props.filterPrice.curr,
                    currentMin: e[0],
                    currentMax: e[1],
                  },
                });
              }}
              trackStyle={{
                backgroundColor: '#d5d5e0',
              }}
              selectedStyle={{
                backgroundColor: '#0F66B2',
              }}
              customMarker={() => (
                <View
                  style={{
                    height: 17,
                    width: 17,
                    borderRadius: 8.5,
                    backgroundColor: '#0F66B2',
                    shadowColor: '#0F66B2',
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                />
              )}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#74747A', fontSize: 14}}>{`${
                this.state.priceFilter.currentMin
              } ${this.state.priceFilter.curr &&
                this.state.priceFilter.curr.name}`}</Text>
              <Text style={{color: '#74747A', fontSize: 14}}>{`${
                this.state.priceFilter.currentMax
              } ${this.state.priceFilter.curr &&
                this.state.priceFilter.curr.name}`}</Text>
            </View>
          </View>
        ),
      });
    }

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Accordion
          dataArray={dataForAccordion}
          expanded={0}
          renderHeader={(item, expanded) => (
            <View
              style={{
                height: 64,
                paddingHorizontal: 16,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderBottomWidth: expanded ? 0 : 1,
                borderColor: '#d5d5e0',
              }}>
              <Text style={{fontSize: 18}}>{item.title}</Text>
              {expanded ? (
                <Icon
                  type="FontAwesome5"
                  style={{color: '#0061ED', fontWeight: 'lighter'}}
                  name="angle-down"
                />
              ) : (
                <Icon
                  type="FontAwesome5"
                  style={{color: '#131314', fontWeight: 'lighter'}}
                  name="angle-right"
                />
              )}
            </View>
          )}
          renderContent={item => {
            return (
              <View
                style={{
                  // minHeight: 100,
                  backgroundColor: '#fff',
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#d5d5e0',
                  paddingVertical: 20,
                }}>
                {item.content}
              </View>
            );
          }}
        />
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <Button
            onPress={this.onPressFilterButton}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 40,
              shadowColor: '#0F66B2',
              shadowOpacity: 0.5,
              shadowRadius: 8,
              shadowOffset: {
                width: 0,
                height: 2,
              },
            }}>
            <Text style={{color: '#fff', fontSize: 16}}>Применить</Text>
          </Button>
        </View>
      </>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarFilterScreen);
