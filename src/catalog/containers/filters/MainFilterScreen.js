/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useReducer, useRef} from 'react';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Button,
  Icon,
  Text,
  HStack,
  VStack,
  Box,
  View,
  Divider,
  ScrollView,
} from 'native-base';

import RNPickerSelect from 'react-native-picker-select';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import FilterRow from '../../components/FilterRow';
import ModalViewFilter from '../../components/ModalViewFilter';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckboxList from '../../../core/components/CheckboxList';

import styleConst from '../../../core/style-const';
import {DEFAULT_CITY} from '../../../core/const';
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
import {TextInput} from 'react-native-paper';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';

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
  seatsCount: 'seatsCount',
  drive: 'drive',
  colors: 'colors',
  grade: 'grade',
};

const initialStateFilters = {
  nds: false,
  guarantee: false,
  breakInsurance: false,
  fullServiceHistory: false,
  onlineOrder: false,
  ordered: false,
  enginetypeType: [],
  'price-special': false,
};

const yearItems = [];
const minDate = new Date(substractYears(100)).getUTCFullYear();
const maxDate = new Date().getUTCFullYear();
if (minDate && maxDate) {
  for (let i = minDate; i <= maxDate; i++) {
    yearItems.push({
      label: i.toString(),
      value: i,
      key: i,
    });
  }
}
yearItems.reverse();

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 24,
    paddingLeft: 1,
    color: '#222b45',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 25,
    width: 105,
    color: '#222b45',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const mapStateToProps = ({catalog, dealer}) => {
  return {
    region: dealer.region,
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
  if (typeof field === 'object' && get(field, 'length', false)) {
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
  if (labels && !labels.length) {
    return null;
  }
  return (
    <View style={styles.fieldCaptionValues}>
      <Text style={styles.fieldValueOne}>
        {declOfNum(
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
  region,
  stockTypeDefault = 'New',
  updateFromApiDefault = false,
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
  const [grades, setGrade] = useState({});
  const [accordionModels, setAccordion] = useState({});
  const [dataFilters, setDataFilters] = useState(null);
  const mainRef = useRef(null);

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
          city: DEFAULT_CITY[region].id,
        }).then(res => {
          const totalCarsCount = get(res, 'payload.total.count', 0);
          setTotalCars(totalCarsCount);
          const payloadData = get(res, 'payload.data');
          if (payloadData) {
            if (get(payloadData, 'brand')) {
              let brandsTmp = [];
              let modelsTmp = [];
              let modelsAccordionTmp = [];
              let brandsNames = {};
              Object.keys(payloadData.brand).map(val => {
                const brandID = Number(val);
                const brandName = payloadData.brand[val].name.toString();
                const models = payloadData.brand[val].model;
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
                modelsTmp[brandID].sort((a, b) => {
                  if (isNaN(a.label)) {
                    return a.label - b.label;
                  }
                  return a.label > b.label ? 1 : -1;
                });
                modelsAccordionTmp.push({
                  label: brandName,
                  id: brandID,
                  items: modelsTmp[brandID],
                  type: 'brand',
                });
              });
              modelsAccordionTmp.sort((a, b) => (a.label > b.label ? 1 : -1));
              brandsTmp.sort((a, b) => (a.label > b.label ? 1 : -1));
              setAccordion(modelsAccordionTmp);
              res.payload.data.brand = brandsTmp;
              res.payload.data.model = modelsTmp;
            }
            if (get(payloadData, 'gearbox')) {
              let tmp = {};
              Object.keys(payloadData.gearbox).map(val => {
                tmp[Number(val)] = strings.CarParams.gearbox[Number(val)];
              });
              res.payload.data.gearbox = _convertSelect(tmp);
            }
            if (get(payloadData, 'body')) {
              let bodyNames = {};
              let tmp = {};
              Object.keys(payloadData.body).map(val => {
                const number = Number(val);
                tmp[number] = strings.CarParams.body[number];
                const nameLocal = get(strings, 'CarParams.body');
                if (nameLocal[number]) {
                  bodyNames[strings.CarParams.body[number]] = number;
                } else {
                  bodyNames[strings.CarParams.body[number]] = get(
                    payloadData,
                    'body',
                  )[val];
                }
              });
              setBody(bodyNames);
              res.payload.data.body = _convertSelect(tmp);
            }
            if (get(payloadData, 'enginetype')) {
              let tmp = {};
              Object.keys(payloadData.enginetype).map(val => {
                tmp[Number(val)] = strings.CarParams.engine[Number(val)];
              });
              res.payload.data.enginetype = _convertSelect(tmp);
            }
            if (get(payloadData, 'drive')) {
              let tmp = {};
              Object.keys(payloadData.drive).map(val => {
                tmp[Number(val)] = strings.CarParams.wheels[Number(val)];
              });
              res.payload.data.drive = _convertSelect(tmp);
            }
            if (get(payloadData, 'colors')) {
              let colorsTmp = [];
              let colorsNames = {};
              Object.keys(payloadData.colors).map(val => {
                colorsTmp.push({
                  value: val,
                  label: strings.Colors[Number(val)],
                });
                colorsNames[strings.Colors[Number(val)]] =
                  payloadData.colors[val];
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
          city: DEFAULT_CITY[region].id,
          region: region,
        }).then(res => {
          const totalCarsCount = get(res, 'payload.total.count', 0);
          setTotalCars(totalCarsCount);
          const payloadData = get(res, 'payload.data');
          if (payloadData) {
            if (
              get(payloadData, 'city') &&
              Object.keys(payloadData.city).length > 1
            ) {
              let tmp = {};
              Object.keys(payloadData.city).map(val => {
                tmp[Number(val)] = payloadData.city[Number(val)];
              });
              res.payload.data.city = _convertSelect(tmp);
            }
            if (get(payloadData, 'brand')) {
              let brandsTmp = [];
              let modelsTmp = [];
              let modelsAccordionTmp = [];
              let brandsNames = {};
              Object.keys(payloadData.brand).map(val => {
                const brandID = Number(val);
                const brandName = payloadData.brand[val].name.toString();
                const models = payloadData.brand[val].model;
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
            if (get(payloadData, 'gearbox')) {
              let tmp = {};
              Object.keys(payloadData.gearbox).map(val => {
                tmp[Number(val)] = strings.CarParams.gearbox[Number(val)];
              });
              res.payload.data.gearbox = _convertSelect(tmp);
            }
            if (get(payloadData, 'body')) {
              let bodyNames = {};
              let tmp = {};
              Object.keys(payloadData.body).map(val => {
                tmp[Number(val)] = strings.CarParams.body[Number(val)];
                bodyNames[strings.CarParams.body[Number(val)]] = Number(val);
              });
              setBody(bodyNames);
              res.payload.data.body = _convertSelect(tmp);
            }
            if (get(payloadData, 'enginetype')) {
              let tmp = {};
              Object.keys(payloadData.enginetype).map(val => {
                tmp[Number(val)] = strings.CarParams.engine[Number(val)];
              });
              res.payload.data.enginetype = _convertSelect(tmp);
            }
            if (get(payloadData, 'drive')) {
              let tmp = {};
              Object.keys(payloadData.drive).map(val => {
                tmp[Number(val)] = strings.CarParams.wheels[Number(val)];
              });
              res.payload.data.drive = _convertSelect(tmp);
            }
            if (get(payloadData, 'colors')) {
              let colorsTmp = [];
              let colorsNames = {};
              Object.keys(payloadData.colors).map(val => {
                colorsTmp.push({
                  value: val,
                  label: strings.Colors[Number(val)],
                });
                colorsNames[strings.Colors[Number(val)]] =
                  payloadData.colors[val];
              });
              res.payload.data.colors = colorsTmp;
              setColors(colorsNames);
            }
            if (get(payloadData, 'grades')) {
              let gradeTmp = {};
              let gradeNames = {};
              Object.keys(payloadData.grades).map(val => {
                gradeTmp[Number(val)] = payloadData.grades[Number(val)]?.name;

                gradeNames[Number(val)] = payloadData.grades[Number(val)];
              });
              res.payload.data.grades = _convertSelect(gradeTmp);
              setGrade(gradeNames);
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
        navigation.navigateDeprecated('NewCarListScreen', {
          sortBy: 'price',
          sortDirection: 'asc',
          total: {
            count: totalCars,
          },
          showPrices,
        });
        break;
      case 'Used':
        navigation.navigateDeprecated('UsedCarListScreenStack', {
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
    Analytics.logEvent('screen', 'catalog/mainFilters');
  }, []);

  useEffect(() => {
    dispatchFilters(null, null);
    setDataFilters(null);
    setTotalCars(null);
    _showHideSubmitButton(false);
    clearBrandModelFilters();
  }, [region]);

  useEffect(() => {
    _fetchFiltersAPI(stockType);
  }, [stockType]);

  useEffect(() => {
    _showHideSubmitButton(false);
    let filtersLocal = {};
    Object.assign(filtersLocal, stateFilters);
    if (stateFilters.cityIDs) {
      stateFilters.cityIDs.map(val => {
        Object.assign(filtersLocal, stateFilters, {
          ['city[' + val.value + ']']: parseInt(val.value, 10),
        });
      });
    }
    if (brandModel[stockType].brand) {
      let tmp = [];
      Object.keys(brandModel[stockType].brand).map(key => {
        tmp.push(parseInt(key, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        brand: tmp.join(','),
      });
    }
    if (brandModel[stockType].model) {
      let tmp = [];
      Object.keys(brandModel[stockType].model).map(key => {
        tmp.push(parseInt(key, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        model: tmp.join(','),
      });
    }
    if (stateFilters.gearboxType) {
      let tmp = [];
      stateFilters.gearboxType.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        gearbox: tmp.join(','),
      });
    }
    if (stateFilters.bodyType) {
      let tmp = [];
      stateFilters.bodyType.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        body: tmp.join(','),
      });
    }
    if (stateFilters.enginetypeType) {
      let tmp = [];
      stateFilters.enginetypeType.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        enginetype: tmp.join(','),
      });
    }
    if (stateFilters.driveType) {
      let tmp = [];
      stateFilters.driveType.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        drive: tmp.join(','),
      });
    }
    if (stateFilters.grade) {
      let tmp = [];
      stateFilters.grade.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        grade: tmp.join(','),
      });
    }
    if (stateFilters.colorType) {
      let tmp = [];
      stateFilters.colorType.map(val => {
        tmp.push(parseInt(val.value, 10));
      });
      Object.assign(filtersLocal, stateFilters, {
        colors: tmp.join(','),
      });
    }
    if (stateFilters.ordered) {
      Object.assign(filtersLocal, stateFilters, {
        ordered: 'active',
      });
    }
    switch (stockType) {
      case 'New':
        actionFetchNewCar({
          filters: filtersLocal,
          city: DEFAULT_CITY[region].id,
        }).then(res => {
          const totalCarsCount = get(res, 'payload.total.count', 0);
          setTotalCars(totalCarsCount);
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        actionFetchUsedCar({
          filters: filtersLocal,
          region: region,
          city: DEFAULT_CITY[region].id,
        }).then(res => {
          const totalCarsCount = get(res, 'payload.total.count', 0);
          setTotalCars(totalCarsCount);
          _showHideSubmitButton(true);
        });
        break;
    }
  }, [updateFromApi, brandModel[stockType]]);

  const minPrice = get(
    stateFilters,
    'price_from',
    get(dataFilters, 'prices.min'),
  );

  const maxPrice = get(
    stateFilters,
    'price_to',
    get(dataFilters, 'prices.max'),
  );

  const minPower = get(
    stateFilters,
    'power_from',
    get(dataFilters, 'data.power.min'),
  );

  const maxPower = get(
    stateFilters,
    'power_to',
    get(dataFilters, 'data.power.max'),
  );

  const minMileage = get(
    stateFilters,
    'mileage_from',
    get(dataFilters, 'data.mileage.min'),
  );

  const maxMileage = get(
    stateFilters,
    'mileage_to',
    get(dataFilters, 'data.mileage.max'),
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <Box px="3" py="3" bg={styleConst.color.white}>
          <Button.Group
            isAttached
            colorScheme={'blue'}
            mx={{
              base: 'auto',
              md: 0,
            }}
            shadow="5"
            size="md">
            <Button
              isPressed={stockType === 'New' ? true : false}
              variant={stockType === 'New' ? 'solid' : 'outline'}
              isLoading={stockType === 'New' && stockLoading ? true : false}
              isLoadingText={strings.NewCarListScreen.titleShort}
              _spinner={{color: styleConst.color.white}}
              width="45%"
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
              _spinner={{color: styleConst.color.white}}
              width="45%"
              _text={{textTransform: 'uppercase'}}
              onPress={() => updateStock('Used')}>
              {strings.UsedCarListScreen.titleShort}
            </Button>
          </Button.Group>
        </Box>
        {dataFilters && dataFilters.data ? (
          <View mb="1/4">
            {dataFilters &&
            dataFilters.data.city &&
            Object.keys(dataFilters.data.city).length > 1 ? (
              <Box
                px="3"
                py="3"
                borderColor={'gray.100'}
                borderTopWidth="5"
                bg={styleConst.color.white}>
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
                bg={styleConst.color.white}>
                <FilterRow
                  onPress={() => {
                    navigation.navigateDeprecated('BrandModelFilterScreen', {
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
              <Box px="3" py="3" mt="1" bg={styleConst.color.white}>
                <VStack
                  space="4"
                  divider={<Divider bg="gray.100" thickness="1" />}>
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
                            'year_from',
                            dataFilters?.data?.year?.min,
                          ),
                        to:
                          strings.CarsFilterScreen.filters.year.to +
                          ' ' +
                          get(
                            stateFilters,
                            'year_to',
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
                              'mileage_from',
                              dataFilters.data.mileage.min,
                            ),
                          ),
                        to:
                          strings.CarsFilterScreen.filters.year.to +
                          ' ' +
                          numberWithGap(
                            get(
                              stateFilters,
                              'mileage_to',
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
              bg={styleConst.color.white}>
              <VStack
                space="2"
                divider={<Divider bg="gray.100" thickness="1" />}>
                {get(dataFilters, 'prices') &&
                !get(dataFilters, 'prices.hidden') ? (
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
                            'price_from',
                            dataFilters?.prices?.min || 0,
                          ),
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        numberWithGap(
                          get(
                            stateFilters,
                            'price_to',
                            dataFilters?.prices?.max || 0,
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
              bg={styleConst.color.white}>
              <VStack
                space="2"
                divider={<Divider bg="gray.100" thickness="1" />}>
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
                          'engineVolumeShort_from',
                          dataFilters.data.engineVolume.short.min.toFixed(1),
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        get(
                          stateFilters,
                          'engineVolumeShort_to',
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
                          'power_from',
                          dataFilters.data.power.min,
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        get(
                          stateFilters,
                          'power_to',
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
                {stockType !== 'Used' &&
                dataFilters &&
                dataFilters.data.seatsCount?.values ? (
                  <FilterRow
                    onPress={() => {
                      _showHideModal(true, modals.seatsCount);
                    }}
                    title={strings.CarsFilterScreen.filters.seatsCount.title}
                    type="multiSlider"
                    values={{
                      from:
                        strings.CarsFilterScreen.filters.year.from +
                        ' ' +
                        get(
                          stateFilters,
                          'seatsCount_from',
                          dataFilters.data.seatsCount.min,
                        ),
                      to:
                        strings.CarsFilterScreen.filters.year.to +
                        ' ' +
                        get(
                          stateFilters,
                          'seatsCount_to',
                          dataFilters.data.seatsCount.max,
                        ),
                    }}
                    icon={{
                      as: MaterialCommunityIcons,
                      name: 'car-seat',
                      size: 'lg',
                    }}
                    bounceable={true}
                  />
                ) : null}
                {stockType !== 'Used' &&
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
                      name: 'color-palette-outline',
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
              bg={styleConst.color.white}>
              {stockType === 'Used' ? (
                <VStack
                  space="2"
                  divider={<Divider bg="gray.100" thickness="1" />}>
                  {dataFilters && dataFilters.data.grades ? (
                    <FilterRow
                      onPress={() => {
                        _showHideModal(true, modals.grade);
                      }}
                      title={strings.CarsFilterScreen.filters.grades.title}
                      values={_getSelectedLabels(get(stateFilters, 'grade'))}
                      icon={{
                        as: Ionicons,
                        name: 'trophy-outline',
                        size: 'lg',
                      }}
                      bounceable={true}
                      type="multipleCheckbox"
                    />
                  ) : null}
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
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('ordered', !stateFilters.ordered);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.onlyFree.title}
                    isChecked={get(stateFilters, 'ordered', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                </VStack>
              ) : region === 'by' ? (
                <VStack
                  space="2"
                  divider={<Divider bg="gray.100" thickness="1" />}>
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('onlineOrder', !stateFilters.onlineOrder);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.onlineOrder.title}
                    isChecked={get(stateFilters, 'onlineOrder', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                  <FilterRow
                    onPress={() => {
                      _onChangeFilter('ordered', !stateFilters.ordered);
                      setUpdateFromApi(!updateFromApi);
                    }}
                    title={strings.CarsFilterScreen.filters.onlyFree.title}
                    isChecked={get(stateFilters, 'ordered', false)}
                    bounceable={false}
                    type="singleCheckbox"
                  />
                </VStack>
              ) : null}
            </Box>
            {/* Модалка Город */}
            {dataFilters.data.city &&
            Object.keys(dataFilters.data.city).length > 1 ? (
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
                        _makeFilterData(stateFilters.cityIDs, {
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
                    'year_from': dataFilters?.data?.year?.min,
                    'year_to': dataFilters?.data?.year?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.year.title}
                selfClosed={false}>
                <HStack justifyContent="space-between" mx="24">
                  <VStack alignItems="center">
                    <Text fontSize={'md'} color={styleConst.color.greyText5}>
                      {strings.CarsFilterScreen.filters.year.from}
                    </Text>
                    <View>
                    <RNPickerSelect
                      key={'yearPickerFrom'}
                      placeholder={''}
                      touchableWrapperProps={{
                        testID: 'Form.YearSelectInput.YearFrom',
                      }}
                      pickerProps={{
                        testID: 'Form.YearPickerInput.YearFrom',
                        mode: 'dropdown',
                      }}
                      doneText={strings.Base.choose}
                      onValueChange={itemValue => {
                        _onChangeFilter('year_from', itemValue);
                      }}
                      style={{
                        ...pickerSelectStyles,
                      }}
                      textInputProps={{
                        pointerEvents: 'none',
                      }}
                      value={get(
                        stateFilters,
                        'year_from',
                        dataFilters?.data?.year?.min,
                      )}
                      minDate={minDate}
                      maxDate={maxDate}
                      reverse={true}
                      items={yearItems}
                    />
                    </View>
                  </VStack>
                  <VStack alignItems="center">
                    <Text fontSize={'md'} color={styleConst.color.greyText5}>
                      {strings.CarsFilterScreen.filters.year.to}
                    </Text>
                    <RNPickerSelect
                      key={'yearPickerTo'}
                      placeholder={''}
                      touchableWrapperProps={{
                        testID: 'Form.YearSelectInput.YearTo',
                      }}
                      pickerProps={{
                        testID: 'Form.YearPickerInput.YearTo',
                        mode: 'dropdown',
                      }}
                      doneText={strings.Base.choose}
                      onValueChange={itemValue => {
                        _onChangeFilter('year_to', itemValue);
                      }}
                      style={{
                        ...pickerSelectStyles,
                      }}
                      textInputProps={{
                        pointerEvents: 'none',
                      }}
                      value={get(
                        stateFilters,
                        'year_to',
                        dataFilters?.data?.year?.max,
                      )}
                      minDate={minDate}
                      maxDate={maxDate}
                      reverse={true}
                      items={yearItems}
                    />
                  </VStack>
                </HStack>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Пробег */}
            {dataFilters.data.mileage ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.mileage}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'mileage_from': dataFilters?.data?.mileage?.min,
                    'mileage_to': dataFilters?.data?.mileage?.max,
                  })
                }
                avoidKeyboard={true}
                statusBarTranslucent={false}
                title={strings.CarsFilterScreen.filters.mileage.title}
                selfClosed={false}>
                <View style={styles.multiSliderViewWrapper}>
                  <HStack justifyContent={'space-between'}>
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.from}
                      placeholder={strings.CarsFilterScreen.filters.year.from}
                      style={{width: 120}}
                      value={(minMileage
                        ? numberWithGap(minMileage)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (
                          val < get(dataFilters, 'data.mileage.min') ||
                          !val
                        ) {
                          _onChangeFilter({
                            'mileage_from': get(
                              dataFilters,
                              'data.mileage.min',
                            ),
                            'mileage_to': get(
                              stateFilters,
                              'mileage_to',
                              get(dataFilters, 'data.mileage.max'),
                            ),
                          });
                        } else if (
                          val >= get(dataFilters, 'data.mileage.max')
                        ) {
                          _onChangeFilter({
                            'mileage_from':
                              get(dataFilters, 'data.mileage.max') -
                              get(dataFilters, 'data.mileage.step'),
                            'mileage_to': get(
                              stateFilters,
                              'mileage_to',
                              get(dataFilters, 'data.mileage.max'),
                            ),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'mileage_from': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                          'mileage_to': get(
                            stateFilters,
                            'mileage_to',
                            get(dataFilters, 'data.mileage.max'),
                          ),
                        });
                      }}
                    />
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.to}
                      placeholder={strings.CarsFilterScreen.filters.year.to}
                      style={{width: 120}}
                      value={(maxMileage
                        ? numberWithGap(maxMileage)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (
                          val <= get(dataFilters, 'data.mileage.min') ||
                          val > get(dataFilters, 'data.mileage.max') ||
                          !val
                        ) {
                          _onChangeFilter({
                            'mileage_from': get(
                              stateFilters,
                              'mileage_from',
                              get(dataFilters, 'data.mileage.min'),
                            ),
                            'mileage_to': get(dataFilters, 'data.mileage.max'),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'mileage_from': get(
                            stateFilters,
                            'mileage_from',
                            get(dataFilters, 'data.mileage.min'),
                          ),
                          'mileage_to': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                        });
                      }}
                    />
                  </HStack>
                  <MultiSlider
                    values={[
                      get(
                        stateFilters,
                        'mileage_from',
                        dataFilters?.data?.power?.min,
                      ),
                      get(
                        stateFilters,
                        'mileage_to',
                        dataFilters?.data?.power?.max,
                      ),
                    ]}
                    step={10000}
                    min={get(dataFilters, 'data.mileage.min', 0)}
                    max={get(dataFilters, 'data.mileage.max', 1000000)}
                    sliderLength={sliderWidth}
                    onValuesChangeFinish={values =>
                      _onChangeFilter({
                        'mileage_from': values[0],
                        'mileage_to': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View p={10}>
                        <View
                          style={[
                            styleConst.shadow.default,
                            styles.multiSliderCustomMarker,
                          ]}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(
                        get(
                          stateFilters,
                          'mileage_from',
                          dataFilters?.data?.mileage?.min,
                        ),
                      )}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(
                        get(
                          stateFilters,
                          'mileage_to',
                          dataFilters?.data?.mileage?.max,
                        ),
                      )}
                    </Text>
                  </View>
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Цена */}
            {get(dataFilters, 'prices', null) ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.price}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'price_from': get(dataFilters, 'prices.min'),
                    'price_to': get(dataFilters, 'prices.max'),
                  })
                }
                avoidKeyboard={true}
                statusBarTranslucent={false}
                title={strings.CarsFilterScreen.filters.price.title}
                selfClosed={false}>
                <View style={styles.multiSliderViewWrapper}>
                  <HStack justifyContent={'space-between'}>
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.from}
                      placeholder={strings.CarsFilterScreen.filters.year.from}
                      style={{width: 120}}
                      value={(minPrice
                        ? numberWithGap(minPrice)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (val < get(dataFilters, 'prices.min') || !val) {
                          _onChangeFilter({
                            'price_from': get(dataFilters, 'prices.min'),
                            'price_to': get(
                              stateFilters,
                              'price_to',
                              get(dataFilters, 'prices.max'),
                            ),
                          });
                        } else if (val >= get(dataFilters, 'prices.max')) {
                          _onChangeFilter({
                            'price_from':
                              get(dataFilters, 'prices.max') -
                              get(dataFilters, 'prices.step'),
                            'price_to': get(
                              stateFilters,
                              'price_to',
                              get(dataFilters, 'prices.max'),
                            ),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'price_from': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                          'price_to': get(
                            stateFilters,
                            'price_to',
                            get(dataFilters, 'prices.max'),
                          ),
                        });
                      }}
                    />
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.to}
                      placeholder={strings.CarsFilterScreen.filters.year.to}
                      style={{width: 120}}
                      value={(maxPrice
                        ? numberWithGap(maxPrice)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (
                          val <= get(dataFilters, 'prices.min') ||
                          val > get(dataFilters, 'prices.max') ||
                          !val
                        ) {
                          _onChangeFilter({
                            'price_from': get(
                              stateFilters,
                              'price_from',
                              get(dataFilters, 'prices.min'),
                            ),
                            'price_to': get(dataFilters, 'prices.max'),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'price_from': get(
                            stateFilters,
                            'price_from',
                            get(dataFilters, 'prices.min'),
                          ),
                          'price_to': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                        });
                      }}
                    />
                  </HStack>
                  <MultiSlider
                    values={[
                      get(
                        stateFilters,
                        'price_from',
                        get(dataFilters, 'prices.min', 0),
                      ),
                      get(
                        stateFilters,
                        'price_to',
                        get(dataFilters, 'prices.max'),
                      ),
                    ]}
                    step={dataFilters?.prices?.step}
                    min={get(dataFilters, 'prices.min', 0)}
                    max={dataFilters?.prices?.max}
                    sliderLength={sliderWidth}
                    onValuesChangeFinish={values =>
                      _onChangeFilter({
                        'price_from': values[0],
                        'price_to': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View p={10}>
                        <View
                          style={[
                            styleConst.shadow.default,
                            styles.multiSliderCustomMarker,
                          ]}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(get(dataFilters, 'prices.min'))}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {numberWithGap(get(dataFilters, 'prices.max'))}
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
                        _makeFilterData(stateFilters.gearboxType, {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка кол-во сидений */}
            {dataFilters.data.seatsCount?.values ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.seatsCount}
                onHide={() => _showHideModal(false)}
                onReset={() =>
                  _onChangeFilter({
                    'seatsCount_from': dataFilters?.data?.seatsCount?.min,
                    'seatsCount_to': dataFilters?.data?.seatsCount?.max,
                  })
                }
                title={strings.CarsFilterScreen.filters.seatsCount.title}>
                <View style={styles.multiSliderViewWrapper}>
                  <MultiSlider
                    values={[
                      parseInt(
                        get(
                          stateFilters,
                          'seatsCount_from',
                          dataFilters?.data?.seatsCount?.min,
                        ),
                      ),
                      parseInt(
                        get(
                          stateFilters,
                          'seatsCount_to',
                          dataFilters?.data?.seatsCount?.max,
                        ),
                      ),
                    ]}
                    step={1}
                    min={dataFilters.data.seatsCount.min}
                    max={dataFilters.data.seatsCount.max}
                    sliderLength={sliderWidth}
                    onValuesChange={values =>
                      _onChangeFilter({
                        'seatsCount_from': parseInt(values[0]),
                        'seatsCount_to': parseInt(values[1]),
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View p={10}>
                        <View
                          style={[
                            styleConst.shadow.default,
                            styles.multiSliderCustomMarker,
                          ]}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'seatsCount_from',
                          dataFilters?.data.seatsCount?.min,
                        ),
                      ).toFixed(0)}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'seatsCount_to',
                          dataFilters?.data.seatsCount?.max,
                        ),
                      ).toFixed(0)}
                    </Text>
                  </View>
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
                        _makeFilterData(stateFilters.bodyType, {
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
                        _makeFilterData(stateFilters.enginetypeType, {
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
                    'engineVolumeShort_from':
                      dataFilters?.data?.engineVolume?.short?.min,
                    'engineVolumeShort_to':
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
                          'engineVolumeShort_from',
                          dataFilters?.data?.engineVolume?.short?.min,
                        ),
                      ).toFixed(1),
                      parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort_to',
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
                        'engineVolumeShort_from': parseFloat(
                          values[0],
                        ).toFixed(1),
                        'engineVolumeShort_to': parseFloat(values[1]).toFixed(
                          1,
                        ),
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View p={10}>
                        <View
                          style={[
                            styleConst.shadow.default,
                            styles.multiSliderCustomMarker,
                          ]}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort_from',
                          dataFilters?.data.engineVolume?.short?.min,
                        ),
                      ).toFixed(1)}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {parseFloat(
                        get(
                          stateFilters,
                          'engineVolumeShort_to',
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
                    'power_from': dataFilters?.data?.power?.min,
                    'power_to': dataFilters?.data?.power?.max,
                  })
                }
                avoidKeyboard={true}
                statusBarTranslucent={false}
                title={strings.CarsFilterScreen.filters.power.title}
                selfClosed={false}>
                <View style={styles.multiSliderViewWrapper}>
                  <HStack justifyContent={'space-between'}>
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.from}
                      placeholder={strings.CarsFilterScreen.filters.year.from}
                      style={{width: 120}}
                      value={(minPower
                        ? numberWithGap(minPower)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (val < get(dataFilters, 'data.power.min') || !val) {
                          _onChangeFilter({
                            'power_from': get(dataFilters, 'data.power.min'),
                            'power_to': get(
                              stateFilters,
                              'power_to',
                              get(dataFilters, 'data.power.max'),
                            ),
                          });
                        } else if (val >= get(dataFilters, 'data.power.max')) {
                          _onChangeFilter({
                            'power_from':
                              get(dataFilters, 'data.power.max') -
                              get(dataFilters, 'data.power.step'),
                            'power_to': get(
                              stateFilters,
                              'power_to',
                              get(dataFilters, 'data.power.max'),
                            ),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'power_from': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                          'power_to': get(
                            stateFilters,
                            'power_to',
                            get(dataFilters, 'data.power.max'),
                          ),
                        });
                      }}
                    />
                    <TextInput
                      mode="outlined"
                      inputMode="numeric"
                      label={strings.CarsFilterScreen.filters.year.to}
                      placeholder={strings.CarsFilterScreen.filters.year.to}
                      style={{width: 120}}
                      value={(maxPower
                        ? numberWithGap(maxPower)
                        : ''
                      ).toString()}
                      onBlur={e => {
                        const val = parseInt(
                          get(
                            e,
                            'nativeEvent.text',
                            get(e, '_targetInst.pendingProps.text', ''),
                          ).replace(/\D/g, ''),
                        );
                        if (
                          val <= get(dataFilters, 'data.power.min') ||
                          val > get(dataFilters, 'data.power.max') ||
                          !val
                        ) {
                          _onChangeFilter({
                            'power_from': get(
                              stateFilters,
                              'power_from',
                              get(dataFilters, 'data.power.min'),
                            ),
                            'power_to': get(dataFilters, 'data.power.max'),
                          });
                        }
                      }}
                      onChangeText={val => {
                        _onChangeFilter({
                          'power_from': get(
                            stateFilters,
                            'power_from',
                            get(dataFilters, 'data.power.min'),
                          ),
                          'power_to': val
                            ? parseInt(val.replace(/\D/g, ''))
                            : '',
                        });
                      }}
                    />
                  </HStack>
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
                    min={get(dataFilters, 'data.power.min', 0)}
                    max={get(dataFilters, 'data.power.max', 1000)}
                    sliderLength={sliderWidth}
                    onValuesChangeFinish={values =>
                      _onChangeFilter({
                        'power_from': values[0],
                        'power_to': values[1],
                      })
                    }
                    trackStyle={styles.multiSliderTrackStyle}
                    selectedStyle={styles.multiSliderSelectedStyle}
                    customMarker={() => (
                      <View p={10}>
                        <View
                          style={[
                            styleConst.shadow.default,
                            styles.multiSliderCustomMarker,
                          ]}
                        />
                      </View>
                    )}
                  />
                  <View style={styles.multiSliderCaptionView}>
                    <Text style={styles.multiSliderCaptionText}>
                      {get(
                        stateFilters,
                        'power_from',
                        dataFilters?.data.power?.min,
                      )}
                    </Text>
                    <Text style={styles.multiSliderCaptionText}>
                      {get(
                        stateFilters,
                        'power_to',
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
                        _makeFilterData(stateFilters.driveType, {
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
                        _makeFilterData(stateFilters.colorType, {
                          value,
                          label,
                        }),
                      )
                    }
                  />
                </View>
              </ModalViewFilter>
            ) : null}
            {/* Модалка Грейды */}
            {dataFilters.data.grades ? (
              <ModalViewFilter
                isModalVisible={showModal === modals.grade}
                onHide={() => _showHideModal(false)}
                onReset={() => _onChangeFilter('grade', [])}
                title={strings.CarsFilterScreen.filters.grades.title}>
                <View style={styles.selectMultipleWrapper}>
                  <CheckboxList
                    items={dataFilters?.data?.grades}
                    selectedItems={get(stateFilters, 'grade')}
                    type={'grades'}
                    dataExtra={grades}
                    onPressCallback={({value, label}) =>
                      _onChangeFilter(
                        'grade',
                        _makeFilterData(stateFilters.grade, {
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
            <VStack space="4" divider={<Divider bg="gray.100" thickness="1" />}>
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
            onPress={() => {
              _onSubmitButtonPress({showPrices: !dataFilters?.prices?.hidden});
            }}>
            {totalCars
              ? `${strings.CarsFilterScreen.resultsButton.show} ${totalCars} авто`
              : strings.CarsFilterScreen.notFound}
          </Button>
        </Animated.View>
      )}
    </>
  );
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
    height: 27,
    width: 27,
    borderRadius: 7,
    backgroundColor: styleConst.color.lightBlue,
  },
  resultButtonWrapper: {
    zIndex: 100,
    position: 'absolute',
    width: '90%',
    marginHorizontal: '5%',
    bottom: isAndroid ? 40 : 30,
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
  pickerStyle: {
    width: '100%',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MainFilterScreen);
