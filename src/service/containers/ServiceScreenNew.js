/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';
import {orderBy} from 'lodash';
import styleConst from '../../core/style-const';
import {StackActions, NavigationActions} from 'react-navigation';

import {CarCard} from '../../profile/components/CarCard';
import {ServiceModal} from '../components/ServiceModal';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
import {addDays, dayMonthYear} from '../../utils/date';
import UserData from '../../utils/user';
import RenderPrice from '../../utils/price';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import API from '../../utils/api';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['asc']);

  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalVin = '';

  if (profile.cars && profile.cars[0]) {
    if (profile.cars[0].brand) {
      carLocalBrand = profile.cars[0].brand;
    }
    if (profile.cars[0].model) {
      carLocalModel = profile.cars[0].model;
    }

    if (profile.cars[0].vin) {
      carLocalVin = profile.cars[0].vin || '';
    }
  }

  return {
    cars,
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
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    dealerSelected: dealer.selected,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  carContainer: {
    marginLeft: -16,
    marginRight: -16,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginVertical: 10,
  },
  group: {
    marginBottom: 36,
  },
  field: {
    marginBottom: 18,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: -2,
  },
  picker: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    height: 40,
  },
  button: {
    margin: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: '#027aff',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: '#fff',
  },
});

class ServiceScreen extends Component {
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
    } = props;

    this.state = {
      service: '',
      services: undefined,
      servicesFetch: false,
      serviceInfo: undefined,
      serviceInfoFetch: false,
      isModalVisible: false,
      email: email,
      phone: phone,
      name: firstName && lastName ? `${firstName} ${lastName}` : '',
      carBrand: carBrand,
      carModel: carModel,
      carVIN: carVIN,
      isHaveCar: Boolean(props.cars.length > 0),
    };
  }

  noHaveCar = [
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
      name: 'CARVIN',
      type: 'input',
      label: 'VIN номер автомобиля',
      value: this.props.carVIN,
      props: {
        placeholder: null,
      },
    },
  ];

  onServiceChoose(value) {
    this.setState({
      service: value,
    });

    if (value) {
      this._getServicesInfo(value);
    }
  }

  async _getServices() {
    this.setState({
      servicesFetch: true,
    });

    const data = await API.getServiceAvailable({
      dealer: this.props.dealerSelected.id,
      vin: this.state.carVIN,
    });

    console.log('data ======>', data);
    if (data.status !== 200 && data.status !== 'success') {
      Alert.alert(
        'Хьюстон, у нас проблемы!',
        data.error && data.error.message
          ? '\r\n' + data.error.message
          : 'Доступных услуг не найдено. Попробуйте записаться в другой автоцентр',
      );
      data.data = undefined;
    } else {
      let services = [];
      data.data.map((el) => {
        services.push({
          label: el.name,
          value: el.id,
          key: el.id,
        });
      });
      this.setState({
        services: services,
      });
    }

    this.setState({
      servicesFetch: false,
    });
  }

  async _getServicesInfo(id) {
    this.setState({
      serviceInfoFetch: true,
    });
    const data = await API.getServiceInfo({
      id,
      dealer: this.props.dealerSelected.id,
      vin: this.state.carVIN,
    });

    console.log('data.status ====>', data.status, data.status !== 'success');
    if (data.status !== 'success' && data.status !== 200) {
      Alert.alert(
        'Хьюстон, у нас проблемы!',
        '\r\nНе удалось загрузить информацию об услуге',
      );
      data.data = [];
    }

    this.setState({
      serviceInfo: data.data,
      serviceInfoFetch: false,
    });
  }

  _selectCar = (item) => {
    this.setState({
      carName: [item.brand, item.model].join(' '),
      carVIN: item.vin,
    });
  };

  componentDidMount() {
    if (this.state.carVIN) {
      this._getServices();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.carVIN !== this.state.carVIN) {
      this.setState({
        services: undefined,
        time: undefined,
        service: undefined,
        serviceInfo: undefined,
      });
      // this._getServices();
    }
  }

  onPressOrder = async (dataFromForm) => {
    const {navigation} = this.props;

    let data;
    let TimeTotal = 0;

    data = {
      dealer: this.props.dealerSelected.id,
      time: {
        from: parseInt(dataFromForm.DATETIME.time),
      },
      name: dataFromForm.NAME,
      phone: dataFromForm.PHONE,
      email: dataFromForm.EMAIL || null,
      tech_place: dataFromForm.DATETIME.tech_place,
      vin: this.state.carVIN ? this.state.carVIN : dataFromForm.CARVIN || null,
      car: {
        brand: this.state.carBrand
          ? this.state.carBrand
          : dataFromForm.CARBRAND || null,
        model: this.state.carModel
          ? this.state.carModel
          : dataFromForm.CARMODEL || null,
      },
      text: dataFromForm.COMMENT || null,
    };

    if (
      this.state.serviceInfo &&
      this.state.serviceInfo.summary[0].time.total
    ) {
      data.time.to =
        parseInt(dataFromForm.DATETIME.time) +
        parseInt(this.state.serviceInfo.summary[0].time.total);
    }

    console.log('=>>>>>> data', data);
    const order = await API.saveOrderToService(data);

    if (order.status === 'error') {
      Alert.alert('Хьюстон, у нас проблемы!', '\r\n' + order.error.message);
    } else {
      Alert.alert('Всё получилось!', '\r\nСпасибо! Ваша запись оформлена', [
        {
          text: 'ОК',
          onPress() {
            navigation.goBack();
          },
        },
      ]);
      this.setState({success: true, loading: false});
    }
  };

  render() {
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
              !this.state.isHaveCar
                ? {
                    name: 'DATETIME',
                    type: 'dateTime',
                    label: 'Дата сервиса',
                    value: this.state.date,
                    props: {
                      dealer: this.props.dealerSelected,
                      placeholder: 'не ранее ' + dayMonthYear(addDays(2)),
                      required: true,
                      minDate: new Date(addDays(2)),
                    },
                  }
                : {},
            ],
          },
          {
            name: 'Автомобиль',
            fields: !this.state.isHaveCar
              ? this.noHaveCar
              : [
                  {
                    name: 'CARNAME',
                    type: 'component',
                    label: 'Выберите автомобиль',
                    value: this.state.servicesFetch ? (
                      <>
                        <ActivityIndicator
                          color={styleConst.color.blue}
                          style={[styles.spinner, {height: 245}]}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#ababab',
                            textAlign: 'center',
                          }}>
                          подключение к СТО для выбора услуг
                        </Text>
                      </>
                    ) : (
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={styles.carContainer}
                        contentContainerStyle={styles.carContainerContent}>
                        {(this.props.cars || []).map((item) => (
                          <TouchableWithoutFeedback
                            activeOpacity={0.7}
                            key={item.vin}
                            onPress={() => {
                              this._selectCar(item);
                              this._getServices();
                            }}>
                            <View>
                              <CarCard
                                key={item.vin}
                                data={item}
                                type="check"
                                checked={this.state.carVIN === item.vin}
                                onPress={() => {
                                  this._selectCar(item);
                                }}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </ScrollView>
                    ),
                  },
                  this.state.services
                    ? {
                        name: 'SERVICE',
                        type: 'select',
                        label: 'Выберите услугу',
                        value: this.state.service,
                        props: {
                          items: this.state.services,
                          onValueChange: this.onServiceChoose.bind(this),
                          placeholder: {
                            label: 'Что будем делать с авто?',
                            value: null,
                            color: '#9EA0A4',
                          },
                          required: true,
                        },
                      }
                    : {},
                  Boolean(this.state.serviceInfo || this.state.serviceInfoFetch)
                    ? {
                        name: 'serviceInfo',
                        type: 'component',
                        value: this.state.serviceInfoFetch ? (
                          <>
                            <ActivityIndicator
                              color={styleConst.color.blue}
                              style={[styles.spinner, {height: 25}]}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#ababab',
                                textAlign: 'center',
                              }}>
                              вычисляем предв.стоимость
                            </Text>
                          </>
                        ) : (
                          <TouchableOpacity
                            style={{
                              paddingVertical: 5,
                              flex: 1,
                              flexDirection: 'row',
                            }}
                            onPress={() => {
                              this.setState({
                                isModalVisible: !this.state.isModalVisible,
                              });
                            }}>
                            {this.state.serviceInfo.summary &&
                            this.state.serviceInfo.summary[0].summ ? (
                              <>
                                <Text
                                  style={{
                                    marginRight: 10,
                                    paddingTop: 2,
                                  }}>
                                  Предв.стоимость{' '}
                                  <Text
                                    style={{fontSize: 18, fontWeight: 'bold'}}>
                                    {RenderPrice(
                                      parseFloat(
                                        this.state.serviceInfo.summary[0].summ
                                          .required,
                                      ),
                                      this.props.dealerSelected.region,
                                    )}
                                  </Text>
                                </Text>
                                <Icon
                                  name="ios-information-circle-outline"
                                  size={20}
                                  style={{
                                    color: styleConst.color.blue,
                                  }}
                                />
                              </>
                            ) : null}
                          </TouchableOpacity>
                        ),
                      }
                    : {},
                  this.state.serviceInfo && !this.state.serviceInfoFetch
                    ? {
                        name: 'DATETIME',
                        type: 'dateTime',
                        label: 'Дата сервиса',
                        value: '',
                        props: {
                          dealer: this.props.dealerSelected,
                          placeholder: 'не ранее ' + dayMonthYear(addDays(2)),
                          required: true,
                          minDate: new Date(addDays(2)),
                        },
                      }
                    : {},
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
