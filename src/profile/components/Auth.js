import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import { ListItem, Body, Item, Label, Input, Button } from 'native-base';

// styles
import stylesList from '@core/components/Lists/style';

// helpers
import { get } from 'lodash';
import { LOGIN__FAIL } from '@profile/actionTypes';
import styleConst from '@core/style-const';
import { LOGIN_LABEL, LOGIN_PLACEHOLDER, PASS_LABEL, PASS_PLACEHOLDER } from '@profile/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  textContainer: {
    marginBottom: 10,
    paddingHorizontal: styleConst.ui.horizontalGapInList,
    paddingTop: styleConst.ui.horizontalGap,
  },
  text: {
    color: styleConst.color.greyText3,
    fontSize: styleConst.ui.smallTextSize,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 2,
    paddingBottom: 1,
  },
  button: {
    height: styleConst.ui.footerHeight,
  },
  buttonBlue: {
    backgroundColor: styleConst.color.lightBlue,
    flex: 1,
  },
  buttonWhite: {
    backgroundColor: '#fff',
    flex: 2.5,
  },
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonTextWhite: {
    color: '#fff',
  },
  buttonTextBlue: {
    color: styleConst.color.systemBlue,
  },
});

export default class Auth extends Component {
  static propTypes = {
    dealers: PropTypes.array,
    dealerSelected: PropTypes.object,
    loginHandler: PropTypes.func,
    isRequest: PropTypes.bool,
    login: PropTypes.string,
    password: PropTypes.string,
    loginFill: PropTypes.func,
    passwordFill: PropTypes.func,
    navigation: PropTypes.object,
  };

  static defaultProps = {
    isRequest: false,
  };

  onPressRegister = () => this.props.navigation.navigate('RegisterScreen')

  onPressLogin = () => {
    const { login, password, loginHandler, dealers, dealerSelected } = this.props;

    Keyboard.dismiss();

    if (!login && !password) {
      return Alert.alert('Ошибка заполнения формы', '\r\nНе указан логин и пароль');
    }

    if (!login || login.length < 3) {
      return Alert.alert('Ошибка заполнения формы', '\r\nНе указан логин');
    }

    if (!password || password.length < 3) {
      return Alert.alert('Ошибка заполнения формы', '\r\nНе указан пароль');
    }

    // При авторизации через zteam, включает debug режим
    // В этом режиме, во все API обращения добавляется query параметра debug=app
    // Это нужно для тестирование приложения, пушей, автотесты
    // ID тестового автоцентра `999`
    if (login === 'zteam' && password === '4952121052') {
      window.atlantmDebug = true;
    }

    loginHandler({ login, password, dealers, dealerSelected })
      .then(action => {
        if (action.type === LOGIN__FAIL) {
          if (login === 'zteam' && password === '4952121052') {
            window.atlantmDebug = false;
          }

          const defaultMessage = 'Произошла ошибка, попробуйте снова';
          const code = get(action, 'payload.code');
          const message = get(action, 'payload.message');

          setTimeout(() => {
            Alert.alert(!code || code === 500 ? defaultMessage : message);
          }, 100);
        }
      });
  };

  onChangeLogin = value => this.props.loginFill(value)
  onChangePassword = value => this.props.passwordFill(value)

  renderListItem = ({ label, value, placeholder = 'Поле для заполнения', onChangeHandler, inputProps = {}, isLast }) => {

    if (label === LOGIN_LABEL || label === PASS_LABEL) {
      return (
        <View style={stylesList.listItemContainer}>
          <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>{label}</Label>
                <Input
                  style={stylesList.input, {textAlign: 'right', alignSelf: 'center', alignItems: 'center', marginRight: 20}}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={placeholder}
                  onChangeText={onChangeHandler}
                  value={value}
                  returnKeyType="done"
                  returnKeyLabel="Готово"
                  underlineColorAndroid="transparent"
                  {...inputProps}
                />
              </Item>
            </Body>
          </ListItem>
        </View>
      );
    } else {
      return (
        <View style={stylesList.listItemContainer}>
          <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]}>
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>{label}</Label>
                <Input
                  style={stylesList.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={placeholder}
                  onChangeText={onChangeHandler}
                  value={value}
                  returnKeyType="done"
                  returnKeyLabel="Готово"
                  underlineColorAndroid="transparent"
                  {...inputProps}
                />
              </Item>
            </Body>
          </ListItem>
        </View>
      );
    }
  };

  onPressForgotPass = () => this.props.navigation.navigate('ForgotPassScreen')

  renderForgotPassButton = () => {
    return (
      <View style={[
        stylesList.listItemContainer,
        stylesList.listItemContainerFirst,
        styles.actionListItemContainer,
      ]}>
        <ListItem style={stylesList.listItem} first last>
          <Body>
            <TouchableOpacity onPress={this.onPressForgotPass}>
              <Text style={stylesList.listItemValue, {textAlign: 'right'}}>Забыли пароль?</Text>
            </TouchableOpacity>
          </Body>
        </ListItem>
      </View>
    );
  };

  render() {
    const { isRequest, login, password } = this.props;

    return (
      <View style={styles.container}>
        <Spinner visible={isRequest} color={styleConst.color.blue} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Все функции личного кабинета доступны только зарегистрированным пользователям.{'\n'}{'\n'}
            Номер телефона вводится в международном формате.
          </Text>
        </View>

        {this.renderListItem({
          label: LOGIN_LABEL,
          value: login,
          placeholder: LOGIN_PLACEHOLDER,
          onChangeHandler: this.onChangeLogin,
        })}
        {this.renderListItem({
          label: PASS_LABEL,
          value: password,
          placeholder: PASS_PLACEHOLDER,
          onChangeHandler: this.onChangePassword,
          inputProps: { secureTextEntry: true },
          isLast: true,
        })}
        {this.renderForgotPassButton()}

        <View style={styles.footer}>
          <Button onPress={this.onPressRegister} full style={[styles.button, styles.buttonWhite]}>
            <Text numberOfLines={1} style={[styles.buttonText, styles.buttonTextBlue]}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
          </Button>
          <Button onPress={this.onPressLogin} full style={[styles.button, styles.buttonBlue]}>
            <Text numberOfLines={1} style={[styles.buttonText, styles.buttonTextWhite]}>ВОЙТИ</Text>
          </Button>
        </View>
      </View>
    );
  }
}
