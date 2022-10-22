/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  Keyboard,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import {Button, Icon, IconButton, useToast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {store} from '../../core/store';
import styleConst from '../../core/style-const';
import LinearGradient from 'react-native-linear-gradient';
import Form from '../../core/components/Form/Form';

// imports for auth
import {LoginManager} from 'react-native-fbsdk-next';
import Facebook from '../auth/Facebook';
import Google from '../auth/Google';
import VK from '../auth/VK';
import Apple from '../auth/Apple';

import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import OtpAutoFillViewManager from 'react-native-otp-auto-fill';

// redux
import {connect} from 'react-redux';
import {actionSavePofile, actionGetPhoneCode} from '../actions';

import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';
import Analytics from '../../utils/amplitude-analytics';
import PhoneDetect from '../../utils/phoneDetect';

import {strings} from '../../core/lang/const';

import {verticalScale} from '../../utils/scale';
import {get, size} from 'lodash';
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

const LoginScreen = props => {
  const toast = useToast();
  const [isSigninInProgress, setSigninInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [code, setCode] = useState(false);
  const [checkCode, setCheckCode] = useState('');
  const [phone, setPhone] = useState(props?.phone);
  const [codeValue, setCodeValue] = useState('');
  const [codeSize, setCodeSize] = useState(4);
  const [vkLogin, setVKLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const CodeInput = useRef(null);

  const storeData = store.getState();

  let otpArray = [];

  const FormConfig = {
    fields: [
      {
        name: 'PHONELOGIN',
        type: 'phone',
        label: strings.Form.field.label.phone,
        value: phone,
        props: {
          required: true,
          focusNextInput: false,
          offset: 5,
        },
      },
    ],
  };

  const handleComplete = event => {
    const code = event.nativeEvent.code;
    setCodeValue(code);
    if (code.length === codeSize) {
      _verifyCodeStepTwo(code);
    }
  };

  // This is only needed once to get the Android Signature key for SMS body
  const handleOnAndroidSignature = code => {
    console.error('Android Signature Key for SMS body:', code);
  };

  const _onOtpChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      otpArray = otpArrayCopy;
      _onInputCode(otpArray.join(''));

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index < 3) {
          CodeInput[Number(index + 1)].focus();
        }
      } else {
        if (index > 0) {
          CodeInput[Number(index - 1)].focus();
        }
      }
    };
  };

  const _onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      if (Number(value)) {
        if (index > 0 && index < 3 && otpArray[index] !== '') {
          CodeInput[Number(index + 1)].focus();
        }
      }
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (
        value === 'Backspace' &&
        (otpArray[index] === '' || typeof otpArray[index] === 'undefined')
      ) {
        if (index > 0) {
          CodeInput[Number(index - 1)].focus();
        }
        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          otpArray = otpArrayCopy;
        }
        _onInputCode(otpArray.join(''));
      }
    };
  };

  const _onInputCode = text => {
    setCodeValue(text);
    if (text.length === 4) {
      _verifyCodeStepTwo(text);
    }
  };

  const _verifyCodeStepTwo = codeValueVal => {
    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (codeValueVal != checkCode) {
      if (CodeInput && CodeInput.current) {
        otpArray = [];
        CodeInput.current.clear();
        CodeInput.current.focus();
      }
      toast.show({
        description: strings.ProfileScreen.Notifications.error.wrongCode,
        placement: 'top',
        status: 'warning',
        variant: 'subtle',
      });
      return;
    }
    setLoadingVerify(true);
    props
      .actionGetPhoneCode({phone, code: codeValueVal})
      .then(data => {
        console.error('data', data);
        Keyboard.dismiss();
        PushNotifications.addTag('login', data.user.ID);
        if (data.user.SAP && data.user.SAP.ID) {
          PushNotifications.addTag('sapID', data.user.SAP.ID);
          PushNotifications.setExternalUserId(data.user.SAP.ID);
        }
        return props.actionSavePofile(data.user);
      })
      .then(() => {
        setLoadingVerify(false);
        setCodeValue('');
        props.navigation.navigate('LoginScreen');
      })
      .catch(message => {
        otpArray = [];
        setLoadingVerify(false);
        setCodeValue('');
        // Toast.show({
        //   text: strings.Notifications.error.text,
        //   position: 'top',
        //   type: 'warning',
        // });
      });
  };

  const _cancelVerify = () => {
    setCode(false);
    setLoadingVerify(false);
    setCheckCode('');
    setCodeValue('');
    setPhone('');
  };

  const _verifyCode = data => {
    let phone = data.PHONELOGIN;
    const phoneCountry = PhoneDetect.country(phone);
    if (phoneCountry && phoneCountry.code === 'ua') {
      toast.show({
        description:
          'К сожалению вы не можете авторизоваться по этому номеру телефона',
        placement: 'top',
        variant: 'subtle',
        duration: 10000,
      });
      return false;
    }
    setLoadingVerify(true);
    setPhone(phone);
    return props.actionGetPhoneCode({phone}).then(response => {
      if (response.code >= 300) {
        _cancelVerify();

        let message = strings.Notifications.error.text;

        if (response.code === 400) {
          message = strings.ProfileScreen.Notifications.error.phone;
        }

        if (response.code === 406) {
          message = strings.ProfileScreen.Notifications.error.phoneProvider;
        }
        toast.show({
          description: message,
          placement: 'top',
          variant: 'subtle',
        });
        return false;
      } else {
        setLoadingVerify(false);
        setCode(true);
        setCheckCode(response.checkCode);
        setCodeSize(response?.checkCode?.toString().length);
        CodeInput.current.focus();
        return true;
      }
    });
  };

  const _sendDataToApi = profile => {
    setLoading(true);
    return props.actionSavePofile(profile);
  };

  const _checkPhone = async data => {
    data.update = 0;
    const res = await _sendDataToApi(data);
    if (res) {
      switch (res.type) {
        case 'SAVE_PROFILE__UPDATE':
          if (res.payload && res.payload.ID && res.payload.PHONE) {
            // нашли юзверя в CRM и у него есть телефон
            setLoading(false);
            props.navigation.navigate('LoginScreen');
          }
          break;
        case 'SAVE_PROFILE__NOPHONE':
          setLoading(false);
          props.navigation.navigate('PhoneChangeScreen', {
            refererScreen: 'LoginScreen',
            returnScreen: 'LoginScreen',
            userSocialProfile: data,
            type: 'auth',
          });
          break;
        case 'SAVE_PROFILE__FAIL':
          if (res.payload.code) {
            switch (res.payload.code) {
              case 100: // Пользователь не зарегистрирован
                delete data.update; // теперь будем регать пользователя по серьёзке
                setLoading(false);
                props.navigation.navigate('PhoneChangeScreen', {
                  refererScreen: 'LoginScreen',
                  returnScreen: 'LoginScreen',
                  userSocialProfile: data,
                  type: 'auth',
                });
                break;
              default:
                setLoading(false);
                toast.show({
                  description: strings.Notifications.error.text,
                  placement: 'top',
                  variant: 'subtle',
                });
                break;
            }
          } else {
            setLoading(false);
            toast.show({
              description: strings.Notifications.error.text,
              placement: 'top',
              variant: 'subtle',
            });
          }
          break;
      }
    } else {
      setLoading(false);
      toast.show({
        description: strings.Notifications.error.text,
        placement: 'top',
        variant: 'subtle',
      });
    }
  };

  const _renderLoginButtons = region => {
    let VKenabled = true;
    let ButtonWidth = '25%';
    let ButtonHeight = 50;
    const isAndroid = Platform.OS === 'android';
    return (
      <View
        style={{
          opacity: code ? 0 : 1,
          height: code ? Platform.select({ios: 'auto', android: 0}) : 'auto',
          marginTop: 20,
          marginBottom: 10,
          width: '80%',
          marginHorizontal: '10%',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <IconButton
            onPress={() => {
              return Google.signIn(_checkPhone);
            }}
            isDisabled={isSigninInProgress}
            _icon={{
              as: FontAwesome5,
              name: 'google',
              size: 7,
              color: 'white',
            }}
            shadow={3}
            style={[
              styles.SocialLoginBt,
              {
                width: ButtonWidth,
                height: ButtonHeight,
                backgroundColor: '#4286F5',
              },
            ]}
          />
          <IconButton
            onPress={() => {
              return Facebook.signIn(_checkPhone);
            }}
            isDisabled={isSigninInProgress}
            _icon={{
              as: FontAwesome5,
              name: 'facebook',
              size: 10,
              color: 'white',
            }}
            shadow={3}
            style={[
              styles.SocialLoginBt,
              {
                backgroundColor: '#4167B2',
                width: VKenabled ? '29%' : ButtonWidth,
                height: 60,
                marginVertical: 8,
                paddingHorizontal: 8,
              },
            ]}
          />
          {VKenabled ? (
            <IconButton
              onPress={() => {
                return VK.signIn(_checkPhone);
              }}
              isDisabled={isSigninInProgress}
              _icon={{
                as: FontAwesome5,
                name: 'vk',
                size: 8,
                color: 'white',
              }}
              shadow={3}
              style={[
                styles.SocialLoginBt,
                {
                  width: ButtonWidth,
                  height: ButtonHeight,
                  backgroundColor: '#4680C2',
                },
              ]}
            />
          ) : null}
        </View>
        {!isAndroid && appleAuth.isSupported ? (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE_OUTLINE}
            buttonType={AppleButton.Type.SIGN_IN}
            cornerRadius={5}
            style={[
              styles.SocialLoginBt,
              {
                justifyContent: 'space-between',
                height: 45,
              },
            ]}
            onPress={() => {
              return Apple.signIn(_checkPhone);
            }}
          />
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/login');
    LoginManager.logOut();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1}}>
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
    <View testID="LoginScreen.Wrapper" style={{flex: 1}}>
      <ImageBackground
        resizeMode="cover"
        source={
          {uri: get(props.dealerSelected, 'img.thumb') + '1000x1000'} ||
          require('./bg.jpg')
        }
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'flex-start',
        }}>
        <View style={{marginBottom: 10}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['rgba(0, 0, 0, 0.60)', 'rgba(51, 51, 51, 0)']}
            style={styles.LinearGradient}
          />
          <View style={styles.ImageWrapper}>
            <Image
              resizeMode="contain"
              source={require('../../menu/assets/logo-horizontal-white.svg')}
            />
          </View>
          {!code ? _renderLoginButtons(props.dealerSelected.region) : null}
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: code ? 0 : 1,
            }}>
            <View
              style={{
                marginTop: 5,
                marginBottom: 10,
                width: '80%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View style={styles.LoginTextORLine} />
              <Text
                style={{
                  color: styleConst.color.accordeonGrey1,
                  fontSize: 16,
                  lineHeight: 16,
                }}>
                {strings.Base.or}
              </Text>
              <View style={styles.LoginTextORLine} />
            </View>
          </View>
          <View
            style={{
              marginTop: code ? '5%' : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                marginTop: code ? '20%' : 0,
              }}>
              {code ? (
                <>
                  <OtpAutoFillViewManager
                    onComplete={handleComplete}
                    onAndroidSignature={handleOnAndroidSignature}
                    style={styles.TextInputCode}
                    length={codeSize} // Define the length of OTP code. This is a must.
                  />
                  {/* <TextInput
                    style={styles.TextInputCode}
                    key={'textCode'}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    keyboardType="number-pad"
                    ref={CodeInput}
                    maxLength={codeSize}
                    caretHidden={false}
                    enablesReturnKeyAutomatically={true}
                    returnKeyType="send"
                    placeholderTextColor="#afafaf"
                    // onKeyPress={_onInputCode()}
                    onChangeText={text => _onInputCode(text)}
                    selected={false}
                  /> */}
                </>
              ) : (
                <Form
                  keyboardAvoidingViewProps={{
                    enableAutomaticScroll: false,
                  }}
                  contentContainerStyle={{
                    paddingHorizontal: 14,
                    marginTop: 20,
                    justifyContent: 'center',
                  }}
                  formScrollViewStyle={{
                    backgroundColor: 'none',
                  }}
                  key="loginPhoneForm"
                  fields={FormConfig.fields}
                  SubmitButton={{
                    text: strings.Form.button.receiveCode,
                    noAgreement: true,
                    rightIcon: <Icon name="sms" as={MaterialIcons} />,
                  }}
                  onSubmit={_verifyCode}
                />
              )}
            </View>
            {code ? (
              <>
                <Button
                  disabled={loadingVerify}
                  onPress={_verifyCodeStepTwo}
                  style={[styleConst.shadow.default, styles.ApproveButton]}>
                  {loadingVerify ? (
                    <ActivityIndicator color={styleConst.color.white} />
                  ) : (
                    <Text style={{color: styleConst.color.white}}>
                      {strings.ProfileScreen.approve}
                    </Text>
                  )}
                </Button>
                {!loadingVerify ? (
                  <Button
                    disabled={loadingVerify}
                    onPress={_cancelVerify}
                    size="md"
                    style={styles.CancelButton}>
                    <Text style={{color: styleConst.color.greyText}}>
                      {strings.Base.cancel.toLowerCase()}
                    </Text>
                  </Button>
                ) : null}
              </>
            ) : (
              <Button
                onPress={() => {
                  props.navigation.navigate('BonusScreenInfo', {
                    refererScreen: 'LoginScreen',
                    returnScreen: 'LoginScreen',
                  });
                }}
                _text={styles.BonusInfoButtonText}
                leftIcon={<Icon name="info" as={SimpleLineIcons} size={5} />}
                style={styles.BonusInfoButton}>
                {strings.Menu.main.bonus}
              </Button>
            )}
            {/* <Button
                onPress={_verifyCode}
                size="md"
                disabled={loadingVerify ? true : phone ? false : true}
                style={[
                  {
                    marginTop: 20,
                    width: '80%',
                    marginHorizontal: '10%',
                    backgroundColor: '#34BD78',
                    justifyContent: 'center',
                    borderRadius: 5,
                    opacity: loadingVerify ? 0 : phone ? 1 : 0,
                  },
                ]}>
                {loadingVerify ? (
                  <ActivityIndicator color={styleConst.color.white} />
                ) : (
                  <Text style={{color: styleConst.color.white}}>
                    {strings.ProfileScreen.getCode}
                  </Text>
                )}
              </Button> */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  LinearGradient: {
    height: '80%',
    width: '100%',
    position: 'absolute',
  },
  ImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '20%',
    justifyContent: 'center',
  },
  SocialLoginBt: {
    marginVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
  PhoneWrapper: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
  },
  LoginTextORLine: {
    backgroundColor: styleConst.color.accordeonGrey1,
    height: 1,
    width: '40%',
  },
  TextInputCode: {
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    fontSize: 50,
    letterSpacing: 20,
    width: '100%',
    textAlign: 'center',
  },
  CancelButton: {
    width: '30%',
    marginHorizontal: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    borderColor: styleConst.color.white,
    borderWidth: 0.6,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  ApproveButton: {
    marginTop: 10,
    width: '80%',
    marginHorizontal: '10%',
    backgroundColor: '#34BD78',
    justifyContent: 'center',
    borderRadius: 5,
  },
  BonusInfoButton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: styleConst.color.darkBg,
    borderColor: styleConst.color.white,
    borderWidth: 0.6,
    opacity: 0.95,
    borderRadius: 5,
    width: '80%',
    marginVertical: 10,
    marginHorizontal: '10%',
  },
  BonusInfoButtonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.white,
    paddingRight: styleConst.ui.horizontalGapInList,
  },
  BonusInfoButtonIcon: {
    fontSize: 20,
    marginRight: 10,
    color: styleConst.color.white,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
