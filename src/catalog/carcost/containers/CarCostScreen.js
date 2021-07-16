import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import CarCostPhotos from '../components/CarCostPhotos';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import {
  addDays,
  dayMonthYear,
  yearMonthDay,
  substractYears,
} from '../../../utils/date';
import UserData from '../../../utils/user';

import Form from '../../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {actionCarCostOrder} from '../../actions';
import {CAR_COST__SUCCESS, CAR_COST__FAIL} from '../../actionTypes';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get, valuesIn} from 'lodash';
import {ERROR_NETWORK} from '../../../core/const';
import styleConst from '../../../core/style-const';
import isInternet from '../../../utils/internet';

import {strings} from '../../../core/lang/const';

const mapStateToProps = ({dealer, profile, nav, catalog}) => {
  const carCost = get(catalog, 'carCost', {});
  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  if (profile.cars && profile.cars[0]) {
    if (profile.cars[0].brand) {
      carLocalBrand = profile.cars[0].brand;
    }
    if (profile.cars[0].model) {
      carLocalModel = profile.cars[0].model;
    }
    if (profile.cars[0].number) {
      carLocalNumber = profile.cars[0].number || '';
    }

    if (profile.cars[0].vin) {
      carLocalVin = profile.cars[0].vin || '';
    }
  }

  return {
    nav,
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
    carNumber: UserData.get('CARNUMBER')
      ? UserData.get('CARNUMBER')
      : carLocalNumber,
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    dealerSelected: dealer.selected,
    dealerSelectedLocal: dealer.selectedLocal,
  };
};

const mapDispatchToProps = {
  // carcost
  actionCarCostOrder,
};

class CarCostScreen extends Component {
  constructor(props) {
    super(props);

    const {lastName, firstName, phone, email, carName, carNumber, carVIN} =
      props;

    this.state = {
      email: email,
      phone: phone,
      name: [firstName, lastName].join(' '),
      carName: carName,
      carNumber: carNumber,
      carVIN: carVIN,
      carYear: null,
      photos: [],
      loading: false,
      success: false,
    };

    const carFromNavigation = get(props.route, 'params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      this.state.carVIN = carFromNavigation.vin;
      this.state.carBrand = get(carFromNavigation, 'brand');
      this.state.carModel = get(carFromNavigation, 'model');
      this.state.carNumber = get(carFromNavigation, 'number');
      this.state.carMileage = get(carFromNavigation, 'mileage');
      this.state.carName = [
        get(carFromNavigation, 'brand'),
        get(carFromNavigation, 'model'),
      ].join(' ');
    }
  }

  static propTypes = {
    dealerSelected: PropTypes.object,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  };

  onPressOrder = async dataFromForm => {
    const isInternetExist = await isInternet();
    const nav = this.props.navigation;

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const photoForUpload = valuesIn(this.state.photos);

      const action = await this.props.actionCarCostOrder({
        dealerId: this.props.dealerSelected.id,
        date: yearMonthDay(dataFromForm.DATE) || '',
        firstName: dataFromForm.NAME || '',
        secondName: dataFromForm.SECOND_NAME || '',
        lastName: dataFromForm.LAST_NAME || '',
        phone: dataFromForm.PHONE || '',
        email: dataFromForm.EMAIL || '',
        comment: dataFromForm.COMMENT || '',
        vin: dataFromForm.CARVIN || '',
        brand: dataFromForm.CARBRAND || '',
        model: dataFromForm.CARMODEL || '',
        year: dataFromForm.CARYEAR,
        photos: photoForUpload,
        mileage: dataFromForm.CARMILEAGE || '',
        mileageUnit: 'км',
        engineVolume: dataFromForm.CARENGINEVOLUME || '',
        engineType: dataFromForm.CARENGINETYPE || '',
        gearbox: dataFromForm.CARGEARBOXTYPE || '',
      });
      switch (action.type) {
        case CAR_COST__SUCCESS:
          Analytics.logEvent('order', 'catalog/carcost');

          setTimeout(() => {
            Alert.alert(
              strings.Notifications.success.title,
              strings.Notifications.success.textOrder,
              [
                {
                  text: 'ОК',
                  onPress: () => {
                    nav.goBack();
                  },
                },
              ],
            );
          }, 100);
          break;
        case CAR_COST__FAIL:
          let message = get(
            action,
            'payload.message',
            strings.Notifications.error.text,
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(
            () => Alert.alert(strings.Notifications.error.title, message),
            100,
          );
          break;
      }
    }
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
              {
                name: 'DATE',
                type: 'date',
                label: strings.Form.field.label.date,
                value: null,
                props: {
                  placeholder:
                    strings.Form.field.placeholder.date +
                    ' ' +
                    dayMonthYear(addDays(2)),
                  required: true,
                  minimumDate: new Date(addDays(2)),
                  maximumDate: new Date(addDays(62)),
                },
              },
            ],
          },
          {
            name: strings.Form.group.car,
            fields: [
              {
                name: 'CARBRAND',
                type: 'input',
                label: strings.Form.field.label.carBrand,
                value: this.state.carBrand
                  ? this.state.carBrand
                  : this.props.carBrand,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARMODEL',
                type: 'input',
                label: strings.Form.field.label.carModel,
                value: this.state.carModel
                  ? this.state.carModel
                  : this.props.carModel,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARVIN',
                type: 'input',
                label: strings.Form.field.label.carVIN,
                value: this.state.carVIN
                  ? this.state.carVIN
                  : this.props.carVIN,
                props: {
                  placeholder: null,
                  autoCapitalize: 'characters',
                  onSubmitEditing: () => {},
                  returnKeyType: 'done',
                  blurOnSubmit: true,
                },
              },
              {
                name: 'CARYEAR',
                type: 'year',
                label: strings.Form.field.label.carYear,
                value: this.props.carYear,
                props: {
                  required: true,
                  minDate: new Date(substractYears(100)),
                  maxDate: new Date(),
                  reverse: true,
                  placeholder: {
                    label: strings.Form.field.placeholder.carYear,
                    value: null,
                    color: '#9EA0A4',
                  },
                },
              },
              {
                name: 'CARMILEAGE',
                type: 'input',
                label: strings.Form.field.label.carMileage,
                value: this.state.carMileage
                  ? this.state.carMileage
                  : this.props.carMileage,
                props: {
                  keyboardType: 'number-pad',
                  required: true,
                  placeholder: null,
                  onSubmitEditing: () => {},
                  returnKeyType: 'done',
                  blurOnSubmit: true,
                },
              },
              {
                name: 'CARENGINETYPE',
                type: 'select',
                label: strings.Form.field.label.engineType,
                value: this.props.carEngineType,
                props: {
                  items: [
                    {
                      label: strings.Form.field.value.engineType.gasoline,
                      value: 1,
                      key: 1,
                    },
                    {
                      label: strings.Form.field.value.engineType.gasolineGas,
                      value: 9,
                      key: 9,
                    },
                    {
                      label: strings.Form.field.value.engineType.diesel,
                      value: 2,
                      key: 2,
                    },
                    {
                      label: strings.Form.field.value.engineType.hybrid,
                      value: 3,
                      key: 3,
                    },
                    {
                      label: strings.Form.field.value.engineType.electro,
                      value: 4,
                      key: 4,
                    },
                  ],
                  placeholder: {
                    label: strings.Form.field.placeholder.engineType,
                    value: null,
                    color: '#9EA0A4',
                  },
                },
              },
              {
                name: 'CARENGINEVOLUME',
                type: 'input',
                label: strings.Form.field.label.engineVolume,
                value: this.props.carEngineVolume,
                props: {
                  keyboardType: 'number-pad',
                  placeholder: null,
                  onSubmitEditing: () => {},
                  returnKeyType: 'done',
                  blurOnSubmit: true,
                },
              },
              {
                name: 'CARGEARBOXTYPE',
                type: 'select',
                label: strings.Form.field.label.gearbox,
                value: this.props.carGearboxType,
                props: {
                  items: [
                    {
                      label: strings.Form.field.value.gearbox.mechanical,
                      value: 1,
                      key: 1,
                    },
                    {
                      label: strings.Form.field.value.gearbox.automatic,
                      value: 4,
                      key: 4,
                    },
                    {
                      label: strings.Form.field.value.gearbox.dsg,
                      value: 11,
                      key: 11,
                    },
                    {
                      label: strings.Form.field.value.gearbox.robot,
                      value: 12,
                      key: 12,
                    },
                    {
                      label: strings.Form.field.value.gearbox.variator,
                      value: 13,
                      key: 13,
                    },
                  ],
                  placeholder: {
                    label: strings.Form.field.placeholder.gearbox,
                    value: null,
                    color: '#9EA0A4',
                  },
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
            name: strings.Form.group.foto,
            fields: [
              {
                name: 'FOTO',
                type: 'component',
                label: strings.Form.field.label.foto,
                value: (
                  <CarCostPhotos
                    photos={this.state.photos}
                    photosFill={photos => {
                      this.setState({
                        photos: photos,
                      });
                    }}
                  />
                ),
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
    console.log('this.state', this.state);
    console.log('== CarCost ==');

    return (
      <KeyboardAvoidingView onPress={Keyboard.dismiss}>
        <TouchableWithoutFeedback style={styleConst.form.scrollView}>
          <Content
            style={{
              flex: 1,
              paddingTop: 20,
              paddingHorizontal: 14,
              backgroundColor: '#eee',
            }}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={
              Platform.OS === 'android' ? 'always' : 'never'
            }>
            <StatusBar hidden />
            <Form
              fields={this.FormConfig.fields}
              barStyle={'light-content'}
              SubmitButton={{text: strings.Form.button.send}}
              onSubmit={this.onPressOrder}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarCostScreen);
