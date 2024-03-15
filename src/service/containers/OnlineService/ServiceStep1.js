/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useReducer} from 'react';
import {StyleSheet, View, ScrollView, Platform} from 'react-native';
import {useToast} from 'native-base';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {CarCard} from '../../../profile/components/CarCard';

import styleConst from '../../../core/style-const';
import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import dealerProcess from '../../../utils/dealer-process';
import {get, orderBy} from 'lodash';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localDealerClear} from '../../../dealer/actions';
import {strings} from '../../../core/lang/const';

import Analytics from '../../../utils/amplitude-analytics';
import API from '../../../utils/api';
import ToastAlert from '../../../core/components/ToastAlert';

const mapStateToProps = ({dealer, profile, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['desc']);

  let carLocalBrand = undefined;
  let carLocalModel = undefined;
  let carLocalNumber = undefined;
  let carLocalVin = undefined;

  if (profile.cars && typeof profile.cars === 'object') {
    let Cars = [];
    profile.cars.map(item => {
      if (!item.hidden) {
        Cars.push(item);
      }
    });
    if (Cars && Cars[0]) {
      if (Cars[0].brand) {
        carLocalBrand = Cars[0].brand;
      }
      if (Cars[0].model) {
        carLocalModel = Cars[0].model;
      }
      if (Cars[0].number) {
        carLocalNumber = Cars[0].number;
      }
      if (Cars[0].vin) {
        carLocalVin = Cars[0].vin;
      }
    }
  }

  return {
    nav,
    allDealers: dealer.listDealers,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE'),
    email: UserData.get('EMAIL'),
    cars,
    carBrand: UserData.get('CARBRAND')
      ? UserData.get('CARBRAND')
      : carLocalBrand,
    carModel: UserData.get('CARMODEL')
      ? UserData.get('CARMODEL')
      : carLocalModel,
    carNumber: UserData.get('CARNUMBER')
      ? UserData.get('CARNUMBER')
      : carLocalNumber,
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    dealerSelectedLocal: dealer.selectedLocal,
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  orderService,
  localDealerClear,
};

const defaultFieldsData = {
  typeFirst: null,
  typeSecond: null,
  loading: false,
  lead: true,
  items: [],
  itemsFull: [],
};

const reducerService = (state = {}, action) => {
  if (get(action, 'type') === 'clear') {
    return {};
  }
  if (Object.keys(action)[0] === 'typeFirst') {
    return {...defaultFieldsData, ...action};
  }
  return {...state, ...action};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  carContainer: {
    marginLeft: -16,
    marginRight: -16,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginVertical: 10,
  },
  group: {
    marginBottom: 36,
  },
  field: {
    marginBottom: 18,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: -2,
  },
  picker: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    height: 40,
  },
  button: {
    margin: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: '#027aff',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: styleConst.color.white,
  },
  textPriceTitle: {
    marginLeft: 5,
    paddingTop: 7,
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    color: styleConst.color.greyText7,
    width: '83%',
  },
  textPriceIcon: {
    color: styleConst.color.blue,
    marginTop: 3,
  },
  textPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: styleConst.color.greyText,
  },
  scrollViewInner: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 5,
    marginVertical: 29.5,
    textAlign: 'center',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
});

const ServiceStep1 = props => {
  const {
    route,
    carBrand,
    carModel,
    carVIN,
    carNumber,
    localDealerClear,
    dealerSelectedLocal,
    region,
    allDealers,
    navigation,
    cars,
  } = props;

  const [serviceData, setServiceData] = useReducer(
    reducerService,
    defaultFieldsData,
  );

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [servicesCategoryField, setServicesCategoryField] = useState({});
  const [car, setCar] = useState({
    carBrand,
    carModel,
    carVIN,
    carNumber,
  });
  const [myCars, setMyCars] = useState([]);

  const dealer = get(route, 'params.dealerCustom', dealerSelectedLocal);
  const carFromNavigation = get(route, 'params.car');
  const settingsFromNavigation = get(route, 'params.settings');

  const toast = useToast();

  let listDealers = [];
  if (dealer) {
    if (dealer.length) {
      dealer.map(el => {
        if (typeof el === 'string' || typeof el === 'number') {
          el = allDealers[el];
        }
        listDealers.push({
          label: el.name,
          value: el.id,
          key: el.id,
        });
      });
    } else {
      if (typeof dealer === 'object') {
        listDealers.push({
          label: dealer.name,
          value: dealer.id,
          key: dealer.id,
        });
      }
    }
  }

  let dealerField = dealerProcess({
    dealer,
    listDealers,
    dealerSelectedLocal,
    allDealers,
    route,
    dealerFilter: 'ST',
  });

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step1');
    const carFromNavigation = get(route, 'params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      setCar({
        carVIN: carFromNavigation.vin,
        carBrand: get(carFromNavigation, 'brand'),
        carModel: get(carFromNavigation, 'model'),
        carNumber: get(carFromNavigation, 'number'),
        carName: [
          get(carFromNavigation, 'brand'),
          get(carFromNavigation, 'model'),
        ].join(' '),
      });
    }
    // setDealerSelectedLocal(dealerSelectedLocal);

    return () => {
      localDealerClear();
    };
  }, []);

  useEffect(() => {
    // resetForm();
    // setServicesCategoryField({});
    setDealerSelectedLocal(dealerSelectedLocal);
    // setServiceData({type: 'clear'});
  }, [dealerSelectedLocal]);

  useMemo(() => {
    if (!get(serviceData, 'typeFirst')) {
      return;
    }
    switch (serviceData.typeFirst) {
      case 'tyreChange':
      case 'tyreRepair':
      case 'wheelChange':
        setServicesCategoryField({
          name: 'SERVICETYPE',
          type: 'select',
          label: strings.Form.field.label.serviceSecond,
          props: {
            items: strings.ServiceScreen.works2['tyreChange'],
            required: true,
            onChange: typeSecond => setServiceData({typeSecond}),
            placeholder: {
              label: strings.Form.field.placeholder.service,
              value: null,
              color: '#9EA0A4',
            },
          },
        });
        break;
      case 'service':
      case 'carWash':
      case 'other':
      default:
        setServiceData({typeSecond: false});
        setServicesCategoryField({});
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceData.typeFirst]);

  useEffect(() => {
    let carsTmp = [];
    if (carFromNavigation) {
      carsTmp.push(carFromNavigation);
    } else {
      cars.map(item => {
        if (item.hidden) {
          return;
        }
        if (
          get(settingsFromNavigation, 'disableCarBlock') &&
          get(item, 'vin') !== car.carVIN
        ) {
          return;
        }
        carsTmp.push(item);
      });
      if (get(carsTmp, 'length')) {
        carsTmp.push({
          brand: 'Другое авто',
          model: null,
          number: null,
          vin: 'undefinedCar',
        });
      }
    }
    setMyCars(carsTmp);
    const item = carsTmp[0];
    if (typeof item !== undefined) {
      setCar({
        carBrand: get(item, 'carInfo.brand.name', get(item, 'brand')),
        carModel: get(item, 'carInfo.model.name', get(item, 'model')),
        carNumber: get(item, 'number'),
        carVIN: get(item, 'vin'),
      });
    }
  }, [cars]);

  let carsFields = [];

  if (get(myCars, 'length')) {
    carsFields = [
      {
        name: 'CARNAME',
        type: 'component',
        label: strings.Form.field.label.car2,
        value: (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={styles.carContainer}
            contentContainerStyle={styles.carContainerContent}>
            {myCars.map(item => {
              return (
                <RNBounceable
                  activeOpacity={0.7}
                  key={'carWrapper' + item.vin}
                  onPress={() => {
                    setCar({
                      carBrand: get(
                        item,
                        'carInfo.brand.name',
                        get(item, 'brand'),
                      ),
                      carModel: get(
                        item,
                        'carInfo.model.name',
                        get(item, 'model'),
                      ),
                      carNumber: get(item, 'number'),
                      carVIN: get(item, 'vin'),
                    });
                  }}>
                  <View>
                    <CarCard
                      key={'carCard' + item.vin}
                      data={item}
                      type="check"
                      checked={car.carVIN === item.vin}
                      disabled={settingsFromNavigation?.disableCarBlock}
                    />
                  </View>
                </RNBounceable>
              );
            })}
          </ScrollView>
        ),
      },
    ];
  } else {
    carsFields = [
      {
        name: 'CARBRAND',
        type: 'input',
        label: strings.Form.field.label.carBrand,
        value: carBrand,
        props: {
          required: true,
          placeholder: null,
        },
      },
      {
        name: 'CARMODEL',
        type: 'input',
        label: strings.Form.field.label.carModel,
        value: carModel,
        props: {
          required: true,
          placeholder: null,
        },
      },
      {
        name: 'CARNUMBER',
        type: 'input',
        label: strings.Form.field.label.carNumber,
        value: carNumber,
        props: {
          placeholder: null,
        },
      },
      {
        name: 'CARVIN',
        type: 'input',
        label: strings.Form.field.label.carVIN,
        value: carVIN,
        props: {
          placeholder: null,
          autoCapitalize: 'characters',
        },
      },
    ];
  }

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [dealerField],
      },
      dealer
        ? {
            name: strings.Form.group.services,
            fields: [
              {
                name: 'SERVICE',
                type: 'select',
                label: strings.Form.field.label.service,
                props: {
                  items: [
                    {
                      label: strings.ServiceScreen.works.service,
                      value: 'service',
                    },
                    {
                      label: strings.ServiceScreen.works.tyreChange,
                      value: 'tyreChange',
                    },
                    get(dealer, 'id') && ![232, 234].includes(dealer?.id)
                      ? {
                          label: strings.ServiceScreen.works.carWash,
                          value: 'carWash',
                        }
                      : null,
                    {
                      label: strings.ServiceScreen.works.other,
                      value: 'other',
                    },
                  ].filter(x => x !== null),
                  required: true,
                  onChange: typeFirst => setServiceData({typeFirst}),
                  placeholder: {
                    label: strings.Form.field.placeholder.service,
                    value: null,
                    color: '#9EA0A4',
                  },
                },
              },
              servicesCategoryField,
            ],
          }
        : null,
      {
        name: strings.Form.group.car,
        fields: carsFields,
      },
    ],
  };

  const _onSubmit = async pushProps => {
    let nextScreen = 'ServiceStep3';
    let extData = {};
    if (!get(serviceData, 'typeFirst')) {
      toast.show({
        render: ({id}) => {
          return (
            <ToastAlert
              id={id}
              status="warning"
              duration={3000}
              description={[
                strings.Form.status.fieldRequired1,
                '"' + strings.Form.field.label.service + '"',
                strings.Form.status.fieldRequired2,
              ].join(' ')}
              title={strings.Form.status.fieldRequiredMiss}
            />
          );
        },
      });
      return;
    }
    if (
      get(servicesCategoryField, 'props.required') === true &&
      !get(serviceData, 'typeSecond')
    ) {
      toast.show({
        render: ({id}) => {
          return (
            <ToastAlert
              id={id}
              status="warning"
              duration={3000}
              description={[
                strings.Form.status.fieldRequired1,
                '"' + strings.Form.field.label.serviceSecond + '"',
                strings.Form.status.fieldRequired2,
              ].join(' ')}
              title={strings.Form.status.fieldRequiredMiss}
            />
          );
        },
      });
      return;
    }
    setServiceData({loading: true});
    let workType = get(pushProps, 'SERVICE');
    if (get(serviceData, 'typeSecond')) {
      workType = get(pushProps, 'SERVICETYPE');
    }
    const isDataAvailable = await API.fetchServiceCalculation({
      dealerID: get(pushProps, 'DEALER'),
      workType,
    });
    let servicesFull = get(isDataAvailable, 'data', []);
    if (!get(servicesFull, 'length')) {
      setServiceData({lead: true, loading: false});
    } else {
      nextScreen = 'ServiceStep2';
      extData = {
        itemsFull: servicesFull,
        lead: false,
      };
    }
    if (car) {
      extData.CARBRAND = get(car, 'carBrand', pushProps.CARBRAND);
      extData.CARMODEL = get(car, 'carModel', pushProps.CARMODEL);
      extData.CARNUMBER = get(car, 'carNumber', pushProps.CARNUMBER);
      extData.CARVIN = get(car, 'carVIN', pushProps.CARVIN);
    }
    const dataForNextScreen = {...serviceData, ...pushProps, ...extData};
    navigation.navigate(nextScreen, dataForNextScreen);
  };

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      fields={FormConfig}
      barStyle={'light-content'}
      defaultCountryCode={region}
      onSubmit={_onSubmit}
      SubmitButton={{
        text: strings.Form.button.next,
        noAgreement: true,
        props: {
          isLoadingText: null,
        },
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceStep1);
