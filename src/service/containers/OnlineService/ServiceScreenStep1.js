/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Icon, Button, Toast, CheckBox} from 'native-base';
import {get, orderBy} from 'lodash';
import styleConst from '../../../core/style-const';

import {CarCard} from '../../../profile/components/CarCard';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import showPrice from '../../../utils/price';

// redux
import {connect} from 'react-redux';
import {localDealerClear} from '../../../dealer/actions';
import {strings} from '../../../core/lang/const';

import API from '../../../utils/api';

const mapStateToProps = ({dealer, profile, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['desc']);

  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  if (profile.cars && typeof profile.cars === 'object') {
    let Cars = [];
    profile.cars.map(item => {
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
    color: styleConst.color.white,
  },
  textPriceTitle: {
    marginLeft: 5,
    paddingTop: 7,
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    color: styleConst.color.greyText7,
    width: '83%',
  },
  textPriceIcon: {
    color: styleConst.color.blue,
    marginTop: 3,
  },
  textPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: styleConst.color.greyText,
  },
  checkbox: {
    right: 0,
    top: 14,
    position: 'absolute',
  },
  scrollViewInner: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 5,
    marginVertical: 29.5,
    textAlign: 'center',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center',
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
      orderLead: false,
      recommended: false,
    };

    const carFromNavigation = get(this.props.route, 'params.car');
    this.settingsFromNavigation = get(this.props.route, 'params.settings');
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
    this.props.cars.map(item => {
      if (!item.hidden) {
        this.myCars.push(item);
      }
    });

    this.props.localDealerClear();

    this.dealerBlock = {
      name: strings.Form.group.dealer,
      fields: [
        {
          name: 'DEALER',
          type: 'dealerSelect',
          label: strings.Form.field.label.dealer,
          value: this.props.dealerSelected,
          props: {
            goBack: false,
            isLocal: false,
          },
        },
      ],
    };
  }

  onServiceChoose(value) {
    if (typeof value !== 'undefined' && value !== null) {
      this.setState(
        {
          service: value,
          serviceInfo: undefined,
          date: undefined,
          time: undefined,
        },
        () => {
          if (value !== null && value !== 'other') {
            // если выбраны какие-то работы кроме "другое"
            this._getServicesInfo(value);
          } else {
            this.setState({
              orderLead: true,
            });
          }
        },
      );
    }
  }

  async _getServices() {
    const {navigation, route} = this.props;
    this.setState({
      servicesFetch: true,
    });
    const data = await API.getServiceAvailable({
      dealer: this.props.dealerSelected.id,
      vin: this.state.carVIN,
    });

    if (data.status !== 200 && data.status !== 'success') {
      data.data = undefined;
      this.setState({
        orderLead: true,
        services: undefined,
        serviceInfo: undefined,
        servicesFetch: false,
        date: undefined,
        time: undefined,
      });
      if (get(this.settingsFromNavigation, 'returnOnFailFetchServices', false)) {
        Alert.alert(
          strings.Notifications.error.title,
          'Какой-то текст про то, что калькулятор ТО на выбранном КО для этого авто не существует',
          [
            {
              text: 'ОК',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      }
    } else {
      let services = [];
      data.data.map(el => {
        if (route.name === 'ServiceTOCalculatorScreen' && el.id.toString() === 'other') {
          return;
        }
        services.push({
          label: el.name.toString(),
          value: el.id.toString(),
          key: el.id.toString(),
        });
      });
      this.setState({
        services: services,
        servicesFetch: false,
        date: undefined,
        time: undefined,
      });
    }
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
      data.data = undefined;
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
    this.setState(
      {
        orderLead: false,
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

  onPressOrder = async dataFromForm => {
    const {navigation} = this.props;

    let service = '';

    if (this.state.services && !this.state.service) {
      Toast.show({
        text: strings.ServiceScreenStep1.Notifications.error.chooseService,
        position: 'bottom',
        duration: 3000,
        type: 'warning',
      });
      return false;
    }

    if (dataFromForm.SERVICE && this.state.services) {
      service = this.state.services.find(x => x.key === dataFromForm.SERVICE);
    }

    let data = {
      dealer: this.props.dealerSelected,
      service: service || null,
      serviceInfo: this.state.serviceInfo || null,
      orderLead: this.state.orderLead,
      recommended: this.state.recommended || false,
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
    return true;
  };

  render() {
    this.FormConfig = {
      fields: {
        groups: [
          !this.settingsFromNavigation?.disableDealer ? this.dealerBlock : {},
          {
            name: strings.Form.group.car,
            fields: [
              {
                name: 'CARNAME',
                type: 'component',
                label: strings.Form.field.label.car2,
                value: this.state.servicesFetch ? (
                  <>
                    <ActivityIndicator
                      color={styleConst.color.blue}
                      style={[styleConst.spinner, {height: 245}]}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#ababab',
                        textAlign: 'center',
                      }}>
                      {
                        strings.ServiceScreenStep1.Notifications.loading
                          .dealerConnect
                      }
                    </Text>
                  </>
                ) : this.myCars && this.myCars.length ? (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={styles.carContainer}
                    contentContainerStyle={styles.carContainerContent}>
                    {(this.myCars || []).map(item => (
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        key={item.vin}
                        onPress={() => {
                          if (!this.settingsFromNavigation?.disableCarBlock) {
                            this._selectCar(item, () => {
                              this._getServices();
                            });
                          }
                        }}>
                        <View>
                          <CarCard
                            key={item.vin}
                            data={item}
                            type="check"
                            checked={this.state.carVIN === item.vin}
                            disabled={this.settingsFromNavigation?.disableCarBlock}
                            onPress={() => {
                                if (!this.settingsFromNavigation?.disableCarBlock) {
                                  this._selectCar(item, () => {
                                  this._getServices();
                                });
                              }
                            }}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.scrollViewInner} useNativeDriver>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="car-off"
                      fontSize={20}
                    />
                    <Text
                      style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
                      {strings.UserCars.empty.text + '\r\n'}
                    </Text>
                    <Button
                      full
                      bordered
                      style={{borderRadius: 5}}
                      onPress={() => {
                        this.props.navigation.navigate('About', {
                          screen: 'LoginScreen',
                          activePanel: 'hidden',
                        });
                      }}>
                      <Text style={{padding: 5}}>
                        {strings.UserCars.archiveCheck}
                      </Text>
                    </Button>
                  </View>
                ),
              },
              this.state.services
                ? {
                    name: 'SERVICE',
                    type: 'select',
                    label: strings.Form.field.label.service,
                    value: this.state.service,
                    props: {
                      items: this.state.services,
                      focusNextInput: false,
                      required: true,
                      onChange: this.onServiceChoose.bind(this),
                      placeholder: {
                        label: strings.Form.field.placeholder.service,
                        value: null,
                        color: '#9EA0A4',
                      },
                    },
                  }
                : null,
              Boolean(this.state.serviceInfo || this.state.serviceInfoFetch)
                ? {
                    name: 'serviceInfo',
                    type: 'component',
                    value: this.state.serviceInfoFetch ? (
                      <>
                        <ActivityIndicator
                          color={styleConst.color.blue}
                          style={[styleConst.spinner, {height: 25}]}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#ababab',
                            textAlign: 'center',
                          }}>
                          {
                            strings.ServiceScreenStep1.Notifications.loading
                              .calculatePrice
                          }
                        </Text>
                      </>
                    ) : this.state.serviceInfo ? (
                      <TouchableOpacity
                        style={{
                          paddingVertical: 5,
                          flex: 1,
                          flexDirection: 'row',
                        }}
                        onPress={() => {
                          this.props.navigation.navigate('ServiceInfoModal', {
                            data: this.state.serviceInfo,
                            type: 'required',
                          });
                        }}>
                        {this.state.serviceInfo.summary &&
                        this.state.serviceInfo.summary[0].summ ? (
                          <>
                            <Icon
                              name="ios-information-circle-outline"
                              size={24}
                              style={styles.textPriceIcon}
                            />
                            <Text style={styles.textPriceTitle}>
                              {strings.ServiceScreenStep1.price}{' '}
                              <Text style={styles.textPrice}>
                                {showPrice(
                                  parseFloat(
                                    this.state.serviceInfo.summary[0].summ
                                      .required,
                                  ),
                                  this.props.dealerSelected.region,
                                )}
                              </Text>
                            </Text>
                          </>
                        ) : null}
                      </TouchableOpacity>
                    ) : null,
                  }
                : {},
              this.state.serviceInfo &&
              this.state.serviceInfo.summary[0].summ.recommended
                ? {
                    name: 'recommended',
                    type: 'component',
                    value: (
                        <TouchableOpacity
                          style={{
                            paddingVertical: 5,
                            flex: 1,
                            flexDirection: 'row',
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('ServiceInfoModal', {
                              data: this.state.serviceInfo,
                              type: 'recommended',
                            });
                          }}>
                          {this.state.serviceInfo.summary &&
                          this.state.serviceInfo.summary[0].summ ? (
                            <>
                              <Icon
                                name="ios-information-circle-outline"
                                size={24}
                                style={styles.textPriceIcon}
                              />
                              <Text style={styles.textPriceTitle}>
                                {strings.ServiceScreenStep1.priceRecommended}{' '}
                                <Text style={styles.textPrice}>
                                  {'+'}
                                  {showPrice(
                                    parseFloat(
                                      this.state.serviceInfo.summary[0].summ
                                        .recommended,
                                    ),
                                    this.props.dealerSelected.region,
                                  )}
                                </Text>
                              </Text>
                              <CheckBox
                                onPress={() => {
                                  this.setState({
                                    recommended: !this.state.recommended,
                                  });
                                }}
                                checked={this.state.recommended}
                                style={[styles.checkbox]}
                                color={styleConst.color.blue}
                              />
                            </>
                          ) : null}
                        </TouchableOpacity>
                    ),
                  }
                : {},
            ],
          },
          this.state.serviceInfo && this.state.serviceInfo.summary[0].summ.total ? {
            name: strings.ServiceScreenStep1.total,
            fields: [
              {
                name: 'recommended',
                type: 'component',
                value: (
                  <>
                  <View
                    style={{
                        paddingVertical: 5,
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="money"
                        type={"FontAwesome"}
                        size={24}
                        style={styles.textPriceIcon}
                      />
                      <Text style={styles.textPriceTitle}>
                        {strings.ServiceScreenStep1.total}{' '}
                        <Text style={styles.textPrice}>
                          {showPrice(
                            parseFloat(
                              this.state.recommended ? 
                              this.state.serviceInfo.summary[0].summ.total : this.state.serviceInfo.summary[0].summ.required
                            ),
                            this.props.dealerSelected.region,
                          )}
                        </Text>
                      </Text>
                  </View>
                  <Text style={{fontSize: 14, color: styleConst.color.greyBlueText, marginTop: 10,}}>{this.state.serviceInfo.summary[0]?.text}</Text>
                  </>
                )
              }
            ],
          } : {},
        ],
      },
    };
    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styleConst.form.scrollView}>
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
                  text: get(this.props.route, 'params.settings.submitButtonText', false) ? get(this.props.route, 'params.settings.submitButtonText') : strings.DatePickerCustom.chooseDateButton,
                  style: {
                    backgroundColor: styleConst.color.darkBg,
                  },
                }}
                parentState={this.state}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreenStep1);
