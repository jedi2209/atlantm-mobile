/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import {addDays, dayMonthYear, format} from '../../../../utils/date';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localUserDataUpdate} from '../../../../profile/actions';
import {localDealerClear} from '../../../../dealer/actions';
import {
  SERVICE_ORDER__SUCCESS,
  SERVICE_ORDER__FAIL,
} from '../../../actionTypes';
import {strings} from '../../../../core/lang/const';

import Analytics from '../../../../utils/amplitude-analytics';

import API from '../../../../utils/api';
import {ERROR_NETWORK} from '../../../../core/const';
import {useToast} from 'native-base';

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

const ServiceNonAuthStep1 = props => {
  const {
    route,
    lastName,
    firstName,
    phone,
    email,
    carBrand,
    carModel,
    carVIN,
    carNumber,
    localDealerClear,
    dealerSelectedLocal,
    region,
    allDealers,
  } = props;

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [isSuccess, setSuccess] = useState(false);
  const [servicesSecond, setServices] = useState([]);
  const [orderLead, setLead] = useState(true);
  const [car, setCar] = useState({
    carBrand: carBrand,
    carModel: carModel,
    carVIN: carVIN,
    carNumber: carNumber,
  });
  const [user, setUser] = useState({
    email: email,
    phone: phone,
    name: firstName && lastName ? `${firstName} ${lastName}` : '',
  });

  const dealer = get(props.route, 'params.dealerCustom', dealerSelectedLocal);

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
      if (typeof dealer == 'object') {
        listDealers.push({
          label: dealer.name,
          value: dealer.id,
          key: dealer.id,
        });
      }
    }
  }

  useEffect(() => {
    const carFromNavigation = get(props.route, 'params.car');
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
  }, [dealerSelectedLocal]);

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
          readonly: get(route, 'params.settings.dealerHide', true),
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
        fields: [
          dealerField,
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
              onChange: async workType => {
                const services = await API.fetchServiceCalculation({
                  dealerID: get(dealer, 'id'),
                  workType,
                });
                let servicesTmp = [];
                get(services, 'data.work', []).map(el => {
                  servicesTmp.push({
                    label: el.name,
                    value: el.count,
                    key: el.id,
                  });
                });
                if (servicesTmp.length) {
                  setServices(servicesTmp);
                }
              },
              placeholder: {
                label: strings.Form.field.placeholder.service,
                value: null,
                color: '#9EA0A4',
              },
            },
          },
          servicesSecond.length
            ? {
                name: 'SERVICESecond',
                type: 'select',
                label: strings.Form.field.label.service,
                value: null,
                props: {
                  items: servicesSecond,
                  required: true,
                  placeholder: {
                    label: strings.Form.field.placeholder.service,
                    value: null,
                    color: '#9EA0A4',
                  },
                },
              }
            : {},
        ],
      },
      {
        name: strings.Form.group.car,
        fields: [
          {
            name: 'CARBRAND',
            type: 'input',
            label: strings.Form.field.label.carBrand,
            value: props.carBrand,
            props: {
              required: true,
              placeholder: null,
            },
          },
          {
            name: 'CARMODEL',
            type: 'input',
            label: strings.Form.field.label.carModel,
            value: props.carModel,
            props: {
              required: true,
              placeholder: null,
            },
          },
          {
            name: 'CARNUMBER',
            type: 'input',
            label: strings.Form.field.label.carNumber,
            value: props.carNumber,
            props: {
              required: true,
              placeholder: null,
            },
          },
          {
            name: 'CARVIN',
            type: 'input',
            label: strings.Form.field.label.carVIN,
            value: props.carVIN,
            props: {
              placeholder: null,
              autoCapitalize: 'characters',
            },
          },
        ],
      },
    ],
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
      onSubmit={() => {}}
      SubmitButton={{
        text: strings.DatePickerCustom.chooseDateButton,
        noAgreement: true,
      }}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep1);
