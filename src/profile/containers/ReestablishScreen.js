/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';

import {get} from 'lodash';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';

import {Button, Icon, Toast} from 'native-base';

import {StackActions, NavigationActions} from 'react-navigation';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';
import styleConst from '../../core/style-const';

const mapStateToProps = ({dealer, profile, contacts, nav, info}) => {
  return {
    list: info.list,
    nav,
    profile,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

import {
  actionLogin,
  actionSaveProfileByUser,
  actionRequestForgotPass,
} from '../actions';

const mapDispatchToProps = {
  actionLogin,
  actionSaveProfileByUser,
  actionRequestForgotPass,
};

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

const deviceWidth = Dimensions.get('window').width;
const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  // Скопировано из ProfileSettingsScreen.
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  caption: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'normal',
  },
  field: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 36,
  },
  textinput: {
    height: !isAndroid ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
    width: deviceWidth - 40,
    paddingTop: 20,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

class ReestablishScreen extends React.Component {
  constructor(props) {
    super(props);

    this.fields = {
      passInput: React.createRef(),
    };

    this.state = {
      login: '',
      password: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerTitle: 'Вход по логину и паролю',
      headerLeft: (
        <HeaderIconBack
          theme="white"
          // ContainerStyle={styleConst.headerBackButton.ContainerStyle}
          // IconStyle={styleConst.headerBackButton.IconStyle}
          navigation={navigation}
        />
      ),
    };
  };

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  checkLoginPass() {
    const {login, password} = this.state;
    if (login.length === 0 || password.length === 0) {
      Toast.show({
        text: 'Поля логин и пароль обязательны для заполнения',
        position: 'top',
        type: 'warning',
      });
      this.setState({loading: false});
      return false;
    }
    return true;
  }

  checkLogin() {
    const {login} = this.state;
    if (login.length === 0) {
      Toast.show({
        text: 'Нам нужно знать твой логин, чтобы восстановить доступ',
        position: 'top',
        type: 'warning',
      });
      this.setState({loading: false});
      return false;
    }
    return true;
  }

  onPressLogin = () => {
    const {login, password} = this.state;
    this.setState({loading: true});

    if (!this.checkLoginPass()) {
      return false;
    }
    this.props
      .actionLogin({login, password, id: this.props.profile.login.ID})
      .then((action) => {
        switch (action.type) {
          case 'LOGIN__FAIL_OLD_LKK':
            if (login === 'zteam' && password === '4952121052') {
              window.atlantmDebug = false;
            }

            const defaultMessage = 'Произошла ошибка, попробуем снова?';
            const code = get(action, 'payload.code');
            const message = get(action, 'payload.message');
            Toast.show({
              text: !code || code === 500 ? defaultMessage : message,
              position: 'top',
              type: 'danger',
            });
            this.setState({loading: false});
            break;
          case 'LOGIN__SUCCESS_OLD_LKK':
            this.props
              .actionSaveProfileByUser({
                ...this.props.profile.login,
                SAP: action.payload.SAP,
                user: {
                  first_name: action.payload.first_name,
                  last_name: action.payload.last_name,
                  email: action.payload.email,
                  phone: action.payload.phone,
                },
                isReestablish: true,
              })
              .then((data) => {
                this.setState({loading: false});
                const _this = this;
                Toast.show({
                  text: 'Отлично! Всё получилось!',
                  position: 'top',
                  type: 'success',
                });
                setTimeout(() => {
                  _this.props.navigation.navigate('ProfileScreenInfo');
                }, 500);
              })
              .catch(() => {
                this.setState({loading: false});
                Toast.show({
                  text: 'Произошла ошибка, попробуем снова?',
                  position: 'top',
                  type: 'danger',
                });
              });
            break;
        }
      });
  };

  render() {
    let disableButton = false;
    if (this.state.login.length === 0 || this.state.password.length === 0) {
      disableButton = true;
    }
    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Icon
                  type="MaterialCommunityIcons"
                  name="emoticon-cry-outline"
                  style={{fontSize: 48, position: 'absolute'}}
                />
                <Text style={[styles.caption, {marginLeft: 60}]}>
                  Мы очень раздасадованы тем, что ты не обнаружил свои
                  автомобили и бонусный счет в личном кабинете.{'\n'}
                  Пожалуйста, дай нам ещё один шанс!
                </Text>
                <Text style={[styles.caption]}>
                  Введи свои данные для доступа к старому личному кабинету.
                  {'\n\n'}
                  Это последний раз когда тебе придётся вспомнить эти магические
                  комбинации цифр и букв для входа в личный кабинет.
                </Text>
              </View>
              <View style={styles.group}>
                <View style={styles.field}>
                  <TextInput
                    autoCorrect={false}
                    autoCompleteType="username"
                    textContentType="username"
                    autoCapitalize="none"
                    style={styles.textinput}
                    label="Логин"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.fields.passInput.current.focus();
                    }}
                    ref={this.fields.loginInput}
                    blurOnSubmit={false}
                    value={this.state.login || ''}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={this.onChangeField('login')}
                  />
                </View>
                <View
                  style={[
                    styles.field,
                    {
                      flexDirection: 'row',
                      flex: 1,
                    },
                  ]}>
                  <TextInput
                    style={styles.textinput}
                    autoCompleteType="password"
                    textContentType="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    label="Пароль"
                    returnKeyType="send"
                    value={this.state.password || ''}
                    ref={this.fields.passInput}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={this.onChangeField('password')}
                    onSubmitEditing={() => {
                      this.onPressLogin();
                    }}
                  />
                  <Button
                    transparent
                    title="Не помню пароль"
                    onPress={() => {
                      this.setState({RequestForgotPassloading: true});
                      if (!this.checkLogin()) {
                        return false;
                      }
                      this.props
                        .actionRequestForgotPass(this.state.login)
                        .then((action) => {
                          console.log('action', action);
                          switch (action.type) {
                            case 'FORGOT_PASS_REQUEST__SUCCESS':
                              Toast.show({
                                text: action.payload.message
                                  ? action.payload.message
                                  : 'Всё получилось!',
                                position: 'top',
                                type: 'success',
                              });
                              break;
                            default:
                              Toast.show({
                                text: action.payload.message,
                                position: 'top',
                                type: 'danger',
                              });
                              break;
                          }
                          this.setState({RequestForgotPassloading: false});
                        });
                    }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 20,
                      height: isAndroid ? 45 : 35,
                      padding: isAndroid ? 25 : 15,
                      elevation: 0,
                    }}>
                    {this.state.RequestForgotPassloading ? (
                      <ActivityIndicator
                        color={styleConst.color.lightBlue}
                        style={{
                          marginRight: 40,
                        }}
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                          fontStyle: 'italic',
                          shadowOpacity: 0,
                          color: styleConst.color.lightBlue,
                          elevation: 0,
                        }}>
                        не помню пароль
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
              {!disableButton ? (
                <View style={styles.group}>
                  <Button
                    disabled={disableButton ? true : false}
                    active={disableButton ? false : true}
                    title="Найдите мои данные"
                    onPress={this.state.loading ? undefined : this.onPressLogin}
                    style={[styles.button, styleConst.shadow.default]}>
                    {this.state.loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Найдите мои данные</Text>
                    )}
                  </Button>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReestablishScreen);
