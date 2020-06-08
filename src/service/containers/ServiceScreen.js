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
  Dimensions,
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
import isInternet from '../../utils/internet';
import {addDays, yearMonthDay} from '../../utils/date';
import {ERROR_NETWORK} from '../../core/const';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../actionTypes';

let mapStateToProps = ({dealer, profile, service, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    date: service.date,
    firstName: profile.login.NAME
      ? profile.login.NAME
      : profile.localUserData.NAME
      ? profile.localUserData.NAME
      : '',
    secondName: profile.login.SECOND_NAME
      ? profile.login.SECOND_NAME
      : profile.localUserData.SECOND_NAME
      ? profile.localUserData.SECOND_NAME
      : '',
    lastName:
      profile.login.LAST_NAME && profile.login.LAST_NAME.length
        ? profile.login.LAST_NAME
        : profile.localUserData.LAST_NAME
        ? profile.localUserData.LAST_NAME
        : '',
    phone:
      profile.login.PHONE && profile.login.PHONE.length
        ? profile.login.PHONE[0].VALUE
        : profile.localUserData.PHONE
        ? profile.localUserData.PHONE
        : '',
    email:
      profile.login.EMAIL && profile.login.EMAIL.length
        ? profile.login.EMAIL[0].VALUE
        : profile.localUserData.EMAIL
        ? profile.localUserData.EMAIL
        : '',
    carName: profile.cars.length
      ? [profile.cars[0].brand, profile.cars[0].model].join(' ')
      : profile.localUserData.CARNAME
      ? profile.localUserData.CARNAME
      : '',
    carNumber: profile.cars.length
      ? profile.cars[0].number
      : profile.localUserData.CARNUMBER
      ? profile.localUserData.CARNUMBER
      : '',
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
                  textContentType: 'name',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: this.props.lastName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: 'Телефон',
                value: this.props.phone,
                props: {
                  required: true,
                  textContentType: 'phone',
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: 'Email',
                value: this.props.email,
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
                name: 'CARNAME',
                type: 'input',
                label: 'Марка и модель автомобиля',
                value: this.props.carName,
                props: {
                  placeholder: null,
                  required: true,
                },
              },
              {
                name: 'CARNUMBER',
                type: 'input',
                label: 'Гос.номер автомобиля',
                value: this.props.carNumber,
                props: {
                  required: true,
                  placeholder: null,
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
          CARNUMBER: props.CARNUMBER,
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
