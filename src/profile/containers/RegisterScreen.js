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
  carVINFill,
  carNumberFill,
  actionRegister,
} from '../actions';
import { REGISTER__SUCCESS, REGISTER__FAIL } from '../actionTypes';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import ProfileForm from '../components/ProfileForm';
import ListItemHeader from '../components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { ERROR_NETWORK } from '../../core/const';
import stylesHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  textContainer: {
    paddingHorizontal: styleConst.ui.horizontalGapInList,
    paddingTop: styleConst.ui.horizontalGap,
  },
  text: {
    color: styleConst.color.greyText3,
    fontSize: styleConst.ui.smallTextSize,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
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
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    carVIN: profile.carVIN,
    carNumber: profile.carNumber,

    isRegisterRequest: profile.meta.isRegisterRequest,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
  carVINFill,
  carNumberFill,

  actionRegister,
};

class RegisterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Регистрация',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,

    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carVINFill: PropTypes.func,
    carNumberFill: PropTypes.func,

    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    carVIN: PropTypes.string,
    carNumber: PropTypes.string,

    actionRegister: PropTypes.func,
    isRegisterRequest: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps) {
    const {
      name,
      phone,
      email,
      carVIN,
      carNumber,
      dealerSelected,
      isRegisterRequest,
    } = this.props;
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'RegisterScreen';
      }
    }

    return isActiveScreen;
  }

  onPressRegister = () => {
    const {
      name,
      email,
      phone,
      carVIN,
      carNumber,
      navigation,
      actionRegister,
      dealerSelected,
    } = this.props;

    if (!name) {
      return setTimeout(() => Alert.alert('Заполните ФИО'), 100);
    }

    if (!phone) {
      return setTimeout(() => Alert.alert('Заполните контактный телефон'), 100);
    }

    if (!email) {
      return setTimeout(() => Alert.alert('Заполните email'), 100);
    }

    actionRegister({
      dealerId: dealerSelected.id,
      name,
      phone,
      email,
      carVIN,
      carNumber,
    })
      .then(action => {
        if (action.type === REGISTER__SUCCESS) {
          const defaultMessage = `Ваша заявка на регистрацию успешно отправлена специалистам автоцентра ${dealerSelected.name}`;

          setTimeout(() => {
            Alert.alert(
              get(action, 'payload.data.message', defaultMessage),
              '',
              [
                {
                  text: 'ОК',
                  onPress() {
                    navigation.goBack();
                  },
                },
              ],
            );
          }, 100);
        }

        if (action.type === REGISTER__FAIL) {
          let message = get(action, 'payload.message', 'Произошла ошибка, попробуйте снова');

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
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
      carVINFill,
      carNumberFill,
      name,
      phone,
      email,
      carVIN,
      carNumber,

      isRegisterRequest,
    } = this.props;

    console.log('== Register Screen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <Spinner visible={isRegisterRequest} color={styleConst.color.blue} />
            <List style={styles.list}>

            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Чтобы зарегистрироваться, заполните, пожалуйста, форму ниже.
                Специалисты автоцентра сообщат вам логин и пароль по СМС и электронной почте.
                Обращаем ваше внимание на то, что доступ к Личному кабинету могут получить только Клиенты Атлант-М.
              </Text>
            </View>

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ*" />

              <ProfileForm
                isRegisterForm={true}
                carSection={true}
                name={name}
                phone={phone}
                email={email}
                carVIN={carVIN}
                carNumber={carNumber}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
                carVINFill={carVINFill}
                carNumberFill={carNumberFill}
              />
            </List>

            <Button onPress={this.onPressRegister} full style={styles.button}>
              <Icon name="ios-car" style={styles.buttonIcon} />
              <Text numberOfLines={1} style={styles.buttonText}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
            </Button>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
