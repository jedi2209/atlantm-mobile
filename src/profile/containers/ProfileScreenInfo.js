/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {orderBy} from 'lodash';

import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableNativeFeedbackBase,
} from 'react-native';
import {Button, Icon} from 'native-base';
import PushNotifications from '@core/components/PushNotifications';
import SocialAuth from '../components/SocialAuth';

// redux
import {connect} from 'react-redux';
import {getProfileSapData, actionLogout, connectSocialMedia} from '../actions';
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
});

import {SafeAreaView} from 'react-navigation';
import {verticalScale} from '../../utils/scale';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CarCard} from '../components/CarCard';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  //TODO: owner true должен быть показан первым
  const cars = orderBy(profile.cars, ['owner'], ['asc']);

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

    cars,
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
};

class ProfileScreenInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
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
        if (SAP.ID && SAP.ID.length > 0) {
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
        <StatusBar barStyle="light-content" />
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
            <Button
              full
              onPress={() => {
                this.props.navigation.navigate('ChooseDealerScreen');
              }}
              style={[styleConst.shadow.default, styles.buttonPrimary]}>
              <Text style={styles.buttonPrimaryText}>
                {this.props.dealerSelected.name}
              </Text>
            </Button>
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
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginHorizontal: 20,
                    marginTop: 10,
                  }}>
                  Мои автомобили
                </Text>
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
              {this.props.cars.length > 0 ? (
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}>
                  {this.props.cars.map((item) => (
                    <TouchableWithoutFeedback
                      key={item.vin}
                      onPress={() =>
                        this.props.navigation.navigate('TOHistore', {car: item})
                      }>
                      <View>
                        <CarCard data={item} />
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              ) : null}

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
                            У Вас пока 0 баллов. Посмотреть подробнее о бонусной
                            программе
                          </Text>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            <View>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                }}>
                                Посмотреть
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreenInfo);
