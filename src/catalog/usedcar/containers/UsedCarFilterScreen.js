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
  actionFetchUsedCarByFilter,
  actionSaveCarUsedFilters,
  actionSetNeedUpdateUsedCarList,
  actionResetUsedCarList,
  actionSelectUsedCarCity,
  actionSelectUsedCarPriceRange,
} from '../../actions';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import stylesHeader from '../../../core/components/Header/style';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import {ScrollView} from 'react-native-gesture-handler';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.usedCar.items,
    filterPriceByUser: catalog.usedCar.filters,
    filterPrice: catalog.usedCar.prices,
    city: catalog.usedCar.city,
    region: catalog.usedCar.region,
    needFetchFilterData: catalog.usedCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity:
      catalog.usedCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.usedCar.meta.isFetchingFilterData,
  };
};

const mapDispatchToProps = {
  // actionFetchUsedCarFilterData,
  actionFetchUsedCarByFilter,
  actionSaveCarUsedFilters,
  actionSelectUsedCarCity,
  actionResetUsedCarList,
  actionSetNeedUpdateUsedCarList,
  actionSelectUsedCarPriceRange,
};

class UsedCarFilterScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Фильтры',
    headerStyle: stylesHeader.common,
    headerTitleStyle: {fontWeight: '200', color: '#000'},
    headerLeft: <View />,
    headerRight: (
      <Icon
        type="AntDesign"
        style={{
          color: '#000',
          fontWeight: 'lighter',
          fontSize: 22,
          marginRight: 14,
        }}
        name="close"
        onPress={() => navigation.goBack()}
      />
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
      priceFilter: {...props.filterPrice, ...props.filterPriceByUser},
    };
  }

  componentDidMount() {
    // const {actionFetchUsedCarFilterData, dealerSelected} = this.props;
    // actionFetchUsedCarFilterData({city: dealerSelected.city.id});
    Amplitude.logEvent('screen', 'catalog/usedcar/filter');
  }

  componentDidUpdate(prevProps, prevState) {
    const {filterData, filterPrice, needFetchFilterData, filters} = this.props;

    if (needFetchFilterData) {
      return actionFetchUsedCarByFilter({
        filters,
        searchUrl: filterData.search_url,
        filterPrice,
      });
    }

    if (this.props.filterPrice !== prevProps.filterPrice) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        priceFilter: {
          ...this.props.filterPrice,
          ...this.props.filterPriceByUser,
        },
      });
    }

    if (this.props.filterPriceByUser !== prevProps.filterPriceByUser) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        priceFilter: {
          ...this.props.filterPrice,
          ...this.props.filterPriceByUser,
        },
      });
    }

    if (this.state.selectedCity !== prevState.selectedCity) {
      this.setState({
        priceFilter: {
          ...this.props.filterPrice,
          minPrice: undefined,
          maxPrice: undefined,
        },
      });

      this.props.actionSelectUsedCarPriceRange({
        minPrice: undefined,
        maxPrice: undefined,
      });
    }
  }

  onPressFilterButton = () => {
    this.props.navigation.navigate('UsedCarListScreen');
    this.props.actionSelectUsedCarPriceRange({
      minPrice: this.state.priceFilter.minPrice,
      maxPrice: this.state.priceFilter.maxPrice,
    });
    this.props.actionSaveCarUsedFilters({
      minPrice: this.state.priceFilter.minPrice,
      maxPrice: this.state.priceFilter.maxPrice,
    });
    this.props.actionSetNeedUpdateUsedCarList();
  };

  render() {
    const dataForAccordion = [
      {
        title: 'Город',
        content: (
          <Content>
            {this.state.cityFilters.map(({id, name}) => (
              <View key={'view-city-' + id}>
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
                    <Text style={{fontSize: 16}}>{name}</Text>
                  </Left>
                  <Right>
                    <Radio
                      selectedColor={styleConst.color.lightBlue}
                      name={id}
                      selected={id === this.state.selectedCity}
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
                    />
                  </Right>
                </ListItem>
              </View>
            ))}
          </Content>
        ),
      },
    ];

    if (this.props.filterPrice.min || this.props.filterPrice.max) {
      dataForAccordion.push({
        title: 'Цена',
        content: (
          <View
            style={{
              paddingLeft: '5%',
            }}>
            <MultiSlider
              values={[
                this.state.priceFilter.minPrice || this.props.filterPrice.min,
                this.state.priceFilter.maxPrice || this.props.filterPrice.max,
              ]}
              step={this.props.filterPrice.step}
              min={this.props.filterPrice.min}
              max={this.props.filterPrice.max}
              onValuesChange={e => {
                this.setState({
                  priceFilter: {
                    ...this.props.filterPrice,
                    minPrice: e[0],
                    maxPrice: e[1],
                  },
                });
              }}
              trackStyle={{
                backgroundColor: '#d5d5e0',
              }}
              selectedStyle={{
                backgroundColor: styleConst.color.lightBlue,
              }}
              customMarker={() => (
                <View
                  style={[
                    styleConst.shadow.default,
                    {
                      height: 17,
                      width: 17,
                      borderRadius: 8.5,
                      backgroundColor: styleConst.color.lightBlue,
                    },
                  ]}
                />
              )}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#74747A', fontSize: 14}}>
                {showPrice(
                  this.state.priceFilter.minPrice || this.props.filterPrice.min,
                  this.props.dealerSelected.region,
                )}
              </Text>
              <Text style={{color: '#74747A', fontSize: 14}}>
                {showPrice(
                  this.state.priceFilter.maxPrice || this.props.filterPrice.max,
                  this.props.dealerSelected.region,
                )}
              </Text>
            </View>
          </View>
        ),
      });
    }

    return (
      <ScrollView style={{borderWidth: 0}}>
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
                  style={{
                    color: styleConst.color.lightBlue,
                    fontWeight: 'lighter',
                  }}
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
            full
            onPress={this.onPressFilterButton}
            disabled={
              this.props.items.length && this.props.items[0].type ? true : false
            }
            style={[
              styleConst.shadow.default,
              {
                backgroundColor:
                  this.props.items.length && this.props.items[0].type
                    ? styleConst.color.bg
                    : styleConst.color.lightBlue,
                paddingVertical: 16,
                paddingHorizontal: 40,
                marginHorizontal: 20,
                borderRadius: 5,
              },
            ]}>
            <Text
              style={{
                color:
                  this.props.items.length && this.props.items[0].type
                    ? styleConst.color.lightBlue
                    : '#fff',
                fontSize: 16,
              }}>
              {this.props.items.length && this.props.items[0].type
                ? 'Нет авто в наличии'
                : 'Применить'}
            </Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsedCarFilterScreen);
