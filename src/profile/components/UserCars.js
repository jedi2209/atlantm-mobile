/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {store} from '../../core/store';
import {get} from 'lodash';
import {CarCard} from './CarCard';
import {
  Icon,
  Button,
  HStack,
  Actionsheet,
  Box,
  Text,
  useToast,
} from 'native-base';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToastAlert from '../../core/components/ToastAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';
import orderFunctions from '../../utils/orders';
import {strings} from '../../core/lang/const';

import {actionToggleCar} from '../actions';

const mapDispatchToProps = dispatch => {
  return {
    actionToggleCar: (item, id) => {
      return dispatch(actionToggleCar(item, id));
    },
  };
};

const styles = StyleSheet.create({
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  carChooseText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    color: styleConst.color.greyText,
  },
  carChooseTextSelected: {
    textDecorationLine: 'none',
    color: 'black',
  },
});

let UserCars = ({actionToggleCar, activePanel}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const cars = get(store.getState(), 'profile.cars');
  const [loading, setLoading] = useState(false);
  const [carsPanel, setActivePanel] = useState(activePanel);

  const [actionSheetStatus, setActionSheetStatus] = useState(false);
  const [actionSheetData, setActionSheetData] = useState({});

  let carsScrollView = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      carsScrollView &&
        carsScrollView.current &&
        carsScrollView.current.scrollToEnd({duration: 500});
    }, 2000);
    setTimeout(() => {
      carsScrollView &&
        carsScrollView.current &&
        carsScrollView.current.scrollTo({x: 0, y: 0, animated: true});
    }, 2500);
  }, []);

  const ActionSheetMenu = () => {
    if (!actionSheetData || !actionSheetData['options']) {
      return <></>;
    }
    return (
      <Actionsheet
        hideDragIndicator
        size="full"
        isOpen={actionSheetStatus}
        onClose={() => {
          setActionSheetStatus(false);
        }}>
        <Actionsheet.Content>
          <Box w="100%" my={4} px={4} justifyContent="space-between">
            <Text
              fontSize="xl"
              color="gray.500"
              _dark={{
                color: 'gray.500',
              }}>
              {actionSheetData.title}
            </Text>
          </Box>
          {actionSheetData.options.map(el => {
            switch (el.id) {
              case 'orderService':
                el.navigate = {
                  screen: 'ServiceScreen',
                  params: {
                    car: actionSheetData.item,
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
                    car: actionSheetData.item,
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
                    car: actionSheetData.item,
                  },
                };
                break;
              case 'carCost':
                el.navigate = {
                  screen: 'CarCostScreen',
                  params: {
                    car: actionSheetData.item,
                  },
                };
                break;
              case 'TOhistory':
                el.navigate = {
                  screen: 'TOHistory',
                  params: {
                    car: actionSheetData.item,
                  },
                };
                break;
              case 'hide':
                el.action = () => {
                  setLoading(true);
                  actionToggleCar(
                    actionSheetData.item,
                    get(store.getState(), 'profile.login.SAP'),
                  )
                    .then(res => {
                      if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                        setActivePanel('default');
                        setLoading(false);
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
                                  title="Ошибка"
                                />
                              );
                            },
                          });
                        }
                      }
                    })
                    .catch(error => {
                      setLoading(false);
                      {
                        toast.show({
                          render: ({id}) => {
                            return (
                              <ToastAlert
                                id={id}
                                description={error}
                                title="Ошибка"
                              />
                            );
                          },
                        });
                      }
                    });
                };
                break;
            }
            return (
              <Actionsheet.Item
                onPress={() => {
                  setActionSheetStatus(false);
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
                startIcon={
                  <Icon
                    as={Ionicons}
                    color={el.iconColor}
                    mr="1"
                    size={6}
                    name={el.icon}
                  />
                }>
                {el.text}
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    );
  };

  const _renderCarsItems = ({cars}) => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}
        ref={carsScrollView}>
        {cars.map(item => {
          let carName = [item.brand, item.model].join(' ');
          if (item.number) {
            carName += ['-- [' + item.number + ']'].join(' ');
          }
          let CarType = '';
          if (item.hidden === true) {
            CarType = 'hidden';
          } else {
            CarType = 'active';
          }
          return (
            <TouchableOpacity
              activeOpacity={1}
              key={item.vin}
              onPress={() => {
                if (CarType === 'active') {
                  orderFunctions.getOrders('car').then(ordersData => {
                    setActionSheetData({
                      options: ordersData.BUTTONS,
                      cancelButtonIndex: ordersData.CANCEL_INDEX,
                      title: carName,
                      destructiveButtonIndex:
                        ordersData.DESTRUCTIVE_INDEX || null,
                      item,
                    });
                    setActionSheetStatus(true);
                  });
                } else {
                  orderFunctions.getArchieveCarMenu().then(data => {
                    setActionSheetData({
                      options: data[CarType][Platform.OS].BUTTONS,
                      cancelButtonIndex:
                        data[CarType][Platform.OS].CANCEL_INDEX,
                      title: carName,
                      destructiveButtonIndex:
                        data[CarType][Platform.OS].DESTRUCTIVE_INDEX || null,
                      item,
                    });
                    setActionSheetStatus(true);
                  });
                }
              }}>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <CarCard data={item} type="profile" />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  let myCars = {
    default: [],
    hidden: [],
    owner: [],
  };
  cars.map(item => {
    if (item.hidden) {
      myCars.hidden.push(item);
    } else {
      myCars.default.push(item);
    }
    if (item.owner) {
      myCars.owner.push(item);
    }
  });
  if (myCars.hidden.length) {
    myCars.hidden.sort((a, b) => b.owner - a.owner);
  }
  if (myCars.default.length) {
    myCars.default.sort((a, b) => b.owner - a.owner);
  }
  return (
    <>
      <HStack
        style={{
          marginHorizontal: 20,
          marginTop: 10,
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: styleConst.color.greyText4,
            }}>
            {strings.UserCars.title}
          </Text>
        </View>
        <HStack
          style={{
            flex: 0.5,
          }}>
          {myCars.default.length > 0 ? (
            <TouchableOpacity
              style={{
                flex: myCars.hidden.length ? 0.6 : 1,
              }}
              onPress={() => {
                setActivePanel('default');
              }}>
              <Text
                selectable={false}
                style={[
                  styles.carChooseText,
                  carsPanel === 'default' ? styles.carChooseTextSelected : null,
                  {
                    marginRight: 5,
                  },
                ]}>
                {strings.UserCars.current}
              </Text>
            </TouchableOpacity>
          ) : null}
          {myCars.hidden.length > 0 ? (
            <TouchableOpacity
              style={{
                flex: myCars.default.length ? 0.4 : 1,
              }}
              onPress={() => {
                setActivePanel('hidden');
              }}>
              <Text
                selectable={false}
                style={[
                  styles.carChooseText,
                  carsPanel === 'hidden' ? styles.carChooseTextSelected : null,
                ]}>
                {strings.UserCars.archive}
              </Text>
            </TouchableOpacity>
          ) : null}
        </HStack>
      </HStack>
      {loading ? (
        <ActivityIndicator
          color="#0061ED"
          style={{
            alignSelf: 'center',
            marginTop: verticalScale(56),
            marginBottom: verticalScale(55),
          }}
        />
      ) : myCars[carsPanel].length > 0 ? (
        _renderCarsItems({
          cars: myCars[carsPanel],
          navigation: navigation,
        })
      ) : (
        <View
          style={[
            styles.scrollViewInner,
            {
              flex: 1,
              paddingHorizontal: 24,
              marginVertical: 29.5,
              textAlign: 'center',
              alignContent: 'center',
              width: '100%',
              alignItems: 'center',
            },
          ]}
          useNativeDriver>
          <Icon as={MaterialCommunityIcons} name="car-off" size={12} />
          <Text style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
            {strings.UserCars.empty.text + '\r\n'}
          </Text>
          <Button
            variant="outline"
            _text={{padding: 1}}
            onPress={() => setActivePanel('hidden')}>
            {strings.UserCars.archiveCheck}
          </Button>
        </View>
      )}
      <ActionSheetMenu />
    </>
  );
};

UserCars.defaultProps = {
  activePanel: 'default',
};

export default connect(null, mapDispatchToProps)(UserCars);
