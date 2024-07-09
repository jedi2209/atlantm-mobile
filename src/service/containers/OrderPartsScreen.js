/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {get, orderBy} from 'lodash';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import {Icon, Button, useToast} from 'native-base';
import Form from '../../core/components/Form/Form';
import {CarCard} from '../../profile/components/CarCard';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import {connect} from 'react-redux';
import {orderParts} from '../actions';
import {localDealerClear} from '../../dealer/actions';
import {localUserDataUpdate} from '../../profile/actions';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import UserData from '../../utils/user';
import {ERROR_NETWORK} from '../../core/const';
import {PARTS_ORDER__SUCCESS, PARTS_ORDER__FAIL} from '../actionTypes';
import {strings} from '../../core/lang/const';
import LogoLoader from '../../core/components/LogoLoader';
import dealerProcess from '../../utils/dealer-process';

const mapStateToProps = ({dealer, profile, nav}) => {
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
    dealerSelected: dealer.selected,
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
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  orderParts,
  localDealerClear,
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

const OrderPartsScreen = props => {
  const {
    localDealerClear,
    dealerSelected,
    dealerSelectedLocal,
    cars,
    navigation,
    route,
    allDealers,
  } = props;

  const dealer = get(route, 'params.dealerCustom', dealerSelectedLocal);
  const toast = useToast();

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [carSelected, setCar] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [myCars, setMyCars] = useState([]);

  let isHaveCar = false;

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

  useEffect(() => {
    let myCarsTmp = [];
    props.cars.map(item => {
      if (!item.hidden) {
        myCarsTmp.push(item);
      }
    });
    if (myCarsTmp.length) {
      setMyCars(myCarsTmp);
    }

    const carFromNavigation = get(props.route, 'params.car');

    if (carFromNavigation && get(carFromNavigation, 'vin')) {
      setCar({
        carBrand: get(carFromNavigation, 'brand'),
        carModel: get(carFromNavigation, 'model.name', 'model'),
        carName: [
          get(carFromNavigation, 'brand'),
          get(carFromNavigation, 'model.name', 'model'),
        ].join(' '),
        carVIN: carFromNavigation.vin,
      });
    }

    if (myCars.length === 1) {
      setCar({
        carBrand: myCars[0]?.brand,
        carModel: myCars[0]?.model,
        carName: [myCars[0]?.brand, myCars[0]?.model].join(' '),
        carVIN: myCars[0]?.vin,
      });
    }
    return () => {
      localDealerClear();
    };
  }, [localDealerClear, props.route]);

  if (get(props, 'cars.length')) {
    isHaveCar = true;
  }

  useEffect(() => {
    setDealerSelectedLocal(dealerSelectedLocal);
  }, [dealerSelectedLocal]);

  let dealerField = dealerProcess({
    dealer,
    listDealers,
    dealerSelectedLocal,
    allDealers,
    route,
    dealerFilter: 'ZZ',
  });

  const formConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [dealerField],
      },
      {
        name: strings.Form.group.part,
        fields: [
          {
            name: 'PART',
            type: 'textarea',
            label: strings.Form.field.label.part,
            value: props.Part,
            props: {
              placeholder: strings.Form.field.placeholder.part,
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
                            style={{
                              zIndex: 15,
                            }}
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
                                checked={carSelected?.carVIN === item.vin}
                                onPress={() => {
                                  _selectCar(item);
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
                          navigation.navigate('Profile', {
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

  const _selectCar = item => {
    const carModel = get(item, 'model.name', get(item, 'model', ''));
    setCar({
      carBrand: item?.brand,
      carModel,
      carName: [item?.brand, carModel].join(' '),
      carVIN: item?.vin,
    });
  };

  const _onPressOrder = async dataFromForm => {
    const isInternet = require('../../utils/internet').default;
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      toast.show({
        title: ERROR_NETWORK,
        status: 'warning',
        duration: 2000,
        id: 'networkError',
      });
      return;
    }
    const {navigation, localUserDataUpdate} = props;

    if (!dataFromForm.CARBRAND && carSelected?.carBrand) {
      dataFromForm.CARBRAND = carSelected?.carBrand;
    }
    if (!dataFromForm.CARMODEL && carSelected?.carModel) {
      dataFromForm.CARMODEL = carSelected?.carModel;
    }
    if (!dataFromForm.CAR && carSelected?.carName) {
      dataFromForm.CAR = carSelected?.carName;
    }
    if (!dataFromForm.CARVIN && carSelected?.carVIN) {
      dataFromForm.CARVIN = carSelected?.carVIN;
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

    const actionID = get(props.route, 'params.actionID');

    const dataToSend = {
      car: get(dataFromForm, 'CARNAME', ''),
      brand: get(dataFromForm, 'CARBRAND', ''),
      model: get(
        dataFromForm,
        'CARMODEL.name',
        get(dataFromForm, 'CARMODEL', ''),
      ),
      vin: get(dataFromForm, 'CARVIN', ''),
      firstName: get(dataFromForm, 'NAME', ''),
      secondName: get(dataFromForm, 'SECOND_NAME', ''),
      lastName: get(dataFromForm, 'LAST_NAME', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      text: get(dataFromForm, 'COMMENT', ''),
      part: get(dataFromForm, 'PART', ''),
      dealerID,
      actionID,
    };

    try {
      setLoading(true);

      const action = await props.orderParts(dataToSend);

      if (action && action.type) {
        switch (action.type) {
          case PARTS_ORDER__SUCCESS:
            Analytics.logEvent('order', 'parts');
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
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            );
            break;
          case PARTS_ORDER__FAIL:
            toast.show({
              title: strings.Notifications.error.title,
            });
            break;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('await orderParts(dataToSend)', error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LogoLoader />;
  }

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key={'OrderPartsForm'}
      fields={formConfig}
      barStyle={'light-content'}
      SubmitButton={{text: strings.Form.button.send}}
      onSubmit={_onPressOrder}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPartsScreen);
