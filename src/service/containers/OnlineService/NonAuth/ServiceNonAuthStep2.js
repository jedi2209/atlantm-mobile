/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useReducer} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localDealerClear} from '../../../../dealer/actions';
import {strings} from '../../../../core/lang/const';

import API from '../../../../utils/api';
import {View} from 'native-base';
import styleConst from '../../../../core/style-const';
import Analytics from '../../../../utils/amplitude-analytics';
import LogoLoader from '../../../../core/components/LogoLoader';

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

const reducerService = (state = {}, action) => {
  if (action.type && action.type === 'clear') {
    return {};
  }
  return {...state, ...action};
};

const ServiceNonAuthStep2 = props => {
  const {route, region, navigation} = props;

  const orderData = get(route, 'params', {});

  const [serviceData, setServiceData] = useReducer(reducerService, {
    typeFirst: get(orderData, 'SERVICE'),
    typeSecond: get(orderData, 'SERVICETYPE'),
    loading: false,
    lead: get(orderData, 'lead'),
    items: [],
    itemsFull: [],
  });

  const [servicesValueField, setServicesValueField] = useState({});
  const [extraFields, setAdditionalFields] = useState({});

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step2');
  }, []);

  useEffect(() => {
    if (
      !get(orderData, 'DEALER') ||
      !get(orderData, 'SERVICE') ||
      !get(orderData, 'SERVICETYPE')
    ) {
      return;
    }
    setServiceData({loading: true});
    API.fetchServiceCalculation({
      dealerID: get(orderData, 'DEALER'),
      workType: get(orderData, 'SERVICETYPE'),
    }).then(servicesCalculation => {
      let servicesTmp = [];
      let servicesFull = [];
      get(servicesCalculation, 'data', []).map(el => {
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
        return navigation.navigate('ServiceNonAuthStep3', {
          ...orderData,
          ...serviceData,
        });
      }
      setServiceData({
        loading: false,
        lead: false,
        items: servicesTmp,
        itemsFull: servicesFull,
      });
    });
  }, [orderData]);

  useEffect(() => {
    if (!get(serviceData, 'items.length')) {
      return;
    }
    setAdditionalFields({
      name: strings.Form.field.label.serviceTypes[get(orderData, 'SERVICE')]
        .additional,
      fields: [
        {
          name: 'additionalField',
          type: 'checkbox',
          label:
            strings.Form.field.label.serviceTypes[get(orderData, 'SERVICE')]
              .myTyresInStorage,
          value: false,
        },
        {
          name: 'leaveTyresInStorage',
          type: 'checkbox',
          label:
            strings.Form.field.label.serviceTypes[get(orderData, 'SERVICE')]
              .leaveTyresInStorage,
          value: false,
        },
      ],
    });
    setServicesValueField({
      name: 'SERVICESecond',
      type: 'select',
      label:
        strings.Form.field.label.serviceTypes[get(orderData, 'SERVICE')].second,
      value: null,
      props: {
        items: serviceData.items,
        required: true,
        // value: secondData.items,
        placeholder: {
          label:
            strings.Form.field.label.serviceTypes[get(orderData, 'SERVICE')]
              .second,
          value: null,
          color: '#9EA0A4',
        },
        onChange: async serviceSecondID => {
          const itemsFull = get(serviceData, 'itemsFull');
          const indexEl = Object.keys(itemsFull).find(
            item => itemsFull[item].id == serviceSecondID,
          );
          if (indexEl) {
            setServiceData({itemFullSelected: serviceData.itemsFull[indexEl]});
          }
        },
      },
    });
  }, [serviceData?.items]);

  if (serviceData.loading) {
    return <LogoLoader />;
  }

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.services,
        fields: [
          serviceData.loading
            ? {
                name: 'loading',
                type: 'loading',
                value: null,
                props: {},
              }
            : servicesValueField,
        ],
      },
      extraFields,
    ],
  };

  const _onSubmit = async pushProps => {
    pushProps.SERVICESecondFull = serviceData.itemFullSelected;
    delete serviceData.itemFullSelected;
    navigation.navigate('ServiceNonAuthStep3', {
      ...orderData,
      ...serviceData,
      ...pushProps,
    });
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
        props: {
          isDisabled: serviceData.loading,
        },
      }}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep2);
