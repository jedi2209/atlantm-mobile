/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import {get, orderBy} from 'lodash';

import {ServiceModal} from '../../components/ServiceModal';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear, format} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {localUserDataUpdate} from '../../../profile/actions';
import {localDealerClear} from '../../../dealer/actions';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../../actionTypes';

import Amplitude from '../../../utils/amplitude-analytics';

import API from '../../../utils/api';

const mapStateToProps = ({dealer, profile, service, nav}) => {
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
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  orderService,
  localDealerClear,
};

class ServiceScreenNonAuth extends Component {
  constructor(props) {
    super(props);
    const {
      lastName,
      firstName,
      phone,
      email,
      carBrand,
      carModel,
      carVIN,
      carNumber,
    } = props;

    this.state = {
      isModalVisible: false,
      email: email,
      phone: phone,
      name: firstName && lastName ? `${firstName} ${lastName}` : '',
      carBrand: carBrand,
      carModel: carModel,
      carVIN: carVIN,
      carNumber: carNumber,
    };

    const carFromNavigation = get(this.props.navigation, 'state.params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      this.state.carVIN = carFromNavigation.vin;
      this.state.carBrand = get(carFromNavigation, 'brand');
      this.state.carModel = get(carFromNavigation, 'model');
      this.state.carNumber = get(carFromNavigation, 'number');
      this.state.carName = [
        get(carFromNavigation, 'brand'),
        get(carFromNavigation, 'model'),
      ].join(' ');
    }
    this.orderLead = false;

    this.props.localDealerClear();
  }

  onPressOrder = async (dataFromForm) => {
    const {navigation} = this.props;
    console.log('onPressOrder', this.state, dataFromForm);

    let dateFromForm = get(dataFromForm, 'DATETIME', null);

    if (get(dateFromForm, 'noTimeAlways', false)) {
      // хак для Лексуса
      this.orderLead = true;
    }

    let data = {
      dealer: this.props.dealerSelected.id,
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
      service: dataFromForm.SERVICE || null,
      vin: dataFromForm.CARVIN || null,
      car: {
        brand: dataFromForm.CARBRAND || null,
        model: dataFromForm.CARMODEL || null,
        plate: dataFromForm.CARNUMBER || null,
      },
      text: dataFromForm.COMMENT || null,
    };

    if (this.orderLead) {
      // отправляем ЛИД
      const dataToSend = {
        brand: get(data, 'car.brand', ''),
        model: get(data, 'car.model', ''),
        carNumber: get(data, 'car.plate', ''),
        vin: get(data, 'vin', ''),
        date: format(dataFromForm.DATE),
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
      // отправляем полноценную онлайн-запись
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

  FormConfig = {
    fields: {
      groups: [
        {
          name: 'Автоцентр',
          fields: [
            {
              name: 'DEALER',
              type: 'dealerSelect',
              label: 'Автоцентр',
              value: this.props.dealerSelected,
              props: {
                goBack: false,
                isLocal: false,
                navigation: this.props.navigation,
              },
            },
            {
              name: 'DATETIME',
              type: 'dateTime',
              label: 'Выбери удобную для тебя дату',
              value: null,
              props: {
                placeholder: 'начиная с ' + dayMonthYear(addDays(2)),
                required: true,
                type: 'service',
                minimumDate: new Date(addDays(2)),
                maximumDate: new Date(addDays(62)),
                dealer: this.props.dealerSelected,
              },
            },
          ],
        },
        {
          name: 'Автомобиль',
          fields: [
            {
              name: 'CARBRAND',
              type: 'input',
              label: 'Марка',
              value: this.props.carBrand,
              props: {
                required: true,
                placeholder: null,
              },
            },
            {
              name: 'CARMODEL',
              type: 'input',
              label: 'Модель',
              value: this.props.carModel,
              props: {
                required: true,
                placeholder: null,
              },
            },
            {
              name: 'CARNUMBER',
              type: 'input',
              label: 'Гос. номер автомобиля',
              value: this.props.carNumber,
              props: {
                required: true,
                placeholder: null,
              },
            },
            {
              name: 'CARVIN',
              type: 'input',
              label: 'VIN номер автомобиля',
              value: this.props.carVIN,
              props: {
                placeholder: null,
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

  render() {
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
                barStyle={'light-content'}
                defaultCountryCode={this.props.dealerSelected.region}
                onSubmit={this.onPressOrder}
                parentState={this.state}
              />
            </View>
            <View>
              <ServiceModal
                visible={this.state.isModalVisible}
                onClose={() => this.setState({isModalVisible: false})}
                data={this.state.serviceInfo}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceScreenNonAuth);
