/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon, ActionSheet, Toast} from 'native-base';
import * as Animatable from 'react-native-animatable';
import PushNotifications from '@core/components/PushNotifications';
import DealerItemList from '@core/components/DealerItemList';

// redux
import {connect} from 'react-redux';
import {
  getProfileSapData,
  actionLogout,
  connectSocialMedia,
  actionToggleCar,
} from '../actions';
import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import Amplitude from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
    flex: 1,
    flexDirection: 'row',
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
  buttonPrimary: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
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

import {SafeAreaView} from 'react-navigation';
import {verticalScale} from '../../utils/scale';
import {CarCard} from '../components/CarCard';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,

    isFetchProfileData: profile.meta.isFetchProfileData,

    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  actionLogout,

  actionSetPushGranted,
  actionSetPushActionSubscribe,
  getProfileSapData,
  connectSocialMedia,
  actionToggleCar,
};
const CarMenu = {
  active: {
    BUTTONS: [
      {
        id: 'orderService',
        text: '🛠 Запись на сервис',
      },
      {
        id: 'orderParts',
        text: 'Заказать зап.части',
      },
      {
        id: 'TOhistory',
        text: '📘 История обслуживания',
      },
      // {id: 'tva', text: 'Проверить ТВА', icon: 'aperture', iconColor: '#ea943b'},
      {
        id: 'hide',
        text: '📥 Скрыть в архив',
      },
      {id: 'cancel', text: 'Отмена'},
    ],
    DESTRUCTIVE_INDEX: 3,
    CANCEL_INDEX: 4,
  },
  hidden: {
    BUTTONS: [
      {
        id: 'TOhistory',
        text: '📘 История обслуживания',
      },
      // {id: 'tva', text: 'Проверить ТВА', icon: 'aperture', iconColor: '#ea943b'},
      {
        id: 'hide',
        text: '📤 Сделать текущим',
      },
      {id: 'cancel', text: 'Отмена'},
    ],
    DESTRUCTIVE_INDEX: 1,
    CANCEL_INDEX: 2,
  },
};

class ProfileScreenInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cars: 'default',
    };
  }

  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  componentDidMount() {
    console.log('componentDidMount before => this.props', this.props);
    if (this.props.login.ID) {
      console.log('componentDidMount => this.props', this.props);
      this.getUserData();
    }

    Amplitude.logEvent('screen', 'profile/main');
  }

  componentDidUpdate(nextProps) {
    if (this.props.login.ID && this.props.login.ID !== nextProps.login.ID) {
      this.getUserData();
    }

    if (
      this.props.login.SAP &&
      this.props.login.SAP.ID !==
        (nextProps.login.SAP ? nextProps.login.SAP.ID : null)
    ) {
      this.getUserData();
    }
  }

  getUserData() {
    this.setState({loading: true});
    const {ID, SAP} = this.props.login;

    this.props
      .getProfileSapData({
        id: ID,
        sap: SAP,
      })
      .then(() => {
        if (SAP && SAP.ID && SAP.ID.length > 0) {
          PushNotifications.addTag('sapID', SAP.ID);
          PushNotifications.setExternalUserId(SAP.ID);
        }
        this.setState({loading: false});
      })
      .catch((err) => {
        console.log(
          'ERROR если что-то идет не так то разлогиниваем пользователя',
          err,
        );
        this.props.actionLogout();
      });
  }

  _renderCars() {
    let myCars = {
      default: [],
      hidden: [],
      owner: [],
    };
    this.props.cars.map((item) => {
      if (item.hidden) {
        myCars.hidden.push(item);
        // } else if (item.owner) {
        //   myCars.owner.push(item);
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
                  this.setState({cars: 'default'});
                }}>
                <Text
                  selectable={false}
                  style={[
                    styles.carChooseText,
                    this.state.cars === 'default'
                      ? styles.carChooseTextSelected
                      : null,
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
                  this.setState({cars: 'hidden'});
                }}>
                <Text
                  selectable={false}
                  style={[
                    styles.carChooseText,
                    this.state.cars === 'hidden'
                      ? styles.carChooseTextSelected
                      : null,
                  ]}>
                  архив
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {myCars[this.state.cars].length > 0 ? (
          this._renderCarsItems(myCars[this.state.cars])
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
            <Button bordered onPress={() => this.setState({cars: 'hidden'})}>
              <Text style={{padding: 5}}>Проверим архив?</Text>
            </Button>
          </View>
        )}
      </>
    );
  }

  _renderCarsItems(cars) {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}>
        {cars.map((item) => {
          let CarType = '';
          if (item.hidden === true) {
            CarType = 'hidden';
          } else {
            CarType = 'active';
          }
          return (
            <TouchableWithoutFeedback
              key={item.vin}
              onPress={() => {
                let carName = [
                  item.brand,
                  item.model,
                  '-- [' + item.number + ']',
                ].join(' ');
                ActionSheet.show(
                  {
                    options: CarMenu[CarType].BUTTONS,
                    cancelButtonIndex: CarMenu[CarType].CANCEL_INDEX,
                    destructiveButtonIndex: CarMenu[CarType].DESTRUCTIVE_INDEX,
                    title: carName,
                  },
                  (buttonIndex) => {
                    switch (CarMenu[CarType].BUTTONS[buttonIndex].id) {
                      case 'orderService':
                        this.props.navigation.navigate('ServiceScreen', {
                          car: item,
                        });
                        break;
                      case 'orderParts':
                        break;
                      case 'TOhistory':
                        this.props.navigation.navigate('TOHistore', {
                          car: item,
                        });
                        break;
                      case 'hide':
                        this.setState({loading: true});
                        this.props
                          .actionToggleCar(item, this.props.login.SAP)
                          .then((res) => {
                            if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                              this.setState({
                                loading: false,
                                cars: 'default',
                              });
                              Toast.show({
                                text: 'Статус автомобиля изменён',
                                type: 'success',
                                position: 'bottom',
                              });
                            }
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
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{minHeight: '100%'}}>
          <Text
            style={{
              fontSize: 35,
              fontWeight: '600',
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            {`${this.props.login.NAME || ''} ${
              this.props.login.LAST_NAME || ''
            }`}
          </Text>
          {!this.state.loading ? (
            <DealerItemList
              key={'dealerSelect'}
              dealer={this.props.dealerSelected}
              style={[
                {
                  paddingHorizontal: 5,
                  paddingTop: 10,
                },
              ]}
              goBack={true}
              isLocal={false}
              navigation={this.props.navigation}
              returnScreen={this.props.navigation.state.routeName}
            />
          ) : null}

          {this.state.loading ? (
            <ActivityIndicator
              color="#0061ED"
              style={{
                alignSelf: 'center',
                marginTop: verticalScale(60),
                marginBottom: verticalScale(60),
              }}
            />
          ) : (
            <>
              {this.props.cars.length > 0 ? (
                this._renderCars()
              ) : (
                <>
                  <View
                    style={[
                      styleConst.shadow.default,
                      styles.scrollViewInner,
                      {
                        display: 'flex',
                        backgroundColor: '#979797',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 125,
                      },
                    ]}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 18,
                        paddingHorizontal: 20,
                      }}>
                      У вас пока ещё нет автомобилей, о которых мы знаем...
                    </Text>
                    <Button
                      full
                      onPress={() => {
                        this.props.navigation.navigate('ReestablishScreen');
                      }}
                      style={[
                        {
                          position: 'absolute',
                          backgroundColor: 'none',
                          elevation: 0,
                          bottom: -10,
                          right: 5,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.buttonPrimaryText,
                          {
                            color: '#fff',
                            fontSize: 14,
                            fontStyle: 'italic',
                            textDecorationStyle: 'dotted',
                            textDecorationColor: '#fff',
                            textDecorationLine: 'underline',
                            shadowOpacity: 0,
                            elevation: 0,
                          },
                        ]}>
                        Не видите свои авто?
                      </Text>
                    </Button>
                  </View>
                </>
              )}

              {this.props.bonus.data && this.props.bonus.data.saldo ? (
                <TouchableOpacity
                  style={[
                    styleConst.shadow.default,
                    {
                      marginHorizontal: 20,
                      marginBottom: 20,
                    },
                  ]}
                  onPress={() => this.props.navigation.navigate('BonusScreen')}>
                  <View
                    style={{
                      backgroundColor: '#0061ed',
                      borderRadius: 5,
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('BonusScreen')
                    }>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: 98,
                        height: 98,
                        borderRadius: 49,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 24,
                      }}>
                      <Text
                        style={{
                          color: '#0061ed',
                          fontSize: 20,
                          fontWeight: '600',
                        }}>
                        {this.props.bonus.data && this.props.bonus.data.saldo
                          ? this.props.bonus.data.saldo.value
                          : 0}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          marginBottom: 8,
                          fontWeight: '600',
                        }}>
                        Бонусные баллы
                      </Text>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          marginBottom: 16,
                          fontWeight: '600',
                        }}>
                        История накопления и трат Ваших бонусных баллов
                      </Text>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 16,
                              fontWeight: '600',
                            }}
                            onPress={() =>
                              this.props.navigation.navigate('BonusScreen')
                            }>
                            Посмотреть
                          </Text>
                        </View>
                        <Icon
                          type="FontAwesome5"
                          name="angle-right"
                          style={{color: '#fff', fontSize: 20, marginLeft: 8}}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate('BonusScreenInfo')
                  }>
                  <View>
                    <View
                      style={[
                        styleConst.shadow.default,
                        {
                          marginHorizontal: 20,
                        },
                      ]}>
                      <View
                        style={{
                          backgroundColor: '#0061ed',
                          borderRadius: 5,
                          padding: 14,
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#fff',
                            width: 98,
                            height: 98,
                            borderRadius: 49,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 24,
                          }}>
                          {this.props.bonus.data &&
                          this.props.bonus.data.saldo ? (
                            <Text
                              style={{
                                color: '#0061ed',
                                fontSize: 20,
                                fontWeight: '600',
                              }}>
                              {this.props.bonus.data.saldo.value}
                            </Text>
                          ) : (
                            <Icon
                              name="frowno"
                              type="AntDesign"
                              style={[{fontSize: 76, marginTop: 9}]}
                            />
                          )}
                        </View>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 18,
                              marginBottom: 8,
                              fontWeight: '600',
                            }}>
                            Бонусные баллы
                          </Text>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              marginBottom: 16,
                              fontWeight: '600',
                            }}>
                            У Вас пока{' '}
                            <Text style={{fontWeight: 'bold', fontSize: 22}}>
                              0
                            </Text>{' '}
                            баллов.{'\r\n'}Узнайте больше о бонусной программе и
                            накапливайте баллы быстрее!
                          </Text>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            <View>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                }}>
                                Хочу больше баллов
                              </Text>
                            </View>
                            <Icon
                              type="FontAwesome5"
                              name="angle-right"
                              style={{
                                color: '#fff',
                                fontSize: 20,
                                marginLeft: 8,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              <Button
                full
                onPress={() => {
                  this.props.navigation.navigate('ProfileSettingsScreen');
                }}
                style={[
                  styleConst.shadow.default,
                  styles.buttonPrimary,
                  {backgroundColor: styleConst.color.green},
                ]}>
                <Text style={styles.buttonPrimaryText}>
                  Редактировать данные
                </Text>
              </Button>
            </>
          )}
          {!this.state.loading ? (
            <View style={{textAlign: 'center', alignItems: 'center'}}>
              <Button
                transparent
                onPress={() => {
                  this.props.actionLogout();
                }}
                style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 20,
                  marginVertical: 5,
                }}>
                <Text
                  style={[
                    styles.buttonPrimaryText,
                    {
                      color: styleConst.color.lightBlue,
                    },
                  ]}>
                  Выйти
                </Text>
              </Button>
            </View>
          ) : null}
          {console.log('this', this)}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreenInfo);
