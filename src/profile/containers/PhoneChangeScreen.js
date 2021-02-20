/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent, createRef} from 'react';
import {
  View,
  TextInput,
  Keyboard,
  Text,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import {Button, Icon, Toast, Content} from 'native-base';
import PhoneInput from 'react-native-phone-input';
import {store} from '../../core/store';
import styleConst from '../../core/style-const';
import LinearGradient from 'react-native-linear-gradient';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';
import Form from '../../core/components/Form/Form';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';

// imports for auth
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {LoginManager} from 'react-native-fbsdk';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import VKLogin from 'react-native-vkontakte-login';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

// redux
import {connect} from 'react-redux';
import {actionSavePofile, actionGetPhoneCode} from '../actions';

import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';
import Amplitude from '../../utils/amplitude-analytics';

import strings from '../../core/lang/const';

import {verticalScale} from '../../utils/scale';
import {ScrollView} from 'react-native';
import {string} from 'prop-types';
import UserData from '../../utils/user';

export const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: profile.email,
    car: profile.car,
    carNumber: profile.carNumber,

    isFetchProfileData: profile.meta.isFetchProfileData,

    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,

    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  actionSetPushGranted,
  actionSetPushActionSubscribe,

  actionSavePofile,
  actionGetPhoneCode,
};

class PhoneChangeScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSigninInProgress: false,
      userInfo: {},
      code: false,
      checkCode: '',
      phone: '',
      codeValue: '',
      vkLogin: false,
      loading: false,
      loadingVerify: false,
      pickerData: null,
    };

    this.FormConfig = {
      fields: [
        {
          name: 'PHONE',
          type: 'phone',
          label: strings.Form.field.label.phone,
          value: this.props.phone,
          props: {
            required: true,
            focusNextInput: false,
          },
        },
      ],
    };
  }

  CodeInput = [];
  otpArray = [];

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: [stylesHeader.resetBorder, {backgroundColor: '#eee'}],
      headerTitleStyle: stylesHeader.transparentHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          icon="md-close"
          IconStyle={{
            fontSize: 42,
            width: 40,
            color: '#222B45',
          }}
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  _onOtpChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = this.otpArray.concat();
      otpArrayCopy[index] = value;
      this.otpArray = otpArrayCopy;
      this._onInputCode(this.otpArray.join(''));

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index < 3) {
          this.CodeInput[Number(index + 1)].focus();
        }
      } else {
        if (index > 0) {
          this.CodeInput[Number(index - 1)].focus();
        }
      }
    };
  };

  _onOtpKeyPress = (index) => {
    return ({nativeEvent: {key: value}}) => {
      if (Number(value)) {
        if (index > 0 && index < 3 && this.otpArray[index] !== '') {
          this.CodeInput[Number(index + 1)].focus();
        }
      }
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace') {
        if (
          this.otpArray[index] === '' ||
          typeof this.otpArray[index] === 'undefined'
        ) {
          if (index > 0) {
            this.CodeInput[Number(index - 1)].focus();
            this.CodeInput[Number(index - 1)].clear();
            this.otpArray[Number(index - 1)] = '';
          }
        }
        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = this.otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          this.otpArray = otpArrayCopy;
        }
        this._onInputCode(this.otpArray.join(''));
      }
    };
  };

  _verifyCode = (phone) => {
    this.setState({loadingVerify: true});
    // this.props.navigation.setParams({
    //   verifyCode: true,
    // });
    this.props.actionGetPhoneCode({phone}).then((response) => {
      if (response.code >= 300) {
        this.setState({
          code: false,
          loadingVerify: false,
          checkCode: '',
          codeValue: '',
        });

        let message = strings.Notifications.error.text;

        if (response.code === 400) {
          message = strings.ProfileScreen.Notifications.error.phone;
        }

        if (response.code === 406) {
          message = strings.ProfileScreen.Notifications.error.phoneProvider;
        }
        Toast.show({
          text: message,
          position: 'top',
          type: 'warning',
        });
      } else {
        this.setState({
          code: true,
          loadingVerify: false,
          checkCode: response.checkCode,
        });
        this.CodeInput[0].focus();
      }
      return;
    });
  };

  _verifyCodeStepTwo = async () => {
    const phone = this.state.phone;
    const code = this.state.codeValue;

    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (code != this.state.checkCode) {
      this.setState({codeValue: ''});
      this.CodeInput[0].clear();
      this.CodeInput[1].clear();
      this.CodeInput[2].clear();
      this.CodeInput[3].clear();
      this.CodeInput[0].focus();
      this.otpArray = [];
      Toast.show({
        text: strings.ProfileScreen.Notifications.error.wrongCode,
        buttonText: 'ОК',
        position: 'top',
        type: 'danger',
      });
      return;
    }
    this.setState({loading: true, loadingVerify: true});

    let profile = this.props.navigation.state.params.userSocialProfile;
    profile.phone = phone;

    const typeUpdate = this.props.navigation.state.params.type;

    switch (typeUpdate) {
      case 'auth': // авторизация
        profile.update = 0; // сначала проверяем наличие пользователя в принципе
        const actionCheckUser = await this.props.actionSavePofile(profile);
        if (actionCheckUser && actionCheckUser.type) {
          console.log('actionCheckUser.type', actionCheckUser.type);
          switch (actionCheckUser.type) {
            case 'SAVE_PROFILE__FAIL':
              if (actionCheckUser.payload.code) {
                switch (actionCheckUser.payload.code) {
                  case 100: // Пользователь не зарегистрирован
                    delete profile.update; // теперь будем регать пользователя по серьёзке
                    const actionAddUser = await this.props.actionSavePofile(
                      profile,
                    );
                    if (actionAddUser) {
                      if (actionAddUser.payload.ID) {
                        this.setState({loading: false});
                        this.props.navigation.navigate('ProfileScreenInfo');
                      } else {
                        Toast.show({
                          text: strings.Notifications.error.text,
                          position: 'bottom',
                          type: 'warning',
                        });
                      }
                    }
                    break;
                }
              } else {
                Toast.show({
                  text: strings.Notifications.error.text,
                  position: 'bottom',
                  type: 'warning',
                });
              }
              break;
            case 'SAVE_PROFILE__UPDATE': // пользователя нашли
              this.setState({loading: false});
              this.props.navigation.navigate('ProfileScreenInfo');
              break;
          }
        }
        break;
    }
    return true;
  };

  _onInputCode = (text) => {
    if (text.length === 4) {
      this.setState({codeValue: text}, () => {
        this._verifyCodeStepTwo();
      });
    }
  };

  _onPressSubmit = (data) => {
    this.setState(
      {
        phone: data.PHONE,
      },
      () => {
        if (data.PHONE) {
          this._verifyCode(data.PHONE);
        }
      },
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.mainView}>
          <ActivityIndicator
            color="#0061ED"
            style={{
              alignSelf: 'center',
              marginTop: verticalScale(60),
            }}
          />
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback
        style={styles.mainView}
        onPress={Keyboard.dismiss}>
        <View style={styles.mainView}>
          <View
            style={{
              flex: 1,
              marginTop: 40,
              paddingHorizontal: 14,
            }}>
            {this.state.code ? (
              <>
                <Text style={styles.CodeTitleText}>
                  {strings.PhoneChangeScreen.enterCode}
                </Text>
                <View style={styles.CodeWrapper}>
                  {[0, 1, 2, 3].map((element, index) => (
                    <TextInput
                      style={styles.CodeTextInput}
                      key={'textCode' + index}
                      textContentType="oneTimeCode"
                      keyboardType="number-pad"
                      ref={(input) => {
                        this.CodeInput[index] = input;
                      }}
                      maxLength={1}
                      caretHidden={true}
                      enablesReturnKeyAutomatically={true}
                      returnKeyType="send"
                      placeholderTextColor="#afafaf"
                      autoCompleteType="off"
                      onKeyPress={this._onOtpKeyPress(index)}
                      onChangeText={this._onOtpChange(index)}
                      selected={false}
                    />
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.TitleText}>
                  {strings.PhoneChangeScreen.title}
                </Text>
                <Text style={styles.TitleCommentText}>
                  {strings.PhoneChangeScreen.comment}
                </Text>
                <Form
                  fields={this.FormConfig.fields}
                  barStyle={'light-content'}
                  SubmitButton={{
                    text: strings.Form.button.receiveCode,
                    iconRight: (
                      <Icon
                        name="sms"
                        type="MaterialIcons"
                        style={styles.BonusInfoButtonIcon}
                      />
                    ),
                  }}
                  onSubmit={this._onPressSubmit}
                />
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#eee',
  },
  BonusInfoButtonIcon: {
    fontSize: 20,
    marginLeft: 10,
    color: styleConst.color.white,
  },
  TitleText: {
    color: '#222B45',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: styleConst.font.medium,
    marginBottom: 25,
  },
  TitleCommentText: {
    color: styleConst.color.greyText,
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    marginBottom: 25,
  },
  CodeTitleText: {
    color: '#222B45',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: styleConst.font.medium,
    marginBottom: 25,
  },
  CodeWrapper: {
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: '5%',
  },
  CodeTextInput: {
    height: 100,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#fff',
    backgroundColor: 'rgba(175, 175, 175, 0.7)',
    borderRadius: 5,
    fontSize: 80,
    letterSpacing: 0,
    marginLeft: '3%',
    width: '22%',
    textAlign: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneChangeScreen);
