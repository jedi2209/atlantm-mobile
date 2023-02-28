import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import CarCostPhotos from '../components/CarCostPhotos';
import {Icon, Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  addDays,
  dayMonthYear,
  yearMonthDay,
  substractYears,
} from '../../../utils/date';
import UserData from '../../../utils/user';
import {CarCard} from '../../../profile/components/CarCard';

import Form from '../../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {actionCarCostOrder} from '../../actions';
import {CAR_COST__SUCCESS, CAR_COST__FAIL} from '../../actionTypes';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get, orderBy, valuesIn} from 'lodash';
import {ERROR_NETWORK} from '../../../core/const';
import isInternet from '../../../utils/internet';

import {strings} from '../../../core/lang/const';

const mapStateToProps = ({dealer, profile, catalog}) => {
  const cars = orderBy(profile.cars, ['owner'], ['desc']);
  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';
  let Cars = [];

  if (cars && typeof cars === 'object') {
    cars.map(item => {
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
    cars: Cars,
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
  actionCarCostOrder,
};

const styles = StyleSheet.create({
  carContainer: {
    marginLeft: -16,
    marginRight: -16,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginVertical: 0,
  },
});

const CarCostScreen = ({
  dealerSelected,
  dealerSelectedLocal,
  firstName,
  secondName,
  lastName,
  phone,
  email,
  carBrand,
  carModel,
  carName,
  carNumber,
  carVIN,
  cars,
  myCars,
  navigation,
  route,
}) => {
  const [carSelected, setCarData] = useState({
    carBrand,
    carModel,
    carName,
    carNumber,
    carMileage: null,
    carVIN,
    carYear: null,
    carEngineType: null,
    carEngineVolume: null,
    carGearboxType: null,
    carWheelType: null,
  });

  const [photos, setPhotos] = useState([]);
  const [userComment, setUserComment] = useState('');

  const [FormConfig, setFormConfig] = useState({});

  useEffect(() => {
    console.info('== CarCost ==');
    Analytics.logEvent('screen', 'catalog/carcost');

    if (cars.length === 1) {
      _selectCar(cars[0]);
    }
  }, []);

  useEffect(() => {
    const carFromNavigation = get(route, 'params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      _selectCar(carFromNavigation);
    }
    const userTextFromNavigation = get(route, 'params.Text');
    if (userTextFromNavigation) {
      setUserComment(userTextFromNavigation);
    }
  }, [route]);

  useEffect(() => {
    setFormConfig({
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
                  dealerSelectedLocal && dealerSelectedLocal.id
                    ? dealerSelectedLocal
                    : dealerSelected,
                props: {
                  goBack: false,
                  isLocal: true,
                  returnScreen: navigation.state?.routeName,
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
            fields: _getCars(),
          },
          {
            name: strings.Form.group.contacts,
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: strings.Form.field.label.name,
                value: firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: strings.Form.field.label.secondName,
                value: secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: strings.Form.field.label.lastName,
                value: lastName,
                props: {
                  textContentType: 'familyName',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: strings.Form.field.label.phone,
                value: phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: strings.Form.field.label.email,
                value: email,
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
                    photos={photos}
                    photosFill={photos => {
                      setPhotos(photos);
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
                value: userComment,
                props: {
                  placeholder: strings.Form.field.placeholder.comment,
                },
              },
            ],
          },
        ],
      },
    });
  }, [carSelected, photos]);

  const _selectCar = item => {
    setCarData({
      carBrand: get(item, 'brand'),
      carModel: get(item, 'model'),
      carNumber: get(item, 'number'),
      carMileage: get(item, 'mileage', null),
      carName: [get(item, 'brand'), get(item, 'model')].join(' '),
      carVIN: get(item, 'vin', null),
      carYear: get(item, 'year', null),
    });
  };

  const _onPressOrder = async dataFromForm => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const photoForUpload = valuesIn(photos);

      const dataToSend = {
        dealerId: dealerSelected.id,
        date: yearMonthDay(dataFromForm.DATE) || '',
        firstName: dataFromForm.NAME || '',
        secondName: dataFromForm.SECOND_NAME || '',
        lastName: dataFromForm.LAST_NAME || '',
        phone: dataFromForm.PHONE || '',
        email: dataFromForm.EMAIL || '',
        comment: dataFromForm.COMMENT || '',
        vin: dataFromForm.CARVIN || carSelected.carVIN || '',
        brand: dataFromForm.CARBRAND || carSelected.carBrand || '--',
        model: dataFromForm.CARMODEL || carSelected.carModel || '--',
        year: dataFromForm.CARYEAR || carSelected.carYear || '',
        photos: photoForUpload,
        mileage: dataFromForm.CARMILEAGE || carSelected.carMileage || '',
        mileageUnit: 'км',
        engineVolume: dataFromForm.CARENGINEVOLUME || '',
        engineType: dataFromForm.CARENGINETYPE || '',
        gearbox: dataFromForm.CARGEARBOXTYPE || '',
        wheel: dataFromForm.CARWHEELTYPE || '',
      };

      const action = await actionCarCostOrder(dataToSend);
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

  const _getCars = () => {
    if (cars && cars.length) {
      return [
        {
          name: 'CARNAME',
          type: 'component',
          label: strings.Form.field.label.car2,
          value:
            cars && cars.length ? (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.carContainer}
                contentContainerStyle={styles.carContainerContent}>
                {(cars || []).map(item => {
                  return (
                    <TouchableWithoutFeedback
                      activeOpacity={0.7}
                      key={item.vin}
                      onPress={() => {
                        _selectCar(item);
                      }}>
                      <View>
                        <CarCard
                          key={item.vin}
                          data={item}
                          type="check"
                          checked={carSelected.carVIN === item.vin}
                          onPress={() => {
                            return _selectCar(item);
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.scrollViewInner,
                  {
                    flex: 1,
                    paddingLeft: 24,
                    paddingRight: 5,
                    marginVertical: 29.5,
                    textAlign: 'center',
                    alignContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                  },
                ]}
                useNativeDriver>
                <Icon
                  size={20}
                  as={MaterialCommunityIcons}
                  name="car-off"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  style={styles.point}
                />
                <Text
                  style={{
                    marginTop: 5,
                    marginLeft: 10,
                    lineHeight: 20,
                  }}>
                  {strings.UserCars.empty.text + '\r\n'}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  style={{borderRadius: 5}}
                  _text={{padding: 5}}
                  onPress={() => {
                    navigation.navigate('About', {
                      screen: 'LoginScreen',
                      activePanel: 'hidden',
                    });
                  }}>
                  {strings.UserCars.archiveCheck}
                </Button>
              </View>
            ),
        },
        {
          name: 'CARMILEAGE',
          type: 'input',
          label: strings.Form.field.label.carMileage,
          value: carSelected.carMileage,
          props: {
            keyboardType: 'numeric',
            required: true,
            placeholder: null,
            onSubmitEditing: () => {},
            returnKeyType: 'done',
            blurOnSubmit: true,
          },
        },
      ];
    } else {
      return [
        {
          name: 'CARBRAND',
          type: 'input',
          label: strings.Form.field.label.carBrand,
          value: carSelected.carBrand,
          props: {
            required: true,
            placeholder: null,
          },
        },
        {
          name: 'CARMODEL',
          type: 'input',
          label: strings.Form.field.label.carModel,
          value: carSelected.carModel,
          props: {
            required: true,
            placeholder: null,
          },
        },
        {
          name: 'CARVIN',
          type: 'input',
          label: strings.Form.field.label.carVIN,
          value: carSelected.carVIN,
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
          value: carSelected.carYear,
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
          value: carSelected.carMileage,
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
          value: carSelected.carEngineType,
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
          value: carSelected.carEngineVolume,
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
          value: carSelected.carGearboxType,
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
        {
          name: 'CARWHEELTYPE',
          type: 'select',
          label: strings.Form.field.label.wheel,
          value: carSelected.carWheelType,
          props: {
            items: [
              {
                label: strings.CarParams.wheels[1],
                value: 1,
                key: 1,
              },
              {
                label: strings.CarParams.wheels[3],
                value: 3,
                key: 3,
              },
              {
                label: strings.CarParams.wheels[4],
                value: 4,
                key: 4,
              },
            ],
            placeholder: {
              label: strings.Form.field.placeholder.wheel,
              value: null,
              color: '#9EA0A4',
            },
          },
        },
      ];
    }
  };

  if (!FormConfig || !FormConfig?.fields) {
    return <></>;
  }

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
      }}
      key="CarCostForm"
      fields={FormConfig.fields}
      barStyle={'light-content'}
      SubmitButton={{text: strings.Form.button.send}}
      onSubmit={_onPressOrder}
    />
  );
};

CarCostScreen.propTypes = {
  dealerSelected: PropTypes.object,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CarCostScreen);
