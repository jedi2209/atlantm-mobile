/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import {Button} from 'native-base';
import DatePicker from 'react-native-datepicker';
import {StackActions, NavigationActions} from 'react-navigation';
import Form from '../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import DeviceInfo from 'react-native-device-info';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import isInternet from '../../utils/internet';
import {addDays} from '../../utils/date';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK} from '../../core/const';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../actionTypes';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  return {
    nav,
    date: service.date,
    car: profile.car,
    name: profile.login ? profile.login.name : '',
    phone: profile.login ? profile.login.phone : '',
    email: profile.login ? profile.login.email : '',
    dealerSelected: dealer.selected,
    profile,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  carFill,
  dateFill,
  nameFill,
  phoneFill,
  emailFill,
  orderService,
};

const {width: screenWidth} = Dimensions.get('window');

const datePickerStyles = {
  dateTouchBody: {
    width: screenWidth - 28,
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 18,
    color: '#d8d8d8',
  },
  dateText: {
    fontSize: 18,
    color: '#222b45',
  },
  datePicker: {
    borderTopColor: 0,
  },
};

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    const {
      last_name = '',
      first_name = '',
      phone,
      cars,
      email,
    } = this.props.profile.login;

    let car = '';

    if (this.props.profile.login.car) {
      car = {
        number: this.props.profile.login.carNumber,
        brand: this.props.profile.login.car,
        model: '',
      };
    } else {
      car = (cars && cars.find((value) => value.owner)) || {
        number: '',
        brand: '',
        model: '',
      };
    }

    this.state = {
      date: new Date(addDays(2)),
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      car: `${car.brand} ${car.model}`,
      carNumber: car.number,
      name: `${first_name} ${last_name}`,
      loading: false,
      success: false,
    };

    console.log('new Date(substractDays(2))', new Date(addDays(2)));

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: 'Автоцентр',
            fields: [
              {
                name: 'DEALER',
                type: 'dealerSelect',
                label: 'Автоцентр',
                value: this.state.firstName,
                props: {
                  goBack: true,
                  dealer: this.props.dealerSelected,
                  navigation: this.props.navigation,
                  returnScreen: this.props.navigation.state.routeName,
                },
              },
              {
                name: 'DATE',
                type: 'date',
                label: 'Выберите удобную для вас дату',
                value: this.state.date,
                props: {
                  placeholder: null,
                  required: true,
                  minDate: new Date(addDays(2)),
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
                value: this.state.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: 'Отчество',
                value: this.state.secondName,
                props: {
                  textContentType: 'name',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: this.state.lastName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: 'Телефон',
                value: this.state.phone,
                props: {
                  required: true,
                  textContentType: 'phone',
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: 'Email',
                value: this.state.email,
                props: {
                  required: true,
                },
              },
            ],
          },
          {
            name: 'Автомобиль',
            fields: [
              {
                name: 'CAR',
                type: 'input',
                label: 'Марка и модель автомобиля',
                value: this.state.carName,
                props: {
                  placeholder: null,
                  required: true,
                  // maxDate: new Date(substractYears(18)),
                  // minDate: new Date(substractDays(2)),
                },
              },
              {
                name: 'NUMBER',
                type: 'input',
                label: 'Гос.номер автомобиля',
                value: this.state.carNumber,
                props: {
                  required: true,
                  placeholder: null,
                  // maxDate: new Date(substractYears(18)),
                  // minDate: new Date(substractYears(100)),
                },
              },
            ],
          },
        ],
      },
    };
  }

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    carFill: PropTypes.func,
    dateFill: PropTypes.func,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    car: PropTypes.string,
    date: PropTypes.object,
    isOrderServiceRequest: PropTypes.bool,
  };

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  onPressOrder = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    // Предотвращаем повторную отправку формы.
    if (this.props.isOrderServiceRequest) {
      return;
    }

    if (
      (!this.state.name &&
        !this.state.name.length &&
        !this.state.name.trim()) ||
      (!this.state.phone &&
        !this.state.phone.length &&
        !this.state.phone.trim()) ||
      (!this.state.car && !this.state.car.length && !this.state.car.trim()) ||
      !this.state.date
    ) {
      return Alert.alert(
        'Не хватает информации',
        'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
      );
    }

    try {
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;
      const orderDate = this.state.date;
      const dealerID = this.props.dealerSelected.id;

      this.setState({loading: true});

      const action = await this.props.orderService({
        car:
          this.state.car &&
          this.state.car.length &&
          typeof this.state.car === 'string'
            ? this.state.car.trim()
            : this.state.car || '',
        date: orderDate,
        name:
          this.state.name &&
          this.state.name.length &&
          typeof this.state.name === 'string'
            ? this.state.name.trim()
            : this.state.name || '',
        email:
          this.state.email &&
          this.state.email.length &&
          typeof this.state.email === 'string'
            ? this.state.email.trim()
            : this.state.email || '',
        phone:
          this.state.phone &&
          this.state.phone.length &&
          typeof this.state.phone === 'string'
            ? this.state.phone.trim()
            : this.state.phone || '',
        device,
        dealerID,
      });

      if (action.type === SERVICE_ORDER__SUCCESS) {
        const _this = this;
        Amplitude.logEvent('order', 'service');
        Alert.alert(
          'Ваша заявка успешно отправлена',
          'Наши менеджеры вскоре свяжутся с Вами. Спасибо!',
          [
            {
              text: 'ОК',
              onPress() {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: 'BottomTabNavigation',
                    }),
                  ],
                });
                _this.props.navigation.dispatch(resetAction);
              },
            },
          ],
        );
        this.setState({success: true, loading: false});
      }

      if (action.type === SERVICE_ORDER__FAIL) {
        setTimeout(
          () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
          100,
        );
      }
    } catch (error) {}
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ServiceScreen';

    return isActiveScreen;
  }

  render() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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
                defaultCountryCode={'by'}
                onSubmit={this.onPressOrder}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
