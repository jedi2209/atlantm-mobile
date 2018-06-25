import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Alert, StyleSheet, View, Text } from 'react-native';
import { Content, List, StyleProvider, ListItem, Body, Item, Label, Input, Button } from 'native-base';

// redux
import { connect } from 'react-redux';
import {
  actionFillForgotCode,
  actionFillForgotLogin,
  actionRequestForgotPass,
  actionSubmitForgotPassCode,
  actionSetForgotPassPhoneMode,
} from '@profile/actions';
import {
  FORGOT_PASS_REQUEST__SUCCESS,
  FORGOT_PASS_REQUEST__FAIL,
  FORGOT_PASS_SUBMIT_CODE__SUCCESS,
  FORGOT_PASS_SUBMIT_CODE__FAIL,
} from '@profile/actionTypes';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import FooterButton from '@core/components/FooterButton';
import ListItemHeader from '@profile/components/ListItemHeader';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '@core/components/Lists/style';

// helpers
import isInternet from '@utils/internet';
import { get } from 'lodash';
import Amplitude from '@utils/amplitude-analytics';
import getTheme from '../../../native-base-theme/components';
import styleConst from '@core/style-const';
import { ERROR_NETWORK } from '@core/const';
import stylesHeader from '@core/components/Header/style';
import { LOGIN_LABEL, LOGIN_PLACEHOLDER, FORGOT_PASS_CODE_LABEL, FORGOT_PASS_CODE_PLACEHOLDER } from '@profile/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  textContainer: {
    paddingHorizontal: styleConst.ui.horizontalGapInList,
    paddingTop: styleConst.ui.horizontalGap,
    paddingBottom: 15,
  },
  text: {
    color: styleConst.color.greyText3,
    fontSize: styleConst.ui.smallTextSize,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  button: {
    marginTop: 10,
    height: styleConst.ui.footerHeight,
  },
  buttonWhite: {
    backgroundColor: 'white',
    flex: 2.5,
  },
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonTextBlue: {
    color: styleConst.color.systemBlue,
  },
});

const mapStateToProps = ({ dealer, profile, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,

    forgotPassLogin: profile.forgotPass.login,
    forgotPassCode: profile.forgotPass.code,

    isForgotPassByPhone: profile.forgotPass.meta.isForgotPassByPhone,
    isForgotPassRequest: profile.forgotPass.meta.isForgotPassRequest,
    isForgotPassCodeSubmit: profile.forgotPass.meta.isForgotPassCodeSubmit,
  };
};

const mapDispatchToProps = {
  actionFillForgotLogin,
  actionFillForgotCode,
  actionRequestForgotPass,
  actionSubmitForgotPassCode,
  actionSetForgotPassPhoneMode,
};

class ForgotPassScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Восстановление пароля',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,

    forgotPassLogin: PropTypes.string,
    forgotPassCode: PropTypes.string,
    isForgotPassByPhone: PropTypes.bool,
    isForgotPassRequest: PropTypes.bool,
    isForgotPassCodeSubmit: PropTypes.bool,
    actionFillForgotLogin: PropTypes.func,
    actionFillForgotCode: PropTypes.func,
    actionRequestForgotPass: PropTypes.func,
    actionSubmitForgotPassCode: PropTypes.func,
    actionSetForgotPassPhoneMode: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ForgotPassScreen';
      }
    }

    return isActiveScreen;
  }

  onChangeLogin = value => this.props.actionFillForgotLogin(value)

  onChangeCode = value => this.props.actionFillForgotCode(value)

  onPressButtonRequestLogin = async() => {
    const isInternetExist = await isInternet();
    if (!isInternetExist) return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);

    const {
      navigation,
      forgotPassLogin,
      actionFillForgotLogin,
      actionRequestForgotPass,
    } = this.props;

    if (!forgotPassLogin) {
      return setTimeout(() => Alert.alert('Введите логин'), 100);
    }

    actionRequestForgotPass({ forgotPassLogin })
      .then(action => {
        if (action.type === FORGOT_PASS_REQUEST__SUCCESS) {
          Amplitude.logEvent('order', 'profile/forgot_pass_request', { login: forgotPassLogin });

          if (get(action, 'payload.code') !== 119) {
            setTimeout(() => {
              Alert.alert(
                get(action, 'payload.message'),
                '',
                [
                  {
                    text: 'ОК',
                    onPress() {
                      actionFillForgotLogin(''); // очищаем логин
                      navigation.goBack();
                    },
                  },
                ],
              );
            }, 100);
          }
        }

        if (action.type === FORGOT_PASS_REQUEST__FAIL) {
          let message = get(action, 'payload.message', 'Произошла ошибка, попробуйте снова');

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
  }

  onPressButtonSubmitCode = async() => {
    const isInternetExist = await isInternet();
    if (!isInternetExist) return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);

    const {
      navigation,
      forgotPassCode,
      forgotPassLogin,
      actionFillForgotCode,
      actionFillForgotLogin,
      actionSubmitForgotPassCode,
      actionSetForgotPassPhoneMode,
    } = this.props;

    if (!forgotPassLogin || !forgotPassCode) {
      return setTimeout(() => Alert.alert('Введите код подтверждения'), 100);
    }

    const resetPhoneMode = this.resetPhoneMode.bind(this);

    actionSubmitForgotPassCode({ forgotPassLogin, forgotPassCode })
      .then(action => {
        if (action.type === FORGOT_PASS_SUBMIT_CODE__SUCCESS) {
          Amplitude.logEvent('order', 'profile/forgot_pass_submit_code', { login: forgotPassLogin });

          setTimeout(() => {
            Alert.alert(
              get(action, 'payload.message'),
              '',
              [
                {
                  text: 'ОК',
                  onPress() {
                    resetPhoneMode();
                    navigation.goBack();
                  },
                },
              ],
            );
          }, 100);
        }

        if (action.type === FORGOT_PASS_SUBMIT_CODE__FAIL) {
          let message = get(action, 'payload.message', 'Произошла ошибка, попробуйте снова');

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
  }

  renderListItem = ({ label, value, placeholder, onChangeHandler, disabled }) => {
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={stylesList.label}>{label}</Label>
              <Input
                disabled={disabled}
                style={stylesList.input}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={placeholder}
                onChangeText={onChangeHandler}
                value={value}
                returnKeyType="done"
                returnKeyLabel="Готово"
                underlineColorAndroid="transparent"
              />
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  resetPhoneMode = () => {
    const { actionFillForgotLogin, actionFillForgotCode, actionSetForgotPassPhoneMode } = this.props;

    actionFillForgotLogin('');
    actionFillForgotCode('');
    actionSetForgotPassPhoneMode(false);
  }

  onPressResetButton = () => this.resetPhoneMode()

  renderResetButton = () => {
    return (
      <Button onPress={this.onPressResetButton} full style={[styles.button, styles.buttonWhite]}>
        <Text style={[styles.buttonText, styles.buttonTextBlue]}>{'Ввести логин заново'.toUpperCase()}</Text>
      </Button>
    );
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      forgotPassCode,
      forgotPassLogin,
      isForgotPassByPhone,
      isForgotPassRequest,
      isForgotPassCodeSubmit,
    } = this.props;

    console.log('== Forgot Password Screen ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content enableResetScrollToCoords={false}>
            <Spinner visible={isForgotPassRequest || isForgotPassCodeSubmit} color={styleConst.color.blue} />
            <List style={styles.list}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  Введите номер телефона в международном формате, email или ID Клиента
                </Text>
              </View>

              {/* <ListItemHeader text="Заполните поле" /> */}

              {this.renderListItem({
                label: LOGIN_LABEL,
                value: forgotPassLogin,
                placeholder: LOGIN_PLACEHOLDER,
                onChangeHandler: this.onChangeLogin,
                disabled: isForgotPassByPhone, // блокируем изменение логина после запроса пароля
              })}
              {
                isForgotPassByPhone ?
                  (
                    <View>
                      {this.renderResetButton()}
                      <ListItemHeader text="Код подтверждения выслан на указанный телефон посредством SMS" />
                      {
                        this.renderListItem({
                          label: FORGOT_PASS_CODE_LABEL,
                          value: forgotPassCode,
                          placeholder: FORGOT_PASS_CODE_PLACEHOLDER,
                          onChangeHandler: this.onChangeCode,
                        })
                      }
                    </View>
                  )
                  :
                  null
              }
            </List>
          </Content>
          <FooterButton
            text={isForgotPassByPhone ? 'Подтвердить код' : 'Выслать пароль'}
            // isLoading={isForgotPassRequest}
            onPressButton={isForgotPassByPhone ? this.onPressButtonSubmitCode : this.onPressButtonRequestLogin}
          />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassScreen);
