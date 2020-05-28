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
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Picker, Button} from 'native-base';
import {sortBy, orderBy} from 'lodash';

import {CarCard} from '../../profile/components/CarCard';
import DealerItemList from '../../core/components/DealerItemList';
import ChooseDateTimeComponent from '../components/ChooseDateTimeComponent';
import {TextInput} from '../../core/components/TextInput';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import API from '../../utils/api';
import {TouchableOpacity} from 'react-native-gesture-handler';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  const cars = orderBy(profile.login.cars, ['owner'], ['desc']);
  console.log('cars =====>', cars);

  return {
    cars,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  carContainer: {
    marginLeft: -14,
    marginRight: -14,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginBottom: -10,
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

    const car = props.cars.length > 0 ? props.cars[0] : {};
    const {last_name = '', first_name = '', phone, email} = props.profile.login;

    this.state = {
      car: car,
      service: '',
      services: [],
      serviceInfo: undefined,
      isModalVisible: false,
      step: 1,
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      name: `${first_name} ${last_name}`,
      carName: '',
      carNumber: '',
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
    console.log('start _getServices');
    const data = await API.getServiceAvailable({
      dealer: this.props.dealerSelected.id,
      vin: this.state.car.vin,
    });

    console.log('data.data', data.data);

    this.setState({
      services: data.data,
    });
  }

  async _getServicesInfo(id) {
    console.log('start _getServicesInfo');
    const data = await API.getServiceInfo({
      id,
      dealer: this.props.dealerSelected.id,
      vin: this.state.car.vin,
    });

    console.log('data.data', data.data);

    this.setState({
      serviceInfo: data.data,
    });
  }

  componentDidMount() {
    if (this.state.car && this.state.car.vin) {
      this._getServices();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   prevState.car.vin !== undefined &&
    //   prevState.car.vin !== this.state.car.vin
    // ) {
    //   this.setState({
    //     services: [],
    //     time: undefined,
    //     service: undefined,
    //     serviceInfo: undefined,
    //     isButtonVisible: false,
    //   });
    //   this._getServices();
    // }
  }

  saveOrder() {
    console.log('this.state ==>', this.state);
  }

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  render() {
    const {navigation, dealerSelected} = this.props;

    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.step === 1 && (
            <>
              <StatusBar barStyle="light-content" />
              <View
                // Визуально выравниваем относительно остальных компонентов.
                style={[styles.group, {marginLeft: -24, marginRight: -14}]}>
                <DealerItemList
                  goBack
                  navigation={navigation}
                  city={dealerSelected.city}
                  name={dealerSelected.name}
                  brands={dealerSelected.brands}
                />
              </View>

              {!this.state.isHaveCar ? (
                <View style={styles.group}>
                  <View style={styles.field}>
                    <TextInput
                      style={styles.textinput}
                      label="Авто"
                      value={this.state.carName || ''}
                      onChangeText={this.onChangeField('car')}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextInput
                      style={styles.textinput}
                      label="Гос. номер"
                      value={this.state.carNumber || ''}
                      onChangeText={this.onChangeField('carNumber')}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.field}>
                  <Text style={styles.label}>Выберите автомобиль</Text>
                  {/* TODO: Разобраться, почему есть вертикальный скролл внутри контейнера. */}
                  {this.props.cars.length > 0 && (
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      style={styles.carContainer}
                      contentContainerStyle={styles.carContainerContent}>
                      {this.props.cars.map((item) => (
                        <TouchableWithoutFeedback
                          key={item.vin}
                          onPress={() => this.setState({car: item})}>
                          <View>
                            <CarCard
                              key={item.vin}
                              data={item}
                              type="check"
                              checked={this.state.car.vin === item.vin}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}

              {this.state.isHaveCar && (
                <View style={styles.field}>
                  <Text style={styles.label}>Выберите доступную услугу</Text>
                  <Picker
                    mode="dropdown"
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
                    {this.state.services.map((item) => (
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
                    this.setState({isModalVisible: !this.state.isModalVisible});
                    console.log(this.state.serviceInfo);
                  }}>
                  <Text>Показать данные об услуге</Text>
                </TouchableOpacity>
              )}
              <View style={styles.field}>
                {(Boolean(this.state.service) || !this.state.isHaveCar) && (
                  <ChooseDateTimeComponent
                    time={this.state.time}
                    dealer={dealerSelected}
                    onChange={(data) => {
                      console.log('=====> time', data.time);
                      this.setState({time: data.time * 1000});
                    }}
                  />
                )}
              </View>
              {this.state.isButtonVisible && (
                <View>
                  <Button
                    style={styles.button}
                    onPress={() => {
                      this.setState({step: 2});
                    }}>
                    <Text style={styles.buttonText}>Далее</Text>
                  </Button>
                </View>
              )}
            </>
          )}
          {this.state.step === 2 && (
            <>
              <View style={styles.group}>
                <View style={styles.field}>
                  <TextInput
                    autoCorrect={false}
                    style={styles.textinput}
                    label="ФИО"
                    value={this.state.name || ''}
                    enablesReturnKeyAutomatically={true}
                    textContentType={'name'}
                    onChangeText={this.onChangeField('name')}
                  />
                </View>
                <View style={styles.field}>
                  <TextInput
                    style={styles.textinput}
                    label="Телефон"
                    keyboardType="phone-pad"
                    value={this.state.phone || ''}
                    enablesReturnKeyAutomatically={true}
                    textContentType={'telephoneNumber'}
                    onChangeText={this.onChangeField('phone')}
                  />
                </View>
                <View style={styles.field}>
                  <TextInput
                    style={styles.textinput}
                    label="Email"
                    keyboardType="email-address"
                    value={this.state.email || ''}
                    enablesReturnKeyAutomatically={true}
                    textContentType={'emailAddress'}
                    onChangeText={this.onChangeField('email')}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Button
                    style={[
                      styles.button,
                      {width: '50%', margin: 0, marginRight: 5},
                    ]}
                    onPress={() => {
                      this.setState({step: 1});
                    }}>
                    <Text style={styles.buttonText}>Назад</Text>
                  </Button>

                  <Button
                    style={[styles.button, {width: '50%', margin: 0}]}
                    onPress={() => {
                      this.saveOrder();
                    }}>
                    <Text style={styles.buttonText}>Сохранить</Text>
                  </Button>
                </View>
              </View>
            </>
          )}
        </View>
        <View>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{flex: 1, backgroundColor: '#fff', padding: 20}}>
              <Text>Hello!</Text>
              <Button
                onPress={() => {
                  this.setState({isModalVisible: !this.state.isModalVisible});
                }}>
                <Text>Понятно</Text>
              </Button>
            </View>
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
