/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Icon, Button, Toast, Checkbox, HStack} from 'native-base';
import {get, orderBy} from 'lodash';
import styleConst from '../../../core/style-const';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {CarCard} from '../../../profile/components/CarCard';
import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import showPrice from '../../../utils/price';

// redux
import {connect} from 'react-redux';
import {localDealerClear} from '../../../dealer/actions';
import {strings} from '../../../core/lang/const';

import API from '../../../utils/api';
import {ERROR_NETWORK} from '../../../core/const';

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
    dealerSelectedLocal: dealer.selectedLocal,
    allDealers: dealer.listDealers,
    region: dealer.region,
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
    const {route, carBrand, carModel, carVIN, carNumber, allDealers} = props;

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

    this.carFromNavigation = get(route, 'params.car');
    this.settingsFromNavigation = get(route, 'params.settings');
    if (this.carFromNavigation && get(this.carFromNavigation, 'vin')) {
      this.state.carVIN = this.carFromNavigation.vin;
      this.state.carBrand = get(this.carFromNavigation, 'brand');
      this.state.carModel = get(this.carFromNavigation, 'model');
      this.state.carNumber = get(this.carFromNavigation, 'number');
      this.state.carName = [
        get(this.carFromNavigation, 'brand'),
        get(this.carFromNavigation, 'model'),
      ].join(' ');
    }

    this.dealerSelectedLocal = get(route, 'params.dealerCustom');

    this.myCars = [];
    this.props.cars.map(item => {
      if (!item.hidden) {
        this.myCars.push(item);
      }
    });

    this.listDealers = [];
    if (this.dealerSelectedLocal) {
      if (this.dealerSelectedLocal.length) {
        this.dealerSelectedLocal.map(el => {
          if (typeof el === 'string' || typeof el === 'number') {
            el = allDealers[el];
          }
          this.listDealers.push({
            label: el.name,
            value: el.id,
            key: el.id,
          });
        });
      } else {
        if (typeof this.dealerSelectedLocal === 'object') {
          this.listDealers.push({
            label: this.dealerSelectedLocal.name,
            value: this.dealerSelectedLocal.id,
            key: this.dealerSelectedLocal.id,
          });
        }
      }
    }

    this.props.localDealerClear();
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
    if (!get(this.dealerSelectedLocal, 'id', false)) {
      return;
    }
    const {navigation, route} = this.props;
    this.setState({
      servicesFetch: true,
    });
    const data = await API.getServiceAvailable({
      dealer: this.dealerSelectedLocal.id,
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
      if (
        get(this.settingsFromNavigation, 'returnOnFailFetchServices', false)
      ) {
        let errorTitle = strings.Notifications.error.title;
        let errorText = strings.ServiceScreenStep1.Notifications.error.noData;
        switch (data?.error.code) {
          case 6: // неправильное КО
            errorText =
              strings.ServiceScreenStep1.Notifications.error.wrongDealer;
            break;
          case 7: // Для VIN не определены признаки ТО
            errorText =
              strings.ServiceScreenStep1.Notifications.error.noDataCar;
            break;
          default:
            break;
        }
        Alert.alert(errorTitle, errorText, [
          {
            text: 'ОК',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        if (this.carFromNavigation || this.myCars.length === 1) {
          this.onPressOrder();
        }
      }
    } else {
      let services = [];
      data.data.map(el => {
        if (
          get(route, 'name', null) === 'ServiceTOCalculatorScreen' &&
          get(el, 'id', '').toString() === 'other'
        ) {
          return;
        }
        services.push({
          label: get(el, 'name', '').toString(),
          value: get(el, 'id', '').toString(),
          key: get(el, 'id', '').toString(),
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
    if (!get(this.dealerSelectedLocal, 'id', false)) {
      return;
    }
    this.setState({
      serviceInfoFetch: true,
    });
    const data = await API.getServiceInfo({
      id,
      dealer: this.dealerSelectedLocal.id,
      vin: this.state.carVIN,
    });

    let orderLeadStatus = false;

    if (data.status !== 'success' && data.status !== 200) {
      data.data = undefined;
      orderLeadStatus = true;
    }

    this.setState({
      serviceInfo: data.data,
      serviceInfoFetch: false,
      orderLead: orderLeadStatus,
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
    // if (this.state.carVIN && get(this.dealerSelectedLocal, 'id', false)) {
    //   this._getServices();
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.carVIN !== this.state.carVIN) {
      return this._onCarChange();
    }
    return false;
  }

  onPressOrder = async dataFromForm => {
    const isInternet = require('../../../utils/internet').default;
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      Toast.show({
        title: ERROR_NETWORK,
        status: 'warning',
        duration: 2000,
        id: 'networkError',
      });
      return;
    }

    const {navigation} = this.props;

    let service = '';
    if (this.state.services && !this.state.service) {
      Toast.show({
        title: strings.ServiceScreenStep1.Notifications.error.chooseService,
      });
      return false;
    }
    if (
      get(dataFromForm, 'SERVICE', false) &&
      get(this.state, 'services', false)
    ) {
      service = this.state.services.find(x => x.key === dataFromForm.SERVICE);
    }

    let data = {
      dealer: this.props.dealerSelectedLocal,
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
    this.dealerBlock = {
      name: strings.Form.group.dealer,
      fields: [
        {
          name: 'DEALER',
          type: 'dealerSelect',
          label: strings.Form.field.label.dealer,
          value: this.props.dealerSelectedLocal,
          props: {
            required: true,
            goBack: true,
            showBrands: false,
            isLocal: true,
            dealerFilter: {
              type: 'ST',
            },
          },
        },
      ],
    };
    if (this.listDealers) {
      if (this.listDealers.length < 1) {
        this.dealerBlock = {
          name: strings.Form.group.dealer,
          fields: [
            {
              name: 'DEALER',
              type: 'dealerSelect',
              label: strings.Form.group.dealer,
              value: this.props.dealerSelectedLocal || this.dealerSelectedLocal,
              props: {
                required: true,
                goBack: true,
                isLocal: true,
                showBrands: false,
                readonly: get(this.settingsFromNavigation, 'dealerHide', false),
                dealerFilter: {
                  type: 'ST',
                },
              },
            },
          ],
        };
      } else if (this.listDealers.length === 1) {
        this.dealerBlock = {
          name: strings.Form.group.dealer,
          fields: [
            {
              name: 'DEALER',
              type: 'dealerSelect',
              label: strings.Form.group.dealer,
              value: this.props.dealerSelectedLocal || this.dealerSelectedLocal,
              props: {
                required: true,
                goBack: true,
                isLocal: true,
                showBrands: false,
                readonly: true,
                dealerFilter: {
                  type: 'ST',
                },
              },
            },
          ],
        };
      } else if (this.listDealers.length > 1) {
        this.dealerBlock = {
          name: strings.Form.group.dealer,
          fields: [
            {
              name: 'DEALER',
              type: 'select',
              label: strings.Form.field.label.dealer,
              value: null,
              props: {
                items: this.listDealers,
                required: true,
                goBack: true,
                showBrands: false,
                isLocal: true,
                dealerFilter: {
                  type: 'ST',
                },
                placeholder: {
                  label: strings.Form.field.placeholder.dealer,
                  value: null,
                  color: '#9EA0A4',
                },
              },
            },
          ],
        };
      }
    }

    this.FormConfig = {
      fields: {
        groups: [
          !get(this.settingsFromNavigation, 'dealerHide', false)
            ? this.dealerBlock
            : {},
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
                    {(this.myCars || []).map(item => {
                      if (
                        this.settingsFromNavigation?.disableCarBlock &&
                        item &&
                        item.vin &&
                        this.state.carVIN
                      ) {
                        if (item?.vin !== this.state.carVIN) {
                          return;
                        }
                      }
                      return (
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
                              disabled={
                                this.settingsFromNavigation?.disableCarBlock
                              }
                              onPress={() => {
                                if (
                                  !this.settingsFromNavigation?.disableCarBlock
                                ) {
                                  this._selectCar(item, () => {
                                    this._getServices();
                                  });
                                }
                              }}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.scrollViewInner} useNativeDriver>
                    <Icon
                      as={MaterialCommunityIcons}
                      name="car-off"
                      fontSize={20}
                    />
                    <Text
                      style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
                      {strings.UserCars.empty.text + '\r\n'}
                    </Text>
                    <Button
                      variant="outline"
                      rounded={'lg'}
                      _text={{padding: 1}}
                      onPress={() => {
                        this.props.navigation.navigate('About', {
                          screen: 'LoginScreen',
                          activePanel: 'hidden',
                        });
                      }}>
                      {strings.UserCars.archiveCheck}
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
                              name="car-info"
                              size={8}
                              as={MaterialCommunityIcons}
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
                                  this.props.region,
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
              get(this.state.serviceInfo, 'summary[0].summ.recommended', false)
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
                        get(
                          this.state.serviceInfo,
                          'summary[0].summ',
                          false,
                        ) ? (
                          <HStack
                            alignContent={'center'}
                            alignItems={'center'}
                            alignSelf={'center'}>
                            <Icon
                              name="information-circle-outline"
                              size={8}
                              as={Ionicons}
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
                                  this.props.region,
                                )}
                              </Text>
                            </Text>
                            <Checkbox
                              aria-label={
                                strings.ServiceScreenStep1.priceRecommended
                              }
                              onChange={() => {
                                this.setState({
                                  recommended: !this.state.recommended,
                                });
                              }}
                              isChecked={this.state.recommended}
                              defaultIsChecked={this.state.recommended}
                              style={[styles.checkbox]}
                            />
                          </HStack>
                        ) : null}
                      </TouchableOpacity>
                    ),
                  }
                : {},
            ],
          },
          this.state.serviceInfo && this.state.serviceInfo.summary[0].summ.total
            ? {
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
                            as={FontAwesome}
                            size={8}
                            style={styles.textPriceIcon}
                          />
                          <Text style={styles.textPriceTitle}>
                            {strings.ServiceScreenStep1.total}{' '}
                            <Text style={styles.textPrice}>
                              {showPrice(
                                parseFloat(
                                  this.state.recommended
                                    ? this.state.serviceInfo.summary[0].summ
                                        .total
                                    : this.state.serviceInfo.summary[0].summ
                                        .required,
                                ),
                                this.props.region,
                              )}
                            </Text>
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: styleConst.color.greyBlueText,
                            marginTop: 10,
                          }}>
                          {this.state.serviceInfo.summary[0]?.text}
                        </Text>
                      </>
                    ),
                  },
                ],
              }
            : {},
        ],
      },
    };
    return (
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key="ServiceStep1Form"
        fields={this.FormConfig.fields}
        defaultCountryCode={this.props.region}
        onSubmit={this.onPressOrder}
        SubmitButton={{
          text: get(this.props.route, 'params.settings.submitButtonText', false)
            ? get(this.props.route, 'params.settings.submitButtonText')
            : strings.DatePickerCustom.chooseDateButton,
          style: {
            backgroundColor: styleConst.color.darkBg,
          },
          noAgreement: true,
        }}
        parentState={this.state}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreenStep1);
