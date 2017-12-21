import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, View, Text, Platform } from 'react-native';
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
} from '../actions';

// components
import Auth from '../components/Auth';
import ProfileForm from '../components/ProfileForm';
import ListItemHeader from '../components/ListItemHeader';
import BonusDiscount from '../components/BonusDiscount';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
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

const mapStateToProps = ({ dealer, profile, nav }) => {
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

    auth: profile.auth,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
  carFill,
  carNumberFill,

  loginFill,
  passwordFill,
  actionLogin,
  actionLogout,
};

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Личный кабинет',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

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

    auth: PropTypes.object,
    loginFill: PropTypes.func,
    passwordFill: PropTypes.func,
    login: PropTypes.string,
    password: PropTypes.string,
    isLoginRequest: PropTypes.bool,

    bonus: PropTypes.object,
    discounts: PropTypes.array,
  }

  static defaultProps = {
    auth: {},
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

  onPressLogout = () => {
    const { actionLogout } = this.props;

    return Alert.alert(
      'Подтвердите действие',
      '',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          onPress() {
            actionLogout();
            // setTimeout(() => Alert.alert('Вы вышли из личного кабинета'), 100);
          },
        },
      ],
    );
  };

  getDealersList = () => {
    const { listRussia, listUkraine, listBelarussia } = this.props;
    return [].concat(listRussia, listUkraine, listBelarussia);
  }

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

      auth,
      login,
      password,
      loginFill,
      passwordFill,
      actionLogin,
      isLoginRequest,
      bonus,
      discounts,
    } = this.props;

    console.log('== Profile ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
              {
                !auth.token ?
                  (
                    <Auth
                      dealers={this.getDealersList()}
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
                auth.token ?
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
                returnScreen="ProfileScreen"
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                auth={auth}
                carSection={true}
                name={name}
                phone={phone}
                email={email}
                car={car}
                carNumber={carNumber}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
                carFill={carFill}
                carNumberFill={carNumberFill}
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
