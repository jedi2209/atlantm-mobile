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
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Icon, Picker, Button} from 'native-base';
import {orderBy} from 'lodash';
import styleConst from '@core/style-const';

import {CarCard} from '../../profile/components/CarCard';
import ChooseDateTimeComponent from '../components/ChooseDateTimeComponent';
import {TextInput} from '../../core/components/TextInput';
import {ServiceModal} from '../components/ServiceModal';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
import {addDays, dayMonthYear} from '../../utils/date';
import UserData from '../../utils/user';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import API from '../../utils/api';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['desc']);

  let carLocalName = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  if (profile.cars && profile.cars[0]) {
    if (profile.cars[0].brand && profile.cars[0].model) {
      carLocalName = [profile.cars[0].brand, profile.cars[0].model].join(' ');
    }
    if (profile.cars[0].number) {
      carLocalNumber = profile.cars[0].number || '';
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
    carName: UserData.get('CARNAME') ? UserData.get('CARNAME') : carLocalName,
    carNumber: UserData.get('CARNUMBER')
      ? UserData.get('CARNUMBER')
      : carLocalNumber,
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
      carName,
      carNumber,
      carVIN,
    } = props;

    this.state = {
      service: '',
      services: undefined,
      servicesFetch: false,
      serviceInfo: undefined,
      isModalVisible: false,
      email: email,
      phone: phone,
      name: firstName && lastName ? `${firstName} ${lastName}` : '',
      carName: carName,
      carNumber: carNumber,
      carVIN: carVIN,
      isHaveCar: Boolean(props.cars.length > 0),
    };
  }

  onValueChange2(value) {
    this.setState({
      service: value,
    });

    if (value) {
      this._getServicesInfo(value);
    }
  }

  async _getServices() {
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
    }

    this.setState({
      services: data.data,
      servicesFetch: false,
    });
  }

  async _getServicesInfo(id) {
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
    });
  }

  componentDidMount() {
    if (this.state.carName && this.state.carVIN) {
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
      this._getServices();
    }
  }

  async saveOrder() {
    console.log('this.state ==>', this.state);
    console.log('this.state.serviceInfo ==>', this.state.serviceInfo);

    if (this.state.isHaveCar) {
      console.log('dealer', this.props.dealerSelected.id);
      console.log('time', {
        from: this.state.time,
        to: 'this.state.time + this.state.serviceInfo.summary[0].time.total',
      });
      console.log('name', this.state.name);
      console.log('phone', this.state.phone);
      console.log('email', this.state.email);
      console.log('tech_place', this.state.tech_place);
      console.log('vin', this.state.carVIN);
      console.log('car', {
        name: `${this.state.car.brand} ${this.state.car.model}`,
        plate: this.state.car.number,
      });
    } else {
      console.log('dealer', this.props.dealerSelected.id);
      console.log('time', {
        from: this.state.time,
        to: 'this.state.time + this.state.serviceInfo.summary[0].time.total',
      });
      console.log('name', this.state.name);
      console.log('phone', this.state.phone);
      console.log('email', this.state.email);
      console.log('tech_place', this.state.tech_place);
      console.log('vin', this.state.carVIN);
      console.log('car', {
        name: this.state.carName,
        plate: this.state.carNumber,
      });
    }

    let data;

    if (this.state.isHaveCar) {
      data = {
        dealer: this.props.dealerSelected.id,
        time: {
          from: this.state.time / 1000,
          to:
            // eslint-disable-next-line prettier/prettier
            (this.state.time + this.state.serviceInfo.summary[0].time.total * 1000) / 1000,
        },
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        tech_place: this.state.tech_place,
        vin: this.state.carVIN,
        car: {
          name: `${this.state.car.brand} ${this.state.car.model}`,
          plate: this.state.car.number,
        },
      };
    } else {
      data = {
        dealer: this.props.dealerSelected.id,
        time: {
          from: this.state.time / 1000,
          to:
            // eslint-disable-next-line prettier/prettier
            (this.state.time + this.state.serviceInfo.summary[0].time.total * 1000) / 1000,
        },
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        tech_place: this.state.tech_place,
        vin: this.state.carVIN,
        car: {
          name: this.state.carName,
          plate: this.state.carNumber,
        },
      };
    }

    console.log('=>>>>>> data', data);
    const order = await API.saveOrderToService(data);

    if (order.status === 'error') {
      Alert.alert('Хьюстон, у нас проблемы!', '\r\n' + order.error.message);
    } else {
      Alert.alert('Всё получилось!', '\r\nСпасибо! Ваша запись оформлена');
    }
  }

  onPressOrder = (data) => {
    console.log('onPressOrder data', data);
    console.log('onPressOrder this.state', this.state);
    return false;
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
              {
                name: 'DATETIME',
                type: 'dateTime',
                label: 'Выберите удобную для вас дату',
                value: this.state.date,
                props: {
                  dealer: this.props.dealerSelected,
                  placeholder: 'не ранее ' + dayMonthYear(addDays(2)),
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
                name: 'CARNAME',
                type: !this.state.isHaveCar ? 'input' : 'component',
                label: !this.state.isHaveCar
                  ? 'Марка и модель'
                  : 'Выберите автомобиль',
                value: this.state.isHaveCar ?
                  this.state.servicesFetch ? (
                    <>
                      <ActivityIndicator
                        color={styleConst.color.blue}
                        style={[styles.spinner, {height: 200}]}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#ababab',
                          textAlign: 'center',
                        }}>
                        выясняем возможные услуги на СТО для выбранного
                        автомобиля
                      </Text>
                    </>
                  ) : (
                    <>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={styles.carContainer}
                        contentContainerStyle={styles.carContainerContent}>
                        {(this.props.cars || []).map((item) => (
                          <TouchableWithoutFeedback
                            key={item.vin}
                            onPress={() => {
                              this.setState({
                                servicesFetch: true,
                                carName: [item.brand, item.model].join(' '),
                                carNumber: item.number,
                                carVIN: item.vin,
                              });
                            }}>
                            <View>
                              <CarCard
                                key={item.vin}
                                data={item}
                                type="check"
                                checked={this.state.carVIN === item.vin}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </ScrollView>
                      {this.state.isHaveCar && this.state.services && (
                        <View style={styles.field}>
                          <Text style={styles.label}>
                            Выберите доступную услугу
                          </Text>
                          <Picker
                            mode="dropdown"
                            iosHeader="Услуга"
                            headerBackButtonText="Выбрать"
                            iosIcon={
                              <Icon
                                name="arrow-down"
                                style={{color: '#c7c7c7', marginRight: 0}}
                              />
                            }
                            style={styles.picker}
                            placeholder="Выберите услугу"
                            placeholderStyle={{
                              color: '#d8d8d8',
                              fontSize: 18,
                              paddingLeft: 0,
                            }}
                            textStyle={{
                              paddingLeft: 0,
                            }}
                            selectedValue={this.state.service}
                            onValueChange={this.onValueChange2.bind(this)}>
                            {(this.state.services || []).map((item) => (
                              <Picker.Item
                                key={item.id}
                                label={item.name}
                                value={item.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                      {Boolean(this.state.serviceInfo) && (
                        <TouchableOpacity
                          style={{paddingBottom: 20}}
                          onPress={() => {
                            this.setState({
                              isModalVisible: !this.state.isModalVisible,
                            });
                          }}>
                          <Text>Показать данные об услуге</Text>
                        </TouchableOpacity>
                      )}
                    </>
                ) : null,
              },
              {
                name: 'CARNUMBER',
                type: !this.state.isHaveCar ? 'input' : null,
                label: 'Гос.номер',
                value: this.props.carNumber,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARVIN',
                type: !this.state.isHaveCar ? 'input' : null,
                label: 'VIN номер автомобиля',
                value: this.props.carVIN,
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
                  required: true,
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
                  textContentType: 'emailAddress',
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
                defaultCountryCode={'by'}
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
