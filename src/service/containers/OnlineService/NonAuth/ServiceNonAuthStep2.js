/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import {
  addDays,
  dayMonthYear,
  format,
  humanDate,
  getDateFromTimestamp,
} from '../../../../utils/date';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {localUserDataUpdate} from '../../../../profile/actions';
import {
  SERVICE_ORDER__SUCCESS,
  SERVICE_ORDER__FAIL,
} from '../../../actionTypes';
import {strings} from '../../../../core/lang/const';

import Analytics from '../../../../utils/amplitude-analytics';

import API from '../../../../utils/api';
import {ERROR_NETWORK} from '../../../../core/const';
import {View, Text, useToast, Image, Icon, HStack, VStack} from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styleConst from '../../../../core/style-const';

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

const ServiceNonAuthStep2 = props => {
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
    dealerSelectedLocal,
    region,
    listDealers,
    navigation,
  } = props;

  const [orderParams, setOrderParams] = useState(true);
  const [orderLead, setLead] = useState(true);
  const [showReview, setReview] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const params = get(props.route, 'params', null);
    setOrderParams(params);
    if (!get(params, 'lead') !== orderLead) {
      setLead(get(params, 'lead'));
    }

    return () => {
      setOrderParams();
    };
  }, []);

  const _onPressOrder = async dataFromForm => {
    const isInternet = require('../../../../utils/internet').default;
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

    let dateFromForm = get(dataFromForm, 'DATETIME', null);

    let data = {
      dealer: orderParams.DEALER,
      time: {
        from: parseInt(get(dateFromForm, 'time', 0)),
        to:
          parseInt(get(dateFromForm, 'time', 0)) +
          parseInt(get(orderParams, 'secondData.total.time', 0)),
      },
      f_FirstName: get(dataFromForm, 'NAME', ''),
      f_SecondName: get(dataFromForm, 'SECOND_NAME', ''),
      f_LastName: get(dataFromForm, 'LAST_NAME', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      tech_place: get(dateFromForm, 'tech_place', ''),
      service: get(orderParams, 'SERVICE', ''),
      serviceName: strings.ServiceScreen.works[get(orderParams, 'SERVICE', '')],
      vin: get(orderParams, 'CARVIN', ''),
      car: {
        brand: get(orderParams, 'CARBRAND', ''),
        model: get(orderParams, 'CARMODEL', ''),
        plate: get(orderParams, 'CARNUMBER', ''),
      },
      text: dataFromForm.COMMENT || null,
    };

    if (orderLead) {
      // отправляем ЛИД
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model', ''),
        carNumber: get(data, 'car.plate', ''),
        vin: get(data, 'vin', ''),
        date: format(dateFromForm?.date ? dateFromForm.date : dateFromForm),
        service: get(data, 'serviceName', ''),
        firstName: get(data, 'f_FirstName', ''),
        secondName: get(data, 'f_SecondName', ''),
        lastName: get(data, 'f_LastName', ''),
        email: get(data, 'email', ''),
        phone: get(data, 'phone', ''),
        text: get(data, 'text', ''),
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
                    navigation.goBack();
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
        Analytics.logEvent('order', 'OnlineService');
        Alert.alert(
          strings.Notifications.success.title,
          '\r\n' +
            strings.Notifications.success.textOnline +
            '\r\n\r\n Номер бронирования #' +
            get(order, 'data.id'),
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

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DATETIME',
            type: get(orderParams, 'lead', true) ? 'date' : 'dateTime',
            label: strings.Form.field.label.date,
            // value: dateSelected,
            props: {
              placeholder:
                strings.Form.field.placeholder.date + dayMonthYear(addDays(1)),
              required: true,
              type: 'service',
              serviceID: get(orderParams, 'SERVICE', null),
              minimumDate: new Date(addDays(1)),
              maximumDate: new Date(addDays(62)),
              dealer: {
                id: orderParams.DEALER,
              },
              reqiredTime: get(orderParams, 'secondData.total.time', null),
              onChange: data => {
                setReview(null);
                if (get(data, 'time')) {
                  setReview({...orderParams, datetime: data});
                }
              },
            },
          },
        ],
      },
      showReview
        ? {
            name: strings.ServiceScreenStep1.total,
            fields: [
              {
                name: 'Review',
                type: 'component',
                value: (
                  <View>
                    <Image
                      source={{
                        uri: get(listDealers[showReview.DEALER], 'img.0'),
                      }}
                      alt="dealer main image"
                      resizeMode="cover"
                      w={'100%'}
                      h={200}
                    />
                    <View
                      position={'absolute'}
                      background={styleConst.color.white}
                      w={'100%'}
                      h={200}
                      opacity={0.9}
                    />
                    <View position={'absolute'} h={200} w={'100%'} p={2}>
                      <VStack mx={1} mb={3} space={4}>
                        {get(showReview, 'datetime.time') ? (
                          <HStack alignItems="center">
                            <Icon
                              name="calendar-check-outline"
                              as={MaterialCommunityIcons}
                              size={8}
                              mr={2}
                              color={styleConst.color.blue}
                            />
                            <Text
                              fontSize={20}
                              lineHeight={32}
                              fontWeight={'600'}>
                              {humanDate(
                                getDateFromTimestamp(showReview.datetime.time),
                              )}
                            </Text>
                          </HStack>
                        ) : null}
                        <HStack alignItems="center">
                          <CarIcon
                            type={get(showReview, 'SERVICE')}
                            size={8}
                            mr={2}
                            color={styleConst.color.blue}
                          />
                          <Text>
                            {[
                              strings.ServiceScreen.works[showReview.SERVICE],
                              'в',
                              listDealers[showReview.DEALER].name,
                            ].join(' ')}
                          </Text>
                        </HStack>
                        <HStack alignItems="center">
                          <Icon
                            name="car-outline"
                            as={MaterialCommunityIcons}
                            size={8}
                            mr={2}
                            color={styleConst.color.blue}
                          />
                          <Text>
                            {showReview.CARBRAND} {showReview.CARMODEL}
                            {showReview.CARNUMBER
                              ? '\r\nгос. номер ' + showReview.CARNUMBER
                              : null}
                          </Text>
                        </HStack>
                        {get(showReview, 'secondData.total') ? (
                          <Text fontWeight={600} fontSize={17}>
                            ~ {showReview.secondData.total.summ.value}{' '}
                            {showReview.secondData.total.summ.currency}
                          </Text>
                        ) : null}
                      </VStack>
                    </View>
                  </View>
                ),
                props: {
                  unstyle: true,
                },
              },
            ],
          }
        : {},
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
            value: props.Text,
            props: {
              placeholder: strings.Form.field.placeholder.comment,
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
      onSubmit={_onPressOrder}
      SubmitButton={{text: strings.Form.button.send}}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep2);
