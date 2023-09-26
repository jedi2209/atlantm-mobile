/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState} from 'react';
import {Alert} from 'react-native';
import {Toast} from 'native-base';
import {get} from 'lodash';

import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear, format} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localUserDataUpdate} from '../../../profile/actions';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../../actionTypes';
import {strings} from '../../../core/lang/const';

import Analytics from '../../../utils/amplitude-analytics';

import API from '../../../utils/api';

const mapStateToProps = ({dealer}) => {
  return {
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE'),
    email: UserData.get('EMAIL'),
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  orderService,
};

const ServiceScreenStep2 = props => {
  const {navigation, route, region} = props;

  const orderLead = get(route, 'params.orderLead', false);
  const service = get(route, 'params.service');
  const serviceInfo = get(route, 'params.serviceInfo');
  const car = {
    carBrand: get(route, 'params.car.brand'),
    carModel: get(route, 'params.car.model'),
    carVIN: get(route, 'params.car.vin'),
    carNumber: get(route, 'params.car.plate'),
  };
  const dealer = get(route, 'params.dealer');
  const recommended = get(route, 'params.recommended');
  const [dateSelected, setDate] = useState(null);

  const _onPressOrder = async dataFromForm => {
    let dateFromForm = get(dataFromForm, 'DATE', null);
    let isLead = orderLead;

    if (dateFromForm?.noTimeAlways) {
      isLead = true;
    }

    if (!dateFromForm) {
      Toast.show({
        title: strings.ServiceScreen.Notifications.error.chooseDate,
      });
      return false;
    }
    setDate(dateFromForm);

    let data = {
      dealer: dealer.id,
      time: {
        from:
          dateFromForm && dateFromForm.time
            ? parseInt(dateFromForm.time)
            : null,
      },
      f_FirstName: dataFromForm.NAME || null,
      f_SecondName: dataFromForm.SECOND_NAME || null,
      f_LastName: dataFromForm.LAST_NAME || null,
      phone: dataFromForm.PHONE || null,
      email: dataFromForm.EMAIL || null,
      tech_place: (dateFromForm && dateFromForm.tech_place) || null,
      service: (service && service.label) || null,
      recommended: recommended || false,
      vin: car.carVIN || null,
      car: {
        brand: car.carBrand || null,
        model: car.carModel || null,
        plate: car.carNumber || null,
      },
      text: dataFromForm.COMMENT || null,
    };

    if (serviceInfo && serviceInfo.summary[0].time) {
      if (recommended) {
        data.time.to =
          parseInt(dateFromForm.time, 10) +
          parseInt(serviceInfo.summary[0].time.total, 10);
      } else {
        data.time.to =
          parseInt(dateFromForm.time, 10) +
          parseInt(serviceInfo.summary[0].time.required, 10);
      }
    }
    console.log('data', data);
    console.log('dateFromForm', dateFromForm);
    if (isLead) {
      let textAdd = get(data, 'text', '');
      let text = '';
      if (service) {
        textAdd = ['Требуемые работы:', data.service, '\r\n'].join(' ');
        if (data.recommended) {
          textAdd = [
            textAdd,
            'Стоимость:',
            get(serviceInfo, 'summary[0].summ.total'),
          ].join(' ');
        } else {
          textAdd = [
            textAdd,
            'Стоимость:',
            get(serviceInfo, 'summary[0].summ.required'),
          ].join(' ');
        }
        text = [textAdd, get(data, 'text', '')].join('\r\n');
      } else {
        text = get(data, 'text', '');
      }
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model.name', get(data, 'car.model'), ''),
        carNumber: get(data, 'car.plate', ''),
        vin: get(data, 'vin', ''),
        date: format(dateFromForm?.date ? dateFromForm.date : dateFromForm),
        service: get(data, 'service', ''),
        firstName: get(data, 'f_FirstName', ''),
        secondName: get(data, 'f_SecondName', ''),
        lastName: get(data, 'f_LastName', ''),
        email: get(data, 'email', ''),
        phone: get(data, 'phone', ''),
        text: text,
        dealerID: data.dealer,
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
          '\r\n' + strings.Notifications.success.textOnline,
          [
            {
              text: 'ОК',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      }
    }
  };

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.date,
        fields: [
          {
            name: 'DATE',
            type: orderLead ? 'date' : 'dateTime',
            label: strings.Form.field.label.date,
            value: dateSelected,
            props: {
              placeholder:
                strings.Form.field.placeholder.date + dayMonthYear(addDays(2)),
              required: true,
              type: 'service',
              minimumDate: new Date(addDays(2)),
              maximumDate: new Date(addDays(62)),
              dealer,
              serviceID: service && service.value,
              reqiredTime: recommended
                ? get(serviceInfo, 'summary[0].time.total')
                : get(serviceInfo, 'summary[0].time.required'),
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
      key="ServiceStep2Form"
      fields={FormConfig}
      defaultCountryCode={region}
      onSubmit={_onPressOrder}
      SubmitButton={{
        text: strings.ServiceScreen.button,
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreenStep2);
