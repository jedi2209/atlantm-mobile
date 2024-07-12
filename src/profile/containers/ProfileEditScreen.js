import React, {useState, useEffect} from 'react';
import {Alert, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, ScrollView, useToast} from 'native-base';
import {Controller, useForm, useFieldArray} from 'react-hook-form';

import {IconButton} from 'react-native-paper';

import {substractYears} from '../../utils/date';

import SocialAuth from '../components/SocialAuth';
import {SubmitButton} from '../../core/components/Form/SubmitCustom';
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

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 8,
    marginBottom: 80,
  },
  iconPlus: {
    marginRight: 9,
  },
  socialAuthContainer: {
    width: '80%',
    marginHorizontal: '10%',
    paddingVertical: 7,
  },
  submitButton: {
    borderRadius: 5,
    marginTop: -10,
    marginBottom: 30,
  },
});

const ProfileEditScreen = props => {
  const {NAME, LAST_NAME, SECOND_NAME, EMAIL, PHONE, BIRTHDATE} = props.profile;
  const [loading, setLoading] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingFormStatus, setFormSendingStatus] = useState(null);
  const navigation = useNavigation();
  const toast = useToast();

  const mustUpdateScreen = get(props, 'route.params.updateScreen', false);

  let birthdate = null;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      NAME: NAME,
      SECOND_NAME: SECOND_NAME,
      LAST_NAME: LAST_NAME,
      emails: [],
      phones: [],
    },
  });
  const {
    fields: fieldsEmail,
    replace: replaceEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'emails', // unique name for your Field Array
  });

  const {
    fields: fieldsPhone,
    replace: replacePhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: 'phones', // unique name for your Field Array
  });

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/edit');
    if (get(EMAIL, 'length')) {
      let tmp = [];
      EMAIL.map((field, num) => {
        tmp.push({
          name: get(field, 'VALUE'),
        });
      });
      replaceEmail(tmp);
    }

    if (get(PHONE, 'length')) {
      let tmp = [];
      PHONE.map((field, num) => {
        tmp.push({
          name: get(field, 'VALUE'),
        });
      });
      replacePhone(tmp);
    }
  }, [mustUpdateScreen, PHONE, EMAIL, replaceEmail, replacePhone]);

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

    setSendingForm(true);
    let emailValue = [];
    let phoneValue = [];

    get(data, 'emails', []).map((field, num) => {
      emailValue.push({
        TYPE_ID: 'EMAIL',
        VALUE: field.name,
        VALUE_TYPE: 'HOME',
      });
    });
    get(data, 'phones', []).map((field, num) => {
      phoneValue.push({
        TYPE_ID: 'PHONE',
        VALUE: field.name,
        VALUE_TYPE: 'HOME',
      });
    });

    delete data.agreementCheckbox;
    delete data.phones;
    delete data.emails;

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
          setSendingForm(false);
          setTimeout(() => navigation.navigate('LoginScreen'), 300);
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
          setSendingForm(false);
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
    <ScrollView style={styles.scrollViewContainer} paddingX={2}>
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

      <GroupForm
        title={strings.Form.group.email}
        button={
          <IconButton
            icon="plus-circle-outline"
            iconColor={styleConst.color.blue}
            style={styles.iconPlus}
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'PhoneChangeScreen',
                params: {
                  refererScreen: 'ProfileEditScreen',
                  returnScreen: 'ProfileEditScreen',
                  mode: 'addNewEmail',
                  type: 'profileUpdate',
                  userSocialProfile: get(props, 'profile'),
                },
              })
            }
          />
        }>
        {fieldsEmail.map((field, index) => {
          const isLast = index === fieldsEmail.length - 1;
          return (
            <Controller
              control={control}
              key={field.id}
              name={`emails.${index}.name`}
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  key={'input' + field.id}
                  type="email"
                  label={null}
                  disabled={true}
                  style={{marginBottom: isLast ? 0 : 6}}
                  num={index}
                  length={get(fieldsEmail, 'length')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onPressIcon={() => removeEmail(index)}
                />
              )}
            />
          );
        })}
      </GroupForm>

      <GroupForm
        title={strings.Form.group.phones}
        button={
          <IconButton
            icon="plus-circle-outline"
            iconColor={styleConst.color.blue}
            style={styles.iconPlus}
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'PhoneChangeScreen',
                params: {
                  refererScreen: 'ProfileEditScreen',
                  returnScreen: 'ProfileEditScreen',
                  mode: 'addNewPhone',
                  type: 'profileUpdate',
                  userSocialProfile: get(props, 'profile'),
                },
              })
            }
          />
        }>
        {fieldsPhone.map((field, index) => {
          const isLast = index === fieldsPhone.length - 1;
          return (
            <Controller
              control={control}
              key={field.id}
              name={`phones.${index}.name`}
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  key={'input' + field.id}
                  type="phone"
                  label={null}
                  disabled={true}
                  style={{marginBottom: isLast ? 0 : 6}}
                  length={get(fieldsPhone, 'length')}
                  num={index}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onPressIcon={() => removePhone(index)}
                />
              )}
            />
          );
        })}
      </GroupForm>

      <GroupForm title={strings.Form.field.label.social}>
        <SocialAuth region={props.region} style={styles.socialAuthContainer} />
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

      <SubmitButton
        onPress={handleSubmit(_onPressSave)}
        sendingStatus={sendingFormStatus}
        sending={sendingForm}>
        {!sendingForm ? (
          <Button
            variant="link"
            style={styles.submitButton}
            _text={{padding: 5, color: styleConst.color.red}}
            onPress={() => {
              Alert.alert(
                strings.ProfileSettingsScreen.Notifications.deleteAccount.title,
                strings.ProfileSettingsScreen.Notifications.deleteAccount.text,
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
      </SubmitButton>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
