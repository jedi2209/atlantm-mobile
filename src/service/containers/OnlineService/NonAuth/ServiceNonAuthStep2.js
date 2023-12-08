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
import {View, Text, useToast} from 'native-base';

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
  } = props;

  const [orderParams, setOrderParams] = useState(true);
  const [orderLead, setLead] = useState(true);
  const [user, setUser] = useState({
    email: email,
    phone: phone,
    name: firstName && lastName ? `${firstName} ${lastName}` : '',
  });
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
    const {navigation} = props;

    // console.info('dataFromForm', dataFromForm);
    // console.info('orderParams', orderParams);
    // return;

    let dateFromForm = get(dataFromForm, 'DATETIME', null);

    // if (get(dateFromForm, 'noTimeAlways', false)) {
    //   // хак для Лексуса
    //   setLead(true);
    // }

    let data = {
      dealer: orderParams.DEALER,
      time: {
        from: parseInt(dateFromForm.time),
        to:
          parseInt(dateFromForm.time) +
          parseInt(get(orderParams, 'secondData.total.time', 0)),
      },
      f_FirstName: dataFromForm.NAME || null,
      f_SecondName: dataFromForm.SECOND_NAME || null,
      f_LastName: dataFromForm.LAST_NAME || null,
      phone: dataFromForm.PHONE,
      email: dataFromForm.EMAIL || null,
      tech_place: dateFromForm.tech_place || null,
      service: orderParams.SERVICE,
      serviceName: dataFromForm.SERVICE || null,
      vin: orderParams.CARVIN,
      car: {
        brand: orderParams.CARBRAND || null,
        model: orderParams.CARMODEL || null,
        plate: orderParams.CARNUMBER || null,
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
                    <Text>
                      Вы будете записаны на{' '}
                      {strings.ServiceScreen.works[showReview.SERVICE]} в
                      автоцентр {listDealers[showReview.DEALER].name}
                    </Text>
                    {get(showReview, 'datetime.time') ? (
                      <Text>
                        {humanDate(
                          getDateFromTimestamp(showReview.datetime.time),
                        )}
                      </Text>
                    ) : null}
                    <Text>
                      для автомобиля {showReview.CARBRAND} {showReview.CARMODEL}
                      {showReview.CARNUMBER
                        ? '\r\nгос. номер ' + showReview.CARNUMBER
                        : null}
                    </Text>
                    {get(showReview, 'secondData.total') ? (
                      <Text>
                        Стоимость работ составит{' '}
                        {showReview.secondData.total.summ.value}{' '}
                        {showReview.secondData.total.summ.currency}
                      </Text>
                    ) : null}
                  </View>
                ),
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
