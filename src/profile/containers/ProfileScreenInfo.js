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
} from 'react-native';
import {Button, Icon} from 'native-base';

// redux
import {connect} from 'react-redux';
import {
  nameFill,
  phoneFill,
  emailFill,
  carFill,
  carNumberFill,
  loginFill,
  passwordFill,
  actionLogin,
  actionLogout,
  actionFetchProfileData,
  actionSavePofile,
} from '../actions';
import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';

import {TouchableOpacity} from 'react-native';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    paddingBottom: isAndroid ? 0 : styleConst.ui.footerHeightIphone,
  },
  button: {
    height: isAndroid
      ? styleConst.ui.footerHeightAndroid
      : styleConst.ui.footerHeightIphone,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
    marginBottom: 30,

    ...Platform.select({
      ios: {
        borderBottomWidth: styleConst.ui.borderWidth,
        borderBottomColor: styleConst.color.border,
      },
    }),
  },
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
    backgroundColor: '#fff',
    borderColor: '#2E3A59',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonPrimaryText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: 'normal',
  },
  scrollView: {},
  scrollViewInner: {display: 'flex', flexDirection: 'column'},
});

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';
import {SafeAreaView} from 'react-navigation';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  //TODO: owner true должен быть показан первым
  const cars = orderBy(profile.login.cars, ['owner'], ['asc']);

  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    car: profile.car,
    carNumber: profile.carNumber,

    isFetchProfileData: profile.meta.isFetchProfileData,

    auth: profile.auth,
    cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.login.bonus,
    discounts: profile.discounts,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
  carFill,
  carNumberFill,

  actionFetchProfileData,

  loginFill,
  passwordFill,
  actionLogin,
  actionLogout,

  actionSetPushGranted,
  actionSetPushActionSubscribe,

  actionSavePofile,
};

const CarCard = ({data}) => {
  const {brand, model, number} = data;
  return (
    <View
      style={[
        styles.scrollViewInner,
        {
          backgroundColor: '#979797',
          marginTop: 10,
          marginBottom: 20,
          borderRadius: 5,
          width: 150,
          justifyContent: 'space-between',
          paddingBottom: 40,
          height: 155,

          marginRight: 15,
        },
      ]}>
      <View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: '#fff',
            fontSize: 14,
            paddingTop: 20,
            paddingBottom: 10,
            paddingHorizontal: 20,
          }}>
          {`${brand} ${model}`}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            paddingHorizontal: 20,
          }}>
          {number}
        </Text>
      </View>
      <Icon
        name="car"
        type="FontAwesome5"
        style={{
          fontSize: 54,
          color: '#0061ed',
          marginLeft: 12,
          marginTop: 20,
        }}
      />
      {/* <Image style={{width: '100%'}} source={require('./Bitmap.png')} /> */}
    </View>
  );
};
class ProfileScreenInfo extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  componentDidMount() {
    if (!this.props.login.token) {
      this.props.navigation.navigate('ProfileScreen');
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.navigation.isFocused() && !this.props.login.token) {
      this.props.navigation.navigate('ProfileScreen');
    }
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <ScrollView>
          <Text
            style={{
              fontSize: 35,
              fontWeight: '600',
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            {`${this.props.login.first_name} ${this.props.login.last_name}`}
          </Text>
          <Button
            full
            onPress={() => {
              this.props.navigation.navigate('ChooseDealerScreen');
            }}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>
              {this.props.dealerSelected.name}
            </Text>
          </Button>

          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginHorizontal: 20,
            }}>
            Мои автомобили
          </Text>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{paddingLeft: 20, paddingRight: 5}}
            style={styles.scrollView}>
            {this.props.cars.map(item => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('TOHistore', {car: item})
                }>
                <CarCard data={item} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('BonusScreen')}>
            <View style={{marginHorizontal: 20}}>
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
                  <Text
                    style={{color: '#0061ed', fontSize: 20, fontWeight: '600'}}>
                    {this.props.bonus && this.props.bonus.saldo
                      ? this.props.bonus.saldo.value + '23'
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
                        }}>
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
            </View>
          </TouchableOpacity>
          <Button
            full
            onPress={() => {
              this.props.navigation.navigate('ProfileSettingsScreen');
            }}
            style={[styles.buttonPrimary, {marginTop: 40}]}>
            <Text style={styles.buttonPrimaryText}>Редактировать данные</Text>
          </Button>
          <Button
            full
            onPress={() => {
              this.props.actionLogout();
              this.props.navigation.navigate('ProfileScreen');
            }}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>Выйти</Text>
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreenInfo);
