/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useReducer} from 'react';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localDealerClear} from '../../../../dealer/actions';
import {strings} from '../../../../core/lang/const';

import Analytics from '../../../../utils/amplitude-analytics';
import API from '../../../../utils/api';

const mapStateToProps = ({dealer, service, nav}) => {
  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  return {
    nav,
    allDealers: dealer.listDealers,
    date: service.date,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE'),
    email: UserData.get('EMAIL'),
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

const ServiceNonAuthStep1 = props => {
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
  } = props;

  const [serviceData, setServiceData] = useReducer(
    reducerService,
    defaultFieldsData,
  );

  // const [seed, setSeed] = useState(1);
  // const resetForm = () => {
  //   setSeed(Math.random());
  // };

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [servicesCategoryField, setServicesCategoryField] = useState({});
  const [car, setCar] = useState({
    carBrand: carBrand,
    carModel: carModel,
    carVIN: carVIN,
    carNumber: carNumber,
  });

  const dealer = get(route, 'params.dealerCustom', dealerSelectedLocal);

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

  let dealerField = {};
  if (listDealers) {
    if (listDealers.length < 1) {
      dealerField = {
        name: 'DEALER',
        type: 'dealerSelect',
        label: strings.Form.group.dealer,
        value: dealer,
        props: {
          required: true,
          goBack: true,
          isLocal: true,
          showBrands: false,
          dealerFilter: {
            type: 'ST',
          },
        },
      };
    }
    if (listDealers.length === 1) {
      dealerField = {
        name: 'DEALER',
        type: 'dealerSelect',
        label: strings.Form.group.dealer,
        value: dealerSelectedLocal || allDealers[dealer] || dealer,
        props: {
          required: true,
          goBack: true,
          isLocal: true,
          showBrands: false,
          readonly: get(route, 'params.settings.dealerHide', false),
          dealerFilter: {
            type: 'ST',
          },
        },
      };
    }
    if (listDealers.length > 1) {
      dealerField = {
        name: 'DEALER',
        type: 'select',
        label: strings.Form.field.label.dealer,
        value: dealer,
        props: {
          items: listDealers,
          required: true,
          placeholder: {
            label: strings.Form.field.placeholder.dealer,
            value: null,
            color: '#9EA0A4',
          },
        },
      };
    }
  }

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
          value: get(serviceData, 'typeSecond'),
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
        setServicesCategoryField({});
        break;
    }
  }, [serviceData]);

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [dealerField],
      },
      dealerSelectedLocal || dealerSelectedLocalState
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
                    {
                      label: strings.ServiceScreen.works.carWash,
                      value: 'carWash',
                    },
                    {
                      label: strings.ServiceScreen.works.other,
                      value: 'other',
                    },
                  ],
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
        fields: [
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
        ],
      },
    ],
  };

  const _onSubmit = async pushProps => {
    let nextScreen = 'ServiceNonAuthStep3';
    let extData = {};
    setServiceData({loading: true});
    if (get(serviceData, 'typeSecond')) {
      const isDataAvailable = await API.fetchServiceCalculation({
        dealerID: get(pushProps, 'DEALER'),
        workType: get(pushProps, 'SERVICETYPE'),
        additional: false,
      });
      if (isDataAvailable) {
        let servicesTmp = [];
        let servicesFull = [];
        get(isDataAvailable, 'data', []).map(el => {
          const id = get(el, 'id');
          servicesTmp.push({
            label: el.name,
            value: id,
            key: id,
          });
          servicesFull.push(el);
        });
        if (!get(servicesTmp, 'length')) {
          setServiceData({lead: true, loading: false});
        } else {
          nextScreen = 'ServiceNonAuthStep2';
          extData = {
            items: servicesTmp,
            itemsFull: servicesFull,
            lead: false,
          };
        }
      }
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep1);
