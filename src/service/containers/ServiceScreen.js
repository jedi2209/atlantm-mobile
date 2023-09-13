/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, orderBy} from 'lodash';
import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
} from 'react-native';
import {Icon, Button} from 'native-base';
import Form from '../../core/components/Form/Form';
import {CarCard} from '../../profile/components/CarCard';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import {connect} from 'react-redux';
import {orderService} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import {addDays, dayMonthYear, yearMonthDay} from '../../utils/date';
import {ERROR_NETWORK} from '../../core/const';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../actionTypes';
import {strings} from '../../core/lang/const';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  const cars = orderBy(profile.cars, ['owner'], ['desc']);
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
    allDealers: dealer.listDealers,
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
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  orderService,
};

const styles = StyleSheet.create({
  carContainer: {
    marginLeft: -16,
    marginRight: -16,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginVertical: 10,
  },
});

const ServiceScreen = props => {
  const {route, cars, dealerSelectedLocal, navigation, allDealers} = props;

  const [carSelected, selectCar] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const isHaveCar = Boolean(cars.length > 0);
  const dealer = get(route, 'params.dealerCustom', dealerSelectedLocal);
  const isDealerHide = get(route, 'params.dealerHide', true);

  let listDealers = [];
  if (dealer) {
    if (dealer.length) {
      dealer.map(el => {
        if (typeof el === 'string' || typeof el === 'number') {
          el = allDealers[el];
        }
        listDealers.push({
          label: el.name,
          value: el.id,
          key: el.id,
        });
      });
    } else {
      if (typeof dealer == 'object') {
        listDealers.push({
          label: dealer.name,
          value: dealer.id,
          key: dealer.id,
        });
      }
    }
  }

  let myCars = [];
  cars.map(item => {
    if (!item.hidden) {
      myCars.push(item);
    }
  });
  if (myCars.length === 1) {
    selectCar({
      carBrand: myCars[0]?.brand,
      carModel: myCars[0]?.model,
      carName: [myCars[0]?.brand, myCars[0]?.model].join(' '),
      carVIN: myCars[0]?.vin,
    });
  }

  let dealerField = {};
  if (listDealers) {
    if (listDealers.length < 1) {
      dealerField = {
        name: 'DEALER',
        type: 'dealerSelect',
        label: strings.Form.group.dealer,
        value: dealer,
        props: {
          required: true,
          goBack: true,
          isLocal: true,
          showBrands: false,
          readonly: isDealerHide,
          dealerFilter: {
            type: 'ST',
          },
        },
      };
    }
    if (listDealers.length === 1) {
      dealerField = {
        name: 'DEALER',
        type: 'dealerSelect',
        label: strings.Form.group.dealer,
        value: dealerSelectedLocal || allDealers[dealer] || dealer,
        props: {
          required: true,
          goBack: true,
          isLocal: true,
          showBrands: false,
          readonly: isDealerHide,
          dealerFilter: {
            type: 'ST',
          },
        },
      };
    }
    if (listDealers.length > 1) {
      dealerField = {
        name: 'DEALER',
        type: 'select',
        label: strings.Form.field.label.dealer,
        value: null,
        props: {
          items: listDealers,
          required: true,
          placeholder: {
            label: strings.Form.field.placeholder.dealer,
            value: null,
            color: '#9EA0A4',
          },
        },
      };
    }
  }

  useEffect(() => {
    const carFromNavigation = get(route, 'params.car');
    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      selectCar({
        carBrand: get(carFromNavigation, 'brand'),
        carModel: get(carFromNavigation, 'model'),
        carName: [
          get(carFromNavigation, 'brand'),
          get(carFromNavigation, 'model'),
        ].join(' '),
        carVIN: carFromNavigation.vin,
      });
    }
  }, [route]);

  const _onPressOrder = async dataFromForm => {
    const {localUserDataUpdate} = props;

    if (!dataFromForm.CARBRAND && carSelected?.carBrand) {
      dataFromForm.CARBRAND = carSelected?.carBrand;
    }
    if (!dataFromForm.CARMODEL && carSelected?.carModel) {
      dataFromForm.CARMODEL = carSelected?.carModel;
    }
    if (!dataFromForm.CAR && carSelected?.carName) {
      dataFromForm.CAR = carSelected?.carName;
    }

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    const dealerID = get(
      dataFromForm,
      'DEALER.id',
      get(dataFromForm, 'DEALER'),
    );
    const orderDate = yearMonthDay(dataFromForm.DATE);
    const actionID = get(route, 'params.actionID', null);

    const dataToSend = {
      car: get(dataFromForm, 'CARNAME', ''),
      brand: get(dataFromForm, 'CARBRAND', ''),
      model: get(dataFromForm, 'CARMODEL', ''),
      vin: get(dataFromForm, 'CARVIN', carSelected?.carVIN),
      date: orderDate,
      firstName: get(dataFromForm, 'NAME', ''),
      secondName: get(dataFromForm, 'SECOND_NAME', ''),
      lastName: get(dataFromForm, 'LAST_NAME', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      text: get(dataFromForm, 'COMMENT', ''),
      dealerID,
      actionID,
    };
    try {
      setLoading(true);

      const action = await props.orderService(dataToSend);

      if (action && action.type) {
        switch (action.type) {
          case SERVICE_ORDER__SUCCESS:
            Analytics.logEvent('order', 'service');
            localUserDataUpdate({
              NAME: dataFromForm.NAME,
              SECOND_NAME: dataFromForm.SECOND_NAME,
              LAST_NAME: dataFromForm.LAST_NAME,
              PHONE: dataFromForm.PHONE,
              EMAIL: dataFromForm.EMAIL,
              CARNAME: dataFromForm.CARNAME,
              CARBRAND: dataFromForm.CARBRAND,
              CARMODEL: dataFromForm.CARMODEL,
              CARVIN: dataFromForm.CARVIN,
            });
            Alert.alert(
              strings.Notifications.success.title,
              strings.Notifications.success.text,
              [
                {
                  text: 'ОК',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            );
            setLoading(false);
            setSuccess(true);
            break;
          case SERVICE_ORDER__FAIL:
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            );
            break;
        }
      }
    } catch (error) {}
  };

  const FormConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [
          dealerField,
          {
            name: 'DATE',
            type: 'date',
            label: strings.Form.field.label.date,
            value: null,
            props: {
              placeholder:
                strings.Form.field.placeholder.date + dayMonthYear(addDays(2)),
              required: true,
              minimumDate: new Date(addDays(2)),
              maximumDate: new Date(addDays(62)),
            },
          },
        ],
      },
      {
        name: strings.Form.group.car,
        fields: isHaveCar
          ? [
              {
                name: 'CARNAME',
                type: 'component',
                label: strings.Form.field.label.car2,
                value:
                  myCars && myCars.length ? (
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      style={styles.carContainer}
                      contentContainerStyle={styles.carContainerContent}>
                      {(myCars || []).map(item => {
                        return (
                          <TouchableWithoutFeedback
                            activeOpacity={0.7}
                            key={item.vin}
                            onPress={() => {
                              selectCar({
                                carBrand: item.brand,
                                carModel: item.model,
                                carName: [item.brand, item.model].join(' '),
                                carVIN: item.vin,
                              });
                            }}>
                            <View>
                              <CarCard
                                key={item.vin}
                                data={item}
                                type="check"
                                checked={carSelected?.carVIN === item.vin}
                                onPress={() => {
                                  selectCar({
                                    carBrand: item.brand,
                                    carModel: item.model,
                                    carName: [item.brand, item.model].join(' '),
                                    carVIN: item.vin,
                                  });
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
                        as={MaterialCommunityIcons}
                        name="car-off"
                        fontSize={20}
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
                        variant="outline"
                        rounded={'lg'}
                        _text={{padding: 1}}
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
            ]
          : [
              {
                name: 'CARBRAND',
                type: 'input',
                label: strings.Form.field.label.carBrand,
                value: props.carBrand,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARMODEL',
                type: 'input',
                label: strings.Form.field.label.carModel,
                value: props.carModel,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              {
                name: 'CARVIN',
                type: 'input',
                label: strings.Form.field.label.carVIN,
                value: props.carVIN,
                props: {
                  placeholder: null,
                  autoCapitalize: 'characters',
                  onSubmitEditing: () => {},
                  returnKeyType: 'done',
                  blurOnSubmit: true,
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
            value: props.firstName,
            props: {
              required: true,
              textContentType: 'name',
            },
          },
          {
            name: 'SECOND_NAME',
            type: 'input',
            label: strings.Form.field.label.secondName,
            value: props.secondName,
            props: {
              textContentType: 'middleName',
            },
          },
          {
            name: 'LAST_NAME',
            type: 'input',
            label: strings.Form.field.label.lastName,
            value: props.lastName,
            props: {
              textContentType: 'familyName',
            },
          },
          {
            name: 'PHONE',
            type: 'phone',
            label: strings.Form.field.label.phone,
            value: props.phone,
            props: {
              required: true,
            },
          },
          {
            name: 'EMAIL',
            type: 'email',
            label: strings.Form.field.label.email,
            value: props.email,
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
            value: props.Text,
            props: {
              placeholder: strings.Form.field.placeholder.comment,
            },
          },
        ],
      },
    ],
  };

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key="ServiceForm"
      fields={FormConfig}
      barStyle={'light-content'}
      SubmitButton={{text: strings.Form.button.send}}
      onSubmit={_onPressOrder}
    />
  );
};

ServiceScreen.propTypes = {
  localUserDataUpdate: PropTypes.func,
  isOrderServiceRequest: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
