/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {View, Button, HStack, Icon, useToast} from 'native-base';

import OtpAutoFillViewManager from 'react-native-otp-auto-fill';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styleConst from '../../core/style-const';
import TransitionView from '../../core/components/TransitionView';
import ToastAlert from '../../core/components/ToastAlert';
import Form from '../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {
  actionSavePofile,
  actionSaveProfileByUser,
  actionGetPhoneCode,
} from '../actions';

import {actionSetPushActionSubscribe} from '../../core/actions';

import PushNotifications from '../../core/components/PushNotifications';

import Analytics from '../../utils/amplitude-analytics';

import PhoneDetect from '../../utils/phoneDetect';

import {get} from 'lodash';

import {strings} from '../../core/lang/const';

import {verticalScale} from '../../utils/scale';
import UserData from '../../utils/user';
import {APP_PHONE_RESTRICTED, ERROR_NETWORK} from '../../core/const';

export const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
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
  actionSaveProfileByUser,
  actionGetPhoneCode,
};

const PhoneChangeScreen = props => {
  const toast = useToast();
  const mode = get(props, 'route.params.mode', 'default');
  const [code, setCode] = useState(false);
  const [checkCode, setCheckCode] = useState('');
  const [phone, setPhone] = useState(
    mode === 'addNewPhone' || mode === 'addNewEmail' ? null : props?.phone,
  );
  const [codeSize, setCodeSize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const CodeInput = useRef(null);

  const paddingHorizontalMargin = 14;

  let FormConfig = {};

  switch (mode) {
    case 'addNewPhone':
      FormConfig = {
        fields: [
          {
            name: 'PHONE',
            type: 'phone',
            label: strings.Form.field.label.phone,
            value: null,
            props: {
              required: true,
              focusNextInput: false,
            },
          },
        ],
      };
      break;
    case 'addNewEmail':
      FormConfig = {
        fields: [
          {
            name: 'PHONE',
            type: 'email',
            label: strings.Form.field.label.email,
            value: '',
            props: {
              required: true,
              focusNextInput: false,
            },
          },
        ],
      };
      break;
    default:
      FormConfig = {
        fields: [
          {
            name: 'PHONE',
            type: 'phone',
            label: strings.Form.field.label.phone,
            value: phone,
            props: {
              required: true,
              focusNextInput: false,
            },
          },
        ],
      };
      break;
  }

  const handleComplete = event => {
    const code = event.nativeEvent.code;
    if (code.length === codeSize) {
      _verifyCodeStepTwo(code);
    }
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
    let phoneTmp = data.PHONE;
    const phoneCountry = PhoneDetect.country(phoneTmp);
    if (phoneCountry && APP_PHONE_RESTRICTED.includes(phoneCountry.code)) {
      toast.show({
        render: ({id}) => {
          return (
            <ToastAlert
              id={id}
              description={
                'К сожалению вы не можете авторизоваться по этому номеру телефона'
              }
              title="Ошибка"
            />
          );
        },
      });
      return false;
    }
    setLoadingVerify(true);
    setPhone(phoneTmp);
    return props.actionGetPhoneCode({phone: phoneTmp}).then(response => {
      if (response.code >= 300) {
        _cancelVerify();

        let message = strings.Notifications.error.text;

        if (response.code === 400) {
          message = strings.ProfileScreen.Notifications.error.phone;
          if (mode === 'addNewEmail') {
            message = strings.ProfileScreen.Notifications.error.email;
          }
        }

        if (response.code === 406) {
          message = strings.ProfileScreen.Notifications.error.phoneProvider;
        }
        toast.show({
          render: ({id}) => {
            return <ToastAlert id={id} description={message} title="Ошибка" />;
          },
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

  const _verifyCodeStepTwo = async codeValueVal => {
    // тут специально одно равно чтобы сработало приведение типов
    // eslint-disable-next-line eqeqeq
    if (codeValueVal != checkCode) {
      toast.show({
        render: ({id}) => {
          return (
            <ToastAlert
              id={id}
              description={strings.ProfileScreen.Notifications.error.wrongCode}
              isClosable={false}
              title="Ошибка"
            />
          );
        },
      });
      return false;
    }
    setLoadingVerify(true);
    let profile = get(props, 'route.params.userSocialProfile');
    profile.phone = phone;
    const typeUpdate = get(props, 'route.params.type');

    switch (typeUpdate) {
      case 'auth': // авторизация
        profile.update = 0; // сначала проверяем наличие пользователя в принципе
        const actionCheckUser = await props.actionSavePofile(profile);
        if (actionCheckUser && actionCheckUser.type) {
          switch (actionCheckUser.type) {
            case 'SAVE_PROFILE__FAIL':
              if (actionCheckUser.payload.code) {
                switch (actionCheckUser.payload.code) {
                  case 100: // Пользователь не зарегистрирован
                    profile.update = true; // теперь будем регать пользователя по серьёзке
                    const actionAddUser = await props.actionSavePofile(profile);
                    if (actionAddUser) {
                      if (actionAddUser.payload.ID) {
                        setLoadingVerify(false);
                        props.navigation.navigate('LoginScreen');
                      } else {
                        toast.show({
                          render: ({id}) => {
                            return (
                              <ToastAlert
                                id={id}
                                description={strings.Notifications.error.text}
                                title="Ошибка"
                              />
                            );
                          },
                        });
                      }
                    }
                    break;
                }
              } else {
                toast.show({
                  render: ({id}) => {
                    return (
                      <ToastAlert
                        id={id}
                        description={strings.Notifications.error.text}
                        title="Ошибка"
                      />
                    );
                  },
                });
              }
              break;
            case 'SAVE_PROFILE__NOPHONE': // пользователя нашли, но без телефона
              delete profile.update;
              const crmID = actionCheckUser.payload?.ID;
              props
                .actionGetPhoneCode({
                  phone,
                  code: codeValueVal,
                  crmID,
                })
                .then(response => {
                  if (response && response.code === 200) {
                    Keyboard.dismiss();
                    PushNotifications.addTag('login', response.user.ID);
                    if (response.user.SAP && response.user.SAP.ID) {
                      PushNotifications.addTag('sapID', response.user.SAP.ID);
                      PushNotifications.setExternalUserId(response.user.SAP.ID);
                    }
                    return props.actionSavePofile(response.user);
                  } else {
                    setLoadingVerify(false);
                    toast.show({
                      render: ({id}) => {
                        return (
                          <ToastAlert
                            id={id}
                            description={strings.Notifications.error.text}
                            title="Ошибка"
                          />
                        );
                      },
                    });
                    return false;
                  }
                })
                .then(() => {
                  setLoadingVerify(false);
                  props.navigation.navigate('LoginScreen', {
                    verifyCode: false,
                  });
                });
              break;
            case 'SAVE_PROFILE__UPDATE': // пользователя нашли
              setLoadingVerify(false);
              props.navigation.navigate('LoginScreen', {
                verifyCode: false,
              });
              break;
          }
        }
        break;
      case 'profileUpdate':
        let contactUser = null;
        switch (mode) {
          case 'addNewPhone':
            if (
              get(profile, 'phone', null) &&
              typeof profile.PHONE === 'object' &&
              get(profile, 'PHONE.length', 0)
            ) {
              contactUser = profile.phone;
              profile.PHONE.push({
                IS_MAIN: false,
                TYPE_ID: 'PHONE',
                VALUE: contactUser,
                VALUE_TYPE: 'MOBILE',
              });
              delete profile.phone;
            }
            break;
          case 'addNewEmail':
            if (
              get(profile, 'phone', null) &&
              typeof profile.PHONE === 'object' &&
              get(profile, 'EMAIL.length', 0)
            ) {
              contactUser = profile.phone;
              profile.EMAIL.push({
                IS_MAIN: false,
                TYPE_ID: 'EMAIL',
                VALUE: contactUser,
                VALUE_TYPE: 'HOME',
              });
              delete profile.phone;
            }
            break;
        }
        const actionSaveUserProfile = await props.actionSaveProfileByUser(
          profile,
        );
        if (get(actionSaveUserProfile, 'type', false)) {
          setLoadingVerify(false);
          switch (actionSaveUserProfile.type) {
            case 'SAVE_PROFILE__UPDATE':
              if (mode === 'addNewPhone') {
                Analytics.logEvent('screen', 'AddPhone', {
                  phone: contactUser,
                });
              } else if (mode === 'addNewEmail') {
                Analytics.logEvent('screen', 'AddEmail', {
                  email: contactUser,
                });
              }
              props.navigation.navigate('ProfileEditScreen', {
                updateScreen: true,
              });
              break;
          }
        }
        break;
    }
    return true;
  };

  const _cancelVerify = () => {
    setCode(false);
    setLoadingVerify(false);
    setCheckCode('');
    setPhone('');
  };

  const _show_background_code = items => {
    if (!items) {
      return;
    }
    let res = [];
    const width = 100 / (items + 2);
    const screenWidth = Dimensions.get('screen').width;
    const widthElement = (screenWidth / 100) * width;
    const buttonSpace = screenWidth / (items + 0.8);
    //const buttonSpaceAndroid = parseFloat('1' + buttonSpace) / 100;
    const buttonSpaceAndroid = 1.04;

    for (let index = 0; index < items; index++) {
      res.push(
        <View
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
      <TransitionView
        animation={styleConst.animation.opacityIn}
        duration={350}
        index={1}>
        <Text style={styles.TitleText}>
          {strings.PhoneChangeScreen.enterCode}
        </Text>
        {!loadingVerify ? (
          <View mb={12}>
            <HStack
              justifyContent={'space-between'}
              position={'absolute'}
              w={'100%'}>
              {/* {res.map(el => {
                return el;
              })} */}
              <View
                key={'backgroundInputCodeMain'}
                style={{
                  height: 75,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 5,
                  width: '100%',
                }}
              />
            </HStack>
            <OtpAutoFillViewManager
              ref={CodeInput}
              onComplete={handleComplete}
              fontSize={isAndroid ? 50 : 42}
              space={isAndroid ? buttonSpaceAndroid : buttonSpace}
              style={[styles.TextInputCode, {borderWidth: 0}]}
              length={codeSize} // Define the length of OTP code. This is a must.
            />
          </View>
        ) : null}
        <TransitionView
          animation={styleConst.animation.zoomIn}
          duration={250}
          index={2}>
          {loadingVerify ? (
            <ActivityIndicator
              color={styleConst.color.blue}
              style={{
                alignSelf: 'center',
                marginTop: verticalScale(60),
              }}
            />
          ) : null}
          <Button
            isLoadingText={
              mode === 'addNewPhone'
                ? strings.PhoneChangeScreen.isLoadingAddNewPhone
                : strings.PhoneChangeScreen.isLoading
            }
            isLoading={loadingVerify}
            onPress={_cancelVerify}
            size="md"
            style={styles.CancelButton}
            _text={{color: styleConst.color.greyText}}>
            {strings.Base.cancel.toLowerCase()}
          </Button>
        </TransitionView>
      </TransitionView>
    );
  };

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/PhoneViaAuth');
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
    <TouchableWithoutFeedback
      style={styles.mainView}
      onPress={Keyboard.dismiss}>
      <View style={styles.mainView}>
        <View
          style={{
            flex: 1,
            marginTop: 40,
            paddingHorizontal: paddingHorizontalMargin,
          }}>
          {code ? (
            _show_background_code(codeSize)
          ) : (
            <>
              <Text style={styles.TitleText}>
                {strings.PhoneChangeScreen.title}
              </Text>
              <Text style={styles.TitleCommentText}>
                {strings.PhoneChangeScreen.addNewComment[mode]
                  ? strings.PhoneChangeScreen.addNewComment[mode]
                  : strings.PhoneChangeScreen.comment}
              </Text>
              <Form
                key="phoneChangeForm"
                fields={FormConfig.fields}
                barStyle={'light-content'}
                keyboardAvoidingViewProps={{
                  enableAutomaticScroll: false,
                }}
                SubmitButton={{
                  text: strings.Form.button.receiveCode,
                  rightIcon: (
                    <Icon
                      name="sms"
                      as={MaterialIcons}
                      style={styles.BonusInfoButtonIcon}
                    />
                  ),
                }}
                onSubmit={_verifyCode}
              />
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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
  TextInputCode: {
    height: 70,
    marginLeft: isAndroid ? 0 : 22,
    borderWidth: 0.6,
    width: '100%',
  },
  CancelButton: {
    width: '80%',
    marginHorizontal: '10%',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneChangeScreen);
