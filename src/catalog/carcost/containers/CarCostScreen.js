import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import CarCostPhotos from '../components/CarCostPhotos';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import {substractYears} from '../../../utils/date';
import UserData from '../../../utils/user';

import Form from '../../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {actionCarCostOrder} from '../../actions';
import {CAR_COST__SUCCESS, CAR_COST__FAIL} from '../../actionTypes';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get, valuesIn} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import {ERROR_NETWORK} from '../../../core/const';
import isInternet from '../../../utils/internet';

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
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: [stylesHeader.headerStyle, stylesHeader.whiteHeader],
      headerTitleStyle: [
        stylesHeader.headerTitleStyle,
        stylesHeader.whiteHeaderTitle,
      ],
      headerTitle: 'Оценка моего авто',
      headerLeft: (
        <HeaderIconBack
          theme="blue"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

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
  }

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  };

  onPressOrder = async (dataFromForm) => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {navigation} = this.props;

      const photoForUpload = valuesIn(this.state.photos);

      const action = await this.props.actionCarCostOrder({
        dealerId: this.props.dealerSelected.id,
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
          Amplitude.logEvent('order', 'catalog/carcost');

          setTimeout(() => {
            Alert.alert(
              'Всё получилось!',
              'Заявка успешно отправлена. Наши менеджеры вскоре свяжутся с тобой. Спасибо!',
              [
                {
                  text: 'ОК',
                  onPress() {
                    navigation.goBack();
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
            'Произошла ошибка, попробуем снова?',
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(
            () => Alert.alert('Хьюстон, у нас проблемы...', message),
            100,
          );
          break;
      }
    }
  };

  // shouldComponentUpdate(nextProps) {
  //   const nav = nextProps.nav.newState;
  //   let isActiveScreen = false;

  //   if (nav) {
  //     const rootLevel = nav.routes[nav.index];
  //     if (rootLevel) {
  //       isActiveScreen =
  //         get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
  //         'CarCostScreen';
  //     }
  //   }

  //   return isActiveScreen;
  // }

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
                value:
                  this.props.dealerSelectedLocal &&
                  this.props.dealerSelectedLocal.id
                    ? this.props.dealerSelectedLocal
                    : this.props.dealerSelected,
                props: {
                  goBack: true,
                  isLocal: true,
                  navigation: this.props.navigation,
                  returnScreen: this.props.navigation.state.routeName,
                },
              },
            ],
          },
          {
            name: 'Автомобиль',
            fields: [
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
                label: 'VIN номер',
                value: this.props.carVIN,
                props: {
                  placeholder: null,
                },
              },
              {
                name: 'CARYEAR',
                type: 'year',
                label: 'Год выпуска',
                value: this.props.carYear,
                props: {
                  required: true,
                  minDate: new Date(substractYears(100)),
                  maxDate: new Date(),
                  reverse: true,
                  placeholder: {
                    label: 'Выбери год выпуска...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  // Icon: () => {
                  //   return (
                  //     <Icon
                  //       type="MaterialIcons"
                  //       name="date-range"
                  //       size={24}
                  //       color="gray"
                  //     />
                  //   );
                  // },
                },
              },
              // {
              //   name: 'CARCOLOR',
              //   type: 'input',
              //   label: 'Цвет',
              //   value: this.props.carColor,
              //   props: {
              //     placeholder: null,
              //   },
              // },
              {
                name: 'CARMILEAGE',
                type: 'input',
                label: 'Пробег [в километрах]',
                value: this.props.carMileage,
                props: {
                  keyboardType: 'number-pad',
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARENGINETYPE',
                type: 'select',
                label: 'Тип двигателя',
                value: this.props.carEngineType,
                props: {
                  items: [
                    {
                      label: 'Бензин',
                      value: 1,
                      key: 1,
                    },
                    {
                      label: 'Бензин (ГАЗ)',
                      value: 9,
                      key: 9,
                    },
                    {
                      label: 'Дизель',
                      value: 2,
                      key: 2,
                    },
                    {
                      label: 'Гибрид',
                      value: 3,
                      key: 3,
                    },
                    {
                      label: 'Электро',
                      value: 4,
                      key: 4,
                    },
                  ],
                  placeholder: {
                    label: 'Укажи тип двигателя...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  // Icon: () => {
                  //   return (
                  //     <Icon
                  //       type="MaterialCommunityIcons"
                  //       name="engine"
                  //       size={24}
                  //       color="gray"
                  //     />
                  //   );
                  // },
                },
              },
              {
                name: 'CARENGINEVOLUME',
                type: 'input',
                label: 'Объём двигателя [в куб.см]',
                value: this.props.carEngineVolume,
                props: {
                  keyboardType: 'number-pad',
                  placeholder: null,
                },
              },
              {
                name: 'CARGEARBOXTYPE',
                type: 'select',
                label: 'Тип КПП',
                value: this.props.carGearboxType,
                props: {
                  items: [
                    {
                      label: 'Механическая',
                      value: 1,
                      key: 1,
                    },
                    {
                      label: 'Автоматическая',
                      value: 4,
                      key: 4,
                    },
                    {
                      label: 'Автоматическая -- DSG',
                      value: 11,
                      key: 11,
                    },
                    {
                      label: 'Автоматическая -- Робот',
                      value: 12,
                      key: 12,
                    },
                    {
                      label: 'Автоматическая -- Вариатор',
                      value: 13,
                      key: 13,
                    },
                  ],
                  placeholder: {
                    label: 'Выбери коробку передач...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  // Icon: () => {
                  //   return (
                  //     <Icon
                  //       type="FontAwesome"
                  //       name="gears"
                  //       size={24}
                  //       color="red"
                  //     />
                  //   );
                  // },
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
            name: 'Фотографии',
            fields: [
              {
                name: 'FOTO',
                type: 'component',
                label: 'Прикрепи фото',
                value: (
                  <CarCostPhotos
                    photos={this.state.photos}
                    photosFill={(photos) => {
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
            name: 'Дополнительно',
            fields: [
              {
                name: 'COMMENT',
                type: 'textarea',
                label: 'Комментарий',
                value: this.props.Text,
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

    console.log('== CarCost ==');

    return (
      <KeyboardAvoidingView onPress={Keyboard.dismiss}>
        <TouchableWithoutFeedback style={{flex: 1, backgroundColor: '#eee'}}>
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
            <Form
              fields={this.FormConfig.fields}
              barStyle={'light-content'}
              onSubmit={this.onPressOrder}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarCostScreen);
