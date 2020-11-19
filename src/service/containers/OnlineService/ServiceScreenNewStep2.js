/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import {Toast} from 'native-base';
import {get} from 'lodash';
// import {StackActions, NavigationActions} from 'react-navigation';

import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear, format} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localUserDataUpdate} from '../../../profile/actions';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../../actionTypes';

import Amplitude from '../../../utils/amplitude-analytics';

import API from '../../../utils/api';

const mapStateToProps = ({dealer, service, nav}) => {
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

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    this.orderLead = get(this.props.navigation, 'state.params.orderLead');
    this.service = get(this.props.navigation, 'state.params.service');
    this.serviceInfo = get(this.props.navigation, 'state.params.serviceInfo');
    this.dealer = get(this.props.navigation, 'state.params.dealer');
    this.car = {
      carBrand: get(this.props.navigation, 'state.params.car.brand'),
      carModel: get(this.props.navigation, 'state.params.car.model'),
      carVIN: get(this.props.navigation, 'state.params.car.vin'),
      carNumber: get(this.props.navigation, 'state.params.car.plate'),
    };
  }

  onPressOrder = async (dataFromForm) => {
    const {navigation} = this.props;

    let dateFromForm = get(dataFromForm, 'DATE', null);

    if (get(dateFromForm, 'noTimeAlways', false)) {
      this.orderLead = true;
    }

    if (!dateFromForm) {
      Toast.show({
        text: 'Необходимо выбрать дату для продолжения',
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
      serviceName: (this.service && this.service.label) || null,
      vin: this.car.carVIN || null,
      car: {
        brand: this.car.carBrand || null,
        model: this.car.carModel || null,
        plate: this.car.carNumber || null,
      },
      text: dataFromForm.COMMENT || null,
    };

    if (this.serviceInfo && this.serviceInfo.summary[0].time.total) {
      data.time.to =
        parseInt(dateFromForm.time) +
        parseInt(this.serviceInfo.summary[0].time.total);
    }
    // console.log('onPressOrder', this.orderLead, data, format(dateFromForm));
    // return true;
    if (this.orderLead) {
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model', ''),
        carNumber: get(data, 'car.plate', ''),
        vin: get(data, 'vin', ''),
        date: format(dateFromForm),
        service: get(data, 'serviceName', ''),
        firstName: get(data, 'f_FirstName', ''),
        secondName: get(data, 'f_SecondName', ''),
        lastName: get(data, 'f_LastName', ''),
        email: get(data, 'email', ''),
        phone: get(data, 'phone', ''),
        text: get(data, 'text', ''),
        dealerID: data.dealer,
      };
      const action = await this.props.orderService(dataToSend);

      if (action && action.type) {
        switch (action.type) {
          case SERVICE_ORDER__SUCCESS:
            Amplitude.logEvent('order', 'service');
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
              'Заявка успешно отправлена',
              'Наши менеджеры вскоре свяжутся с тобой. Спасибо!',
              [
                {
                  text: 'ОК',
                  onPress() {
                    navigation.goBack();
                  },
                },
              ],
            );
            break;
          case SERVICE_ORDER__FAIL:
            Alert.alert('Ошибка', 'Произошла ошибка, попробуем снова?');
            break;
        }
      }
    } else {
      const order = await API.saveOrderToService(data);
      if (order.status === 'error') {
        Alert.alert('Хьюстон, у нас проблемы!', '\r\n' + order.error.message);
      } else {
        Amplitude.logEvent('order', 'OnlineService');
        Alert.alert(
          'Всё получилось!',
          '\r\nСпасибо! Твоя запись оформлена, ждём!',
          [
            {
              text: 'ОК',
              onPress() {
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
            name: 'Дата',
            fields: [
              {
                name: 'DATE',
                type: this.orderLead ? 'date' : 'dateTime',
                label: 'Выбери удобную для тебя дату',
                value: null,
                props: {
                  placeholder: 'начиная с ' + dayMonthYear(addDays(2)),
                  required: true,
                  type: 'service',
                  minimumDate: new Date(addDays(2)),
                  maximumDate: new Date(addDays(62)),
                  dealer: this.dealer,
                },
              },
            ],
          },
          {
            name: 'Контактные данные',
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: 'Имя',
                value: this.props.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: 'Отчество',
                value: this.props.secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: this.props.lastName,
                props: {
                  textContentType: 'familyName',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: 'Телефон',
                value: this.props.phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: 'Email',
                value: this.props.email,
                props: {
                  required: false,
                },
              },
            ],
          },
          {
            name: 'Дополнительно',
            fields: [
              {
                name: 'COMMENT',
                type: 'textarea',
                label: 'Комментарий',
                value: this.props.Text,
                props: {
                  placeholder:
                    'На случай если тебе потребуется передать нам больше информации',
                },
              },
            ],
          },
        ],
      },
    };
    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{flex: 1, backgroundColor: '#eee'}}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                marginBottom: 160,
                paddingHorizontal: 14,
              }}>
              <Form
                fields={this.FormConfig.fields}
                defaultCountryCode={this.props.dealerSelected.region}
                onSubmit={this.onPressOrder}
                SubmitButton={{
                  text: 'Записаться!',
                }}
                parentState={this.state}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
