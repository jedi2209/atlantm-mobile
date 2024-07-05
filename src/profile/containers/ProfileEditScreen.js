/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Text, Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, View, ScrollView, useToast} from 'native-base';

import {getTimestamp, substractYears} from '../../utils/date';

import {useForm, Controller} from 'react-hook-form';
import TransitionView from '../../core/components/TransitionView';
import SocialAuth from '../components/SocialAuth';
import {
  AgreementCheckbox,
  GroupForm,
  InputCustom,
} from '../../core/components/Form/InputCustom';

import {connect} from 'react-redux';

import {actionSaveProfileToAPI, actionDeleteProfile} from '../actions';
import styleConst from '../../core/style-const';

import Analytics from '../../utils/amplitude-analytics';
import {strings} from '../../core/lang/const';
import {ERROR_NETWORK} from '../../core/const';

import {get} from 'lodash';
import {Icon} from 'react-native-paper';

const mapStateToProps = ({profile, dealer}) => {
  return {
    profile: profile.login,
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  actionSaveProfileToAPI,
  actionDeleteProfile,
};

const ProfileEditScreen = props => {
  const {NAME, LAST_NAME, SECOND_NAME, EMAIL, PHONE, BIRTHDATE} = props.profile;
  const [loading, setLoading] = useState(false);
  const [sendingForm, setFormSending] = useState(false);
  const [sendingFormStatus, setFormSendingStatus] = useState(null);
  const navigation = useNavigation();
  const toast = useToast();

  let emailData = [];
  let emailDefaultData = {};
  let phoneDefaultData = {};
  let phoneData = [];
  let birthdate = null;

  if (get(EMAIL, 'length')) {
    EMAIL.map((field, num) => {
      const fieldID = 'email__' + get(field, 'ID', num);
      emailDefaultData[fieldID] = get(field, 'VALUE');
    });
  }

  if (get(PHONE, 'length')) {
    PHONE.map((field, num) => {
      const fieldID = 'phone__' + get(field, 'ID', num);
      phoneDefaultData[fieldID] = get(field, 'VALUE');
    });
  }

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      NAME: NAME,
      SECOND_NAME: SECOND_NAME,
      LAST_NAME: LAST_NAME,
      ...emailDefaultData,
      ...phoneDefaultData,
    },
  });

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/edit');
  }, []);

  if (get(EMAIL, 'length')) {
    EMAIL.map((field, num) => {
      const fieldID = 'email__' + get(field, 'ID', num);
      const isLast = num === EMAIL.length - 1;
      emailData.push(
        <Controller
          control={control}
          name={fieldID}
          key={fieldID}
          render={({field: {onChange, onBlur, value}}) => (
            <InputCustom
              key={'input' + fieldID}
              type="email"
              label={null}
              style={{marginBottom: isLast ? 0 : 6}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />,
      );
    });
  }

  if (get(PHONE, 'length')) {
    PHONE.map((field, num) => {
      const fieldID = 'phone__' + get(field, 'ID', num);
      const isLast = num === PHONE.length - 1;
      phoneData.push(
        <Controller
          control={control}
          name={fieldID}
          key={fieldID}
          render={({field: {onChange, onBlur, value}}) => (
            <InputCustom
              key={'input' + fieldID}
              type="phone"
              num={num}
              label={null}
              style={{marginBottom: isLast ? 0 : 6}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />,
      );
    });
  } else {
    phoneData = PHONE;
  }

  if (typeof BIRTHDATE === 'string' && BIRTHDATE.length > 0) {
    birthdate = new Date(BIRTHDATE);
  } else if (typeof BIRTHDATE === 'object') {
    birthdate = BIRTHDATE;
  }

  const FormConfig = {
    fields: {
      groups: [
        {
          name: strings.Form.group.additional,
          fields: [
            {
              name: 'BIRTHDATE',
              type: 'date',
              label: strings.Form.field.label.birthday,
              value: birthdate,
              props: {
                maximumDate: new Date(substractYears(18)),
                minimumDate: new Date(substractYears(100)),
                placeholder: strings.Form.field.placeholder.birthday,
              },
            },
          ],
        },
      ],
    },
  };

  const _onPressSave = async data => {
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

    setFormSending(true);
    let emailValue = [];
    let phoneValue = [];
    let propsTmp = {};

    Object.entries(data).forEach(field => {
      if (field[0].startsWith('email__')) {
        emailValue.push({
          ID: field[0].replace('email__', ''),
          TYPE_ID: 'EMAIL',
          VALUE: field[1],
          VALUE_TYPE: 'HOME',
        });
        delete data[field[0]];
      } else if (field[0].startsWith('phone__')) {
        phoneValue.push({
          ID: field[0].replace('phone__', ''),
          TYPE_ID: 'PHONE',
          VALUE: field[1],
          VALUE_TYPE: 'MOBILE',
        });
        delete data[field[0]];
      }
    });

    delete data.agreementCheckbox;

    let formData = {
      ...data,
      EMAIL: emailValue,
      PHONE: phoneValue,
    };

    const profileToSend = Object.assign(
      {ID: get(props, 'profile.ID')},
      formData,
    );

    return props
      .actionSaveProfileToAPI(profileToSend)
      .then(response => {
        setFormSendingStatus(true);
        setTimeout(() => {
          setFormSendingStatus(null);
          navigation.navigate('LoginScreen');
          // setFormSending(false);
          // setTimeout(() => navigation.navigate('LoginScreen'), 300);
        }, 500);
        return response;
      })
      .catch(() => {
        setTimeout(
          () =>
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            ),
          100,
        );
        setFormSendingStatus(false);
        setTimeout(() => {
          setFormSendingStatus(null);
          setFormSending(false);
        }, 1000);
        return false;
      });
  };

  const _onPressDelete = () => {
    setLoading(true);
    return props
      .actionDeleteProfile(props.profile)
      .then(data => {
        Alert.alert('', data.error.message, [
          {
            text: strings.Base.ok,
            style: 'default',
            onPress: () => {
              navigation.goBack(null);
              navigation.navigate('LoginScreen');
            },
          },
        ]);
      })
      .catch(() => {
        setTimeout(
          () =>
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            ),
          100,
        );
        setLoading(false);
        return false;
      });
  };

  if (loading) {
    return (
      <ActivityIndicator
        color={styleConst.color.blue}
        style={styleConst.spinner}
      />
    );
  }

  return (
    <ScrollView style={{paddingHorizontal: 8}} paddingX={2}>
      <GroupForm title={strings.Form.group.main}>
        <Controller
          control={control}
          rules={{
            required: [
              strings.Form.status.fieldRequired1,
              strings.Form.status.fieldRequired2,
            ].join(' '),
          }}
          name="NAME"
          render={({field: {onChange, onBlur, value}}) => (
            <InputCustom
              placeholder={strings.Form.field.label.name}
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType={'name'}
              value={value}
              isValid={get(errors, 'NAME', true)}
            />
          )}
        />

        <Controller
          control={control}
          name="SECOND_NAME"
          render={({field: {onChange, onBlur, value}}) => (
            <InputCustom
              placeholder={strings.Form.field.label.secondName}
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType={'middleName'}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="LAST_NAME"
          render={({field: {onChange, onBlur, value}}) => (
            <InputCustom
              placeholder={strings.Form.field.label.lastName}
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType={'familyName'}
              value={value}
            />
          )}
        />
      </GroupForm>

      <GroupForm title={strings.Form.group.contacts}>{emailData}</GroupForm>
      <GroupForm title={strings.Form.group.contacts}>{phoneData}</GroupForm>

      <GroupForm title={strings.Form.field.label.social}>
        <SocialAuth
          region={props.region}
          style={{
            width: '80%',
            marginHorizontal: '10%',
            paddingVertical: 7,
          }}
        />
      </GroupForm>

      <Controller
        control={control}
        rules={{
          required: [
            strings.Form.status.fieldRequired1,
            strings.Form.status.fieldRequired2,
          ].join(' '),
        }}
        name="agreementCheckbox"
        render={({field: {onChange, onBlur, value}}) => (
          <AgreementCheckbox
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            isValid={get(errors, 'agreementCheckbox', true)}
          />
        )}
      />

      {!sendingFormStatus ? (
        <TransitionView animation={'slideInUp'} duration={300} index={1}>
          <View h={40}>
            <Button
              onPress={handleSubmit(_onPressSave)}
              color="blue.500"
              size="lg"
              shadow={2}
              mt={4}
              spinnerPlacement="start"
              isLoading={sendingForm}
              isLoadingText={strings.Form.button.sending}
              variant="solid"
              testID="Form.ButtonSubmit"
              accessibilityValue={{
                text: 'false',
              }}
              _text={{color: styleConst.color.white, fontSize: 16}}>
              {strings.ProfileSettingsScreen.save}
            </Button>
            {!sendingForm ? (
              <Button
                variant="link"
                style={{borderRadius: 5, marginTop: -10, marginBottom: 30}}
                _text={{padding: 5, color: styleConst.color.red}}
                onPress={() => {
                  Alert.alert(
                    strings.ProfileSettingsScreen.Notifications.deleteAccount
                      .title,
                    strings.ProfileSettingsScreen.Notifications.deleteAccount
                      .text,
                    [
                      {
                        text: strings.Base.cancel,
                        style: 'destructive',
                      },
                      {
                        text: strings.Base.ok,
                        style: 'default',
                        onPress: () => {
                          return _onPressDelete();
                        },
                      },
                    ],
                  );
                }}>
                {strings.ProfileSettingsScreen.deleteAccount}
              </Button>
            ) : null}
          </View>
        </TransitionView>
      ) : (
        <TransitionView animation={'slideInLeft'} duration={300} index={1}>
          <View alignItems={'center'} mt={4} h={40}>
            <Icon
              source={
                sendingFormStatus
                  ? 'check-circle-outline'
                  : 'close-circle-outline'
              }
              color={
                sendingFormStatus
                  ? styleConst.color.green
                  : styleConst.color.red
              }
              size={34}
            />
          </View>
        </TransitionView>
      )}
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
