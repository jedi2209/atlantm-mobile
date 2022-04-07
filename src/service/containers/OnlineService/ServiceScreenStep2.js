/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Alert,
} from 'react-native';
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

const mapStateToProps = ({dealer, nav}) => {
  return {
    nav,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE'),
    email: UserData.get('EMAIL'),
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  orderService,
};

class ServiceScreenStep2 extends Component {
  constructor(props) {
    super(props);

    this.orderLead = get(this.props.route, 'params.orderLead', false);
    this.service = get(this.props.route, 'params.service');
    this.serviceInfo = get(this.props.route, 'params.serviceInfo');
    this.dealer = get(this.props.route, 'params.dealer');
    this.car = {
      carBrand: get(this.props.route, 'params.car.brand'),
      carModel: get(this.props.route, 'params.car.model'),
      carVIN: get(this.props.route, 'params.car.vin'),
      carNumber: get(this.props.route, 'params.car.plate'),
    };
    this.recommended = get(this.props.route, 'params.recommended');
  }

  onPressOrder = async dataFromForm => {
    const {navigation} = this.props;

    let dateFromForm = get(dataFromForm, 'DATE', null);

    if (dateFromForm?.noTimeAlways) {
      this.orderLead = true;
    }

    if (!dateFromForm) {
      Toast.show({
        text: strings.ServiceScreen.Notifications.error.chooseDate,
        position: 'bottom',
        duration: 3000,
        type: 'warning',
      });
      return false;
    }

    let data = {
      dealer: this.dealer.id,
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
      service: (this.service && this.service.label) || null,
      recommended: this.recommended || false,
      vin: this.car.carVIN || null,
      car: {
        brand: this.car.carBrand || null,
        model: this.car.carModel || null,
        plate: this.car.carNumber || null,
      },
      text: dataFromForm.COMMENT || null,
    };

    if (this.serviceInfo && this.serviceInfo.summary[0].time) {
      if (this.recommended) {
        data.time.to =
          parseInt(dateFromForm.time) +
          parseInt(this.serviceInfo.summary[0].time.total);
      } else {
        data.time.to =
          parseInt(dateFromForm.time) +
          parseInt(this.serviceInfo.summary[0].time.required);
      }
    }
    if (this.orderLead) {
      let textAdd = get(data, 'text', '');
      if (this.service) {
        textAdd = ['Требуемые работы:', data.service, '\r\n'].join(' ');
        if (data.recommended) {
          textAdd = [textAdd, 'Стоимость:', get(this.serviceInfo, 'summary[0].summ.total')].join(' ');
        } else {
          textAdd = [textAdd, 'Стоимость:', get(this.serviceInfo, 'summary[0].summ.required')].join(' ');
        }
        text = [textAdd, get(data, 'text', '')].join('\r\n');
      } else {
        text = get(data, 'text', '');
      }
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model', ''),
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
      const action = await this.props.orderService(dataToSend);

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
    this.setState({success: true, loading: false});
  };

  render() {
    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.Form.group.date,
            fields: [
              {
                name: 'DATE',
                type: this.orderLead ? 'date' : 'dateTime',
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
                  dealer: this.dealer,
                  serviceID: this.service && this.service.value,
                  reqiredTime: this.recommended
                    ? get(this.serviceInfo, 'summary[0].time.total')
                    : get(this.serviceInfo, 'summary[0].time.required'),
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
                value: this.props.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: strings.Form.field.label.secondName,
                value: this.props.secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: strings.Form.field.label.lastName,
                value: this.props.lastName,
                props: {
                  textContentType: 'familyName',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: strings.Form.field.label.phone,
                value: this.props.phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: strings.Form.field.label.email,
                value: this.props.email,
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
                value: this.props.Text,
                props: {
                  placeholder: strings.Form.field.placeholder.comment,
                },
              },
            ],
          },
        ],
      },
    };
    return (
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key='ServiceStep2Form'
        fields={this.FormConfig.fields}
        defaultCountryCode={this.props.dealerSelected.region}
        onSubmit={this.onPressOrder}
        SubmitButton={{
          text: strings.ServiceScreen.button,
        }}
        parentState={this.state}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreenStep2);
