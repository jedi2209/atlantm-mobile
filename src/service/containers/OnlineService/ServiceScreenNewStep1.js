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
import {Icon, Toast} from 'native-base';
import {get, orderBy} from 'lodash';
import styleConst from '../../../core/style-const';
// import {StackActions, NavigationActions} from 'react-navigation';

import {CarCard} from '../../../profile/components/CarCard';
import {ServiceModal} from '../../components/ServiceModal';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import RenderPrice from '../../../utils/price';

// redux
import {connect} from 'react-redux';
import {localDealerClear} from '../../../dealer/actions';

import API from '../../../utils/api';

const mapStateToProps = ({dealer, profile, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['asc']);

  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  if (profile.cars && typeof profile.cars === 'object') {
    let Cars = [];
    profile.cars.map((item) => {
      if (!item.hidden) {
        Cars.push(item);
      }
    });
    if (Cars && Cars[0]) {
      if (Cars[0].brand) {
        carLocalBrand = Cars[0].brand;
      }
      if (Cars[0].model) {
        carLocalModel = Cars[0].model;
      }
      if (Cars[0].number) {
        carLocalNumber = Cars[0].number || '';
      }
      if (Cars[0].vin) {
        carLocalVin = Cars[0].vin || '';
      }
    }
  }

  return {
    cars,
    nav,
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
  localDealerClear,
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

class ServiceScreenStep1 extends Component {
  constructor(props) {
    super(props);
    const {carBrand, carModel, carVIN, carNumber} = props;

    this.state = {
      service: undefined,
      services: undefined,
      servicesFetch: false,
      serviceInfo: undefined,
      serviceInfoFetch: false,
      isModalVisible: false,
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

    this.myCars = [];
    this.props.cars.map((item) => {
      if (!item.hidden) {
        this.myCars.push(item);
      }
    });
    this.orderLead = false;

    this.props.localDealerClear();
  }

  onServiceChoose(value) {
    this.setState(
      {
        service: value,
        serviceInfo: undefined,
        date: undefined,
        time: undefined,
      },
      () => {
        if (!isNaN(value) && value !== null) {
          this._getServicesInfo(value);
        }
      },
    );
  }

  async _getServices() {
    // if (!this.orderLead) {
    this.setState({
      servicesFetch: true,
    });
    // console.log(
    //   '_getServices this.state.dealerSelectedLocal',
    //   this.state.dealerSelectedLocal,
    // );
    const data = await API.getServiceAvailable({
      dealer: this.props.dealerSelected.id,
      vin: this.state.carVIN,
    });

    if (data.status !== 200 && data.status !== 'success') {
      // Alert.alert(
      //   'Хьюстон, у нас проблемы!',
      //   data.error && data.error.message
      //     ? '\r\n' + data.error.message
      //     : 'Доступных услуг не найдено. Попробуй записаться в другой автоцентр',
      // );
      this.orderLead = true;
      data.data = undefined;
      this.setState({
        services: undefined,
        serviceInfo: undefined,
        servicesFetch: false,
        date: undefined,
        time: undefined,
      });
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
        servicesFetch: false,
        date: undefined,
        time: undefined,
      });
      console.log('_getServices', this.state);
    }
    // }
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

    if (data.status !== 'success' && data.status !== 200) {
      // Alert.alert(
      //   'Хьюстон, у нас проблемы!',
      //   '\r\nНе удалось загрузить информацию об услуге',
      // );
      data.data = [];
    }

    this.setState({
      serviceInfo: data.data,
      serviceInfoFetch: false,
    });
  }

  _selectCar = (item, callback) => {
    this.setState(
      {
        carName: [item.brand, item.model].join(' '),
        carVIN: item.vin ? item.vin : null,
        carBrand: item.brand ? item.brand : null,
        carModel: item.model ? item.model : null,
        carNumber: item.number ? item.number : null,
        date: undefined,
        time: undefined,
        services: undefined,
        service: undefined,
        serviceInfo: undefined,
      },
      callback ? callback : () => {},
    );
  };

  _onCarChange = () => {
    this.orderLead = false;
    this.setState(
      {
        date: undefined,
        time: undefined,
        services: undefined,
        service: undefined,
        serviceInfo: undefined,
      },
      () => {
        return true;
      },
    );
  };

  componentDidMount() {
    if (
      this.state.carVIN &&
      this.props.dealerSelected &&
      this.props.dealerSelected.id
    ) {
      this._getServices();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.carVIN !== this.state.carVIN) {
      return this._onCarChange();
    }
    return false;
  }

  onPressOrder = async (dataFromForm) => {
    const {navigation} = this.props;

    let service = '';

    if (this.state.services && !this.state.service) {
      Toast.show({
        text: 'Необходимо выбрать желаемую услугу для продолжения',
        position: 'bottom',
        duration: 3000,
        type: 'warning',
      });
      return false;
    }

    if (dataFromForm.SERVICE && this.state.services) {
      service = this.state.services.find((x) => x.key === dataFromForm.SERVICE);
    }

    let data = {
      dealer: this.props.dealerSelected,
      service: service || null,
      serviceInfo: this.state.serviceInfo || null,
      orderLead: this.orderLead,
      car: {
        brand: this.state.carBrand
          ? this.state.carBrand
          : dataFromForm.CARBRAND || null,
        model: this.state.carModel
          ? this.state.carModel
          : dataFromForm.CARMODEL || null,
        plate: this.state.carNumber
          ? this.state.carNumber
          : dataFromForm.CARNUMBER || null,
        vin: this.state.carVIN
          ? this.state.carVIN
          : dataFromForm.CARVIN || null,
      },
    };

    navigation.navigate('ServiceScreenStep2', data);

    console.log('onPressOrder', this.orderLead, data, dataFromForm);
    return true;
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
                  goBack: false,
                  isLocal: false,
                  navigation: this.props.navigation,
                },
              },
            ],
          },
          {
            name: 'Автомобиль',
            fields: [
              {
                name: 'CARNAME',
                type: 'component',
                label: 'Выбери автомобиль',
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
                    {(this.myCars || []).map((item) => (
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        key={item.vin}
                        onPress={() => {
                          this._selectCar(item, () => {
                            this._getServices();
                          });
                        }}>
                        <View>
                          <CarCard
                            key={item.vin}
                            data={item}
                            type="check"
                            checked={this.state.carVIN === item.vin}
                            onPress={() => {
                              this._selectCar(item, () => {
                                this._getServices();
                              });
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
                    label: 'Выбери услугу',
                    value: this.state.service,
                    props: {
                      items: this.state.services,
                      focusNextInput: false,
                      required: true,
                      onChange: this.onServiceChoose.bind(this),
                      placeholder: {
                        label: 'Что будем делать с авто?',
                        value: null,
                        color: '#9EA0A4',
                      },
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
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                }}>
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
                defaultCountryCode={this.props.dealerSelected.region}
                onSubmit={this.onPressOrder}
                SubmitButton={{
                  text: 'Выбрать дату',
                  style: {
                    backgroundColor: styleConst.color.darkBg,
                  },
                }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreenStep1);
