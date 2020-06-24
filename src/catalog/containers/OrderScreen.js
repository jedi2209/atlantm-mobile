/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
// redux
import {connect} from 'react-redux';
import {actionOrderCar} from '../actions';
import {nameFill, phoneFill, emailFill} from '../../profile/actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '@core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {CATALOG_ORDER__SUCCESS, CATALOG_ORDER__FAIL} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

const $size = 40;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  list: {
    paddingBottom: $size,
  },
  serviceForm: {
    marginTop: $size,
  },
  // Скопировано из ProfileSettingsScreen.
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 36,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const mapStateToProps = ({dealer, catalog, profile}) => {
  return {
    dealerSelected: dealer.selected,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    profile,
    comment: catalog.orderComment,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
  actionOrderCar,
};

class OrderScreen extends Component {
  constructor(props) {
    super(props);

    const car = get(this.props.navigation, 'state.params.car');
    const isNewCar = get(this.props.navigation, 'state.params.isNewCar');
    const region = get(this.props.navigation, 'state.params.region');
    const {brand, model, complectation, year} = car;

    const carName = [
      brand ? brand.toString() : null,
      model ? model.name.toString() : null,
      complectation ? complectation.toString() : null,
      year ? year.toString() : null,
    ].join(' ');

    this.state = {
      date: '',
      comment: '',
    };

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: 'Автомобиль',
            fields: [
              {
                name: 'CARNAME',
                type: 'input',
                label: isNewCar
                  ? 'Марка, модель и комплектация'
                  : 'Марка, модель и год выпуска',
                value: carName,
                props: {
                  editable: false,
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
                  required: true,
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
                value: this.props.comment,
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

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerTitle: 'Заявка на авто',
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
  };

  onPressOrder = async (data) => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const {navigation} = this.props;

    const dealerId = get(navigation, 'state.params.dealerId');
    const carId = get(navigation, 'state.params.carId');
    const isNewCar = get(navigation, 'state.params.isNewCar');
    const name = [data.NAME, data.SECOND_NAME, data.LAST_NAME].join(' ');
    const action = await this.props.actionOrderCar({
      name: name,
      email: data.EMAIL,
      phone: data.PHONE,
      dealerId,
      carId,
      comment: data.COMMENT || '',
      isNewCar,
    });
    switch (action.type) {
      case CATALOG_ORDER__SUCCESS:
        const car = get(navigation, 'state.params.car');
        const {brand, model} = car;
        const path = isNewCar ? 'newcar' : 'usedcar';

        Amplitude.logEvent('order', `catalog/${path}`, {
          brand_name: brand,
          model_name: get(model, 'name'),
        });

        let _this = this;
        Alert.alert(
          'Ваша заявка успешно отправлена!',
          'Наши менеджеры вскоре свяжутся с Вами. Спасибо!',
          [
            {
              text: 'ОК',
              onPress() {
                _this.props.navigation.goBack();
              },
            },
          ],
        );
        break;
      case CATALOG_ORDER__FAIL:
        Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова');
        break;
    }
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{flex: 1, backgroundColor: '#eee'}}>
            <View style={styles.container}>
              <Form
                fields={this.FormConfig.fields}
                barStyle={'light-content'}
                SubmitButton={{text: 'Отправить'}}
                onSubmit={this.onPressOrder}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
