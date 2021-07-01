/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {store} from '../../core/store';
import {get} from 'lodash';
import {CarCard} from './CarCard';
import {Icon, Button, ActionSheet, Toast} from 'native-base';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';
import orderFunctions from '../../utils/orders';
import {strings} from '../../core/lang/const';

import {actionToggleCar} from '../actions';

const mapDispatchToProps = (dispatch) => {
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
  const navigation = useNavigation();
  const cars = get(store.getState(), 'profile.cars');
  const [loading, setLoading] = useState(false);
  const [carsPanel, setActivePanel] = useState(activePanel);

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

  const _showMenu = (ordersData, item, navigation) => {
    let carName = [item.brand, item.model].join(' ');
    if (item.number) {
      carName += ['-- [' + item.number + ']'].join(' ');
    }
    return ActionSheet.show(
      {
        options: ordersData.BUTTONS,
        cancelButtonIndex: ordersData.CANCEL_INDEX,
        destructiveButtonIndex: ordersData.DESTRUCTIVE_INDEX || null,
        title: carName,
      },
      (buttonIndex) => {
        switch (ordersData.BUTTONS[buttonIndex].id) {
          case 'orderService':
            navigation.navigate('ServiceScreen', {
              car: item,
            });
            break;
          case 'orderParts':
            navigation.navigate('OrderPartsScreen', {
              car: item,
            });
            break;
          case 'carCost':
            navigation.navigate('CarCostScreen', {
              car: item,
            });
            break;
          case 'TOhistory':
            navigation.navigate('TOHistory', {
              car: item,
            });
            break;
          case 'hide':
            setLoading(true);
            actionToggleCar(item, get(store.getState(), 'profile.login.SAP'))
              .then((res) => {
                if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                  setActivePanel('default');
                  setLoading(false);
                  Toast.show({
                    text: strings.UserCars.Notifications.success.statusUpdate,
                    type: 'success',
                    position: 'top',
                  });
                }
              })
              .catch((error) => {
                setLoading(false);
                Toast.show({
                  text: error,
                  type: 'danger',
                  position: 'top',
                });
              });
            break;
        }
      },
    );
  };

  const _renderCarsItems = ({cars, navigation}) => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}
        ref={carsScrollView}>
        {cars.map((item) => {
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
                  orderFunctions.getOrders('car').then((ordersData) => {
                    return _showMenu(ordersData, item, navigation);
                  });
                } else {
                  orderFunctions.getCarMenu().then((data) => {
                    return _showMenu(
                      data[CarType][Platform.OS],
                      item,
                      navigation,
                    );
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
  cars.map((item) => {
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
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
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
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
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
        </View>
      </View>
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
          <Icon type="MaterialCommunityIcons" name="car-off" fontSize={20} />
          <Text style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
            {strings.UserCars.empty.text + '\r\n'}
          </Text>
          <Button
            full
            bordered
            style={{borderRadius: 5}}
            onPress={() => setActivePanel('hidden')}>
            <Text style={{padding: 5}}>{strings.UserCars.archiveCheck}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

UserCars.defaultProps = {
  activePanel: 'default',
};

export default connect(null, mapDispatchToProps)(UserCars);
