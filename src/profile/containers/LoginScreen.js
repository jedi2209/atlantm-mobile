/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {Button, HStack, Icon, useToast, VStack, View} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styleConst from '../../core/style-const';
import LinearGradient from 'react-native-linear-gradient';
import Form from '../../core/components/Form/Form';

// imports for auth
import {SocialAuthButton} from '../components/SocialAuthButton';

import OtpAutoFillViewManager from 'react-native-otp-auto-fill';

// redux
import {connect} from 'react-redux';
import {actionSavePofile, actionGetPhoneCode} from '../actions';

import {actionSetPushActionSubscribe} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';
import Analytics from '../../utils/amplitude-analytics';
import PhoneDetect from '../../utils/phoneDetect';
import API from '../../utils/api';

import {strings} from '../../core/lang/const';

import {verticalScale} from '../../utils/scale';
import UserData from '../../utils/user';
import {
  APP_PHONE_RESTRICTED,
  APP_REGION,
  COORDS_DEFAULT,
  ERROR_NETWORK,
  UKRAINE,
  APP_VERSION,
} from '../../core/const';

export const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, core}) => {
  return {
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    region: dealer.region,
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
  actionSetPushActionSubscribe,
  actionSavePofile,
  actionGetPhoneCode,
};

const backgrounds = {
  day: [
    require('../../../assets/lkk/day_1.png'),
    require('../../../assets/lkk/day_2.png'),
    require('../../../assets/lkk/day_3.png'),
    require('../../../assets/lkk/day_4.png'),
    require('../../../assets/lkk/day_5.png'),
    require('../../../assets/lkk/day_6.png'),
  ],
  sunset: [
    require('../../../assets/lkk/sunset_1.png'),
    require('../../../assets/lkk/sunset_2.png'),
    require('../../../assets/lkk/sunset_3.png'),
    require('../../../assets/lkk/sunset_4.png'),
    require('../../../assets/lkk/sunset_5.png'),
    require('../../../assets/lkk/sunset_6.png'),
  ],
  night: [
    require('../../../assets/lkk/night_1.png'),
    require('../../../assets/lkk/night_2.png'),
    require('../../../assets/lkk/night_3.png'),
    require('../../../assets/lkk/night_4.png'),
    require('../../../assets/lkk/night_5.png'),
    require('../../../assets/lkk/night_6.png'),
  ],
  // all: [
  //   require('../../../assets/lkk/day_1.png'),
  //   require('../../../assets/lkk/day_2.png'),
  //   require('../../../assets/lkk/day_3.png'),
  //   require('../../../assets/lkk/day_4.png'),
  //   require('../../../assets/lkk/day_5.png'),
  //   require('../../../assets/lkk/day_6.png'),
  //   require('../../../assets/lkk/sunset_1.png'),
  //   require('../../../assets/lkk/sunset_2.png'),
  //   require('../../../assets/lkk/sunset_3.png'),
  //   require('../../../assets/lkk/sunset_4.png'),
  //   require('../../../assets/lkk/sunset_5.png'),
  //   require('../../../assets/lkk/sunset_6.png'),
  // ],
};

const getSunrise = async (
  lat = COORDS_DEFAULT.lat,
  lng = COORDS_DEFAULT.lon,
) => {
  const url =
    'http://api.sunrise-sunset.org/json?lat=' +
    lat +
    '&lng=' +
    lng +
    '&formatted=1';
  return await API.apiGetData(url);
};

const getBackground = (hrs = 12) => {
  // const res = await getSunrise();
  // console.log('res', res);
  let currArray = backgrounds.day;
  // if (hrs >= 7 && hrs < 17) {
  //   currArray = backgrounds.day;
  // }
  if (hrs >= 17 && hrs < 22) {
    currArray = backgrounds.sunset;
  }
  if (hrs < 7 || hrs >= 22) {
    currArray = backgrounds.night;
  }
  const num = Math.floor(Math.random() * currArray.length);
  return currArray[num];
};

const LoginScreen = props => {
  const {region, navigation, actionSavePofile, actionGetPhoneCode} = props;

  const toast = useToast();
  const [isSigninInProgress, setSigninInProgress] = useState(false);
  const [code, setCode] = useState(false);
  const [checkCode, setCheckCode] = useState('');
  const [phone, setPhone] = useState(props?.phone);
  const [codeValue, setCodeValue] = useState('');
  const [codeSize, setCodeSize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [background, setBackground] = useState(backgrounds.day[0]);
  const [bonusButtonOpaticy, setBonusButtonOpaticy] = useState(1);

  const _animated = {
    SubmitButton: new Animated.Value(bonusButtonOpaticy),
    duration: 200,
  };

  const _showHideSubmitButton = show => {
    if (show) {
      Animated.timing(_animated.SubmitButton, {
        toValue: 1,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setBonusButtonOpaticy(1);
      });
    } else {
      Animated.timing(_animated.SubmitButton, {
        toValue: 0,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setBonusButtonOpaticy(0);
      });
    }
  };

  useEffect(() => {
    _showHideSubmitButton(!keyboardShow);
  }, [keyboardShow]);

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
    actionGetPhoneCode({phone, code: codeValueVal})
      .then(data => {
        Keyboard.dismiss();
        PushNotifications.addTag('login', data.user.ID);
        if (data.user.SAP && data.user.SAP.ID) {
          PushNotifications.addTag('sapID', data.user.SAP.ID);
          PushNotifications.setExternalUserId(data.user.SAP.ID);
        }
        return actionSavePofile(data.user);
      })
      .then(() => {
        setLoadingVerify(false);
        setCodeValue('');
        navigation.navigateDeprecated('LoginScreen');
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

  const _verifyCode = async data => {
    const isInternet = require('../../utils/internet').default;
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      toast.show({
        title: ERROR_NETWORK,
        status: 'warning',
        duration: 2000,
        id: 'networkError',
      });
      return;
    }
    let phone = data.PHONELOGIN;
    const phoneCountry = PhoneDetect.country(phone);
    if (phoneCountry && APP_PHONE_RESTRICTED.includes(phoneCountry.code)) {
      toast.show({
        description: strings.ProfileScreen.restrictedPhone,
        placement: 'top',
        variant: 'subtle',
        duration: 10000,
      });
      return false;
    }
    setLoadingVerify(true);
    setPhone(phone);
    return actionGetPhoneCode({phone}).then(response => {
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
    return actionSavePofile(profile);
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
            navigation.navigateDeprecated('LoginScreen');
          }
          break;
        case 'SAVE_PROFILE__NOPHONE':
          setLoading(false);
          navigation.navigateDeprecated('PhoneChangeScreen', {
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
                navigation.navigateDeprecated('PhoneChangeScreen', {
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
    let ButtonWidth = '30%';
    let ButtonHeight = 60;

    const isAndroid = Platform.OS === 'android';

    if (isAndroid) {
      ButtonWidth = '45%';
    }
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
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <SocialAuthButton
            type="Google"
            onPress={_checkPhone}
            isDisabled={isSigninInProgress}
            style={{
              width: ButtonWidth,
              height: ButtonHeight,
            }}
          />
          {!isAndroid ? (
            <SocialAuthButton
              type="Apple"
              style={{
                width: ButtonWidth,
                height: ButtonHeight,
              }}
              onPress={_checkPhone}
            />
          ) : null}
          {VKenabled ? (
            <SocialAuthButton
              type="VK"
              onPress={_checkPhone}
              isDisabled={isSigninInProgress}
              style={{
                width: ButtonWidth,
                height: ButtonHeight,
              }}
            />
          ) : null}
        </HStack>
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
    let buttonSpace = (screenWidth * 0.75) / (items + 1);
    let buttonSpaceAndroid = 1;
    //const buttonSpaceAndroid = parseFloat('1' + buttonSpace) / 100;
    switch (screenWidth) {
      case 540:
        buttonSpaceAndroid = 1.55;
        break;
      case 411:
      case 414:
        // scale 2.75
        buttonSpace = (screenWidth * 0.72) / (items + 1);
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
          rounded={'lg'}
          style={{
            height: 75,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
          <View
            key={'backgroundInputCodeMain'}
            style={{
              height: 75,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '100%',
            }}
            rounded={'lg'}
          />
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
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );

    const currHours = new Date().getHours(); //To get the Current Hours
    setBackground(getBackground(currHours));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator
          color={styleConst.color.blue}
          size="large"
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
        source={background}
        style={styles.imageBackground}
      />
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['rgba(0, 0, 0, 0.60)', 'rgba(51, 51, 51, 0)']}
        style={styles.LinearGradient}
      />
      <View mb={5} flex={1}>
        <View style={styles.ImageWrapper}>
          <Image
            resizeMode="contain"
            source={require('../../menu/assets/logo-horizontal-white.svg')}
          />
        </View>
        {!code ? _renderLoginButtons(region || APP_REGION) : null}
        <View
          justifyContent={'center'}
          alignItems={'center'}
          opacity={code ? 0 : 1}>
          <HStack
            mt={2}
            mb={3}
            w={'4/5'}
            alignItems={'center'}
            justifyContent={'space-around'}>
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
          </HStack>
        </View>
        <VStack
          alignItems={'center'}
          justifyContent={'center'}
          mt={code ? '5%' : 0}>
          <HStack w={'80%'} mt={code ? '20%' : 0}>
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
                  rightIcon: <Icon name="sms" as={MaterialIcons} />,
                  noAgreement: false,
                }}
                AgreementCheckbox={
                  APP_REGION === UKRAINE
                    ? {
                        defaultIsChecked: true,
                        isDisabled: true,
                        isChecked: true,
                      }
                    : {}
                }
                onSubmit={_verifyCode}
              />
            )}
          </HStack>
          {code ? (
            <>
              <Button
                onPress={_verifyCodeStepTwo}
                isLoadingText={strings.PhoneChangeScreen.isLoading}
                isLoading={loadingVerify}
                _text={{color: styleConst.color.white}}
                rounded={'lg'}
                style={[styleConst.shadow.default, styles.ApproveButton]}>
                {strings.ProfileScreen.approve}
              </Button>
              {!loadingVerify ? (
                <Button
                  disabled={loadingVerify}
                  onPress={_cancelVerify}
                  size="md"
                  rounded={'lg'}
                  style={styles.CancelButton}
                  _text={{color: styleConst.color.greyText}}>
                  {strings.Base.cancel.toLowerCase()}
                </Button>
              ) : null}
            </>
          ) : (
            <Animated.View
              style={{
                opacity: _animated.SubmitButton,
              }}>
              <Button
                onPress={() => {
                  navigation.navigateDeprecated('BonusScreenInfo', {
                    refererScreen: 'LoginScreen',
                    returnScreen: 'LoginScreen',
                  });
                }}
                _text={styles.BonusInfoButtonText}
                leftIcon={<Icon name="info" as={SimpleLineIcons} size={5} />}
                rounded={'lg'}
                w={'60%'}
                style={styles.BonusInfoButton}>
                {strings.Menu.main.bonus}
              </Button>
            </Animated.View>
          )}
        </VStack>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={{marginBottom: 120, color: styleConst.color.white}}>
          {APP_VERSION}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: Dimensions.get('window').height,
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
  },
  LinearGradient: {
    height: Dimensions.get('window').height,
    width: '100%',
    position: 'absolute',
  },
  ImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '20%',
    justifyContent: 'center',
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
    marginTop: 20,
  },
  ApproveButton: {
    marginTop: 10,
    width: '80%',
    marginHorizontal: '10%',
    backgroundColor: '#34BD78',
    justifyContent: 'center',
  },
  BonusInfoButton: {
    backgroundColor: styleConst.color.darkBg,
    borderColor: styleConst.color.white,
    borderWidth: 0.6,
    opacity: 0.95,
    paddingLeft: 0,
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
