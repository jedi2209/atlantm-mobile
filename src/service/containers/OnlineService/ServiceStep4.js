/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {
  ScrollView,
  View,
  Text,
  Icon,
  VStack,
  HStack,
  Image,
  useToast,
} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Form from '../../../core/components/Form/Form';
import {
  dayMonthYear,
  format,
  humanDateTime,
  getTimestamp,
  getDateFromTimestamp,
} from '../../../utils/date';
import UserData from '../../../utils/user';
import Analytics from '../../../utils/amplitude-analytics';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localUserDataUpdate} from '../../../profile/actions';
import {actionAddNotification} from '../../../settings/actions';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../../actionTypes';
import {strings} from '../../../core/lang/const';

import API from '../../../utils/api';
import {ERROR_NETWORK} from '../../../core/const';

import styleConst from '../../../core/style-const';

import {get} from 'lodash';

const mapStateToProps = ({dealer, service, nav}) => {
  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  return {
    nav,
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
    listDealers: dealer.listDealers,
  };
};

const mapDispatchToProps = {
  orderService,
  actionAddNotification,
};

const CarIcon = props => {
  const {type} = props;

  switch (type) {
    case 'tyreChange':
      return (
        <Icon name="snowflake-melt" as={MaterialCommunityIcons} {...props} />
      );
    case 'carWash':
      return <Icon name="car-wash" as={MaterialCommunityIcons} {...props} />;
    case 'service':
    case 'other':
    default:
      return <Icon name="car-wrench" as={MaterialCommunityIcons} {...props} />;
  }
};

const getServiceImage = type => {
  switch (type) {
    case 'tyreChange':
      return require('../../../../assets/services/tyreChange.webp');
    case 'carWash':
      return require('../../../../assets/services/carWash.webp');
    case 'service':
    case 'other':
    default:
      return require('../../../../assets/services/service.webp');
  }
};

const ServiceStep4 = props => {
  const {route, region, listDealers, navigation} = props;

  const orderData = get(route, 'params', {});

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step4');
  }, []);

  const toast = useToast();

  const dateTimeText = get(orderData, 'DATETIME.time')
    ? humanDateTime(getDateFromTimestamp(get(orderData, 'DATETIME.time')))
    : dayMonthYear(get(orderData, 'DATETIME.date', get(orderData, 'DATETIME')));

  const _onPressOrder = async dataFromForm => {
    const isInternet = require('../../../utils/internet').default;
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      toast.show({
        title: ERROR_NETWORK,
        status: 'warning',
        duration: 2000,
        id: 'networkError',
      });
      return;
    }

    let dateFromForm = get(orderData, 'DATETIME', null);
    let servicePrice = null;

    if (get(orderData, 'SERVICESecondFull.total')) {
      servicePrice = [
        orderData.SERVICESecondFull.total.summ.value,
        orderData.SERVICESecondFull.total.summ.currency,
      ].join(' ');
    }

    let myTyresInStorage = false;
    if (get(orderData, 'myTyresInStorage') === 1) {
      myTyresInStorage = true;
    }

    let data = {
      dealer: orderData.DEALER,
      time: {
        from: parseInt(get(dateFromForm, 'time', 0)),
        to:
          parseInt(get(dateFromForm, 'time', 0)) +
          parseInt(get(orderData, 'SERVICESecondFull.total.time', 0)),
      },
      f_FirstName: get(dataFromForm, 'NAME', ''),
      f_SecondName: get(dataFromForm, 'SECOND_NAME', ''),
      f_LastName: get(dataFromForm, 'LAST_NAME', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      callMePls: get(dataFromForm, 'CALLMEPLS', false),
      leaveTyresInStorage: get(orderData, 'leaveTyresInStorage', false),
      myTyresInStorage,
      tech_place: get(dateFromForm, 'tech_place', ''),
      service: get(orderData, 'SERVICE', ''),
      serviceName: [
        strings.ServiceScreen.works[get(orderData, 'SERVICE', '')],
        strings.ServiceScreen.worksService[get(orderData, 'SERVICETYPE', '')],
        get(orderData, 'SERVICESecondFull.name'),
      ].join(' / '),
      servicePrice,
      car: {
        brand: get(orderData, 'CARBRAND', ''),
        model: get(orderData, 'CARMODEL', ''),
        plate: get(orderData, 'CARNUMBER', ''),
        vin:
          get(orderData, 'CARVIN', '') !== 'undefinedCar'
            ? get(orderData, 'CARVIN', '')
            : null,
      },
      text: get(dataFromForm, 'COMMENT', ''),
    };

    data.car.name = [data.car.brand, data.car.model].join(' ');
    if (data.car.plate) {
      data.car.name = [data.car.name, '[' + data.car.plate + ']'].join(' ');
    }

    if (get(orderData, 'lead', true)) {
      // отправляем ЛИД
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model', ''),
        carNumber: get(data, 'car.plate', ''),
        vin: get(data, 'car.vin', ''),
        date: format(dateFromForm?.date ? dateFromForm.date : dateFromForm),
        service: get(data, 'serviceName', ''),
        firstName: get(data, 'f_FirstName', ''),
        secondName: get(data, 'f_SecondName', ''),
        servicePrice,
        lastName: get(data, 'f_LastName', ''),
        email: get(data, 'email', ''),
        phone: get(data, 'phone', ''),
        text: get(data, 'text', ''),
        callMePls: get(data, 'callMePls', false),
        dealerID: get(data, 'dealer'),
      };
      const action = await props.orderService(dataToSend);

      if (action && action.type) {
        switch (action.type) {
          case SERVICE_ORDER__SUCCESS:
            Analytics.logEvent('order', 'service');
            localUserDataUpdate({
              NAME: dataToSend.firstName,
              SECOND_NAME: dataToSend.secondName,
              LAST_NAME: dataToSend.lastName,
              PHONE: dataToSend.phone,
              EMAIL: dataToSend.email,
              CARNAME: [dataToSend.brand, dataToSend.model].join(' '),
              CARBRAND: dataToSend.brand,
              CARMODEL: dataToSend.model,
              CARVIN: dataToSend.vin,
              CARNUMBER: dataToSend.carNumber,
            });
            Alert.alert(
              strings.Notifications.success.title,
              strings.Notifications.success.text,
              [
                {
                  text: 'ОК',
                  onPress: () => {
                    navigation.navigate('BottomTabNavigation', {
                      screen: 'ContactsScreen',
                    });
                  },
                },
              ],
            );
            break;
          case SERVICE_ORDER__FAIL:
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            );
            break;
        }
      }
    } else {
      // отправляем полноценную онлайн-запись
      const order = await API.saveOrderToService(data);
      if (order.status === 'error') {
        Alert.alert(
          strings.Notifications.error.title,
          '\r\n' + order.error.message,
        );
      } else {
        props.actionAddNotification({
          id: get(order, 'data.id'),
          title: 'Вы записаны в ' + listDealers[orderData.DEALER].name,
          text:
            'Ждём вас ' +
            dateTimeText +
            '.\r\nНомер вашего бронирования: ' +
            get(order, 'data.id'),
          type: {
            id: 5,
          },
          date: {
            timestamp: getTimestamp(),
          },
        });
        Analytics.logEvent('order', 'OnlineService');
        Alert.alert(
          strings.Notifications.success.title,
          '\r\n' +
            strings.Notifications.success.textOnline +
            '\r\n\r\nЖдём вас ' +
            dateTimeText +
            ' в ' +
            listDealers[orderData.DEALER].name,
          // '\r\n\r\n Номер бронирования #' +
          // get(order, 'data.id'),
          [
            {
              text: 'ОК',
              onPress: () => navigation.navigate('BottomTabNavigation'),
            },
          ],
        );
      }
    }
  };

  let heightBlock = 200;

  if (get(orderData, 'SERVICETYPE')) {
    heightBlock = heightBlock + 55;
  }
  if (get(orderData, 'SERVICESecondFull.total')) {
    heightBlock = heightBlock + 55;
  }

  const FormConfig = {
    groups: [
      {
        name: strings.ServiceScreenStep1.total,
        fields: [
          {
            name: 'Review',
            type: 'component',
            value: (
              <>
                <Image
                  source={{
                    uri: get(listDealers[orderData.DEALER], 'img.0'),
                  }}
                  alt="dealer main image"
                  resizeMode="cover"
                  w={'100%'}
                  h={heightBlock}
                />
                <View
                  position={'absolute'}
                  background={styleConst.color.white}
                  w={'100%'}
                  h={heightBlock}
                  opacity={0.9}
                />
                <View
                  position={'absolute'}
                  h={heightBlock - 50}
                  w={'90%'}
                  p={2}>
                  <VStack mx={1} mb={3} space={4}>
                    <HStack alignItems="center">
                      <Icon
                        name="map-marker-outline"
                        as={MaterialCommunityIcons}
                        size={8}
                        mr={2}
                        color={styleConst.color.blue}
                      />
                      <VStack>
                        <Text>{listDealers[orderData.DEALER].name}</Text>
                      </VStack>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon
                        name="calendar-check-outline"
                        as={MaterialCommunityIcons}
                        size={8}
                        mr={2}
                        color={styleConst.color.blue}
                      />
                      <Text>{dateTimeText}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <CarIcon
                        type={get(orderData, 'SERVICE')}
                        size={8}
                        mr={2}
                        color={styleConst.color.blue}
                      />
                      <VStack>
                        <Text>
                          {strings.ServiceScreen.works[orderData.SERVICE]}
                        </Text>
                        {get(orderData, 'leaveTyresInStorage', false) ? (
                          <Text>
                            {'+ '}
                            {strings.Form.field.label.serviceTypes[
                              get(orderData, 'SERVICE')
                            ].leaveTyresInStorage.toLowerCase()}
                          </Text>
                        ) : null}
                      </VStack>
                    </HStack>
                    {get(orderData, 'SERVICETYPE') ? (
                      <HStack alignItems="center">
                        <Icon
                          name="gear"
                          as={EvilIcons}
                          size={8}
                          mr={2}
                          color={styleConst.color.blue}
                        />
                        <VStack>
                          <Text>
                            {[
                              strings.ServiceScreen.worksService[
                                orderData.SERVICETYPE
                              ],
                              get(orderData, 'SERVICESecondFull.name', null),
                            ]
                              .filter(key => key !== null)
                              .join('\r\n')}
                          </Text>
                        </VStack>
                      </HStack>
                    ) : null}
                    <HStack alignItems="center">
                      <Icon
                        name="car-outline"
                        as={MaterialCommunityIcons}
                        size={8}
                        mr={2}
                        color={styleConst.color.blue}
                      />
                      <Text>
                        {orderData.CARBRAND} {orderData.CARMODEL}
                        {orderData.CARNUMBER
                          ? '\r\nгос. номер ' + orderData.CARNUMBER
                          : null}
                      </Text>
                    </HStack>
                    {get(orderData, 'SERVICESecondFull.total') ? (
                      <HStack alignItems="center">
                        <Icon
                          name="wallet-outline"
                          as={MaterialCommunityIcons}
                          size={8}
                          mr={2}
                          color={styleConst.color.blue}
                        />
                        <Text fontWeight={600} fontSize={17}>
                          ~ {orderData.SERVICESecondFull.total.summ.value}{' '}
                          {orderData.SERVICESecondFull.total.summ.currency}
                        </Text>
                      </HStack>
                    ) : null}
                  </VStack>
                </View>
              </>
            ),
            props: {
              unstyle: true,
            },
          },
        ],
      },
      {
        name: strings.Form.group.contacts,
        fields: [
          {
            name: 'NAME',
            type: 'input',
            label: strings.Form.field.label.name,
            value: props.firstName,
            props: {
              required: true,
              textContentType: 'name',
            },
          },
          {
            name: 'SECOND_NAME',
            type: 'input',
            label: strings.Form.field.label.secondName,
            value: props.secondName,
            props: {
              textContentType: 'middleName',
            },
          },
          {
            name: 'LAST_NAME',
            type: 'input',
            label: strings.Form.field.label.lastName,
            value: props.lastName,
            props: {
              textContentType: 'familyName',
            },
          },
          {
            name: 'PHONE',
            type: 'phone',
            label: strings.Form.field.label.phone,
            value: props.phone,
            props: {
              required: true,
            },
          },
          {
            name: 'EMAIL',
            type: 'email',
            label: strings.Form.field.label.email,
            value: props.email,
            props: {
              required: false,
            },
          },
        ],
      },
      {
        name: strings.Form.group.additional,
        fields: [
          {
            name: 'COMMENT',
            type: 'textarea',
            label: strings.Form.field.label.comment,
            props: {
              placeholder: strings.Form.field.placeholder.comment,
            },
          },
          !get(orderData, 'lead', true)
            ? {
                name: 'CALLMEPLS',
                type: 'checkbox',
                label: strings.Form.field.label.callMe,
                props: {
                  left: true,
                },
              }
            : {},
        ],
      },
    ],
  };

  return (
    <ScrollView>
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        scrollViewWrapperAvailable={false}
        key="ServiceForm"
        fields={FormConfig}
        barStyle={'light-content'}
        defaultCountryCode={region}
        onSubmit={_onPressOrder}
        SubmitButton={{text: strings.Form.button.send}}
        // keyboardAvoidingViewProps={{
        //   enableAutomaticScroll: true,
        // }}
      />
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceStep4);
