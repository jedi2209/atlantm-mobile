/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
// redux
import {connect} from 'react-redux';
import {actionOrderTestDrive, actionFetchTestDriveCarDetails} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get, orderBy} from 'lodash';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {
  TD_CAR_DETAILS__SUCCESS,
  TD_CAR_DETAILS__FAIL,
  TESTDRIVE_ORDER__SUCCESS,
  TESTDRIVE_ORDER__FAIL,
} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

// import API from '../../utils/api';
import {addDays, dayMonthYear} from '../../utils/date';

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
    backgroundColor: '#eee',
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
    tdCars: catalog.newCar.carDetails.tdcars,
  };
};

const mapDispatchToProps = {
  actionOrderTestDrive,
  localUserDataUpdate,
  actionFetchTestDriveCarDetails,
};

class TestDriveScreen extends PureComponent {
  constructor(props) {
    super(props);
    const orderedCar = get(this.props.navigation, 'state.params.car.ordered');
    let model = '';
    this.carName = [
      get(this.props.navigation, 'state.params.car.brand'),
      model,
      get(this.props.navigation, 'state.params.car.complectation'),
      !orderedCar ? get(this.props.navigation, 'state.params.car.year') : null,
      orderedCar ? 'или аналог' : null,
    ]
      .filter(Boolean)
      .join(' ');

    this.state = {
      date: null,
      testDriveCar: '',
      TDCarsList: [],
      comment: '',
      timeFetch: false,
      carFetch: true,
    };

    this.fetchTDCars();
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerTitle: 'Заявка на тест-драйв',
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
    localUserDataUpdate: PropTypes.func,
    firstName: PropTypes.string,
    secondName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
  };

  fetchTDCars = async () => {
    this.setState({carFetch: true});
    const tdcarsTmp = get(this.props.navigation, 'state.params.testDriveCars');
    const dealerID = get(this.props.navigation, 'state.params.dealerId');
    let tdCarsApi = [];

    tdcarsTmp.map((el) => {
      tdCarsApi.push(el.id);
    });

    const carsAwait = await this.props.actionFetchTestDriveCarDetails(
      dealerID,
      tdCarsApi,
    );

    if (carsAwait && carsAwait.type) {
      switch (carsAwait.type) {
        case TD_CAR_DETAILS__SUCCESS:
          let tdCarsArr = [];
          if (!carsAwait.payload.model) {
            Object.values(carsAwait.payload).map((el) => {
              return tdCarsArr.push({
                label: [
                  //el.model.name,
                //   el.model.generation.name,
                  el.complectation.name,
                  el.engine.name,
                  el.color.original ? el.color.original.split('-')[1] : null,
                ].join(' '),
                value: el.id,
                key: el.id,
              });
            });
          } else {
            tdCarsArr.push({
              label: [
                //carsAwait.payload.model.name,
                // carsAwait.payload.model.generation.name,
                carsAwait.payload.complectation.name,
                carsAwait.payload.engine.name,
                carsAwait.payload.color.original
                  ? carsAwait.payload.color.original.split('-')[1]
                  : null,
              ].join(' '),
              value: carsAwait.payload.id,
              key: carsAwait.payload.id,
            });
          }
          if (tdCarsArr.length > 0) {
            tdCarsArr = orderBy(tdCarsArr, ['label'], ['desc']);
            this.setState({
              TDCarsList: tdCarsArr,
              carFetch: false,
            });
            if (tdCarsArr.length === 1) {
              this.onCarChoose(tdCarsArr[0]);
            }
          }
          return tdCarsArr;
      }
    }
  };

  onPressOrder = async (data) => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    // console.log('onPressOrder', data, this.props, this.state);
    // return true;

    const {navigation} = this.props;

    const carID = this.state.testDriveCar;
    const dealerID = get(navigation, 'state.params.dealerId');
    const isNewCar = get(navigation, 'state.params.isNewCar');
    const time = get(data, 'DATETIME.time');
    const action = await this.props.actionOrderTestDrive({
      firstName: get(data, 'NAME'),
      secondName: get(data, 'SECOND_NAME'),
      lastName: get(data, 'LAST_NAME'),
      email: get(data, 'EMAIL'),
      phone: get(data, 'PHONE'),
      dealerID,
      carID,
      time,
      comment: data.COMMENT || '',
      isNewCar,
    });
    if (action && action.type) {
      switch (action.type) {
        case TESTDRIVE_ORDER__SUCCESS:
          const car = get(navigation, 'state.params.car');
          const {brand, model} = car;
          const path = isNewCar ? 'newcar' : 'usedcar';
          Amplitude.logEvent('order', `testdrive/${path}`, {
            brand_name: brand,
            model_name: get(model, 'name'),
          });
          this.props.localUserDataUpdate({
            NAME: get(data, 'NAME'),
            SECOND_NAME: get(data, 'SECOND_NAME'),
            LAST_NAME: get(data, 'LAST_NAME'),
            PHONE: get(data, 'PHONE'),
            EMAIL: get(data, 'EMAIL'),
          });
          Alert.alert(
            'Ваша заявка успешно отправлена!',
            'Наши менеджеры вскоре свяжутся с Вами. Спасибо!',
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
        case TESTDRIVE_ORDER__FAIL:
          Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова');
          break;
      }
    }
  };

  onCarChoose(value) {
    this.setState({
      testDriveCar: value,
      date: null,
    });
  }

  render() {
    let carblock = {
      name: 'CAR',
      type: 'select',
      label: 'Выберите желаемый автомобиль',
      value: this.state.testDriveCar,
      props: {
        items: this.state.TDCarsList,
        placeholder: {
          label: 'Выберите автомобиль для тест-драйва',
          value: null,
          color: '#9EA0A4',
        },
        onChange: this.onCarChoose.bind(this),
        focusNextInput: false,
        required: true,
      },
    };
    let datetime = {
      name: 'DATETIME',
      type: 'dateTime',
      label: 'Выберите удобную для вас дату',
      value: this.state.date || null,
      props: {
        placeholder: 'начиная с ' + dayMonthYear(addDays(2)),
        required: true,
        type: 'testDrive',
        minimumDate: new Date(addDays(2)),
        maximumDate: new Date(addDays(62)),
        dealer: this.props.dealerSelected,
        carID: this.state.testDriveCar,
      },
    };

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: 'Автомобиль',
            fields: [
              this.state.TDCarsList && !this.state.carFetch
                ? carblock
                : {
                    name: 'CARLOAD',
                    type: 'component',
                    label: 'Выберите желаемый автомобиль',
                    value: (
                      <>
                        <ActivityIndicator
                          color={styleConst.color.blue}
                          style={[styles.spinner, {height: 39}]}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#ababab',
                            textAlign: 'center',
                          }}>
                          ищем свободные автомобили для тест-драйва
                        </Text>
                      </>
                    ),
                  },
              this.state.testDriveCar ? datetime : {},
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
    return (
      <KeyboardAvoidingView onPress={Keyboard.dismiss}>
        <TouchableWithoutFeedback
          style={{flex: 1, backgroundColor: '#eee'}}
          onPress={Keyboard.dismiss}>
          <Content
            style={styles.container}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={
              Platform.OS === 'android' ? 'always' : 'never'
            }>
            <Form
              fields={this.FormConfig.fields}
              barStyle={'light-content'}
              SubmitButton={{text: 'Отправить'}}
              onSubmit={this.onPressOrder}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestDriveScreen);
