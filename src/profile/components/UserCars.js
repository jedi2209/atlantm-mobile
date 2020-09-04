/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
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
import {
  Icon,
  Button,
  CheckBox,
  ActionSheet,
  StyleProvider,
  Toast,
} from 'native-base';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';

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

const CarMenu = {
  active: {
    android: {
      BUTTONS: [
        {
          id: 'orderService',
          text: 'Запись на сервис',
          icon: 'construct',
          iconColor: '#2c8ef4',
        },
        {
          id: 'orderParts',
          text: 'Заказать зап.части',
          icon: 'settings',
          iconColor: '#2c8ef4',
        },
        {
          id: 'TOhistory',
          text: 'История обслуживания',
          icon: 'book-outline',
          iconColor: '#2c8ef4',
        },
        {
          id: 'hide',
          text: 'Скрыть в архив',
          icon: 'archive',
          iconColor: '#2c8ef4',
        },
        {
          id: 'cancel',
          text: 'Отмена',
          icon: 'close',
          iconColor: 'red',
        },
      ],
      DESTRUCTIVE_INDEX: 3,
      CANCEL_INDEX: 4,
    },
    ios: {
      BUTTONS: [
        {
          id: 'orderService',
          text: '🛠Запись на сервис',
        },
        {
          id: 'orderParts',
          text: '🔩Заказать зап.части',
        },
        {
          id: 'TOhistory',
          text: '📘История обслуживания',
          icon: 'book-outline',
          iconColor: '#2c8ef4',
        },
        {
          id: 'hide',
          text: '📥Скрыть в архив',
        },
        {
          id: 'cancel',
          text: 'Отмена',
        },
      ],
      DESTRUCTIVE_INDEX: 3,
      CANCEL_INDEX: 4,
    },
  },
  hidden: {
    android: {
      BUTTONS: [
        {
          id: 'TOhistory',
          text: 'История обслуживания',
          icon: 'book-outline',
          iconColor: '#2c8ef4',
        },
        {
          id: 'hide',
          text: 'Сделать текущим',
          icon: 'swap-horizontal',
          iconColor: '#2c8ef4',
        },
        {
          id: 'cancel',
          text: 'Отмена',
          icon: 'close',
          iconColor: 'red',
        },
      ],
      DESTRUCTIVE_INDEX: 1,
      CANCEL_INDEX: 2,
    },
    ios: {
      BUTTONS: [
        {
          id: 'TOhistory',
          text: '📘 История обслуживания',
        },
        {
          id: 'hide',
          text: '📤 Сделать текущим',
        },
        {id: 'cancel', text: 'Отмена'},
      ],
      DESTRUCTIVE_INDEX: 1,
      CANCEL_INDEX: 2,
    },
  },
};

const UserCars = ({navigation, actionToggleCar}) => {
  const cars = get(store.getState(), 'profile.cars');
  const [loading, setLoading] = useState(false);
  const [carsPanel, setActivePanel] = useState('default');

  let carsScrollView = useRef(null);

  useEffect(() => {
    carsScrollView &&
      carsScrollView.current &&
      carsScrollView.current.scrollToEnd({duration: 500});
    setTimeout(() => {
      carsScrollView &&
        carsScrollView.current &&
        carsScrollView.current.scrollTo({x: 0, y: 0, animated: true});
    }, 500);
  }, []);

  const _renderCarsItems = ({cars, actionToggleCar}) => {
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
                let carName = [
                  item.brand,
                  item.model,
                  '-- [' + item.number + ']',
                ].join(' ');
                ActionSheet.show(
                  {
                    options: CarMenu[CarType][Platform.OS].BUTTONS,
                    cancelButtonIndex:
                      CarMenu[CarType][Platform.OS].CANCEL_INDEX,
                    destructiveButtonIndex:
                      CarMenu[CarType][Platform.OS].DESTRUCTIVE_INDEX,
                    title: carName,
                  },
                  (buttonIndex) => {
                    switch (
                      CarMenu[CarType][Platform.OS].BUTTONS[buttonIndex].id
                    ) {
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
                      case 'TOhistory':
                        navigation.navigate('TOHistore', {
                          car: item,
                        });
                        break;
                      case 'hide':
                        setLoading(true);
                        actionToggleCar(
                          item,
                          get(store.getState(), 'profile.login.SAP'),
                        )
                          .then((res) => {
                            console.log('res', res);
                            if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                              setActivePanel('default');
                              setLoading(false);
                              Toast.show({
                                text: 'Статус автомобиля изменён',
                                type: 'success',
                                position: 'bottom',
                              });
                            }
                          })
                          .catch((error) => {
                            console.log('error', error);
                            setLoading(false);
                            Toast.show({
                              text: error,
                              type: 'danger',
                              position: 'bottom',
                            });
                          });
                        break;
                    }
                  },
                );
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
  });
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
            }}>
            Мои автомобили
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
                текущие
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
                архив
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
          actionToggleCar: actionToggleCar,
        })
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
          <Icon type="MaterialCommunityIcons" name="car-off" fontSize={20} />
          <Text style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
            У вас нет текущих автомобилей.{'\r\n'}
          </Text>
          <Button bordered onPress={() => setActivePanel('hidden')}>
            <Text style={{padding: 5}}>Проверим архив?</Text>
          </Button>
        </View>
      )}
    </>
  );
};
export default connect(null, mapDispatchToProps)(UserCars);
