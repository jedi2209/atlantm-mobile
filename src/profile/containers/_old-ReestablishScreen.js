/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';

import {get} from 'lodash';
import {
  Animated,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';

import {Button, Icon, Toast} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

import {
  actionLogin,
  actionSaveProfileByUser,
  actionRequestForgotPass,
} from '../actions';

const mapStateToProps = ({dealer, profile, contacts, nav, info}) => {
  return {
    list: info.list,
    nav,
    profile,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = {
  actionLogin,
  actionSaveProfileByUser,
  actionRequestForgotPass,
};

const deviceWidth = Dimensions.get('window').width;
const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  // Скопировано из ProfileSettingsScreen.
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: styleConst.color.white,
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
    height: !isAndroid ? 60 : 'auto',
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
    padding: 15,
  },
  buttonText: {
    color: styleConst.color.white,
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

    this._animated = {
      SubmitButton: new Animated.Value(0),
      duration: 150,
    };

    this.disableButton = false;
  }

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  checkLoginPass() {
    const {login, password} = this.state;
    if (login.length === 0 || password.length === 0) {
      Toast.show({
        title: strings.ReestablishScreen.fieldsRequired,
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
        title: strings.ReestablishScreen.loginRequired,
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
      .then(action => {
        switch (action.type) {
          case 'LOGIN__FAIL_OLD_LKK':
            if (login === 'zteam' && password === '4952121052') {
              window.atlantmDebug = false;
            }

            const defaultMessage = strings.Notifications.error.text;
            const code = get(action, 'payload.code');
            const message = get(action, 'payload.message');
            Toast.show({
              title: !code || code === 500 ? defaultMessage : message,
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
              .then(data => {
                this.setState({loading: false});
                const _this = this;
                Toast.show({
                  title: strings.Notifications.success.title,
                });
                setTimeout(() => {
                  _this.props.navigation.navigate('LoginScreen');
                }, 500);
              })
              .catch(() => {
                this.setState({loading: false});
                Toast.show({
                  title: strings.Notifications.error.text,
                });
              });
            break;
        }
      });
  };

  render() {
    if (this.state.login.length === 0 || this.state.password.length === 0) {
      Animated.timing(this._animated.SubmitButton, {
        toValue: 0,
        duration: this._animated.duration,
        useNativeDriver: true,
      }).start(() => {
        this.disableButton = true;
      });
    } else {
      Animated.timing(this._animated.SubmitButton, {
        toValue: 1,
        duration: this._animated.duration,
        useNativeDriver: true,
      }).start(() => {
        this.disableButton = false;
      });
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon
              as={MaterialCommunityIcons}
              name="emoticon-cry-outline"
              style={{fontSize: 48, position: 'absolute'}}
            />
            <Text style={[styles.caption, {marginLeft: 60}]}>
              {strings.ReestablishScreen.notFound.text} {'\n'}
              {strings.ReestablishScreen.notFound.text2}
            </Text>
            <Text style={[styles.caption]}>
              {strings.ReestablishScreen.notFound.caption} {'\n\n'}
              {strings.ReestablishScreen.notFound.caption2}
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
                label={strings.Form.field.label.login}
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
                label={strings.Form.field.label.pass}
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
                variant="unstyled"
                transparent
                title={strings.ReestablishScreen.forgotPass}
                onPress={() => {
                  this.setState({RequestForgotPassloading: true});
                  if (!this.checkLogin()) {
                    return false;
                  }
                  this.props
                    .actionRequestForgotPass(this.state.login)
                    .then(action => {
                      switch (action.type) {
                        case 'FORGOT_PASS_REQUEST__SUCCESS':
                          Toast.show({
                            title: action.payload.message
                              ? action.payload.message
                              : strings.Notifications.success.title,
                          });
                          break;
                        default:
                          Toast.show({
                            title: action.payload.message,
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
                    {strings.ReestablishScreen.forgotPass.toLowerCase()}
                  </Text>
                )}
              </Button>
            </View>
          </View>
          {!this.disableButton ? (
            <Animated.View
              style={[
                styles.group,
                {
                  opacity: this._animated.SubmitButton,
                },
              ]}>
              <Button
                size="full"
                full
                disabled={this.disableButton ? true : false}
                active={this.disableButton ? false : true}
                title={strings.ReestablishScreen.findMyData}
                onPress={this.state.loading ? undefined : this.onPressLogin}
                style={[styles.button, styleConst.shadow.default]}>
                {this.state.loading ? (
                  <ActivityIndicator color={styleConst.color.white} />
                ) : (
                  <Text style={styles.buttonText}>
                    {strings.ReestablishScreen.findMyData}
                  </Text>
                )}
              </Button>
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReestablishScreen);
