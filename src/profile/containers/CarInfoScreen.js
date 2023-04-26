import React, {useEffect, useState} from 'react';

import {TouchableHighlight, Platform, ActivityIndicator} from 'react-native';

import {connect} from 'react-redux';
import {get} from 'lodash';
import {store} from '../../core/store';
import {
  Box,
  Heading,
  Icon,
  View,
  Text,
  Pressable,
  HStack,
  ScrollView,
  useToast,
} from 'native-base';

import Clipboard from '@react-native-clipboard/clipboard';
import ToastAlert from '../../core/components/ToastAlert';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';

import {format} from '../../utils/date';
import numberWithGap from '../../utils/number-with-gap';
import {verticalScale} from '../../utils/scale';

import orderFunctions from '../../utils/orders';

import {actionToggleCar} from '../actions';
import LogoLoader from '../../core/components/LogoLoader';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    car: profile.car,
    carNumber: profile.carNumber,
    cars: profile.cars,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actionToggleCar: (item, id) => {
      return dispatch(actionToggleCar(item, id));
    },
  };
};

const CarInfoScreen = props => {
  const {navigation} = props;
  const toast = useToast();
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (name, string) => {
    Clipboard.setString(string);
    toast.show({
      title: strings.Notifications.success.copy,
      description: [string].join(': '),
      duration: 1500,
      placement: 'bottom',
    });
  };

  const car = get(props, 'route.params.car', get(props, 'cars[0]'));

  const carBrandName = get(car, 'brand', null);
  let carModelName = get(car, 'model', null);

  // if (
  //   carModelName === 'null' ||
  //   carModelName === null ||
  //   carModelName === 'false' ||
  //   carModelName === false ||
  //   carModelName === 'undefined' ||
  //   carModelName === undefined ||
  //   typeof carModelName === 'undefined'
  // ) {
  //   carModelName = get(car, 'model');
  // }

  if (typeof carModelName === 'object') {
    carModelName = get(carModelName, 'name');
  }

  let carData = [];
  carData.push({
    name: 'VIN',
    value: get(car, 'vin', null),
    copyAvailable: true,
  });
  carData.push({
    name: strings.Form.field.label.carNumber,
    value: get(car, 'number', null),
    copyAvailable: true,
  });
  // carData.push({name: strings.Form.field.label.carBrand, value: carBrandName});
  // carData.push({name: strings.Form.field.label.carModel, value: carModelName});
  if (get(car, 'carInfo.year')) {
    carData.push({
      name: strings.Form.field.label.carYear,
      value: format(get(car, 'carInfo.year') + '-01-02', 'YYYY'),
      copyAvailable: true,
    });
  }
  carData.push({
    name: strings.Form.field.label.carMileage,
    value: numberWithGap(get(car, 'mileage', null)),
    copyAvailable: true,
  });

  carData = carData.filter(function (el) {
    return el.value != null && el.value !== 0;
  });

  let carName = [carBrandName, carModelName].join(' ');

  let carType;

  if (car.hidden === true) {
    carType = 'hidden';
  } else {
    carType = 'active';
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: get(
          car,
          'carInfo.color.picker.codes.hex',
          styleConst.color.bg,
        ),
      },
    });
    setLoading(false);
  }, [car, navigation]);

  useEffect(() => {
    if (carType === 'active') {
      orderFunctions.getOrders('car').then(data => {
        let ordersDataTmp = [];
        data?.BUTTONS.map((el, indx) => {
          if (el.id !== 'cancel') {
            ordersDataTmp.push(el);
          }
        });
        setOrdersData(ordersDataTmp);
      });
    } else {
      orderFunctions.getArchieveCarMenu().then(data => {
        let ordersDataTmp = [];
        data[carType][Platform.OS]?.BUTTONS.map((el, indx) => {
          if (el.id !== 'cancel') {
            ordersDataTmp.push(el);
          }
        });
        setOrdersData(ordersDataTmp);
      });
    }
  }, [carType]);

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <Box
      backgroundColor={'white'}
      flex={1}
      bg={{
        linearGradient: {
          colors: [
            'coolGray.200',
            get(car, 'carInfo.color.picker.codes.hex', 'coolGray.300'),
            'coolGray.200',
          ],
          start: [1, 1],
          end: [0, 0],
          locations: [0.09, 0.8, 0.6],
        },
      }}>
      <Box alignItems={'center'}>
        <Icon
          name="car"
          size={32}
          marginY={2}
          as={Fontisto}
          color={styleConst.color.white}
        />
      </Box>
      <ScrollView>
        <Box
          marginX={'5%'}
          paddingX={'5%'}
          shadow={6}
          marginY={2}
          background={'gray.100'}
          rounded={'lg'}>
          <Heading mt={1}>{carName}</Heading>
          {carData.map((el, indx) => {
            return (
              <TouchableHighlight
                key={'val' + el.value}
                underlayColor={'gray.300'}
                onPress={() => {
                  if (!el.copyAvailable) {
                    return;
                  }
                  copyToClipboard(el.name, el.value);
                }}>
                <View marginY={1} paddingY={2}>
                  <Text fontSize={'sm'} color={styleConst.color.greyText7}>
                    {el.name}
                  </Text>
                  <HStack>
                    <Text fontSize={'md'} color={styleConst.color.greyText4}>
                      {el.value}
                    </Text>
                    {el.copyAvailable ? (
                      <Icon
                        name="copy"
                        as={Feather}
                        ml={3}
                        mt={1}
                        color={'gray.300'}
                      />
                    ) : null}
                  </HStack>
                </View>
              </TouchableHighlight>
            );
          })}
        </Box>
        <HStack flexWrap={'wrap'} marginLeft={'5%'}>
          {ordersData.map(el => {
            return (
              <Pressable
                key={'ordersButtons' + el.id}
                backgroundColor={styleConst.color.white}
                onPress={() => {
                  switch (el.id) {
                    case 'orderService':
                      el.navigate = {
                        screen: 'ServiceScreen',
                        params: {
                          car: car,
                          settings: {
                            disableDealer: true,
                            disableCarBlock: true,
                          },
                        },
                      };
                      break;
                    case 'TOCalculator':
                      el.navigate = {
                        screen: 'ServiceTOCalculatorScreen',
                        params: {
                          car: car,
                          settings: {
                            disableDealer: true,
                            disableCarBlock: true,
                            submitButtonText: strings.ServiceScreen.title,
                            returnOnFailFetchServices: true,
                          },
                        },
                      };
                      break;
                    case 'orderParts':
                      el.navigate = {
                        screen: 'OrderPartsScreen',
                        params: {
                          car: car,
                        },
                      };
                      break;
                    case 'carCost':
                      el.navigate = {
                        screen: 'CarCostScreen',
                        params: {
                          car: car,
                        },
                      };
                      break;
                    case 'TOhistory':
                      el.navigate = {
                        screen: 'TOHistory',
                        params: {
                          car: car,
                        },
                      };
                      break;
                    case 'hide':
                      el.action = () => {
                        setLoading(true);
                        props
                          .actionToggleCar(
                            car,
                            get(store.getState(), 'profile.login.SAP'),
                          )
                          .then(res => {
                            if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                              {
                                toast.show({
                                  render: ({id}) => {
                                    return (
                                      <ToastAlert
                                        id={id}
                                        status={'success'}
                                        isClosable={false}
                                        description={
                                          strings.UserCars.Notifications.success
                                            .statusUpdate
                                        }
                                        title={
                                          strings.Notifications.success.title
                                        }
                                      />
                                    );
                                  },
                                });
                              }
                            }
                            setLoading(false);
                            navigation.navigate('LoginScreen', {
                              activePanel: 'default',
                            });
                          })
                          .catch(error => {
                            {
                              toast.show({
                                render: ({id}) => {
                                  return (
                                    <ToastAlert
                                      id={id}
                                      description={error}
                                      title={strings.Notifications.error.title2}
                                    />
                                  );
                                },
                              });
                            }
                            setLoading(false);
                          });
                      };
                      break;
                  }
                  if (el.navigate && el.navigate.screen) {
                    navigation.navigate(
                      el.navigate.screen,
                      el.navigate.params ? el.navigate.params : null,
                    );
                  }
                  if (el.action) {
                    el.action();
                  }
                }}
                marginY={4}
                width={'45%'}
                marginRight={4}
                paddingY={2}
                rounded={'lg'}
                shadow={6}
                alignItems={'center'}>
                <Icon
                  as={el.icon?.font ? el.icon?.font : Ionicons}
                  color={el.icon?.color}
                  mr={1}
                  size={12}
                  name={el.icon?.name}
                />
                <Text>{el.text}</Text>
              </Pressable>
            );
          })}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CarInfoScreen);
