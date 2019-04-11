import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, StyleSheet, Keyboard, Text, Platform } from 'react-native';
import { Container, Content, List, StyleProvider, Button, Icon } from 'native-base';

// redux
import { connect } from 'react-redux';
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
} from '../actions';
import { actionSetPushActionSubscribe, actionSetPushGranted } from '../../core/actions';

// components
import Auth from '../components/Auth';
import ProfileForm from '../components/ProfileForm';
import ListItemHeader from '../components/ListItemHeader';
import BonusDiscount from '../components/BonusDiscount';
import SpinnerView from '../../core/components/SpinnerView';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconReload from '../../core/components/HeaderIconReload';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  button: {
    height: styleConst.ui.footerHeight,
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
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
});

const mapStateToProps = ({ dealer, profile, nav, core }) => {
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
    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,

//    fcmToken: core.fcmToken,
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
};

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: 'Личный кабинет',
      headerStyle: stylesHeader.common,
      headerTitleStyle: stylesHeader.title,
      headerLeft: <HeaderIconBack returnScreen="MenuScreen" navigation={navigation} />,
      headerRight: params.isAuth ? <HeaderIconReload onPress={() => {
        Keyboard.dismiss();

        if (params.onReload) {
          params.onReload();
        }
      }} /> : <View />,
    };
  }

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carFill: PropTypes.func,
    carNumberFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    carNumber: PropTypes.string,

    cars: PropTypes.array,

    auth: PropTypes.object,
    loginFill: PropTypes.func,
    passwordFill: PropTypes.func,
    login: PropTypes.string,
    password: PropTypes.string,
    isLoginRequest: PropTypes.bool,
    isFetchProfileData: PropTypes.bool,

    bonus: PropTypes.object,
    discounts: PropTypes.array,

//    fcmToken: PropTypes.string,
    pushActionSubscribeState: PropTypes.bool,
//    actionSetFCMToken: PropTypes.func,
    actionSetPushGranted: PropTypes.func,
    actionSetPushActionSubscribe: PropTypes.func,
    actionFetchCars: PropTypes.func,
  };

  static defaultProps = {
    auth: {},
  };

  componentDidMount () {
    const { auth, navigation } = this.props;

    navigation.setParams({
      isAuth: get(auth, 'token.id'),
      onReload: auth.token ? this.onReload : null,
    });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ProfileScreen';
      }
    }

    return isActiveScreen;
  }

  onReload = () => {
    const { auth, actionFetchProfileData } = this.props;
    const token = get(auth, 'token.id');

    actionFetchProfileData({ token });
  };

  onPressLogout = () => {
    const { auth, actionLogout } = this.props;

    return Alert.alert(
      'Подтверждение выхода',
      'Вы действительно хотите выйти?',
      [
        { text: 'Нет', style: 'destructive' },
        {
          text: 'Выйти',
          onPress() {
            if (get(auth, 'login') === 'zteam') {
              // отключаем debug режим
              window.atlantmDebug = null;
            }

            setTimeout(() => {
              PushNotifications.removeTag('login');
              actionLogout()
                }, 100
            );
          },
        },
      ],
    );
  };

  getDealersList = () => {
    const { listRussia, listUkraine, listBelarussia } = this.props;
    return [].concat(listRussia, listUkraine, listBelarussia);
  };

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      dealerSelected,
      navigation,
      nameFill,
      phoneFill,
      emailFill,
      carFill,
      carNumberFill,
      name,
      phone,
      email,
      car,
      carNumber,

      cars,
      auth,
      login,
      password,
      loginFill,
      passwordFill,
      actionLogin,
      isLoginRequest,
      bonus,
      discounts,

//      fcmToken,
      pushActionSubscribeState,
//      actionSetFCMToken,
      actionSetPushGranted,
      actionSetPushActionSubscribe,

      isFetchProfileData,
    } = this.props;

    console.log('== Profile ==');

    if (isFetchProfileData) {
      return <SpinnerView text="Обновляем данные личного кабинета" />;
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
            <List style={styles.list}>
              {
                !auth.token ?
                  (
                    <Auth
                      dealers={this.getDealersList()}
                      dealerSelected={dealerSelected}
                      navigation={navigation}
                      loginHandler={actionLogin}
                      isRequest={isLoginRequest}
                      login={login}
                      password={password}
                      loginFill={loginFill}
                      passwordFill={passwordFill}
                    />
                  ) : null
              }

              {
                auth.token && discounts.length  ?
                  <BonusDiscount
                    bonus={get(bonus, 'saldo.value')}
                    discounts={discounts.length}
                    navigation={navigation}
                  /> :
                  null
              }

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                navigation={navigation}
                auth={auth}
                carSection={true}
                name={name}
                phone={phone}
                email={email}
                car={car}
                carNumber={carNumber}
                cars={cars}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
                carFill={carFill}
                carNumberFill={carNumberFill}
//                fcmToken={fcmToken}
                dealerSelected={dealerSelected}
                pushActionSubscribeState={pushActionSubscribeState}
                actionSetPushGranted={actionSetPushGranted}
                actionSetPushActionSubscribe={actionSetPushActionSubscribe}
              />
            </List>

            {
              auth.token ?
                (
                  <Button onPress={this.onPressLogout} full style={styles.button}>
                    <Icon name="ios-exit-outline" style={styles.buttonIcon} />
                    <Text numberOfLines={1} style={styles.buttonText}>ВЫЙТИ ИЗ ЛИЧНОГО КАБИНЕТА</Text>
                  </Button>
                ) : null
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
