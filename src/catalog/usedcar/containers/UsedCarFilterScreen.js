/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
import {
  Icon,
  Button,
  Accordion,
  Radio,
  ListItem,
  Right,
  Left,
  Content,
} from 'native-base';

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
  actionResetUsedCarList,
  actionSelectUsedCarCity,
} from '../../actions';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import stylesHeader from '@core/components/Header/style';

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
    // todo: хз что за фигня разобраться
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
  actionSelectUsedCarCity,
  actionResetUsedCarList,
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
    const region = this.props.dealerSelected.region;
    const country = {
      by: this.props.listBelarussiaByCities,
      ru: this.props.listRussiaByCities,
      ua: this.props.listUkraineByCities,
    };

    this.state = {
      cityFilters: country[region],
      selectedCity: this.props.city
        ? this.props.city.id
        : this.props.dealerSelected.city.id,
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

    if (this.state.selectedCity !== prevState.selectedCity) {
      console.log(
        'actionFetchNewCarFilterData >>>>>>>',
        this.props.dealerSelected.city.id,
      );
      actionFetchNewCarFilterData({city: this.props.dealerSelected.city.id});
    }
  }

  onPressFilterButton = () => {
    this.props.navigation.navigate('UsedCarListScreen');
    this.props.actionSelectUsedCarPriceRange({
      minPrice: this.state.priceFilter.currentMin,
      maxPrice: this.state.priceFilter.currentMax,
    });
    this.props.actionSetNeedUpdateUsedCarList();
  };

  render() {
    console.log('render', this.props.filterPrice);
    const dataForAccordion = [
      {
        title: 'Город',
        content: (
          <Content>
            {this.state.cityFilters.map(({id, name}) => (
              <View>
                <View key={'view2-body-' + id}>
                  <ListItem
                    onPress={() => {
                      this.setState({
                        selectedCity: id,
                      });

                      const item = this.state.cityFilters.find(
                        value => value.id === id,
                      );

                      this.props.actionResetUsedCarList();
                      this.props.actionSetNeedUpdateUsedCarList();
                      this.props.actionSelectUsedCarCity(item);
                    }}
                    style={{
                      height: 44,
                      backgroundColor: '#fff',
                      borderWidth: 0,
                      borderBottomWidth: 0,
                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingVertical: 0,
                      marginLeft: 0,
                    }}>
                    <Left>
                      <Text>{name}</Text>
                    </Left>
                    <Right>
                      <Radio
                        selectedColor="#0F66B2"
                        name={id}
                        selected={id === this.state.selectedCity}
                      />
                    </Right>
                  </ListItem>
                </View>
              </View>
            ))}
          </Content>
        ),
      },
    ];

    if (this.props.filterPrice.$min || this.props.filterPrice.$max) {
      dataForAccordion.push({
        title: 'Цена',
        content: (
          <View
            style={{
              paddingLeft: '5%',
            }}>
            <MultiSlider
              values={[
                this.state.priceFilter.currentMin ||
                  this.props.filterPrice.$min,
                this.state.priceFilter.currentMax ||
                  this.props.filterPrice.$max,
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
              <Text style={{color: '#74747A', fontSize: 14}}>{`${this.state
                .priceFilter.currentMin || this.props.filterPrice.$min} ${this
                .state.priceFilter.curr &&
                this.state.priceFilter.curr.name}`}</Text>
              <Text style={{color: '#74747A', fontSize: 14}}>{`${this.state
                .priceFilter.currentMax || this.props.filterPrice.$max} ${this
                .state.priceFilter.curr &&
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
                  style={{color: '#0F66B2', fontWeight: 'lighter'}}
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
              backgroundColor: '#0F66B2',
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
