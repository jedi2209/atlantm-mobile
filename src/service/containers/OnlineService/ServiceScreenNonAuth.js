/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {get} from 'lodash';

import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear, format} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localUserDataUpdate} from '../../../profile/actions';
import {localDealerClear} from '../../../dealer/actions';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../../actionTypes';
import {strings} from '../../../core/lang/const';

import Analytics from '../../../utils/amplitude-analytics';

import API from '../../../utils/api';

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
  };
};

const mapDispatchToProps = {
  orderService,
  localDealerClear,
};

const ServiceScreenNonAuth = props => {
  const {
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
  } = props;

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [isSuccess, setSuccess] = useState(false);
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

  const _onPressOrder = async dataFromForm => {
    const {navigation, route} = props;

    let dateFromForm = get(dataFromForm, 'DATETIME', null);
    const actionID = get(route, 'params.actionID', null);

    if (get(dateFromForm, 'noTimeAlways', false)) {
      // хак для Лексуса
      setLead(true);
    }

    let data = {
      dealer: props.dealerSelectedLocal.id,
      time: {
        from:
          dateFromForm && dateFromForm.time
            ? parseInt(dateFromForm.time)
            : null,
      },
      f_FirstName: dataFromForm.NAME || null,
      f_SecondName: dataFromForm.SECOND_NAME || null,
      f_LastName: dataFromForm.LAST_NAME || null,
      phone: dataFromForm.PHONE,
      email: dataFromForm.EMAIL || null,
      tech_place: (dateFromForm && dateFromForm.tech_place) || null,
      serviceName: dataFromForm.SERVICE || null,
      vin: dataFromForm.CARVIN || car.carVIN,
      car: {
        brand: dataFromForm.CARBRAND || null,
        model: dataFromForm.CARMODEL || null,
        plate: dataFromForm.CARNUMBER || null,
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
        dealerID: data.dealer,
        actionID,
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
    setSuccess(true);
  };

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'dealerSelect',
            label: strings.Form.field.label.dealer,
            value: dealerSelectedLocalState,
            props: {
              goBack: true,
              isLocal: true,
              showBrands: false,
            },
          },
          {
            name: 'DATETIME',
            type: orderLead ? 'date' : 'dateTime',
            label: strings.Form.field.label.date,
            value: null,
            props: {
              placeholder:
                strings.Form.field.placeholder.date +
                dayMonthYear(addDays(2)),
              required: true,
              type: 'service',
              minimumDate: new Date(addDays(2)),
              maximumDate: new Date(addDays(62)),
              dealer: props.dealerSelectedLocal,
            },
          },
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
)(ServiceScreenNonAuth);
