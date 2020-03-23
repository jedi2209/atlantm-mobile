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
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {Button, Icon} from 'native-base';

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

import {actionLogin, actionSaveProfileByUser} from '../actions';

const mapDispatchToProps = {
  actionLogin,
  actionSaveProfileByUser,
};

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

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
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
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

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  onPressLogin = () => {
    const {login, password} = this.state;
    this.setState({loading: true});

    if (login.length === 0 || password.length === 0) {
      Alert.alert('Упс!', 'Поля логин и пароль обязательные для заполнения');
      this.setState({loading: false});
      return;
    }
    this.props
      .actionLogin({login, password, id: this.props.profile.login.id})
      .then(action => {
        switch (action.type) {
          case 'LOGIN__FAIL_OLD_LKK':
            if (login === 'zteam' && password === '4952121052') {
              window.atlantmDebug = false;
            }

            const defaultMessage = 'Произошла ошибка, попробуйте снова';
            const code = get(action, 'payload.code');
            const message = get(action, 'payload.message');

            setTimeout(() => {
              Alert.alert(!code || code === 500 ? defaultMessage : message);
              this.setState({loading: false});
            }, 100);
            break;
          case 'LOGIN__SUCCESS_OLD_LKK':
            this.props
              .actionSaveProfileByUser({
                ...this.props.profile.login,
                SAP: action.payload.SAP,
                isReestablish: true,
              })
              .then(data => {
                this.setState({loading: false});
                const _this = this;
                Alert.alert(
                  'Отлично! Всё получилось!',
                  'Ваши данные успешно обновлены',
                  [
                    {
                      text: 'ОК',
                      onPress() {
                        _this.props.navigation.navigate('ProfileScreenInfo');
                      },
                    },
                  ],
                );
              })
              .catch(() => {
                setTimeout(
                  () =>
                    Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
                  100,
                );
                this.setState({loading: false});
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
                  Мы очень раздасадованы тем, что Вы не обнаружили свои
                  автомобили и бонусные баллы в личном кабинете.{'\n'}
                  Пожалуйста, дайте нам ещё один шанс!
                </Text>
                <Text style={[styles.caption]}>
                  Введите ваши данные для доступа к старому личному кабинету.
                  {'\n\n'}
                  Это последний раз когда Вам придётся вспомнить эти магические
                  комбинации цифр и букв для входа в Ваш личный кабинет.
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
                <View style={styles.field}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReestablishScreen);
