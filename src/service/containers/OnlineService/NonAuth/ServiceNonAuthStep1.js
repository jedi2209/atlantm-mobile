/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useReducer} from 'react';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localDealerClear} from '../../../../dealer/actions';
import {strings} from '../../../../core/lang/const';

import Analytics from '../../../../utils/amplitude-analytics';

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

const defaultFieldsSdata = {
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
    return {...defaultFieldsSdata, ...action};
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
    defaultFieldsSdata,
  );

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

    setDealerSelectedLocal(dealerSelectedLocal);

    return () => {
      localDealerClear();
    };
  }, []);

  useEffect(() => {
    setDealerSelectedLocal(dealerSelectedLocal);
    setServiceData({type: 'clear'});
  }, [dealerSelectedLocal]);

  useEffect(() => {
    switch (serviceData.typeFirst) {
      case 'service':
        setServicesCategoryField({});
        break;
      case 'tyreChange':
      case 'tyreRepair':
      case 'wheelChange':
        setServicesCategoryField({
          name: 'SERVICETYPE',
          type: 'select',
          label: strings.Form.field.label.service,
          value: get(serviceData, 'typeSecond'),
          props: {
            items: strings.ServiceScreen.works2['tyreChange'],
            required: true,
            onChange: async typeSecond => setServiceData({typeSecond}),
            placeholder: {
              label: strings.Form.field.placeholder.service,
              value: null,
              color: '#9EA0A4',
            },
          },
        });
        break;
      case 'carWash':
        setServicesCategoryField({});
        break;
      case 'other':
        setServicesCategoryField({});
        break;
      default:
        setServicesCategoryField({});
        break;
    }
  }, [serviceData?.typeFirst]);

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
                value: null,
                props: {
                  items: [
                    {
                      label: strings.ServiceScreen.works.service,
                      value: 'service',
                      key: 'service',
                    },
                    {
                      label: strings.ServiceScreen.works.tyreChange,
                      value: 'tyreChange',
                      key: 'tyreChange',
                    },
                    {
                      label: strings.ServiceScreen.works.carWash,
                      value: 'carWash',
                      key: 'carWash',
                    },
                    {
                      label: strings.ServiceScreen.works.other,
                      value: 'other',
                      key: 'other',
                    },
                  ],
                  required: true,
                  onChange: async typeFirst => setServiceData({typeFirst}),
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
        : {},
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
    const dataForNextScreen = {...serviceData, ...pushProps};

    let nextScreen = 'ServiceNonAuthStep3';

    if (get(dataForNextScreen, 'typeSecond')) {
      nextScreen = 'ServiceNonAuthStep2';
    }
    navigation.navigate(nextScreen, dataForNextScreen);
  };

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key="ServiceNonAuthForm"
      fields={FormConfig}
      barStyle={'light-content'}
      defaultCountryCode={region}
      onSubmit={_onSubmit}
      SubmitButton={{
        text: strings.Form.button.next,
        noAgreement: true,
      }}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep1);
