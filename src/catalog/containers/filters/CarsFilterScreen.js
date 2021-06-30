/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useReducer} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Row,
  Button,
  Icon,
  Segment,
  Content,
  Text,
  Card,
  CardItem,
  Right,
  CheckBox,
  StyleProvider,
} from 'native-base';
import getTheme from '../../../../native-base-theme/components';
import {verticalScale} from '../../../utils/scale';

import ModalView from '../../../core/components/ModalView';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import styleConst from '../../../core/style-const';
// redux
import {connect} from 'react-redux';
import API from '../../../utils/api';
import {substractYears} from '../../../utils/date';
import {
  actionFetchNewCarByFilter,
  actionFetchNewCarFilterData,
  actionFetchUsedCarFilterData,
  actionFetchUsedCarByFilter,
  actionSaveCarFilters,
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import showPrice from '../../../utils/price';
import numberWithGap from '../../../utils/number-with-gap';
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
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  rowStatic: {
    height: 65,
  },
  cardItem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: 15,
  },
  cardItemStatic: {
    marginVertical: 0,
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
  fieldCaptionWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  fieldCaptionValues: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
  fieldTitle: {
    fontSize: 16,
    color: styleConst.color.greyText4,
  },
  fieldValues: {
    fontSize: 13,
    color: styleConst.color.greyText5,
    width: '50%',
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

const _animated = {
  SubmitButton: new Animated.Value(1),
  duration: 250,
};

const mapStateToProps = ({catalog, dealer}) => {
  return {
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    city: catalog.newCar.city,
    needFetchFilterData: catalog.newCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity:
      catalog.newCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actionFetchNewCar: data => {
      return dispatch(actionFetchNewCarByFilter(data));
    },
    actionFetchUsedCar: data => {
      return dispatch(actionFetchUsedCarByFilter(data));
    },
    actionFetchNewCarFilters: data => {
      return dispatch(actionFetchNewCarFilterData(data));
    },
    actionFetchUsedCarFilters: data => {
      return dispatch(actionFetchUsedCarFilterData(data));
    },
  };
};

const deviceWidth = Dimensions.get('window').width;
const sliderWidth = (deviceWidth / 100) * 85;

const modals = {
  year: 'year',
  mileage: 'mileage',
  price: 'price',
  power: 'power',
};

const yearItems = [];
const minDate = new Date(substractYears(100)).getUTCFullYear();
const maxDate = new Date().getUTCFullYear();
if (minDate && maxDate) {
  for (var i = minDate; i <= maxDate; i++) {
    yearItems.push({
      label: i.toString(),
      value: i,
    });
  }
}
yearItems.reverse();

const initialStateFilters = {
  nds: false,
};

const reducerFilters = (state = initialStateFilters, field) => {
  let res = {};
  if (typeof field === 'object' && field.length) {
    field.map(val => {
      state[val.name] = val.value;
    });
    Object.assign(res, state);
  } else {
    Object.assign(res, state, {
      [field.name]: field.value,
    });
  }
  return res;
};

const CarsFilterScreen = ({
  navigation,
  route,
  dealerSelected,
  stockTypeDefault,
  actionFetchNewCar,
  actionFetchUsedCar,
  actionFetchNewCarFilters,
  actionFetchUsedCarFilters,
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateFromApi, setUpdateFromApi] = useState(0);
  const [stockLoading, setStockLoading] = useState(false);
  const [totalCars, setTotalCars] = useState(null);
  const [stockType, setStockType] = useState(
    route?.params?.stockTypeDefault
      ? route.params.stockTypeDefault
      : stockTypeDefault,
  );
  const [stateFilters, dispatchFilters] = useReducer(
    reducerFilters,
    initialStateFilters,
  );

  const [dataFilters, setDataFilters] = useState(null);

  const _showHideSubmitButton = show => {
    if (show) {
      Animated.timing(_animated.SubmitButton, {
        toValue: 1,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setLoading(false);
        setStockLoading(false);
      });
    } else {
      Animated.timing(_animated.SubmitButton, {
        toValue: 0,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setLoading(true);
        setStockLoading(true);
      });
    }
  };

  const _showHideModal = (show = false, type) => {
    if (!show) {
      setUpdateFromApi(updateFromApi + 1);
      return setShowModal(null);
    }
    return setShowModal(type);
  };

  // const _fetchCarsAPI = stockType => {
  //   _showHideSubmitButton(false);
  //   switch (stockType) {
  //     case 'New':
  //       actionFetchNewCar({
  //         searchUrl: `/stock/new/cars/get/city/${dealerSelected.city.id}/`,
  //       }).then(res => {
  //         setTotalCars(res.payload.total.count);
  //         _showHideSubmitButton(true);
  //       });
  //       break;
  //     case 'Used':
  //       actionFetchUsedCar({
  //         city: dealerSelected.city.id,
  //       }).then(res => {
  //         setTotalCars(res.payload.total.count);
  //         _showHideSubmitButton(true);
  //       });
  //       break;
  //   }
  // };

  const _fetchFiltersAPI = stockType => {
    _showHideSubmitButton(false);
    switch (stockType) {
      case 'New':
        actionFetchNewCarFilters({
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          setDataFilters(res.payload);
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        actionFetchUsedCarFilters({
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          setDataFilters(res.payload);
          _showHideSubmitButton(true);
        });
        break;
    }
  };

  const updateStock = stockType => {
    setDataFilters(null);
    setTotalCars(null);
    setStockLoading(true);
    setStockType(stockType);
  };

  const _onSubmitButtonPress = () => {
    switch (stockType) {
      case 'New':
        navigation.navigate('NewCarListScreen');
        break;
      case 'Used':
        navigation.navigate('UsedCarListScreen');
        break;
    }
  };

  const _onChangeFilter = (field, value) => {
    if (typeof field === 'object') {
      let data = [];
      Object.keys(field).map(val => {
        data.push({name: val, value: field[val]});
      });
      return dispatchFilters(data);
    } else {
      return dispatchFilters({name: field, value});
    }
  };

  useEffect(() => {
    _fetchFiltersAPI(stockType);
  }, [stockType]);

  useEffect(() => {
    _showHideSubmitButton(false);
    switch (stockType) {
      case 'New':
        actionFetchNewCar({
          filters: stateFilters,
          searchUrl: `/stock/new/cars/get/city/${dealerSelected.city.id}/`,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        actionFetchUsedCar({
          filters: stateFilters,
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          _showHideSubmitButton(true);
        });
        break;
    }
  }, [updateFromApi]);

  return (
    <Container style={styles.container}>
      <Segment style={[styles.row, styles.segmentWrapper]}>
        <Button
          first
          style={[styles.segmentTab, styles.segmentTabTwo]}
          onPress={() => {
            updateStock('New');
          }}
          active={stockType === 'New' ? true : false}>
          <Text style={styles.segmentButtonText}>
            {strings.NewCarListScreen.titleShort}
          </Text>
        </Button>
        <Button
          last
          style={[styles.segmentTab, styles.segmentTabTwo]}
          onPress={() => {
            updateStock('Used');
          }}
          active={stockType === 'Used' ? true : false}>
          <Text style={styles.segmentButtonText}>
            {strings.UsedCarListScreen.titleShort}
          </Text>
        </Button>
      </Segment>
      {dataFilters && dataFilters.data ? (
        <Content>
          <Card noShadow style={[styles.row, styles.rowStatic]}>
            <CardItem
              button
              onPress={() => {
                navigation.navigate('BrandModelsFilterScreen');
              }}
              style={[styles.cardItem, styles.cardItemStatic]}>
              <Text>{strings.CarsFilterScreen.chooseBrandModel}</Text>
              <Right>
                <Icon name="chevron-forward" />
              </Right>
            </CardItem>
          </Card>
          {stockType === 'Used' && dataFilters && dataFilters.data ? (
            <Card noShadow style={[styles.row]}>
              {dataFilters && dataFilters.data.year ? (
                <CardItem
                  button
                  onPress={() => {
                    _showHideModal(true, modals.year);
                  }}
                  style={styles.cardItem}>
                  <View style={styles.fieldCaptionWrapper}>
                    <Text style={styles.fieldTitle}>
                      {strings.CarsFilterScreen.filters.year.title}
                    </Text>
                    <View style={styles.fieldCaptionValues}>
                      <Text style={styles.fieldValues}>
                        от{' '}
                        {get(
                          stateFilters,
                          'year[from]',
                          dataFilters?.data?.year?.min,
                        )}
                      </Text>
                      <Text style={styles.fieldValues}>
                        до{' '}
                        {get(
                          stateFilters,
                          'year[to]',
                          dataFilters?.data?.year?.max,
                        )}
                      </Text>
                    </View>
                  </View>
                  <Right>
                    <Icon name="calendar" />
                  </Right>
                </CardItem>
              ) : null}
              {dataFilters && dataFilters.data.mileage ? (
                <CardItem
                  button
                  onPress={() => {
                    _showHideModal(true, modals.mileage);
                  }}
                  style={styles.cardItem}>
                  <View style={styles.fieldCaptionWrapper}>
                    <Text style={styles.fieldTitle}>
                      {strings.CarsFilterScreen.filters.mileage.title}
                    </Text>
                    <View style={styles.fieldCaptionValues}>
                      <Text style={styles.fieldValues}>
                        от{' '}
                        {numberWithGap(
                          get(
                            stateFilters,
                            'mileage[from]',
                            dataFilters.data.mileage.min,
                          ),
                        )}
                      </Text>
                      <Text style={styles.fieldValues}>
                        до{' '}
                        {numberWithGap(
                          get(
                            stateFilters,
                            'mileage[to]',
                            dataFilters.data.mileage.max,
                          ),
                        )}
                      </Text>
                    </View>
                  </View>
                  <Right>
                    <Icon name="speedometer" />
                  </Right>
                </CardItem>
              ) : null}
            </Card>
          ) : null}
          <Card noShadow style={[styles.row]}>
            {dataFilters && dataFilters.prices ? (
              <CardItem
                button
                onPress={() => {
                  _showHideModal(true, modals.price);
                }}
                style={styles.cardItem}>
                <View style={styles.fieldCaptionWrapper}>
                  <Text style={styles.fieldTitle}>
                    {strings.CarsFilterScreen.filters.price.title}
                  </Text>
                  <View style={styles.fieldCaptionValues}>
                    <Text style={styles.fieldValues}>
                      от{' '}
                      {numberWithGap(
                        get(
                          stateFilters,
                          'price[from]',
                          dataFilters.prices.min,
                        ),
                      )}
                    </Text>
                    <Text style={styles.fieldValues}>
                      до{' '}
                      {numberWithGap(
                        get(stateFilters, 'price[to]', dataFilters.prices.max),
                      )}
                    </Text>
                  </View>
                </View>
                <Right>
                  <Icon name="pricetag" />
                </Right>
              </CardItem>
            ) : null}
            {/* НДС */}
            {stockType === 'Used' ? (
              <CardItem
                button
                onPress={() => {
                  _onChangeFilter('nds', !stateFilters.nds);
                  setUpdateFromApi(updateFromApi + 1);
                }}
                style={styles.cardItem}>
                <Text style={styles.fieldTitle}>
                  {strings.CarsFilterScreen.filters.price.nds}
                </Text>
                <Right>
                  <CheckBox
                    checked={get(stateFilters, 'nds', false)}
                    onPress={() => {
                      _onChangeFilter('nds', !stateFilters.nds);
                      setUpdateFromApi(updateFromApi + 1);
                    }}
                  />
                </Right>
              </CardItem>
            ) : null}
            {/* Спец.цена */}
            <CardItem
              button
              onPress={() => {
                _onChangeFilter(
                  'price-special',
                  !stateFilters['price-special'],
                );
                setUpdateFromApi(updateFromApi + 1);
              }}
              style={styles.cardItem}>
              <Text style={styles.fieldTitle}>
                {strings.CarsFilterScreen.filters.price.special}
              </Text>
              <Right>
                <CheckBox
                  checked={get(stateFilters, 'price-special', false)}
                  onPress={() => {
                    _onChangeFilter(
                      'price-special',
                      !stateFilters['price-special'],
                    );
                    setUpdateFromApi(updateFromApi + 1);
                  }}
                />
              </Right>
            </CardItem>
          </Card>
          <Card noShadow style={[styles.row]}>
            {dataFilters && dataFilters.data.power ? (
              <CardItem
                button
                onPress={() => {
                  _showHideModal(true, modals.power);
                }}
                style={styles.cardItem}>
                <View style={styles.fieldCaptionWrapper}>
                  <Text style={styles.fieldTitle}>
                    {strings.CarsFilterScreen.filters.power.title}
                  </Text>
                  <View style={styles.fieldCaptionValues}>
                    <Text style={styles.fieldValues}>
                      от{' '}
                      {get(
                        stateFilters,
                        'power_from',
                        dataFilters.data.power.min,
                      )}
                    </Text>
                    <Text style={styles.fieldValues}>
                      до{' '}
                      {get(
                        stateFilters,
                        'power_to',
                        dataFilters.data.power.max,
                      )}
                    </Text>
                  </View>
                </View>
                <Right>
                  <Icon type={'SimpleLineIcons'} name="speedometer" />
                </Right>
              </CardItem>
            ) : null}
          </Card>

          {/* Модалка Год выпуска */}
          {dataFilters.data.year ? (
            <ModalView
              isModalVisible={showModal === modals.year}
              onHide={() => {
                _showHideModal(false);
              }}
              title={strings.CarsFilterScreen.filters.year.title}
              type={'bottom'}
              confirmBtnText={strings.Base.choose}
              selfClosed={true}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: '30%',
                }}>
                <RNPickerSelect
                  items={yearItems}
                  doneText={strings.Base.choose}
                  value={get(
                    stateFilters,
                    'year[from]',
                    dataFilters?.data?.year?.min,
                  )}
                  textInputProps={{
                    style: {
                      fontSize: 19,
                      color: '#9EA0A4',
                    },
                  }}
                  placeholder={{
                    label: strings.CarsFilterScreen.filters.year.from,
                    value: null,
                    color: '#9EA0A4',
                  }}
                  onValueChange={value => {
                    _onChangeFilter('year[from]', value);
                  }}
                />
                <RNPickerSelect
                  items={yearItems}
                  doneText={strings.Base.choose}
                  value={get(
                    stateFilters,
                    'year[to]',
                    dataFilters?.data?.year?.max,
                  )}
                  textInputProps={{
                    style: {
                      fontSize: 19,
                      color: '#9EA0A4',
                    },
                  }}
                  placeholder={{
                    label: strings.CarsFilterScreen.filters.year.to,
                    value: null,
                    color: '#9EA0A4',
                  }}
                  onValueChange={value => {
                    _onChangeFilter('year[to]', value);
                  }}
                />
              </View>
            </ModalView>
          ) : null}
          {/* Модалка Пробег */}
          {dataFilters.data.mileage ? (
            <ModalView
              isModalVisible={showModal === modals.mileage}
              onHide={() => {
                _showHideModal(false);
              }}
              title={strings.CarsFilterScreen.filters.mileage.title}
              type={'bottom'}
              confirmBtnText={strings.Base.choose}
              selfClosed={true}>
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: '5%',
                }}>
                <MultiSlider
                  values={[
                    get(
                      stateFilters,
                      'mileage[from]',
                      dataFilters?.data?.mileage?.min,
                    ),
                    get(
                      stateFilters,
                      'mileage[to]',
                      dataFilters?.data?.mileage?.max,
                    ),
                  ]}
                  step={10000}
                  min={dataFilters.data.mileage.min}
                  max={dataFilters.data.mileage.max}
                  sliderLength={sliderWidth}
                  onValuesChange={values => {
                    _onChangeFilter({
                      'mileage[from]': values[0],
                      'mileage[to]': values[1],
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
                          height: 21,
                          width: 21,
                          borderRadius: 7,
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
                    {numberWithGap(
                      get(
                        stateFilters,
                        'mileage[from]',
                        dataFilters?.data?.mileage?.min,
                      ),
                    )}
                  </Text>
                  <Text style={{color: '#74747A', fontSize: 14}}>
                    {numberWithGap(
                      get(
                        stateFilters,
                        'mileage[to]',
                        dataFilters?.data?.mileage?.max,
                      ),
                    )}
                  </Text>
                </View>
              </View>
            </ModalView>
          ) : null}
          {/* Модалка Цена */}
          {dataFilters.prices ? (
            <ModalView
              isModalVisible={showModal === modals.price}
              onHide={() => {
                _showHideModal(false);
              }}
              title={strings.CarsFilterScreen.filters.price.title}
              type={'bottom'}
              confirmBtnText={strings.Base.choose}
              selfClosed={true}>
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: '5%',
                }}>
                <MultiSlider
                  values={[
                    get(stateFilters, 'price[from]', dataFilters?.prices?.min),
                    get(stateFilters, 'price[to]', dataFilters?.prices?.max),
                  ]}
                  step={dataFilters?.prices?.step}
                  min={dataFilters.prices.min}
                  max={dataFilters.prices.max}
                  sliderLength={sliderWidth}
                  onValuesChange={values => {
                    _onChangeFilter({
                      'price[from]': values[0],
                      'price[to]': values[1],
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
                          height: 21,
                          width: 21,
                          borderRadius: 7,
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
                    {numberWithGap(
                      get(
                        stateFilters,
                        'price[from]',
                        dataFilters?.prices?.min,
                      ),
                    )}
                  </Text>
                  <Text style={{color: '#74747A', fontSize: 14}}>
                    {numberWithGap(
                      get(stateFilters, 'price[to]', dataFilters?.prices?.max),
                    )}
                  </Text>
                </View>
              </View>
            </ModalView>
          ) : null}
          {/* Модалка Мощность */}
          {dataFilters.data.power ? (
            <ModalView
              isModalVisible={showModal === modals.power}
              onHide={() => {
                _showHideModal(false);
              }}
              title={strings.CarsFilterScreen.filters.power.title}
              type={'bottom'}
              confirmBtnText={strings.Base.choose}
              selfClosed={true}>
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: '5%',
                }}>
                <MultiSlider
                  values={[
                    get(
                      stateFilters,
                      'power_from',
                      dataFilters?.data?.power?.min,
                    ),
                    get(
                      stateFilters,
                      'power_to',
                      dataFilters?.data?.power?.max,
                    ),
                  ]}
                  step={10}
                  min={dataFilters.data.power.min}
                  max={dataFilters.data.power.max}
                  sliderLength={sliderWidth}
                  onValuesChange={values => {
                    _onChangeFilter({
                      power_from: values[0],
                      power_to: values[1],
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
                          height: 21,
                          width: 21,
                          borderRadius: 7,
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
                    {get(
                      stateFilters,
                      'power_from',
                      dataFilters?.data.power?.min,
                    )}
                  </Text>
                  <Text style={{color: '#74747A', fontSize: 14}}>
                    {get(
                      stateFilters,
                      'power_to',
                      dataFilters?.data.power?.max,
                    )}
                  </Text>
                </View>
              </View>
            </ModalView>
          ) : null}
        </Content>
      ) : (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={[styles.resultButton, styleConst.spinner]}
          size="small"
        />
      )}
      {stockLoading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={[styles.resultButton, styleConst.spinner]}
          size="small"
        />
      ) : !loading ? (
        <Animated.View
          style={{
            opacity: _animated.SubmitButton,
          }}>
          <Button
            block
            style={[styles.resultButton]}
            disabled={!totalCars ? true : false}
            active={totalCars ? true : false}
            onPress={() => {
              _onSubmitButtonPress();
            }}>
            <Text style={styles.resultButtonText}>
              {totalCars
                ? `${strings.CarsFilterScreen.resultsButton.show} ${totalCars} авто`
                : `Нет предложений`}
            </Text>
          </Button>
        </Animated.View>
      ) : null}
    </Container>
  );
};

CarsFilterScreen.defaultProps = {
  stockTypeDefault: 'New',
};

export default connect(mapStateToProps, mapDispatchToProps)(CarsFilterScreen);
