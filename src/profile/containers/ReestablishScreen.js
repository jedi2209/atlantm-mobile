/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// redux
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

import {Button} from 'native-base';
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

//actions
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
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
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

    this.state = {
      login: '62513365',
      password: '26624988',
    };
  }

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
    };
  };

  componentDidUpdate(prevpProps) {}

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  onPressLogin = () => {
    const {login, password} = this.state;
    if (login.length === 0 || password.length === 0) {
      Alert.alert('Поле логин и пароль обязательные');
      return;
    }

    this.props
      .actionLogin({login, password, id: this.props.profile.login.id})
      .then(action => {
        console.log('action >>>>>>', action.type);
        switch (action.type) {
          case 'LOGIN__FAIL':
            if (login === 'zteam' && password === '4952121052') {
              window.atlantmDebug = false;
            }

            const defaultMessage = 'Произошла ошибка, попробуйте снова';
            const code = get(action, 'payload.code');
            const message = get(action, 'payload.message');

            setTimeout(() => {
              Alert.alert(!code || code === 500 ? defaultMessage : message);
            }, 100);
            break;
          case 'LOGIN__SUCCESS':
            console.log('LOGIN__SUCCESS >>>>', action.payload.SAP);

            this.props
              .actionSaveProfileByUser({
                ...this.props.profile.login,
                SAP: action.payload.SAP,
                isReestablish: true,
              })
              .then(data => {
                const _this = this;
                Alert.alert('Ваши данные успешно сохранены', '', [
                  {
                    text: 'ОК',
                    onPress() {
                      _this.props.navigation.navigate('ProfileScreenInfo');
                    },
                  },
                ]);
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
    const {navigation, dealerSelected} = this.props;

    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>Восстановление ЛК</Text>
              </View>
              {this.state.success ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <View style={styles.group}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                      }}>
                      Что тут написать ?
                    </Text>
                  </View>
                  <View>
                    <Button
                      onPress={() => {
                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({
                              routeName: 'BottomTabNavigation',
                            }),
                          ],
                        });
                        this.props.navigation.dispatch(resetAction);
                      }}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Назад</Text>
                    </Button>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        autoCorrect={false}
                        style={styles.textinput}
                        label="Логин"
                        value={this.state.login}
                        enablesReturnKeyAutomatically={true}
                        textContentType={'login'}
                        onChangeText={this.onChangeField('login')}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Пароль"
                        value={this.state.password || ''}
                        enablesReturnKeyAutomatically={true}
                        textContentType={'password'}
                        onChangeText={this.onChangeField('password')}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading ? undefined : this.onPressLogin
                      }
                      style={[styleConst.shadow.default, styles.button]}>
                      {this.state.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>
                          Войти в старый кабинет
                        </Text>
                      )}
                    </Button>
                  </View>
                </>
              )}
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
