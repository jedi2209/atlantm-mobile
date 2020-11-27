/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import UserCars from '../components/UserCars';
import {Button, Icon} from 'native-base';
import PushNotifications from '../../core/components/PushNotifications';
import DealerItemList from '../../core/components/DealerItemList';

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
});

import {SafeAreaView} from 'react-navigation';
import {verticalScale} from '../../utils/scale';

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
    if (this.props.login.ID) {
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

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
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
                <UserCars navigation={this.props.navigation} />
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
                      У тебя пока ещё нет автомобилей, о которых мы знаем...
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
                        Не видишь свои авто?
                      </Text>
                    </Button>
                  </View>
                </>
              )}

              {this.props.bonus.data && this.props.bonus.data.saldo ? (
                <TouchableOpacity
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: 20,
                    },
                  ]}
                  onPress={() => this.props.navigation.navigate('BonusScreen')}>
                  <View
                    style={[
                      styleConst.shadow.default,
                      {
                        backgroundColor: '#0061ed',
                        borderRadius: 5,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'row',
                      },
                    ]}
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
                          ? parseInt(
                              this.props.bonus.data.saldo.value,
                            ).toLocaleString('ru-RU')
                          : 0}
                      </Text>
                      <Text
                        style={{
                          color: styleConst.color.greyText,
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                        {this.props.bonus.data &&
                        this.props.bonus.data.saldo.curr
                          ? this.props.bonus.data.saldo.curr
                          : null}
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
                        Бонусный счёт
                      </Text>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          marginBottom: 16,
                          fontWeight: '600',
                        }}>
                        История накопления и трат твоих бонусов
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
                          Бонусный счёт
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 12,
                            marginBottom: 16,
                            fontWeight: '600',
                          }}>
                          У тебя пока{' '}
                          <Text style={{fontWeight: 'bold', fontSize: 22}}>
                            0
                          </Text>{' '}
                          баллов.{'\r\n'}Узнай больше о бонусной программе и
                          накапливай баллы быстрее!
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
                </TouchableWithoutFeedback>
              )}
              <Button
                block
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
                full
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreenInfo);
