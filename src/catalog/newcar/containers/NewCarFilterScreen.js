/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icon, Button, CheckBox, Accordion} from 'native-base';
import {verticalScale} from '../../../utils/scale';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styleConst from '@core/style-const';
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
} from '../../actions';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import {get, find} from 'lodash';
import stylesHeader from '@core/components/Header/style';

const mapStateToProps = ({catalog, dealer, nav}) => {
  const dealers = [].concat(
    dealer.listRussiaByCities,
    dealer.listUkraineByCities,
    dealer.listBelarussiaByCities,
  );

  const {
    brandFilters,
    bodyFilters,
    priceFilter,
    modelFilter,
  } = catalog.newCar.filters;

  let filterBrands, filterBody, filterPrice, filterModels;

  if (bodyFilters.length > 0) {
    filterBody = bodyFilters;
  } else {
    filterBody = catalog.newCar.filterData
      ? Object.keys(catalog.newCar.filterData.data.body).map(body => ({
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
      filterBrands = Object.keys(catalog.newCar.filterData.data.brand).map(
        body => ({
          id: body,
          checked: false,
          name: catalog.newCar.filterData.data.brand[body].name,
          model: catalog.newCar.filterData.data.brand[body].model,
        }),
      );
    } else {
      filterBrands = [];
    }
  }

  if (modelFilter && modelFilter.length > 0) {
    filterModels = modelFilter;
  } else if (filterBrands.length > 0) {
    filterModels = filterBrands.reduce((acc, brand) => {
      if (brand.checked) {
        Object.keys(brand.model).forEach(item => {
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
    filterData: catalog.newCar.filterData,
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
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Фильтры',
    headerStyle: stylesHeader.common,
    headerTitleStyle: {fontWeight: '200', color: '#000'},
    headerLeft: <View />,
    headerRight: (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={{width: 18, height: 18, marginRight: 14}}
          source={require('./close.png')}
        />
      </TouchableOpacity>
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
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

    Amplitude.logEvent('screen', 'catalog/newcar');
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
        searchUrl: filterData.search_url,
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

  onPressModels = () => {
    const {filterBrands} = this.props;

    if (filterBrands.length === 0) {
      setTimeout(() => Alert.alert('Вы не выбрали ни одной марки'), 100);
    } else {
      this.props.actionSelectNewCarFilterModels();
    }
  };

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
    ].some(filter => filter.length !== 0);

    if (filterPrice || filterPriceSpecial) {
      isItemsCount = true;
    }

    return isItemsCount ? filterCount : filterDataCount;
  };

  render() {
    const filtersContent = [
      {
        title: 'Бренды',
        content:
          this.state.brandFilters.length === 0 ? (
            <ActivityIndicator
              color={styleConst.color.blue}
              style={{
                spinner: {
                  alignSelf: 'center',
                  marginTop: verticalScale(60),
                },
              }}
            />
          ) : (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.brandFilters.map(({id, name, checked}) => (
                <View
                  style={{
                    width: '50%',
                    marginBottom: 30,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      const brands = this.state.brandFilters.map(brand =>
                        brand.id === id
                          ? {...brand, checked: !brand.checked}
                          : brand,
                      );

                      const filterModels = brands.reduce((acc, brand) => {
                        if (brand.checked) {
                          Object.keys(brand.model).forEach(item => {
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
                      key={id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      {/* TODO: Настроить визуал через тему */}
                      {/* TODO: Чекбокс вынести в отдельный компонент */}
                      <CheckBox
                        name="vw"
                        checked={checked}
                        style={{
                          borderRadius: 0,
                          backgroundColor: checked ? '#0061ed' : '#fff',
                          borderColor: checked ? 'transparent' : '#d0d5dc',
                          fontSize: 40,
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
        title: 'Цена',
        content: (
          <View>
            <MultiSlider
              values={[this.state.priceFilter.min, this.state.priceFilter.max]}
              step={this.state.priceFilter.step}
              min={0}
              max={this.state.priceFilter.max}
              onValuesChange={e => {
                this.setState({
                  priceFilter: {
                    // TODO: fix it
                    step: this.state.priceFilter.curr.step,
                    curr: this.state.priceFilter.curr,
                    min: e[0],
                    max: e[1],
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
                this.state.priceFilter.min
              } ${this.state.priceFilter.curr &&
                this.state.priceFilter.curr.name}`}</Text>
              <Text style={{color: '#74747A', fontSize: 14}}>{`${
                this.state.priceFilter.max
              } ${this.state.priceFilter.curr &&
                this.state.priceFilter.curr.name}`}</Text>
            </View>
          </View>
        ),
      },
      {
        title: 'Кузов',
        content: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {this.state.bodyFilters.map(({id, name, checked}) => (
              <View
                style={{
                  marginBottom: 30,
                  minWidth: 100,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      bodyFilters: this.state.bodyFilters.map(body =>
                        body.id === id
                          ? {...body, checked: !body.checked}
                          : body,
                      ),
                    });
                  }}>
                  <View
                    key={id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    {/* TODO: Настроить визуал через тему */}
                    {/* TODO: Чекбокс вынести в отдельный компонент */}
                    <CheckBox
                      name="vw"
                      checked={checked}
                      style={{
                        borderRadius: 0,
                        backgroundColor: checked ? '#0061ed' : '#fff',
                        borderColor: checked ? 'transparent' : '#d0d5dc',
                        fontSize: 40,
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
    ];

    if (this.state.modelFilter.length > 0) {
      filtersContent.splice(1, 0, {
        title: 'Модели',
        content: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {this.state.modelFilter.map(({id, name, checked}) => (
              <View
                style={{
                  marginBottom: 30,
                  width: '50%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      modelFilter: this.state.modelFilter.map(model =>
                        model.id === id
                          ? {...model, checked: !model.checked}
                          : model,
                      ),
                    });
                  }}>
                  <View
                    key={id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    {/* TODO: Настроить визуал через тему */}
                    {/* TODO: Чекбокс вынести в отдельный компонент */}
                    <CheckBox
                      name="vw"
                      checked={checked}
                      style={{
                        borderRadius: 0,
                        backgroundColor: checked ? '#0061ed' : '#fff',
                        borderColor: checked ? 'transparent' : '#d0d5dc',
                        fontSize: 40,
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
      <>
        <Accordion
          dataArray={filtersContent}
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
