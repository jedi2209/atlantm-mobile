/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useReducer} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Container,
  Button,
  Icon,
  Text,
  HStack,
  VStack,
  Box,
  View,
  Divider,
  Checkbox,
  Pressable,
  Select as SelectPicker,
  ScrollView,
} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

// import SegmentedControl from 'rn-segmented-control';

import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

import RNBounceable from '@freakycoder/react-native-bounceable';
import FilterRow from '../../components/FilterRow';
import ModalViewFilter from '../../components/ModalViewFilter';
// import {Picker as SelectPicker} from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckboxList from '../../../core/components/CheckboxList';

import styleConst from '../../../core/style-const';
// redux
import {connect} from 'react-redux';
import {substractYears} from '../../../utils/date';
import {declOfNum} from '../../../utils/decl-of-num';
import {
  actionFetchNewCarByFilter,
  actionFetchNewCarFilterData,
  actionFetchUsedCarFilterData,
  actionFetchUsedCarByFilter,
  actionSaveBrandModelFilter,
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import numberWithGap from '../../../utils/number-with-gap';

import {strings} from '../../../core/lang/const';

const isAndroid = Platform.OS === 'android';

const _animated = {
  SubmitButton: new Animated.Value(1),
  duration: 250,
};

const deviceWidth = Dimensions.get('window').width;
const sliderWidth = (deviceWidth / 100) * 85;

const modals = {
  city: 'city',
  brandModels: 'brandModels',
  year: 'year',
  mileage: 'mileage',
  price: 'price',
  power: 'power',
  engineVolume: 'engineVolume',
  gearbox: 'gearbox',
  body: 'body',
  enginetype: 'enginetype',
  drive: 'drive',
  colors: 'colors',
};

const initialStateFilters = {
  nds: false,
  guarantee: false,
  breakInsurance: false,
  fullServiceHistory: false,
  onlineOrder: false,
  enginetypeType: [],
  'price-special': false,
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

const mapStateToProps = ({catalog, dealer}) => {
  return {
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,

    city: catalog.newCar.city,
    brandModel: {
      New: catalog.newCar.brandModelFilter,
      Used: catalog.usedCar.brandModelFilter,
    },
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
    clearBrandModelFilters: () => {
      return dispatch(actionSaveBrandModelFilter({stockType: 'clear'}));
    },
  };
};

const _convertSelect = data => {
  let g = [];
  Object.keys(data).map(val => {
    return g.push({value: val, label: data[val]});
  });
  return g;
};

const reducerFilters = (state = initialStateFilters, field) => {
  let res = {};
  if (!field) {
    return res;
  }
  if (typeof field === 'object' && field && field.length) {
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

const _getSelectedLabels = (selectArr = []) => {
  let labels = [];
  selectArr.map(val => {
    labels.push(val.label);
  });
  return labels.join(', ');
};

const _getSelectedModels = (selectedModels, models) => {
  let labels = [];
  if (!selectedModels) {
    return null;
  }
  models.map(val => {
    val.items.map(el => {
      if (selectedModels[el.id]) {
        labels.push(el.label);
      }
    });
  });
  if (labels && labels.length === 0) {
    return null;
  }
  return (
    <View style={styles.fieldCaptionValues}>
      <Text style={styles.fieldValueOne}>
        {labels.length +
          ' ' +
          declOfNum(
            labels && labels.length,
            strings.CarsFilterScreen.chooseBrandModel.titles,
          )}
      </Text>
    </View>
  );
};

const _makeFilterData = (field, value) => {
  if (typeof field === 'undefined') {
    let tmp = [];
    tmp.push(value);
    value = tmp;
  } else {
    if (value && value.value) {
      let currentFilterState = field;
      const selected = Object.values(currentFilterState).find(obj => {
        return obj.value == value.value;
      });
      if (!selected) {
        currentFilterState.push(value);
      } else {
        currentFilterState.map((toDelete, i) => {
          if (toDelete.value === value.value) {
            currentFilterState.splice(i, 1);
          }
        });
      }
      value = currentFilterState;
    }
  }
  return value;
};

const MainFilterScreen = ({
  navigation,
  route,
  dealerSelected,
  stockTypeDefault,
  updateFromApiDefault,
  actionFetchNewCar,
  actionFetchUsedCar,
  actionFetchNewCarFilters,
  actionFetchUsedCarFilters,
  clearBrandModelFilters,
  brandModel,
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateFromApi, setUpdateFromApi] = useState(updateFromApiDefault);
  const [stockLoading, setStockLoading] = useState(true);
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
  const [colors, setColors] = useState({});
  const [bodys, setBody] = useState({});
  const [accordionModels, setAccordion] = useState({});
  const [dataFilters, setDataFilters] = useState(null);

  const _showHideSubmitButton = show => {
    if (show) {
      setTimeout(() => {
        Animated.timing(_animated.SubmitButton, {
          toValue: 1,
          duration: _animated.duration,
          useNativeDriver: true,
        }).start(() => {
          setLoading(false);
          setStockLoading(false);
        });
      }, 1000);
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
      setShowModal(null);
      setUpdateFromApi(!updateFromApi);
    } else {
      setShowModal(type);
    }
  };

  const _onChangeFilter = (field, value) => {
    if (typeof field === 'object') {
      let data = [];
      Object.keys(field).map(val => {
        data.push({name: val, value: field[val]});
      });
      dispatchFilters(data);
    } else {
      dispatchFilters({name: field, value});
    }
  };

  const _fetchFiltersAPI = stockType => {
    _showHideSubmitButton(false);
    switch (stockType) {
      case 'New':
        actionFetchNewCarFilters({
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          if (res.payload.data) {
            if (res.payload.data.brand) {
              let brandsTmp = [];
              let modelsTmp = [];
              let modelsAccordionTmp = [];
              let brandsNames = {};
              Object.keys(res.payload.data.brand).map(val => {
                const brandID = Number(val);
                const brandName = res.payload.data.brand[val].name.toString();
                const models = res.payload.data.brand[val].model;
                modelsTmp[brandID] = [];
                brandsTmp.push({value: brandID, label: brandName});
                brandsNames[brandName] = brandID;
                Object.keys(models).map(modelID => {
                  modelsTmp[brandID].push({
                    id: Number(modelID),
                    label: models[modelID],
                    type: 'model',
                  });
                });
                modelsAccordionTmp.push({
                  label: brandName,
                  id: brandID,
                  items: modelsTmp[brandID],
                  type: 'brand',
                });
              });
              setAccordion(modelsAccordionTmp);
              res.payload.data.brand = brandsTmp;
              res.payload.data.model = modelsTmp;
            }
            if (res.payload.data.gearbox) {
              let tmp = {};
              Object.keys(res.payload.data.gearbox).map(val => {
                tmp[Number(val)] = strings.CarParams.gearbox[Number(val)];
              });
              res.payload.data.gearbox = _convertSelect(tmp);
            }
            if (res.payload.data.body) {
              let bodyNames = {};
              let tmp = {};
              Object.keys(res.payload.data.body).map(val => {
                tmp[Number(val)] = strings.CarParams.body[Number(val)];
                bodyNames[strings.CarParams.body[Number(val)]] = Number(val);
              });
              setBody(bodyNames);
              res.payload.data.body = _convertSelect(tmp);
            }
            if (res.payload.data.enginetype) {
              let tmp = {};
              Object.keys(res.payload.data.enginetype).map(val => {
                tmp[Number(val)] = strings.CarParams.engine[Number(val)];
              });
              res.payload.data.enginetype = _convertSelect(tmp);
            }
            if (res.payload.data.drive) {
              let driveTmp = {};
              Object.keys(res.payload.data.drive).map(val => {
                driveTmp[Number(val)] = strings.CarParams.wheels[Number(val)];
              });
              res.payload.data.drive = _convertSelect(driveTmp);
            }
            if (res.payload.data.colors) {
              let colorsTmp = [];
              let colorsNames = {};
              Object.keys(res.payload.data.colors).map(val => {
                colorsTmp.push({
                  value: val,
                  label: strings.Colors[Number(val)],
                });
                colorsNames[strings.Colors[Number(val)]] =
                  res.payload.data.colors[val];
              });
              res.payload.data.colors = colorsTmp;
              setColors(colorsNames);
            }
            setDataFilters(res.payload);
          } else {
            setDataFilters(null);
          }
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        actionFetchUsedCarFilters({
          city: dealerSelected.city.id,
          region: dealerSelected.region,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          if (res.payload.data) {
            if (res.payload.data.city) {
              let tmp = {};
              Object.keys(res.payload.data.city).map(val => {
                tmp[Number(val)] = res.payload.data.city[Number(val)];
              });
              res.payload.data.city = _convertSelect(tmp);
            }
            if (res.payload.data.brand) {
              let brandsTmp = [];
              let modelsTmp = [];
              let modelsAccordionTmp = [];
              let brandsNames = {};
              Object.keys(res.payload.data.brand).map(val => {
                const brandID = Number(val);
                const brandName = res.payload.data.brand[val].name.toString();
                const models = res.payload.data.brand[val].model;
                modelsTmp[brandID] = [];
                brandsTmp.push({value: brandID, label: brandName});
                brandsNames[brandName] = brandID;
                Object.keys(models).map(modelID => {
                  modelsTmp[brandID].push({
                    id: modelID,
                    label: models[modelID],
                    type: 'model',
                  });
                });
                modelsAccordionTmp.push({
                  label: brandName,
                  id: brandID,
                  items: modelsTmp[brandID],
                  type: 'brand',
                });
              });
              modelsAccordionTmp.sort((a, b) =>
                a.label > b.label ? 1 : b.label > a.label ? -1 : 0,
              );
              setAccordion(modelsAccordionTmp);
              res.payload.data.brand = brandsTmp;
              res.payload.data.model = modelsTmp;
            }
            if (res.payload.data.gearbox) {
              let tmp = {};
              Object.keys(res.payload.data.gearbox).map(val => {
                tmp[Number(val)] = strings.CarParams.gearbox[Number(val)];
              });
              res.payload.data.gearbox = _convertSelect(tmp);
            }
            if (res.payload.data.body) {
              let bodyNames = {};
              let tmp = {};
              Object.keys(res.payload.data.body).map(val => {
                tmp[Number(val)] = strings.CarParams.body[Number(val)];
                bodyNames[strings.CarParams.body[Number(val)]] = Number(val);
              });
              setBody(bodyNames);
              res.payload.data.body = _convertSelect(tmp);
            }
            if (res.payload.data.enginetype) {
              let tmp = {};
              Object.keys(res.payload.data.enginetype).map(val => {
                tmp[Number(val)] = strings.CarParams.engine[Number(val)];
              });
              res.payload.data.enginetype = _convertSelect(tmp);
            }
            if (res.payload.data.drive) {
              let driveTmp = {};
              Object.keys(res.payload.data.drive).map(val => {
                driveTmp[Number(val)] = strings.CarParams.wheels[Number(val)];
              });
              res.payload.data.drive = _convertSelect(driveTmp);
            }
            if (res.payload.data.colors) {
              let colorsTmp = [];
              let colorsNames = {};
              Object.keys(res.payload.data.colors).map(val => {
                colorsTmp.push({
                  value: val,
                  label: strings.Colors[Number(val)],
                });
                colorsNames[strings.Colors[Number(val)]] =
                  res.payload.data.colors[val];
              });
              res.payload.data.colors = colorsTmp;
              setColors(colorsNames);
            }
            setDataFilters(res.payload);
          } else {
            setDataFilters(null);
          }
          _showHideSubmitButton(true);
        });
        break;
    }
    return null;
  };

  const updateStock = stockType => {
    dispatchFilters(null, null);
    setDataFilters(null);
    setTotalCars(null);
    _showHideSubmitButton(false);
    clearBrandModelFilters();
    setStockType(stockType);
  };

  const _onSubmitButtonPress = ({showPrices}) => {
    switch (stockType) {
      case 'New':
        navigation.navigate('NewCarListScreen', {
          sortBy: 'price',
          sortDirection: 'asc',
          total: {
            count: totalCars,
          },
          showPrices,
        });
        break;
      case 'Used':
        navigation.navigate('UsedCarListScreenStack', {
          screen: 'UsedCarListScreen',
          params: {
            sortBy: 'price',
            sortDirection: 'asc',
            total: {
              count: totalCars,
            },
            showPrices,
          },
        });
        break;
    }
  };

  useEffect(() => {
    dispatchFilters(null, null);
    setDataFilters(null);
    setTotalCars(null);
    _showHideSubmitButton(false);
    clearBrandModelFilters();
  }, [dealerSelected]);

  useEffect(() => {
    _fetchFiltersAPI(stockType);
  }, [stockType]);

  useEffect(() => {
    _showHideSubmitButton(false);
    let filtersLocal = {};
    Object.assign(filtersLocal, stateFilters);
    if (stateFilters['cityIDs']) {
      stateFilters['cityIDs'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['city[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (brandModel[stockType]['brand']) {
      Object.keys(brandModel[stockType]['brand']).map(key => {
        Object.assign(filtersLocal, stateFilters, {
          ['brand[' + key + ']']: parseInt(key, 10),
        });
      });
    }
    if (brandModel[stockType]['model']) {
      Object.keys(brandModel[stockType]['model']).map(key => {
        Object.assign(filtersLocal, stateFilters, {
          ['model[' + key + ']']: key,
        });
      });
    }
    if (stateFilters['gearboxType']) {
      stateFilters['gearboxType'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['gearbox[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (stateFilters['bodyType']) {
      stateFilters['bodyType'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['body[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (stateFilters['enginetypeType']) {
      stateFilters['enginetypeType'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['enginetype[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (stateFilters['driveType']) {
      stateFilters['driveType'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['drive[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (stateFilters['colorType']) {
      stateFilters['colorType'].map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['colors[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    switch (stockType) {
      case 'New':
        actionFetchNewCar({
          filters: filtersLocal,
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        actionFetchUsedCar({
          filters: filtersLocal,
          region: dealerSelected.region,
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.payload.total.count);
          _showHideSubmitButton(true);
        });
        break;
    }
  }, [updateFromApi, brandModel[stockType]]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Box px="3" py="3" bg="white">
          <Button.Group
            isAttached
            colorScheme={'blue'}
            mx={{
              base: 'auto',
              md: 0,
            }}
            size="md">
            <Button
              isPressed={stockType === 'New' ? true : false}
              variant={stockType === 'New' ? 'solid' : 'outline'}
              isLoading={stockType === 'New' && stockLoading ? true : false}
              isLoadingText={strings.NewCarListScreen.titleShort}
              _spinner={{color: 'white'}}
              width="45%"
              shadow="5"
              _text={{textTransform: 'uppercase'}}
              onPress={() => updateStock('New')}>
              {strings.NewCarListScreen.titleShort}
            </Button>
            <Button
              isPressed={stockType === 'Used' ? true : false}
              variant={stockType === 'Used' ? 'solid' : 'outline'}
              isLoading={stockType === 'Used' && stockLoading ? true : false}
              isLoadingText={strings.UsedCarListScreen.titleShort}
              spinnerPlacement="end"
              _spinner={{color: 'white'}}
              width="45%"
              shadow="5"
              _text={{textTransform: 'uppercase'}}
              onPress={() => updateStock('Used')}>
              {strings.UsedCarListScreen.titleShort}
            </Button>
          </Button.Group>
        </Box>
        {dataFilters && dataFilters.data ? (
          <View mb="1/4">
            {dataFilters && dataFilters.data.city ? (
              <Box
                px="3"
                py="3"
                borderColor={'gray.100'}
                borderTopWidth="5"
                bg="white">
                <FilterRow
                  onPress={() => {
                    _showHideModal(true, modals.city);
                  }}
                  title={strings.CarsFilterScreen.filters.city.title}
                  values={_getSelectedLabels(get(stateFilters, 'cityIDs'))}
                  icon={{
                    as: MaterialCommunityIcons,
                    name: 'home-city-outline',
                  }}
                  bounceable={true}
                  type="multipleCheckbox"
                />
              </Box>
            ) : null}
            {dataFilters && dataFilters.data.brand ? (
              <Box
                px="3"
                py="3"
                borderColor={'gray.100'}
                borderTopWidth="5"
                bg="white">
                <FilterRow
                  onPress={() => {
                    navigation.navigate('BrandModelFilterScreen', {
                      stockType,
                      data: accordionModels,
                    });
                  }}
                  title={strings.CarsFilterScreen.chooseBrandModel.title}
                  values={_getSelectedModels(
                    get(brandModel[stockType], 'model'),
                    accordionModels,
                  )}
                  icon={{
                    as: Ionicons,
                    name: 'chevron-forward',
                  }}
                  bounceable={true}
                  type="multipleCheckbox"
                />
              </Box>
            ) : null}
            {stockType === 'Used' && dataFilters && dataFilters.data ? (
              <Box px="3" py="3" mt="1" bg="white">
                <VStack space="4" divider={<Divider />}>
                  {dataFilters && dataFilters.data.year ? (
                    <FilterRow
                      onPress={() => {
                        _showHideModal(true, modals.year);
                      }}
                      title={strings.CarsFilterScreen.filters.year.title}
                      type="multiSlider"
                      values={{
                        from:
                          strings.CarsFilterScreen.filters.year.from +
                          ' ' +
                          get(
                            stateFilters,
                            'year[from]',
                            dataFilters?.data?.year?.min,
                          ),
                        to:
                          strings.CarsFilterScreen.filters.year.to +
                          ' ' +
                          get(
                            stateFilters,
                            'year[to]',
                            dataFilters?.data?.year?.max,
                          ),
                      }}
                      icon={{name: 'calendar', as: Ionicons, size: 'lg'}}
                      bounceable={true}
                    />
                  ) : null}
                  {dataFilters && dataFilters.data.mileage ? (
                    <FilterRow
                      onPress={() => {
                        _showHideModal(true, modals.mileage);
                      }}
                      title={strings.CarsFilterScreen.filters.mileage.title}
                      type="multiSlider"
                      values={{
                        from:
                          strings.CarsFilterScreen.filters.year.from +
                          ' ' +
                          numberWithGap(
                            get(
                              stateFilters,
                              'mileage[from]',
                              dataFilters.data.mileage.min,
                            ),
                          ),
                        to:
                          strings.CarsFilterScreen.filters.year.to +
                          ' ' +
                          numberWithGap(
                            get(
                              stateFilters,
                              'mileage[to]',
                              dataFilters.data.mileage.max,
                            ),
                          ),
                      }}
                      icon={{name: 'speedometer', as: Ionicons, size: 'lg'}}
                      bounceable={true}
                    />
                  ) : null}
                </VStack>
              </Box>
            ) : null}
            <Box
              px="3"
              py="2"
              borderColor={'gray.100'}
              borderTopWidth="5"
              bg="white">
              <VStack space="2" divider={<Divider />}>
                {dataFilters &&
                dataFilters.prices &&
                !dataFilters.prices.hidden ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.price);
                    }}
                    title={strings.CarsFilterScreen.filters.price.title}
                    type="multiSlider"
                    values={{
                      from:
                        strings.CarsFilterScreen.filters.year.from +
                        ' ' +
                        numberWithGap(
                          get(
                            stateFilters,
                            'price[from]',
                            dataFilters.prices.min || 0,
                          ),
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        numberWithGap(
                          get(
                            stateFilters,
                            'price[to]',
                            dataFilters.prices.max || 0,
                          ),
                        ),
                    }}
                    icon={{as: Ionicons, name: 'pricetag', size: 'lg'}}
                    bounceable={true}
                  />
                ) : null}
                {/* НДС */}
                {stockType === 'Used' ? (
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('nds', !stateFilters.nds);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.price.nds}
                    isChecked={get(stateFilters, 'nds', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                ) : null}
                {/* Спец.цена */}
                <FilterRow
                  onPress={() => {
                    _onChangeFilter(
                      'price-special',
                      !stateFilters['price-special'],
                    );
                    setUpdateFromApi(!updateFromApi);
                  }}
                  title={strings.CarsFilterScreen.filters.price.special}
                  isChecked={get(stateFilters, 'price-special', false)}
                  bounceable={false}
                  type="singleCheckbox"
                />
              </VStack>
            </Box>
            <Box
              px="3"
              py="2"
              borderColor={'gray.100'}
              borderTopWidth="5"
              bg="white">
              <VStack space="2" divider={<Divider />}>
                {dataFilters && dataFilters.data.gearbox ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.gearbox);
                    }}
                    title={strings.CarsFilterScreen.filters.gearbox.title}
                    values={_getSelectedLabels(
                      get(stateFilters, 'gearboxType'),
                    )}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'car-shift-pattern',
                      size: 'lg',
                    }}
                    bounceable={true}
                    type="multipleCheckbox"
                  />
                ) : null}
                {dataFilters && dataFilters.data.body ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.body);
                    }}
                    title={strings.CarsFilterScreen.filters.body.title}
                    values={_getSelectedLabels(get(stateFilters, 'bodyType'))}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'car-convertible',
                      size: 'lg',
                    }}
                    bounceable={true}
                    type="multipleCheckbox"
                  />
                ) : null}
                {dataFilters && dataFilters.data.enginetype ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.enginetype);
                    }}
                    title={strings.CarsFilterScreen.filters.enginetype.title}
                    values={_getSelectedLabels(
                      get(stateFilters, 'enginetypeType'),
                    )}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'engine',
                      size: 'lg',
                    }}
                    bounceable={true}
                    type="multipleCheckbox"
                  />
                ) : null}
                {dataFilters && dataFilters.data.engineVolume ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.engineVolume);
                    }}
                    title={strings.CarsFilterScreen.filters.engineVolume.title}
                    type="multiSlider"
                    values={{
                      from:
                        strings.CarsFilterScreen.filters.year.from +
                        ' ' +
                        get(
                          stateFilters,
                          'engineVolumeShort[from]',
                          dataFilters.data.engineVolume.short.min.toFixed(1),
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        get(
                          stateFilters,
                          'engineVolumeShort[to]',
                          dataFilters.data.engineVolume.short.max.toFixed(1),
                        ),
                    }}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'gauge',
                      size: 'lg',
                    }}
                    bounceable={true}
                  />
                ) : null}
                {dataFilters && dataFilters.data.power ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.power);
                    }}
                    title={strings.CarsFilterScreen.filters.power.title}
                    type="multiSlider"
                    values={{
                      from:
                        strings.CarsFilterScreen.filters.year.from +
                        ' ' +
                        get(
                          stateFilters,
                          'power[from]',
                          dataFilters.data.power.min,
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        get(
                          stateFilters,
                          'power[to]',
                          dataFilters.data.power.max,
                        ),
                    }}
                    icon={{
                      as: SimpleLineIcons,
                      name: 'speedometer',
                      size: 'lg',
                    }}
                    bounceable={true}
                  />
                ) : null}
                {dataFilters && dataFilters.data.drive ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.drive);
                    }}
                    title={strings.CarsFilterScreen.filters.drive.title}
                    values={_getSelectedLabels(get(stateFilters, 'driveType'))}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'car-settings',
                      size: 'lg',
                    }}
                    bounceable={true}
                    type="multipleCheckbox"
                  />
                ) : null}
                {stockType != 'Used' &&
                dataFilters &&
                dataFilters.data.colors ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.colors);
                    }}
                    title={strings.CarsFilterScreen.filters.colors.title}
                    values={_getSelectedLabels(get(stateFilters, 'colorType'))}
                    icon={{
                      as: Ionicons,
                      name: 'md-color-palette-outline',
                      size: 'lg',
                    }}
                    bounceable={true}
                    type="multipleCheckbox"
                  />
                ) : null}
              </VStack>
            </Box>
            <Box
              px="3"
              py="2"
              borderColor={'gray.100'}
              borderTopWidth="5"
              bg="white">
              {stockType === 'Used' ? (
                <VStack space="2" divider={<Divider />}>
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('guarantee', !stateFilters.guarantee);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.guarantee.title}
                    isChecked={get(stateFilters, 'guarantee', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter(
                        'breakInsurance',
                        !stateFilters.breakInsurance,
                      );
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={
                      strings.CarsFilterScreen.filters.breakInsurance.title
                    }
                    isChecked={get(stateFilters, 'breakInsurance', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter(
                        'fullServiceHistory',
                        !stateFilters.fullServiceHistory,
                      );
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={
                      strings.CarsFilterScreen.filters.fullServiceHistory.title
                    }
                    isChecked={get(stateFilters, 'fullServiceHistory', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                </VStack>
              ) : dealerSelected.region === 'by' ? (
                <VStack space="2" divider={<Divider />}>
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('onlineOrder', !stateFilters.onlineOrder);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.guarantee.title}
                    isChecked={get(stateFilters, 'onlineOrder', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                </VStack>
              ) : null}
            </Box>
            {/* Модалка Город */}
            {dataFilters.data.city ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.city}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('cityIDs', [])}
                title={strings.CarsFilterScreen.filters.city.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.city}
                    selectedItems={get(stateFilters, 'cityIDs')}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'cityIDs',
                        _makeFilterData(stateFilters['cityIDs'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Год */}
            {dataFilters.data.year ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.year}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'year[from]': dataFilters?.data?.year?.min,
                    'year[to]': dataFilters?.data?.year?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.year.title}
                selfClosed={false}>
                <View style={styles.yearWrapper}>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerCaption}>
                      {strings.CarsFilterScreen.filters.year.from}
                    </Text>
                    <SelectPicker
                      selectedValue={get(
                        stateFilters,
                        'year[from]',
                        dataFilters?.data?.year?.min,
                      )}
                      key={'yearPickerFrom'}
                      style={styles.pickerStyleYear}
                      onValueChange={(itemValue, itemIndex) =>
                        _onChangeFilter('year[from]', itemValue)
                      }>
                      {yearItems.map(item => {
                        return (
                          <SelectPicker.Item
                            key={'yearPickerItemFrom' + item.value}
                            label={item.label}
                            value={item.value}
                          />
                        );
                      })}
                    </SelectPicker>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerCaption}>
                      {strings.CarsFilterScreen.filters.year.to}
                    </Text>
                    <SelectPicker
                      selectedValue={get(
                        stateFilters,
                        'year[to]',
                        dataFilters?.data?.year?.max,
                      )}
                      key={'yearPickerTo'}
                      style={styles.pickerStyleYear}
                      onValueChange={(itemValue, itemIndex) =>
                        _onChangeFilter('year[to]', itemValue)
                      }>
                      {yearItems.map(item => {
                        return (
                          <SelectPicker.Item
                            key={'yearPickerItemTo' + item.value}
                            label={item.label}
                            value={item.value}
                          />
                        );
                      })}
                    </SelectPicker>
                  </View>
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Пробег */}
            {dataFilters.data.mileage ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.mileage}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'mileage[from]': dataFilters?.data?.mileage?.min,
                    'mileage[to]': dataFilters?.data?.mileage?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.mileage.title}>
                <View style={styles.multiSliderViewWrapper}>
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
                    onValuesChange={values =>
                      _onChangeFilter({
                        'mileage[from]': values[0],
                        'mileage[to]': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View
                        style={[
                          styleConst.shadow.default,
                          styles.multiSliderCustomMarker,
                        ]}
                      />
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(
                        get(
                          stateFilters,
                          'mileage[from]',
                          dataFilters?.data?.mileage?.min,
                        ),
                      )}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
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
              </ModalViewFilter>
            ) : null}
            {/* Модалка Цена */}
            {dataFilters.prices ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.price}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'price[from]': dataFilters?.prices?.min,
                    'price[to]': dataFilters?.prices?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.price.title}
                selfClosed={false}>
                <View style={styles.multiSliderViewWrapper}>
                  <MultiSlider
                    values={[
                      get(
                        stateFilters,
                        'price[from]',
                        dataFilters?.prices?.min,
                      ),
                      get(stateFilters, 'price[to]', dataFilters?.prices?.max),
                    ]}
                    step={dataFilters?.prices?.step}
                    min={dataFilters.prices.min}
                    max={dataFilters.prices.max}
                    sliderLength={sliderWidth}
                    onValuesChange={values =>
                      _onChangeFilter({
                        'price[from]': values[0],
                        'price[to]': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View
                        style={[
                          styleConst.shadow.default,
                          styles.multiSliderCustomMarker,
                        ]}
                      />
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(
                        get(
                          stateFilters,
                          'price[from]',
                          dataFilters?.prices?.min,
                        ),
                      )}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(
                        get(
                          stateFilters,
                          'price[to]',
                          dataFilters?.prices?.max,
                        ),
                      )}
                    </Text>
                  </View>
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Коробка передач */}
            {dataFilters.data.gearbox ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.gearbox}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('gearboxType', [])}
                title={strings.CarsFilterScreen.filters.gearbox.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.gearbox}
                    selectedItems={get(stateFilters, 'gearboxType')}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'gearboxType',
                        _makeFilterData(stateFilters['gearboxType'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Кузов */}
            {dataFilters.data.body ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.body}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('bodyType', [])}
                title={strings.CarsFilterScreen.filters.body.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.body}
                    selectedItems={get(stateFilters, 'bodyType')}
                    dataExtra={bodys}
                    type={'body'}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'bodyType',
                        _makeFilterData(stateFilters['bodyType'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Тип двигателя */}
            {dataFilters.data.enginetype ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.enginetype}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('enginetypeType', [])}
                title={strings.CarsFilterScreen.filters.enginetype.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.enginetype}
                    selectedItems={get(stateFilters, 'enginetypeType')}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'enginetypeType',
                        _makeFilterData(stateFilters['enginetypeType'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Объём двигателя */}
            {dataFilters.data.engineVolume ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.engineVolume}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'engineVolumeShort[from]':
                      dataFilters?.data?.engineVolume?.short?.min,
                    'engineVolumeShort[to]':
                      dataFilters?.data?.engineVolume?.short?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.engineVolume.title}>
                <View style={styles.multiSliderViewWrapper}>
                  <MultiSlider
                    values={[
                      parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort[from]',
                          dataFilters?.data?.engineVolume?.short?.min,
                        ),
                      ).toFixed(1),
                      parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort[to]',
                          dataFilters?.data?.engineVolume?.short?.max,
                        ),
                      ).toFixed(1),
                    ]}
                    step={dataFilters.data.engineVolume.short.step}
                    min={dataFilters.data.engineVolume.short.min}
                    max={dataFilters.data.engineVolume.short.max}
                    sliderLength={sliderWidth}
                    onValuesChange={values =>
                      _onChangeFilter({
                        'engineVolumeShort[from]': parseFloat(
                          values[0],
                        ).toFixed(1),
                        'engineVolumeShort[to]': parseFloat(values[1]).toFixed(
                          1,
                        ),
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View
                        style={[
                          styleConst.shadow.default,
                          styles.multiSliderCustomMarker,
                        ]}
                      />
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort[from]',
                          dataFilters?.data.engineVolume?.short?.min,
                        ),
                      ).toFixed(1)}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort[to]',
                          dataFilters?.data.engineVolume?.short?.max,
                        ),
                      ).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Мощность */}
            {dataFilters.data.power ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.power}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'power[from]': dataFilters?.data?.power?.min,
                    'power[to]': dataFilters?.data?.power?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.power.title}>
                <View style={styles.multiSliderViewWrapper}>
                  <MultiSlider
                    values={[
                      get(
                        stateFilters,
                        'power[from]',
                        dataFilters?.data?.power?.min,
                      ),
                      get(
                        stateFilters,
                        'power[to]',
                        dataFilters?.data?.power?.max,
                      ),
                    ]}
                    step={10}
                    min={dataFilters.data.power.min}
                    max={dataFilters.data.power.max}
                    sliderLength={sliderWidth}
                    onValuesChange={values =>
                      _onChangeFilter({
                        'power[from]': values[0],
                        'power[to]': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View
                        style={[
                          styleConst.shadow.default,
                          styles.multiSliderCustomMarker,
                        ]}
                      />
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {get(
                        stateFilters,
                        'power[from]',
                        dataFilters?.data.power?.min,
                      )}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {get(
                        stateFilters,
                        'power[to]',
                        dataFilters?.data.power?.max,
                      )}
                    </Text>
                  </View>
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Привод */}
            {dataFilters.data.drive ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.drive}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('driveType', [])}
                title={strings.CarsFilterScreen.filters.drive.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.drive}
                    selectedItems={get(stateFilters, 'driveType')}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'driveType',
                        _makeFilterData(stateFilters['driveType'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Цвета */}
            {dataFilters.data.colors ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.colors}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('colorType', [])}
                stylesWrapperContent={{
                  height:
                    dataFilters?.data?.colors?.length > 10 ? '83%' : 'auto',
                  justifyContent: 'flex-end',
                }}
                title={strings.CarsFilterScreen.filters.colors.title}
                selfClosed={false}>
                <View style={styles.selectMultipleColorsWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.colors}
                    type={'colors'}
                    dataExtra={colors}
                    selectedItems={get(stateFilters, 'colorType')}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'colorType',
                        _makeFilterData(stateFilters['colorType'], {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
          </View>
        ) : !stockLoading ? (
          <Box border="1" borderRadius="md">
            <VStack space="4" divider={<Divider />}>
              <Box
                px="4"
                pt="4"
                style={[
                  styles.row,
                  styles.noResultsRow,
                  {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Icon
                  as={MaterialCommunityIcons}
                  style={{
                    color: styleConst.color.greyBlue,
                    fontWeight: 'lighter',
                    fontSize: 120,
                  }}
                  name="car-off"
                />
                <Text
                  style={{
                    color: styleConst.color.greyBlue,
                    fontSize: 20,
                    textTransform: 'uppercase',
                  }}>
                  {strings.CarsFilterScreen.notFound}
                </Text>
              </Box>
            </VStack>
          </Box>
        ) : null}
      </ScrollView>
      {stockLoading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={[
            styles.resultButtonWrapper,
            styleConst.spinner,
            {bottom: isAndroid ? 10 : 40},
          ]}
          size="small"
        />
      ) : (
        <Animated.View
          style={[
            styles.resultButtonWrapper,
            {
              opacity: _animated.SubmitButton,
            },
          ]}>
          <Button
            size="lg"
            colorScheme={'blue'}
            px="1/4"
            shadow="7"
            isDisabled={!totalCars || totalCars === 0 ? true : false}
            // active={totalCars ? true : false}
            onPress={() => {
              _onSubmitButtonPress({showPrices: !dataFilters.prices.hidden});
            }}>
            {/* <Text style={styles.resultButtonText}> */}
            {totalCars
              ? `${strings.CarsFilterScreen.resultsButton.show} ${totalCars} авто`
              : strings.CarsFilterScreen.notFound}
            {/* </Text> */}
          </Button>
        </Animated.View>
      )}
    </>
  );
};

MainFilterScreen.defaultProps = {
  stockTypeDefault: 'New',
  updateFromApiDefault: false,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.white,
    borderWidth: 0,
    flex: 1,
    width: '100%',
    maxWidth: '100%',
  },
  footer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  bounceRow: {
    flexDirection: 'row',
  },
  nestedRow: {},
  nestedRow1Closed: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: styleConst.color.bg,
  },
  nestedRow1Opened: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: styleConst.color.bg,
  },
  nestedRow2Closed: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  nestedRow2Opened: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  noResultsRow: {
    height: 200,
  },
  rowLast: {
    marginBottom: isAndroid ? 60 : 50,
  },
  rowStatic: {
    height: 65,
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
  segmentTabLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  segmentTabRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
    marginTop: 5,
  },
  fieldTitle: {
    fontSize: 16,
    color: styleConst.color.greyText4,
  },
  fieldValueOne: {
    fontSize: 13,
    color: styleConst.color.greyText5,
  },
  fieldValues: {
    fontSize: 13,
    color: styleConst.color.greyText5,
    width: '50%',
  },
  selectMultipleWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  selectMultipleColorsWrapper: {
    justifyContent: 'flex-end',
    paddingHorizontal: '5%',
    bottom: 0,
  },
  multiSliderViewWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  multiSliderSelectedStyle: {
    backgroundColor: styleConst.color.lightBlue,
  },
  multiSliderTrackStyle: {
    backgroundColor: '#d5d5e0',
  },
  multiSliderCaptionView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  multiSliderCaptionText: {
    color: '#74747A',
    fontSize: 14,
  },
  multiSliderCustomMarker: {
    height: 21,
    width: 21,
    borderRadius: 7,
    backgroundColor: styleConst.color.lightBlue,
  },
  resultButtonWrapper: {
    zIndex: 100,
    position: 'absolute',
    width: '90%',
    marginHorizontal: '5%',
    bottom: isAndroid ? 10 : 30,
    alignItems: 'center',
    alignContent: 'center',
  },
  resultButton: {
    zIndex: 99,
    borderRadius: 5,
  },
  resultButtonEnabled: {
    backgroundColor: styleConst.color.blue,
    borderColor: styleConst.color.blue,
  },
  resultButtonText: {
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    flexDirection: 'column',
    width: '50%',
    alignItems: 'center',
  },
  pickerCaption: {
    fontSize: 16,
    color: styleConst.color.greyText5,
  },
  pickerStyle: {
    width: '100%',
  },
  pickerStyleYear: {
    width: isAndroid ? 100 : '100%',
    justifyContent: 'center',
  },
  colorWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorText: {
    fontSize: 17,
    fontFamily: styleConst.font.regular,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorBox_white: {
    borderWidth: 1,
    borderColor: styleConst.color.greyText5,
  },
  bodyTypeBox: {
    width: 40,
    height: 30,
  },
  brandLogo: {
    width: 35,
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  brandLogoWrapper: {},
  brandCaret: {
    fontSize: 26,
    marginTop: -4,
    marginRight: '5%',
    padding: 0,
    color: styleConst.color.systemGray,
  },
  modalTitleRow: {
    marginLeft: 5,
    marginTop: 20,
  },
  yearWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainFilterScreen);
