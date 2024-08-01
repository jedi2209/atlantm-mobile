/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useReducer} from 'react';
import {HStack, Text, View, useToast} from 'native-base';
import {get} from 'lodash';

import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localDealerClear} from '../../../dealer/actions';
import {strings} from '../../../core/lang/const';

import API from '../../../utils/api';
import {getHumanTime} from '../../../utils/date';
import Analytics from '../../../utils/amplitude-analytics';
import ToastAlert from '../../../core/components/ToastAlert';

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

const ServiceStep2 = props => {
  const {route, region, navigation} = props;

  const toast = useToast();

  const orderData = get(route, 'params', {});

  let isAdditionalAvailable = false;

  if (get(orderData, 'itemsFull.length')) {
    for (var i = 0; i < get(orderData, 'itemsFull.length'); i++) {
      if (get(orderData.itemsFull[i], 'additional', false)) {
        isAdditionalAvailable = true;
        break;
      }
    }
  }

  const [serviceData, setServiceData] = useReducer(reducerService, {
    typeFirst: get(orderData, 'SERVICE'),
    typeSecond: get(orderData, 'SERVICETYPE'),
    myTyresInStorage: false,
    leaveTyresInStorage: false,
    loading: false,
    lead: get(orderData, 'lead'),
    items: [],
    itemsFull: get(orderData, 'itemsFull', []),
    itemFullSelected: {},
  });

  const isWheelService = ['tyreChange', 'wheelChange'].includes(
    get(orderData, 'SERVICETYPE'),
  );

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step2');
  }, []);

  useEffect(() => {
    if (!serviceData.itemsFull) {
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
      }).then(servicesCalculation => {
        if (servicesCalculation) {
          setServiceData({
            loading: false,
            lead: false,
            items: [],
            itemsFull: servicesCalculation,
            needUpdate: false,
          });
        } else {
          setServiceData({lead: true, loading: false, needUpdate: false});
          return navigation.navigate('ServiceStep3', {
            ...orderData,
            ...serviceData,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, serviceData?.leaveTyresInStorage]);

  useEffect(() => {
    let servicesTmp = [];
    let servicesFull = [];
    const isAdditionalValues = get(serviceData, 'leaveTyresInStorage', false);
    get(serviceData, 'itemsFull', []).map(el => {
      const id = get(el, 'id.sap');
      servicesFull.push(el);
      if (isAdditionalValues === get(el, 'additional')) {
        servicesTmp.push({
          label: el.name,
          value: id,
          key: id,
        });
      }
    });
    const itemsFull = get(serviceData, 'itemsFull');
    const indexEl = Object.keys(itemsFull).find(
      item =>
        itemsFull[item]?.id?.sap == get(serviceData, 'serviceSecondID') &&
        itemsFull[item]?.additional ==
          get(serviceData, 'leaveTyresInStorage', false),
    );
    setTimeout(() => {
      setServiceData({
        loading: false,
        lead: false,
        items: servicesTmp,
        itemsFull: servicesFull,
        needUpdate: false,
        itemFullSelected: indexEl ? serviceData.itemsFull[indexEl] : {},
      });
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceData.needUpdate]);

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
                value: get(serviceData, 'serviceSecondID', null),
                props: {
                  items: serviceData.items,
                  required: true,
                  iOSselectFix: true,
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
                      item =>
                        itemsFull[item]?.id?.sap == serviceSecondID &&
                        itemsFull[item]?.additional ==
                          get(serviceData, 'leaveTyresInStorage', false),
                    );
                    setServiceData({
                      serviceSecondID,
                    });
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
      isWheelService || isAdditionalAvailable
        ? {
            name: strings.Form.field.label.serviceTypes[
              get(orderData, 'SERVICE')
            ]?.additional,
            fields: [
              isWheelService
                ? {
                    name: 'myTyresInStorage',
                    type: 'select',
                    label:
                      strings.Form.field.label.serviceTypes[
                        get(orderData, 'SERVICE')
                      ].myTyresInStorage,
                    value: get(serviceData, 'myTyresInStorage', false),
                    props: {
                      items: [
                        {
                          label: strings.ContactsScreen.closedDealer.yes,
                          value: 1,
                        },
                        {
                          label: strings.ContactsScreen.closedDealer.no,
                          value: 2,
                        },
                      ],
                      required: true,
                      iOSselectFix: true,
                      onChange: val => {
                        setServiceData({
                          myTyresInStorage: val,
                        });
                      },
                      placeholder: {
                        label:
                          strings.Form.field.placeholder.serviceTypes[
                            get(orderData, 'SERVICE')
                          ].myTyresInStorage,
                        value: null,
                        color: '#9EA0A4',
                      },
                    },
                  }
                : {},
              isAdditionalAvailable
                ? {
                    name: 'leaveTyresInStorage',
                    type: 'switch',
                    label:
                      strings.Form.field.label.serviceTypes[
                        get(orderData, 'SERVICE')
                      ].leaveTyresInStorage,
                    value: get(serviceData, 'leaveTyresInStorage', false),
                    props: {
                      onChange: val =>
                        setServiceData({
                          leaveTyresInStorage: val,
                          needUpdate: true,
                          loading: true,
                          itemFullSelected: {},
                        }),
                    },
                  }
                : {},
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
    if (!get(pushProps, 'SERVICESecond')) {
      toast.show({
        render: ({id}) => {
          return (
            <ToastAlert
              id={id}
              status="warning"
              duration={3000}
              description={[
                strings.Form.status.fieldRequired1,
                '"' +
                  strings.Form.field.label.serviceTypes[
                    get(orderData, 'SERVICE')
                  ].second +
                  '"',
                strings.Form.status.fieldRequired2,
              ].join(' ')}
              title={strings.Form.status.fieldRequiredMiss}
            />
          );
        },
      });
      return;
    }
    pushProps.SERVICESecondFull = serviceData.itemFullSelected;
    delete serviceData.itemFullSelected;
    navigation.navigate('ServiceStep3', {
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
      key="ServiceForm"
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
          isLoadingText: strings.Form.button.loading,
        },
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceStep2);
