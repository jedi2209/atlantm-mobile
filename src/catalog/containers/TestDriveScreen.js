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
import {
  actionOrderTestDrive,
  actionOrderTestDriveLead,
  actionFetchTestDriveCarDetails,
} from '../actions';
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
  TESTDRIVE_LEAD__SUCCESS,
  TESTDRIVE_LEAD__FAIL,
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
  actionOrderTestDriveLead,
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

    const dealer = get(this.props.navigation, 'state.params.car.dealer');
    this.listAll = [];
    dealer.map((el) => {
      this.listAll.push({
        label: el.name,
        value: el.id,
        key: el.id,
      });
    });

    this.state = {
      date: null,
      testDriveCar: '',
      TDCarsList: [],
      comment: '',
      dealerID: null,
      timeFetch: false,
      carFetch: true,
    };

    if (this.listAll.length === 1) {
      this.state.dealerID = this.listAll[0].value;
    }
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

  componentDidMount() {
    if (this.state.dealerID) {
      this.fetchTDCars(this.state.dealerID);
    }
  }

  fetchTDCars = async (dealerID) => {
    this.setState({carFetch: true});
    const tdcarsTmp = get(this.props.navigation, 'state.params.testDriveCars');
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
                label: el.name,
                value: el.id,
                key: el.id,
              });
            });
          } else {
            tdCarsArr.push({
              label: carsAwait.payload.name,
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

    const {navigation} = this.props;

    const carID = this.state.testDriveCar;
    const dealerID = get(data, 'DEALER')
      ? get(data, 'DEALER')
      : this.state.dealerID;
    const isNewCar = get(navigation, 'state.params.isNewCar');
    const time = get(data, 'DATETIME.time');
    // console.log('onPressOrder', data, this.props, this.state, dealerID);
    // return true;
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
        case TESTDRIVE_ORDER__SUCCESS: // отправляем online-запись на ТД
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
            'Заявка успешно отправлена!',
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
        case TESTDRIVE_ORDER__FAIL: // online-запись не сработала, конвертируем в ЛИД
          const actionLead = await this.props.actionOrderTestDriveLead({
            firstName: get(data, 'NAME'),
            secondName: get(data, 'SECOND_NAME'),
            lastName: get(data, 'LAST_NAME'),
            email: get(data, 'EMAIL'),
            phone: get(data, 'PHONE'),
            dealerID,
            carID,
            comment: data.COMMENT || '',
            isNewCar,
          });
          if (actionLead && actionLead.type) {
            switch (actionLead.type) {
              case TESTDRIVE_LEAD__SUCCESS:
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
                  'Заявка успешно отправлена!',
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
              case TESTDRIVE_LEAD__FAIL:
                Alert.alert('Ошибка', 'Произошла ошибка, попробуем снова?');
                break;
            }
          }
          break;
      }
    }
  };

  onDealerChoose(value) {
    this.setState(
      {
        dealerID: value,
        date: null,
        testDriveCar: '',
        TDCarsList: [],
        timeFetch: false,
        carFetch: true,
      },
      () => {
        if (!isNaN(value)) {
          this.fetchTDCars(value);
        }
      },
    );
  }

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
      label: 'Выбери желаемый автомобиль',
      value: this.state.testDriveCar,
      props: {
        items: this.state.TDCarsList,
        placeholder: {
          label: 'Выбери автомобиль для тест-драйва',
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
      label: 'Выбери удобную для тебя дату',
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
            name:
              this.listAll.length > 1 ? 'Автоцентр и автомобиль' : 'Автомобиль',
            fields: [
              this.listAll.length > 1
                ? {
                    name: 'DEALER',
                    type: 'select',
                    label: 'Автоцентр',
                    value: this.state.dealerID,
                    props: {
                      items: this.listAll,
                      required: true,
                      onChange: this.onDealerChoose.bind(this),
                      placeholder: {
                        label: 'Выбери удобный для тебя автоцентр',
                        value: null,
                        color: '#9EA0A4',
                      },
                    },
                  }
                : {},
              this.state.dealerID
                ? this.state.TDCarsList && !this.state.carFetch
                  ? carblock
                  : {
                      name: 'CARLOAD',
                      type: 'component',
                      label: 'Выбери желаемый автомобиль',
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
                    }
                : {},
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
                    'На случай если тебе потребуется передать нам больше информации',
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
