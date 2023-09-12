/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {get, orderBy} from 'lodash';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import {Icon, Button, Toast} from 'native-base';
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
import moment from 'moment';
import LogoLoader from '../../core/components/LogoLoader';

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

let isInternet = null;

const OrderPartsScreen = props => {
  const {localDealerClear, dealerSelected, dealerSelectedLocal, cars} = props;

  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);
  const [carSelected, setCar] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [myCars, setMyCars] = useState([]);

  let isHaveCar = false;

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

    const dealerFromNavigation = get(props.route, 'params.dealer');
    if (dealerFromNavigation) {
      setDealerSelectedLocal(dealerFromNavigation);
    } else {
      setDealerSelectedLocal(
        dealerSelectedLocal ? dealerSelectedLocal : dealerSelected,
      );
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

  if (get(props, 'cars')) {
    isHaveCar = true;
  }

  useEffect(() => {
    setDealerSelectedLocal(props.dealerSelectedLocal);
  }, [props.dealerSelectedLocal]);

  const formConfig = {
    groups: [
      {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'dealerSelect',
            label: strings.Form.field.label.dealer,
            value: dealerSelectedLocalState,
            props: {
              goBack: true,
              isLocal: true,
              showBrands: false,
              required: true,
              dealerFilter: {
                type: 'ZZ',
              },
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
                        size="full"
                        full
                        variant="outline"
                        rounded={'lg'}
                        onPress={() => {
                          props.navigation.navigate('About', {
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
    const {navigation, localUserDataUpdate} = props;

    if (!dataFromForm.CARBRAND && carSelected.carBrand) {
      dataFromForm.CARBRAND = carSelected.carBrand;
    }
    if (!dataFromForm.CARMODEL && carSelected.carModel) {
      dataFromForm.CARMODEL = carSelected.carModel;
    }
    if (!dataFromForm.CAR && carSelected.carName) {
      dataFromForm.CAR = carSelected.carName;
    }
    if (!dataFromForm.CARVIN && carSelected.carVIN) {
      dataFromForm.CARVIN = carSelected.carVIN;
    }

    if (isInternet == null) {
      isInternet = require('../../utils/internet').default;
    }

    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      Toast.show({
        title: ERROR_NETWORK,
      });
    }

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    let dealerID = dataFromForm.DEALER.id;

    if (dealerSelectedLocalState) {
      dealerID = dealerSelectedLocalState.id;
    }
    const actionID = get(props.route, 'params.actionID');

    const dataToSend = {
      car: get(dataFromForm, 'CARNAME', ''),
      brand: get(dataFromForm, 'CARBRAND', ''),
      model: get(dataFromForm, 'CARMODEL.name', 'CARMODEL'),
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
            Toast.show({
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

OrderPartsScreen.propTypes = {
  dealerSelected: PropTypes.object,
  localUserDataUpdate: PropTypes.func,
  isOrderServiceRequest: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPartsScreen);
