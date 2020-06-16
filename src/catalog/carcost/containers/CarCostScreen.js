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
import {Content, List, StyleProvider, Icon} from 'native-base';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import {substractYears} from '../../../utils/date';
import UserData from '../../../utils/user';

import {TextInput} from '../../../core/components/TextInput';
import Form from '../../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {
  actionFillPhotosCarCost,
  actionFillBrandCarCost,
  actionFillModelCarCost,
  actionFillColorCarCost,
  actionSelectYearCarCost,
  actionFillMileageCarCost,
  actionSelectMileageUnitCarCost,
  actionFillEngineVolumeCarCost,
  actionSelectEngineTypeCarCost,
  actionSelectGearboxCarCost,
  actionSelectCarConditionCarCost,
  actionFillCommentCarCost,
  actionFillVinCarCost,
  actionCarCostOrder,
} from '../../actions';
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

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

const mapStateToProps = ({dealer, profile, nav, catalog}) => {
  const carCost = get(catalog, 'carCost', {});
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
    nav,
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
    isCarCostRequest: carCost.meta.isCarCostRequest,
  };
};

const mapDispatchToProps = {
  // carcost
  actionFillPhotosCarCost,
  actionFillBrandCarCost,
  actionFillModelCarCost,
  actionFillColorCarCost,
  actionSelectYearCarCost,
  actionFillMileageCarCost,
  actionSelectMileageUnitCarCost,
  actionFillEngineVolumeCarCost,
  actionSelectEngineTypeCarCost,
  actionSelectGearboxCarCost,
  actionSelectCarConditionCarCost,
  actionFillCommentCarCost,
  actionFillVinCarCost,
  actionCarCostOrder,
};

class CarCostScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
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

  onPressButton = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        navigation,

        name,
        phone,
        email,
        dealerSelected,

        actionCarCostOrder,
        isCarCostRequest,

        comment,
        photos,
        vin,
        brand,
        model,
        year,
        mileage,
        mileageUnit,
        engineVolume,
        engineType,
        gearbox,
        carCondition,
        color,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isCarCostRequest) {
        return false;
      }

      const dealerId = dealerSelected.id;
      const photoForUpload = valuesIn(photos);

      if (!name || !phone || !email || photoForUpload.length === 0) {
        return Alert.alert(
          'Не хватает информации',
          'Необходимо заполнить ФИО, телефон, email и добавить минимум 1 фотографию автомобиля',
        );
      }

      actionCarCostOrder({
        dealerId,
        name,
        phone,
        email,
        comment,
        vin,
        brand,
        model,
        year,
        photos: photoForUpload,
        mileage,
        mileageUnit,
        engineVolume,
        engineType,
        gearbox,
        carCondition,
        color,
      }).then((action) => {
        if (action.type === CAR_COST__SUCCESS) {
          Amplitude.logEvent('order', 'catalog/carcost');

          setTimeout(() => {
            Alert.alert('Ваша заявка успешно отправлена', '', [
              {
                text: 'ОК',
                onPress() {
                  navigation.goBack();
                },
              },
            ]);
          }, 100);
        }

        if (action.type === CAR_COST__FAIL) {
          let message = get(
            action,
            'payload.message',
            'Произошла ошибка, попробуйте снова',
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
    }
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'CarCostScreen';
      }
    }

    return isActiveScreen;
  }

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
            ],
          },
          {
            name: 'Автомобиль',
            fields: [
              {
                name: 'CARNAME',
                type: 'input',
                label: 'Марка и модель',
                value: this.props.carName,
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
                  required: true,
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
                    label: 'Выберите год выпуска...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  Icon: () => {
                    return (
                      <Icon
                        type="MaterialIcons"
                        name="date-range"
                        size={24}
                        color="gray"
                      />
                    );
                  },
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
                      label: 'Дизель',
                      value: 2,
                      key: 2,
                    },
                    {
                      label: 'Гибрид',
                      value: 3,
                      key: 3,
                    },
                  ],
                  placeholder: {
                    label: 'Укажите тип двигателя...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  Icon: () => {
                    return (
                      <Icon
                        type="MaterialCommunityIcons"
                        name="engine"
                        size={24}
                        color="gray"
                      />
                    );
                  },
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
                      label: 'Автоматическая',
                      value: 1,
                      key: 1,
                    },
                    {
                      label: 'Механическая',
                      value: 2,
                      key: 2,
                    },
                  ],
                  placeholder: {
                    label: 'Выберите коробку передач...',
                    value: null,
                    color: '#9EA0A4',
                  },
                  Icon: () => {
                    return (
                      <Icon
                        type="FontAwesome"
                        name="gears"
                        size={24}
                        color="red"
                      />
                    );
                  },
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
          // {
          //   name: 'Фотографии',
          //   fields: [
          //     {
          //       name: 'FOTO',
          //       type: 'component',
          //       label: 'Прикрепите фото',
          //       value: (
          //         <CarCostPhotos
          //           photos={photos}
          //           photosFill={actionFillPhotosCarCost}
          //         />
          //       ),
          //     },
          //   ],
          // },
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
