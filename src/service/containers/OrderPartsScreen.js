/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {get, orderBy} from 'lodash';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import {Toast} from 'native-base';
import Form from '../../core/components/Form/Form';
import {CarCard} from '../../profile/components/CarCard';

// redux
import {connect} from 'react-redux';
import {orderParts} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import {ERROR_NETWORK} from '../../core/const';
import {PARTS_ORDER__SUCCESS, PARTS_ORDER__FAIL} from '../actionTypes';
import strings from '../../core/lang/const';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['asc']);
  let carLocalVin = '',
    carLocalBrand = '',
    carLocalModel = '';

  if (profile.cars && profile.cars[0]) {
    if (profile.cars[0].vin) {
      carLocalVin = profile.cars[0].vin || '';
    }
    if (profile.cars[0].brand) {
      carLocalBrand = profile.cars[0].brand;
    }
    if (profile.cars[0].model) {
      carLocalModel = profile.cars[0].model;
    }
  }

  return {
    cars,
    nav,
    dealerSelected: dealer.selected,
    dealerSelectedLocal: dealer.selectedLocal,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    carBrand: UserData.get('CARBRAND')
      ? UserData.get('CARBRAND')
      : carLocalBrand,
    carModel: UserData.get('CARMODEL')
      ? UserData.get('CARMODEL')
      : carLocalModel,
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    profile,
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  orderParts,
};

const styles = StyleSheet.create({
  carContainer: {
    marginLeft: -16,
    marginRight: -16,
    zIndex: 20,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginVertical: 10,
  },
});

class OrderPartsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: false,
      isHaveCar: Boolean(props.cars.length > 0),
    };
    if (this.props.cars.length === 1) {
      this.state.carBrand = this.props.cars[0].brand;
      this.state.carModel = this.props.cars[0].model;
      this.state.carName = [
        this.props.cars[0].brand,
        this.props.cars[0].model,
      ].join(' ');
      this.state.carVIN = this.props.cars[0].vin;
    }
    const carFromNavigation = get(this.props.route, 'params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      this.state.carBrand = get(carFromNavigation, 'brand');
      this.state.carModel = get(carFromNavigation, 'model');
      this.state.carName = [
        get(carFromNavigation, 'brand'),
        get(carFromNavigation, 'model'),
      ].join(' ');
      this.state.carVIN = carFromNavigation.vin;
    }
    this.myCars = [];
    this.props.cars.map((item) => {
      if (!item.hidden) {
        this.myCars.push(item);
      }
    });
  }

  static propTypes = {
    dealerSelected: PropTypes.object,
    localUserDataUpdate: PropTypes.func,
    isOrderServiceRequest: PropTypes.bool,
  };

  _selectCar = (item) => {
    this.setState({
      carBrand: item.brand,
      carModel: item.model,
      carName: [item.brand, item.model].join(' '),
      carVIN: item.vin,
    });
  };

  onPressOrder = async (dataFromForm) => {
    if (!dataFromForm.CARBRAND && this.state.carBrand) {
      dataFromForm.CARBRAND = this.state.carBrand;
    }
    if (!dataFromForm.CARMODEL && this.state.carModel) {
      dataFromForm.CARMODEL = this.state.carModel;
    }
    if (!dataFromForm.CAR && this.state.carName) {
      dataFromForm.CAR = this.state.carName;
    }
    if (!dataFromForm.CARVIN && this.state.carVIN) {
      dataFromForm.CARVIN = this.state.carVIN;
    }

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      Toast.show({
        text: ERROR_NETWORK,
        position: 'bottom',
        type: 'danger',
      });
    }

    const {navigation, localUserDataUpdate} = this.props;

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    const dealerID = dataFromForm.DEALER.id;

    const dataToSend = {
      car: get(dataFromForm, 'CARNAME', ''),
      brand: get(dataFromForm, 'CARBRAND', ''),
      model: get(dataFromForm, 'CARMODEL', ''),
      vin: get(dataFromForm, 'CARVIN', ''),
      firstName: get(dataFromForm, 'NAME', ''),
      secondName: get(dataFromForm, 'SECOND_NAME', ''),
      lastName: get(dataFromForm, 'LAST_NAME', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      text: get(dataFromForm, 'COMMENT', ''),
      part: get(dataFromForm, 'PART', ''),
      dealerID,
    };
    try {
      this.setState({loading: true});

      const action = await this.props.orderParts(dataToSend);

      if (action && action.type) {
        switch (action.type) {
          case PARTS_ORDER__SUCCESS:
            Amplitude.logEvent('order', 'parts');
            localUserDataUpdate({
              NAME: dataFromForm.NAME,
              SECOND_NAME: dataFromForm.SECOND_NAME,
              LAST_NAME: dataFromForm.LAST_NAME,
              PHONE: dataFromForm.PHONE,
              EMAIL: dataFromForm.EMAIL,
              CARNAME: dataFromForm.CARNAME,
              CARBRAND: dataFromForm.CARBRAND,
              CARMODEL: dataFromForm.CARMODEL,
            });
            Alert.alert(
              strings.Notifications.success.title,
              strings.Notifications.success.text,
              [
                {
                  text: 'ОК',
                  onPress() {
                    navigation.goBack();
                  },
                },
              ],
            );
            this.setState({success: true, loading: false});
            break;
          case PARTS_ORDER__FAIL:
            Toast.show({
              text: strings.Notifications.error.title,
              position: 'bottom',
              type: 'danger',
            });
            break;
        }
      }
    } catch (error) {}
  };

  render() {
    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.Form.group.dealer,
            fields: [
              {
                name: 'DEALER',
                type: 'dealerSelect',
                label: strings.Form.field.label.dealer,
                value:
                  this.props.dealerSelectedLocal &&
                  this.props.dealerSelectedLocal.id
                    ? this.props.dealerSelectedLocal
                    : this.props.dealerSelected,
                props: {
                  goBack: false,
                  isLocal: true,
                  returnScreen: this.props.navigation.state?.routeName,
                },
              },
            ],
          },
          {
            name: strings.Form.group.part,
            fields: [
              {
                name: 'PART',
                type: 'textarea',
                label: strings.Form.field.label.part,
                value: this.props.Part,
                props: {
                  placeholder: strings.Form.field.placeholder.part,
                },
              },
            ],
          },
          {
            name: strings.Form.group.car,
            fields: this.state.isHaveCar
              ? [
                  {
                    name: 'CARNAME',
                    type: 'component',
                    label: strings.Form.field.label.car2,
                    value: (
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={styles.carContainer}
                        contentContainerStyle={styles.carContainerContent}>
                        {(this.myCars || []).map((item) => {
                          return (
                            <TouchableWithoutFeedback
                              style={{
                                zIndex: 15,
                              }}
                              activeOpacity={0.7}
                              key={item.vin}
                              onPress={() => {
                                this._selectCar(item);
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
                          );
                        })}
                      </ScrollView>
                    ),
                  },
                ]
              : [
                  {
                    name: 'CARBRAND',
                    type: 'input',
                    label: strings.Form.field.label.carBrand,
                    value: this.props.carBrand,
                    props: {
                      required: true,
                      placeholder: null,
                    },
                  },
                  {
                    name: 'CARMODEL',
                    type: 'input',
                    label: strings.Form.field.label.carModel,
                    value: this.props.carModel,
                    props: {
                      required: true,
                      placeholder: null,
                    },
                  },
                ],
          },
          {
            name: strings.Form.group.contacts,
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: strings.Form.field.label.name,
                value: this.props.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: strings.Form.field.label.secondName,
                value: this.props.secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: strings.Form.field.label.lastName,
                value: this.props.lastName,
                props: {
                  textContentType: 'familyName',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: strings.Form.field.label.phone,
                value: this.props.phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: strings.Form.field.label.email,
                value: this.props.email,
              },
            ],
          },
          {
            name: strings.Form.group.additional,
            fields: [
              {
                name: 'COMMENT',
                type: 'textarea',
                label: strings.Form.field.label.comment,
                value: this.props.Text,
                props: {
                  placeholder: strings.Form.field.placeholder.comment,
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
                SubmitButton={{text: strings.Form.button.send}}
                onSubmit={this.onPressOrder}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPartsScreen);
