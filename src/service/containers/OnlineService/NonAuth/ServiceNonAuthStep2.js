/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useReducer} from 'react';
import {HStack, Text, View} from 'native-base';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localDealerClear} from '../../../../dealer/actions';
import {strings} from '../../../../core/lang/const';

import API from '../../../../utils/api';
import {getHumanTime} from '../../../../utils/date';
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

const reducerService = (state = {}, action) => {
  if (action.type && action.type === 'clear') {
    return {};
  }
  return {...state, ...action};
};

const ServiceNonAuthStep2 = props => {
  const {route, region, navigation} = props;

  const orderData = get(route, 'params', {});

  const isAdditionalAvailable = get(orderData, 'typeSecond') !== 'tyreRepair';

  const [serviceData, setServiceData] = useReducer(reducerService, {
    typeFirst: get(orderData, 'SERVICE'),
    typeSecond: get(orderData, 'SERVICETYPE'),
    additionalField: false,
    leaveTyresInStorage: false,
    loading: false,
    lead: get(orderData, 'lead'),
    items: get(orderData, 'items'),
    itemsFull: get(orderData, 'itemsFull'),
    itemFullSelected: {},
  });

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step2');
  }, []);

  useEffect(() => {
    if (
      !isAdditionalAvailable &&
      (!get(orderData, 'DEALER') ||
        !get(orderData, 'SERVICE') ||
        !get(orderData, 'SERVICETYPE'))
    ) {
      return;
    }
    if (!get(serviceData, 'items.length') || get(serviceData, 'needUpdate')) {
      setServiceData({
        loading: true,
        items: [],
        itemsFull: [],
        itemFullSelected: {},
        needUpdate: false,
      });
      API.fetchServiceCalculation({
        dealerID: get(orderData, 'DEALER'),
        workType: get(orderData, 'SERVICETYPE'),
        leaveTyresInStorage: get(serviceData, 'leaveTyresInStorage', false),
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
          setServiceData({lead: true, loading: false, needUpdate: false});
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
          needUpdate: false,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, serviceData?.leaveTyresInStorage]);

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
            : get(serviceData, 'items.length') && !get(serviceData, 'lead')
            ? {
                name: 'SERVICESecond',
                type: 'select',
                label:
                  strings.Form.field.label.serviceTypes[
                    get(orderData, 'SERVICE')
                  ].second,
                value: null,
                props: {
                  items: serviceData.items,
                  required: true,
                  // value: secondData.items,
                  placeholder: {
                    label:
                      strings.Form.field.label.serviceTypes[
                        get(orderData, 'SERVICE')
                      ].second,
                    value: null,
                    color: '#9EA0A4',
                  },
                  onChange: async serviceSecondID => {
                    const itemsFull = get(serviceData, 'itemsFull');
                    const indexEl = Object.keys(itemsFull).find(
                      item => itemsFull[item].id == serviceSecondID,
                    );
                    if (indexEl) {
                      setServiceData({
                        itemFullSelected: serviceData.itemsFull[indexEl],
                      });
                    }
                  },
                },
              }
            : null,
        ],
      },
      isAdditionalAvailable
        ? {
            name: strings.Form.field.label.serviceTypes[
              get(orderData, 'SERVICE')
            ].additional,
            fields: [
              {
                name: 'additionalField',
                type: 'checkbox',
                label:
                  strings.Form.field.label.serviceTypes[
                    get(orderData, 'SERVICE')
                  ].myTyresInStorage,
                value: get(serviceData, 'additionalField', false),
              },
              {
                name: 'leaveTyresInStorage',
                type: 'checkbox',
                label:
                  strings.Form.field.label.serviceTypes[
                    get(orderData, 'SERVICE')
                  ].leaveTyresInStorage,
                value: false,
                props: {
                  onSelect: val =>
                    setTimeout(
                      () =>
                        setServiceData({
                          leaveTyresInStorage: val,
                          needUpdate: true,
                        }),
                      300,
                    ),
                },
              },
            ],
          }
        : null,
      get(serviceData, 'itemFullSelected.total')
        ? {
            name: strings.Form.group.additional,
            fields: [
              {
                name: 'summaryData',
                type: 'component',
                label: strings.Form.group.additional,
                value: (
                  <View>
                    {get(serviceData, 'itemFullSelected.total.time') ? (
                      <HStack>
                        <Text>Нам потребуется примерно </Text>
                        <Text fontWeight={600}>
                          {getHumanTime(
                            get(serviceData, 'itemFullSelected.total.time'),
                          )}
                        </Text>
                        <Text> на все работы</Text>
                      </HStack>
                    ) : null}
                    {get(serviceData, 'itemFullSelected.total') ? (
                      <HStack>
                        <Text>Итоговая стоимость составит ~ </Text>
                        <Text fontWeight={600}>
                          {get(
                            serviceData,
                            'itemFullSelected.total.summ.value',
                          )}{' '}
                          {get(
                            serviceData,
                            'itemFullSelected.total.summ.currency',
                          )}
                        </Text>
                      </HStack>
                    ) : null}
                  </View>
                ),
              },
            ],
          }
        : {},
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
          isLoading: serviceData.loading,
          isLoadingText: null,
        },
      }}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep2);
