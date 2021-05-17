/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Icon, Button, CheckBox, Accordion, StyleProvider} from 'native-base';
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

const deviceWidth = Dimensions.get('window').width;

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

class NewCarFilterScreen extends Component {
  static propTypes = {
    dealerSelected: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      brandFilters: props.filterBrands,
      bodyFilters: props.filterBody,
      priceFilter: props.filterPrice,
      modelFilter: props.filterModels,
    };
  }

  componentDidMount() {
    const {actionFetchNewCarFilterData, dealerSelected} = this.props;

    actionFetchNewCarFilterData({city: dealerSelected.city.id});

    Analytics.logEvent('screen', 'catalog/newcar/filter');
  }

  componentDidUpdate(prevProps) {
    const {
      filterData,
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterPriceSpecial,
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
        searchUrl:
          filterData.search_url ||
          `/stock/new/cars/get/city/${this.props.dealerSelected.city.id}/`,
        filterBrands,
        filterModels,
        filterBody,
        filterGearbox,
        filterDrive,
        filterEngineType,
        filterPrice,
        filterPriceSpecial,
      });
    }

    if (this.props.filterBody !== prevProps.filterBody) {
      this.setState({
        bodyFilters: this.props.filterBody,
      });
    }

    if (this.props.filterBrands !== prevProps.filterBrands) {
      this.setState({
        brandFilters: this.props.filterBrands,
      });
    }

    if (this.props.filterPrice !== prevProps.filterPrice) {
      this.setState({
        priceFilter: this.props.filterPrice,
      });
    }

    if (this.props.filterModels !== prevProps.filterModels) {
      this.setState({
        modelFilter: this.props.filterModels,
      });
    }
  }

  // onPressModels = () => {
  //   const {filterBrands} = this.props;
  //   console.log('this.props', this.props);
  //   if (filterBrands.length === 0) {
  //     setTimeout(() => Alert.alert('Вы не выбрали ни одной марки'), 100);
  //   } else {
  //     this.props.actionSelectNewCarFilterModels();
  //   }
  // };

  onPressFilterButton = () => {
    this.props.navigation.navigate('NewCarListScreen');
    this.props.actionSaveCarFilters(this.state);
  };

  getCount = () => {
    const {
      items,
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterPriceSpecial,
      filterData,
    } = this.props;
    const filterDataCount = get(filterData, 'total.count');
    const filterCount = get(items, 'total.count');

    let isItemsCount = [
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
    ].some((filter) => filter.length !== 0);

    if (filterPrice || filterPriceSpecial) {
      isItemsCount = true;
    }

    return isItemsCount ? filterCount : filterDataCount;
  };

  render() {
    const sliderWidth = (deviceWidth / 100) * 80;

    if (this.props.isNotFilterBrands) {
      return (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <Text style={{fontSize: 18}}>Нет доступных фильтров</Text>
        </View>
      );
    }

    if (this.state.brandFilters.length === 0) {
      return (
        <View style={{paddingTop: 20}}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={{
              spinner: {
                alignSelf: 'center',
                marginTop: verticalScale(60),
              },
            }}
          />
        </View>
      );
    }
    const filtersContent = [
      {
        title: strings.NewCarFilterScreen.brands,
        content: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {this.state.brandFilters.map(({id, name, checked}) => (
              <View
                key={'view-brand-' + id}
                style={{
                  width: '50%',
                  marginBottom: 30,
                }}>
                <TouchableOpacity
                  key={'touchable-brand-' + id}
                  onPress={() => {
                    const brands = this.state.brandFilters.map((brand) =>
                      brand.id === id
                        ? {...brand, checked: !brand.checked}
                        : brand,
                    );

                    const filterModels = brands.reduce((acc, brand) => {
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

                    this.setState({
                      brandFilters: brands,
                      modelFilter: filterModels,
                    });
                  }}>
                  <View
                    key={'view2-brand-' + id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    {/* TODO: Настроить визуал через тему */}
                    {/* TODO: Чекбокс вынести в отдельный компонент */}
                    <CheckBox
                      name={'checkbox-brand-' + id}
                      checked={checked}
                      style={{
                        borderRadius: 0,
                        backgroundColor: checked
                          ? styleConst.color.lightBlue
                          : styleConst.color.white,
                        borderColor: checked ? 'transparent' : '#d0d5dc',
                        fontSize: 40,
                      }}
                      onPress={() => {
                        const brands = this.state.brandFilters.map((brand) =>
                          brand.id === id
                            ? {...brand, checked: !brand.checked}
                            : brand,
                        );

                        const filterModels = brands.reduce((acc, brand) => {
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

                        this.setState({
                          brandFilters: brands,
                          modelFilter: filterModels,
                        });
                      }}
                    />
                    <Text style={{marginLeft: 20}}>{name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ),
      },
      {
        title: strings.NewCarFilterScreen.price,
        content: (
          <View
            style={{
              paddingLeft: '5%',
            }}>
            <MultiSlider
              values={[this.state.priceFilter.min, this.state.priceFilter.max]}
              step={this.state.priceFilter.step}
              min={0}
              sliderLength={sliderWidth}
              max={
                this.props.filterData.prices && this.props.filterData.prices.max
              }
              onValuesChange={(e) => {
                this.setState({
                  priceFilter: {
                    ...this.state.priceFilter,
                    min: e[0],
                    max: e[1],
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
                  this.state.priceFilter.min,
                  this.props.dealerSelected.region,
                )}
              </Text>
              <Text style={{color: '#74747A', fontSize: 14}}>
                {showPrice(
                  this.state.priceFilter.max,
                  this.props.dealerSelected.region,
                )}
              </Text>
            </View>
          </View>
        ),
      },
      {
        title: strings.NewCarItemScreen.tech.body.title,
        content: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {this.state.bodyFilters.map(({id, name, checked}) => (
              <View
                key={'view-body-' + id}
                style={{
                  width: '50%',
                  marginBottom: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      bodyFilters: this.state.bodyFilters.map((body) =>
                        body.id === id
                          ? {...body, checked: !body.checked}
                          : body,
                      ),
                    });
                  }}>
                  <View
                    key={'view2-body-' + id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    {/* TODO: Настроить визуал через тему */}
                    {/* TODO: Чекбокс вынести в отдельный компонент */}
                    <CheckBox
                      name={id}
                      checked={checked}
                      style={{
                        borderRadius: 0,
                        backgroundColor: checked
                          ? styleConst.color.lightBlue
                          : styleConst.color.white,
                        borderColor: checked ? 'transparent' : '#d0d5dc',
                        fontSize: 40,
                      }}
                      onPress={() => {
                        this.setState({
                          bodyFilters: this.state.bodyFilters.map((body) =>
                            body.id === id
                              ? {...body, checked: !body.checked}
                              : body,
                          ),
                        });
                      }}
                    />
                    <Text style={{marginLeft: 20}}>
                      {strings.CarParams.body[id]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ),
      },
    ];

    if (this.state.modelFilter.length > 0) {
      filtersContent.splice(1, 0, {
        title: strings.NewCarFilterScreen.models,
        content: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {this.state.modelFilter.map(({id, name, checked}) => (
              <View
                key={'model' + id}
                style={{
                  marginBottom: 30,
                  width: '50%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      modelFilter: this.state.modelFilter.map((model) =>
                        model.id === id
                          ? {...model, checked: !model.checked}
                          : model,
                      ),
                    });
                  }}>
                  <View
                    key={'view-models-' + id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    {/* TODO: Настроить визуал через тему */}
                    {/* TODO: Чекбокс вынести в отдельный компонент */}
                    <CheckBox
                      name={'model' + id}
                      checked={checked}
                      style={{
                        borderRadius: 0,
                        backgroundColor: checked
                          ? styleConst.color.lightBlue
                          : styleConst.color.white,
                        borderColor: checked ? 'transparent' : '#d0d5dc',
                        fontSize: 40,
                      }}
                      onPress={() => {
                        this.setState({
                          modelFilter: this.state.modelFilter.map((model) =>
                            model.id === id
                              ? {...model, checked: !model.checked}
                              : model,
                          ),
                        });
                      }}
                    />
                    <Text style={{marginLeft: 20}}>{name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ),
      });
    }

    return (
      <StyleProvider style={getTheme()}>
        <ScrollView style={{borderWidth: 0}}>
          <StatusBar barStyle="dark-content" />
          <Accordion
            dataArray={filtersContent}
            expanded={[0]}
            renderHeader={(item, expanded) => (
              <View
                style={{
                  height: 64,
                  paddingHorizontal: 16,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: styleConst.color.white,
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
            renderContent={(item) => {
              return (
                <View
                  style={{
                    backgroundColor: styleConst.color.white,
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
              style={[
                styleConst.shadow.default,
                {
                  backgroundColor: styleConst.color.lightBlue,
                  paddingVertical: 16,
                  paddingHorizontal: 40,
                  marginHorizontal: 20,
                  borderRadius: 5,
                },
              ]}>
              <Text style={{color: styleConst.color.white, fontSize: 16}}>
                {strings.UsedCarFilterScreen.apply}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </StyleProvider>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterScreen);

// const ColorCheckbox = ({checked, color}) => {
//   return (
//     <CheckBox
//       checked
//       style={{
//         width: 46,
//         height: 46,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 23,
//         backgroundColor: '#0061ed',
//         borderColor: 'transparent',
//         fontSize: 40,
//       }}
//     />
//   );
// };
// {
//   title: 'Цвет',
//   content: (
//     <View style={{display: 'flex', flexDirection: 'row'}}>
//       {/* TODO: Настроить визуал через тему */}
//       <ColorCheckbox />
//       <ColorCheckbox />
//       <ColorCheckbox />
//       <ColorCheckbox />
//     </View>
//   ),
// },
