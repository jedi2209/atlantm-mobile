/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Keyboard,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Button, HStack, Icon, IconButton, useToast} from 'native-base';
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
  const [code, setCode] = useState(false);
  const [checkCode, setCheckCode] = useState('');
  const [phone, setPhone] = useState(props?.phone);
  const [codeValue, setCodeValue] = useState('');
  const [codeSize, setCodeSize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

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

  const _verifyCodeStepTwo = codeValueVal => {
    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (codeValueVal != checkCode) {
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

  const _show_background_code = items => {
    if (!items) {
      return;
    }
    let res = [];
    const width = 100 / (items + 2);
    const screenWidth = Number.parseInt(
      Dimensions.get('window').width.toFixed(),
    );
    const widthElement = (screenWidth / 100) * width;
    const buttonSpace = (screenWidth * 0.75) / (items + 1);
    console.info('screenWidth', Dimensions.get('window'), screenWidth);
    let buttonSpaceAndroid = 1;
    //const buttonSpaceAndroid = parseFloat('1' + buttonSpace) / 100;
    switch (screenWidth) {
      case 540:
        buttonSpaceAndroid = 1.55;
        break;
      case 411:
        // scale 2.75
        buttonSpaceAndroid = 1.05;
        break;
      case 393:
        // scale 3.5
        buttonSpaceAndroid = 0.97;
        break;
      case 674:
        // scale 2.625
        buttonSpaceAndroid = 2.06;
        break;
      default:
        break;
    }

    for (let index = 0; index < items; index++) {
      res.push(
        <View
          key={'backgroundInputCode' + index}
          style={{
            height: 75,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 5,
            width: widthElement,
          }}
        />,
      );
    }
    return (
      <>
        <HStack
          justifyContent={'space-between'}
          position={'absolute'}
          w={'100%'}>
          {res.map(el => {
            return el;
          })}
        </HStack>
        <OtpAutoFillViewManager
          onComplete={handleComplete}
          fontSize={isAndroid ? 52 : 45}
          space={isAndroid ? buttonSpaceAndroid : buttonSpace}
          style={[styles.TextInputCode, {borderWidth: 0}]}
          length={codeSize} // Define the length of OTP code. This is a must.
        />
      </>
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
          color={styleConst.color.blue}
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
                !loadingVerify ? (
                  _show_background_code(codeSize)
                ) : null
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
                  onPress={_verifyCodeStepTwo}
                  isLoadingText={strings.PhoneChangeScreen.isLoading}
                  isLoading={loadingVerify}
                  _text={{color: styleConst.color.white}}
                  style={[styleConst.shadow.default, styles.ApproveButton]}>
                  {strings.ProfileScreen.approve}
                </Button>
                {!loadingVerify ? (
                  <Button
                    disabled={loadingVerify}
                    onPress={_cancelVerify}
                    size="md"
                    style={styles.CancelButton}
                    _text={{color: styleConst.color.greyText}}>
                    {strings.Base.cancel.toLowerCase()}
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
    height: 70,
    marginLeft: isAndroid ? 0 : 25,
    borderWidth: 0.6,
    width: '100%',
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
