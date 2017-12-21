import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import { ListItem, Body, Item, Label, Input, Button } from 'native-base';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import { LOGIN__SUCCESS, LOGIN__FAIL } from '../actionTypes';
import styleConst from '../../core/style-const';

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
    loginHandler: PropTypes.func,
    isRequest: PropTypes.bool,
    login: PropTypes.string,
    password: PropTypes.string,
    loginFill: PropTypes.func,
    passwordFill: PropTypes.func,
    navigation: PropTypes.object,
  }

  static defaultProps = {
    isRequest: false,
  }

  onPressRegister = () => this.props.navigation.navigate('RegisterScreen')

  onPressLogin = () => {
    const { login, password, loginHandler, dealers } = this.props;

    Keyboard.dismiss();

    if (!login || login.length < 3) {
      return Alert.alert('Введите логин');
    }

    if (!password || password.length < 3) {
      return Alert.alert('Введите пароль');
    }

    loginHandler({ login, password, dealers })
      .then(action => {
        // if (action.type === LOGIN__SUCCESS) {
        //   setTimeout(() => Alert.alert('Успешная авторизация'), 100);
        // }

        if (action.type === LOGIN__FAIL) {
          const defaultMessage = 'Произошла ошибка, попробуйте снова';
          const code = get(action, 'payload.code');
          const message = get(action, 'payload.message');

          setTimeout(() => {
            Alert.alert(!code || code === 500 ? defaultMessage : message);
          }, 100);
        }
      });
  }

  onChangeLogin = value => this.props.loginFill(value)
  onChangePassword = value => this.props.passwordFill(value)

  renderListItem = (label, value, onChangeHandler, inputProps = {}, isLast) => {
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={stylesList.label}>{label}</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Поле для заполнения"
                onChangeText={onChangeHandler}
                value={value}
                keyboardType="phone-pad"
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

  render() {
    const { isRequest, login, password } = this.props;

    return (
      <View style={styles.container}>
        <Spinner visible={isRequest} color={styleConst.color.blue} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Все функции личного кабинета доступны только зарегистрированным пользователям
          </Text>
        </View>

        {this.renderListItem('Логин', login, this.onChangeLogin)}
        {this.renderListItem('Пароль', password, this.onChangePassword, { secureTextEntry: true }, true)}

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
