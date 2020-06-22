/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Form from '../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {orderService} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import {addDays, yearMonthDay} from '../../utils/date';
import {ERROR_NETWORK} from '../../core/const';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../actionTypes';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  let carLocalName = '';
  let carLocalVin = '';

  if (profile.cars && profile.cars[0]) {
    if (profile.cars[0].brand && profile.cars[0].model) {
      carLocalName = [profile.cars[0].brand, profile.cars[0].model].join(' ');
    }

    if (profile.cars[0].vin) {
      carLocalVin = profile.cars[0].vin || '';
    }
  }

  return {
    nav,
    dealerSelected: dealer.selected,
    date: service.date,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    carBrand: UserData.get('CARBRAND')
      ? UserData.get('CARBRAND')
      : carLocalBrand,
    carModel: UserData.get('CARMODEL')
      ? UserData.get('CARMODEL')
      : carLocalModel,
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    profile,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  orderService,
};

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(addDays(2)),
      loading: false,
      success: false,
    };

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
                value: this.props.dealerSelected,
                props: {
                  goBack: true,
                  isLocal: false,
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
                    'На случай если вам потребуется передать нам больше информации',
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
    localUserDataUpdate: PropTypes.func,
    isOrderServiceRequest: PropTypes.bool,
  };

  onPressOrder = async (props) => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const name = [props.NAME, props.SECOND_NAME, props.LAST_NAME]
      .filter(Boolean)
      .join(' ');

    // // Предотвращаем повторную отправку формы.
    // if (this.props.isOrderServiceRequest) {
    //   return;
    // }

    if (!name || !props.PHONE || !props.CARNAME || !props.DATE) {
      return Alert.alert(
        'Не хватает информации',
        'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
      );
    }

    try {
      const dealerID = props.DEALER.id;
      const orderDate = yearMonthDay(props.DATE);

      this.setState({loading: true});

      const action = await this.props.orderService({
        car: get(props, 'CARNAME', ''),
        date: orderDate,
        name: name,
        email: get(props, 'EMAIL', ''),
        phone: get(props, 'PHONE', ''),
        text: get(props, 'COMMENT', ''),
        dealerID,
      });

      if (action.type === SERVICE_ORDER__SUCCESS) {
        const _this = this;
        Amplitude.logEvent('order', 'service');
        _this.props.localUserDataUpdate({
          NAME: props.NAME,
          SECOND_NAME: props.SECOND_NAME,
          LAST_NAME: props.LAST_NAME,
          PHONE: props.PHONE,
          EMAIL: props.EMAIL,
          CARNAME: props.CARNAME,
        });
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
