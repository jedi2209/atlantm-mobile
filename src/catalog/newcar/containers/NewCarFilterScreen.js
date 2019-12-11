/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {
  Body,
  Icon,
  Label,
  Right,
  Footer,
  Button,
  Switch,
  Content,
  ListItem,
  StyleProvider,
  CheckBox,
  Accordion,
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
} from '../../actions';

// components
import EmptyMessage from '@core/components/EmptyMessage';
import CityItemList from '../components/CityItemList';
import PricePicker from '@core/components/PricePicker';
import ListItemHeader from '@profile/components/ListItemHeader';

// styles
import stylesList from '@core/components/Lists/style';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import {get, find, flatten, uniqBy} from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import styleFooter from '@core/components/Footer/style';
import {verticalScale} from '@utils/scale';
import {TEXT_EMPTY_CAR_LIST, BUTTON_EMPTY_CAR_FIND} from '../../constants';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const ColorCheckbox = ({checked, color}) => {
  return (
    <CheckBox
      checked
      style={{
        width: 46,
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 23,
        backgroundColor: '#0061ed',
        borderColor: 'transparent',
        fontSize: 40,
      }}
    />
  );
};

//const FOOTER_HEIGHT = 50;
const styles = StyleSheet.create({
  safearea: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  content: {
    paddingBottom: styleFooter.footer.height,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  spinnerButton: {
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonActive: {
    flex: 1,
    height: styleConst.ui.footerHeight,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonInactive: {
    flex: 1,
    height: styleConst.ui.footerHeight,
    flexDirection: 'row',
    backgroundColor: styleConst.color.darkBg,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: styleConst.font.medium,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    width: 18,
    marginTop: 3,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  body: {
    flex: 1.5,
  },
  right: {
    flex: 2,
  },
  hiddenListItemContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  labelPriceSpecial: {
    color: styleConst.color.red,
  },
});

const mapStateToProps = ({catalog, dealer, nav}) => {
  const dealers = [].concat(
    dealer.listRussiaByCities,
    dealer.listUkraineByCities,
    dealer.listBelarussiaByCities,
  );
  const city = dealers.find(({id}) => id === dealer.selected.city.id);
  const brands = city.dealers.map(({brands}) =>
    brands.map(({name, id}) => ({id, name})),
  );
  const uniqBrands = uniqBy(flatten(brands), 'id');
  const filterBody = catalog.newCar.filterData
    ? Object.keys(catalog.newCar.filterData.data.body).map(body => ({
        id: body,
        name: catalog.newCar.filterData.data.body[body],
      }))
    : [];

  const priceFilter = {
    min: catalog.newCar.filterData ? catalog.newCar.filterData.prices.min : 0,
    max: catalog.newCar.filterData ? catalog.newCar.filterData.prices.max : 0,
    step: catalog.newCar.filterData ? catalog.newCar.filterData.prices.step : 1,
    curr: catalog.newCar.filterData && catalog.newCar.filterData.prices.curr,
  };

  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData,
    filterBrands: catalog.newCar.filterBrands,
    filterModels: catalog.newCar.filterModels,
    filterBody,
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    // filterPrice: catalog.newCar.filterPrice,
    priceFilter,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    city: catalog.newCar.city,
    region: catalog.newCar.region,
    needFetchFilterData: catalog.newCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity:
      catalog.newCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,

    filters: {
      brands: uniqBrands,
    },
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
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <Image
          style={{width: 18, height: 18, marginRight: 14}}
          source={require('./close.png')}
        />
      </TouchableWithoutFeedback>
    ),
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    // console.log(this.props.filters.brands)
    // TODO: Синхронизировать с данными из redux.
    this.state = {
      brandFilters: this.props.filters.brands.map(brand => ({
        ...brand,
        checked: false,
      })),
      bodyFilters: this.props.filterBody.map(body => ({
        ...body,
        checked: false,
      })),
      priceFilter: {
        min: 0,
        max: 0,
        step: 1,
        curr: {},
      },
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
      // обновление экрана после выбора фильтров
      city,
      needFetchFilterData,
      actionFetchNewCarByFilter,
      // обновление экрана после выбора города
      needFetchFilterDataAfterCity,
      actionFetchNewCarFilterData,
    } = this.props;

    if (needFetchFilterDataAfterCity) {
      return actionFetchNewCarFilterData({
        city: this.props.dealerSelected.city.id,
      });
    }
    if (needFetchFilterData) {
      return actionFetchNewCarByFilter({
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
        bodyFilters: this.props.filterBody.map(body => ({
          ...body,
          checked: false,
        })),
      });
    }

    if (this.props.priceFilter !== prevProps.priceFilter) {
      console.log('olol', this.props.priceFilter);
      this.setState({
        priceFilter: {
          min: this.props.priceFilter.min,
          max: this.props.priceFilter.max,
          curr: this.props.priceFilter.curr,
          step: this.props.priceFilter.step,
        },
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

  // onPressPrice = () => this.props.actionShowNewCarFilterPrice();

  // onClosePrice = prices => {
  //   const {
  //     actionHideNewCarFilterPrice,
  //     actionSelectNewCarFilterPrice,
  //   } = this.props;

  //   actionHideNewCarFilterPrice();

  //   if (prices) {
  //     actionSelectNewCarFilterPrice(prices);
  //   }
  // };

  // onPressFilterPriceSpecial = isSet => {
  //   this.props.actionSetNewCarFilterPriceSpecial(isSet);
  // };

  onPressFilterButton = () => {
    // const {navigation, isFetchingNewCarByFilter} = this.props;
    // if (!isFetchingNewCarByFilter) {
      // }
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
    return (
      <>
        <Accordion
          dataArray={[
            {
              title: 'Бренды',
              content: (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {this.state.brandFilters.map(({id, name, checked}) => (
                    <View
                      style={{
                        marginBottom: 30,
                        minWidth: 100,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            brandFilters: this.state.brandFilters.map(brand =>
                              brand.id === id
                                ? {...brand, checked: !brand.checked}
                                : brand,
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
            {
              title: 'Модели',
              content: (
                <Text>coming soon ...</Text>
                // <View style={{display: 'flex', flexDirection: 'row'}}>
                //   {/* TODO: Настроить визуал через тему */}
                //   <CheckBox
                //     name="vw"
                //     onPress={() => {
                //       console.log(this.state.checked, 'ya tyt');
                //       this.setState({checked: true});
                //     }}
                //     checked={this.state.checked}
                //     style={{
                //       borderRadius: 0,
                //       backgroundColor: !this.state.checked ? '#fff' : '#0061ed',
                //       borderColor: !this.state.checked
                //         ? '#d0d5dc'
                //         : 'transparent',
                //       fontSize: 40,
                //     }}
                //   />
                //   <Text style={{marginLeft: 20}}>VW</Text>
                // </View>
              ),
            },
            {
              title: 'Цена',
              content: (
                <View>
                  <MultiSlider
                    values={[
                      this.state.priceFilter.min,
                      this.state.priceFilter.max,
                    ]}
                    step={this.state.priceFilter.step}
                    min={0}
                    max={this.props.priceFilter.max}
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
                      backgroundColor: '#2b65f9',
                    }}
                    customMarker={() => (
                      <View
                        style={{
                          height: 17,
                          width: 17,
                          borderRadius: 8.5,
                          backgroundColor: '#2b65f9',
                          shadowColor: '#2b65f9',
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
          ]}
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
            marginBottom: 40,
          }}>
          <Button
            onPress={this.onPressFilterButton}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 40,
              shadowColor: '#2b65f9',
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

    const {
      city,
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
      navigation,
      dealerSelected,
      isFetchingFilterData,
      isFetchingNewCarByFilter,
    } = this.props;

    console.log('== NewCarFilterScreen ==');

    if (!filterData || isFetchingFilterData) {
      return (
        <View style={styles.safearea}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        </View>
      );
    }

    const minPriceByFilter = get(filterPrice, 'minPrice');
    const step = get(items, 'prices.step') || get(filterData, 'prices.step');
    const minPrice =
      Math.floor(
        get(items, 'prices.min') || get(filterData, 'prices.min') / step,
      ) * step;
    const maxPrice =
      Math.ceil(
        get(items, 'prices.max') || get(filterData, 'prices.max') / step,
      ) * step;
    const currency = get(filterData, 'prices.curr.name');
    const count = this.getCount();

    if (get(filterData, 'total.count') === 0) {
      return (
        <SafeAreaView style={styles.safearea}>
          <CityItemList
            navigation={navigation}
            cityName={city.name}
            cityData={this.getCityData()}
            returnScreen="NewCarFilterScreen"
          />
          <EmptyMessage text={TEXT_EMPTY_CAR_LIST} />
        </SafeAreaView>
      );
    }

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <View style={styles.content}>
              <CityItemList
                navigation={navigation}
                cityName={city.name}
                cityData={this.getCityData()}
                returnScreen="NewCarFilterScreen"
              />

              <ListItemHeader text="ПАРАМЕТРЫ ПОИСКА" />

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressBrands}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>Марка</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterBrands.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterBrands.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressModels}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>Модель</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterModels.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterModels.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <PricePicker
                style={styles.icon}
                min={minPrice}
                max={maxPrice}
                step={step}
                currentMinPrice={filterPrice && filterPrice.minPrice}
                currentMaxPrice={filterPrice && filterPrice.maxPrice}
                currency={currency}
                onPressModal={this.onPressPrice}
                onCloseModal={this.onClosePrice}
                TouchableComponent={TouchableHighlight}>
                <View style={stylesList.listItemContainer}>
                  <View style={styles.hiddenListItemContainer} />
                  <ListItem button={false} style={stylesList.listItemPressable}>
                    <Body style={styles.body}>
                      <Label style={stylesList.label}>Цена</Label>
                    </Body>
                    <Right style={styles.right}>
                      {
                        <Text style={stylesList.listItemValue}>
                          {`от ${minPriceByFilter || minPrice} ${currency}`}
                        </Text>
                      }
                      <Icon name="arrow-forward" style={stylesList.iconArrow} />
                    </Right>
                  </ListItem>
                </View>
              </PricePicker>

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressBody}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>Тип кузова</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterBody.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterBody.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressGearbox}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>КПП</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterGearbox.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterGearbox.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressEngineType}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>Тип двигателя</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterEngineType.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterEngineType.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <View style={stylesList.listItemContainer}>
                <ListItem
                  style={stylesList.listItemPressable}
                  onPress={this.onPressDrive}>
                  <Body style={styles.body}>
                    <Label style={stylesList.label}>Привод</Label>
                  </Body>
                  <Right style={styles.right}>
                    {filterDrive.length !== 0 && (
                      <Text style={stylesList.listItemValue}>
                        {`Выбрано: ${filterDrive.length}`}
                      </Text>
                    )}
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                </ListItem>
              </View>

              <View style={stylesList.listItemContainer}>
                <ListItem style={stylesList.listItem} last>
                  <Body>
                    <Label style={[stylesList.label, styles.labelPriceSpecial]}>
                      Спец.предложение
                    </Label>
                  </Body>
                  <Right>
                    <Switch
                      onValueChange={this.onPressFilterPriceSpecial}
                      value={filterPriceSpecial}
                    />
                  </Right>
                </ListItem>
              </View>
            </View>
          </Content>
          <Footer style={styleFooter.footer}>
            <Button
              onPress={() => this.onPressFilterButton(count)}
              full
              disabled={count ? false : true}
              activeOpacity={0.8}
              style={[
                count ? [styles.buttonActive] : [styles.buttonInactive],
                styleFooter.button,
              ]}>
              {isFetchingNewCarByFilter ? (
                <ActivityIndicator color="#fff" style={styles.spinnerButton} />
              ) : (
                <View style={styles.buttonContent}>
                  {count ? (
                    <Text style={styles.buttonText}>{`НАЙДЕНО ${count}`}</Text>
                  ) : (
                    <Text style={styles.buttonText}>
                      {BUTTON_EMPTY_CAR_FIND}
                    </Text>
                  )}
                  {count ? (
                    <Image
                      source={require('@core/components/CustomIcon/assets/arrow_right_white.png')}
                      style={styles.buttonIcon}
                    />
                  ) : (
                    <Image style={styles.buttonIcon} />
                  )}
                </View>
              )}
            </Button>
          </Footer>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarFilterScreen);
