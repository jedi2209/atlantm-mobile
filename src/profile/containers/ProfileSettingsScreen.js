/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon, Button, Text, View,} from 'native-base';

import {substractYears} from '../../utils/date';

import Form from '../../core/components/Form/Form';
import SocialAuth from '../components/SocialAuth';

import {connect} from 'react-redux';

import {actionSaveProfileToAPI, actionDeleteProfile} from '../actions';
import styleConst from '../../core/style-const';

import Analytics from '../../utils/amplitude-analytics';
import {strings} from '../../core/lang/const';

const mapStateToProps = ({profile, dealer}) => {
  return {
    profile: profile.login,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionSaveProfileToAPI,
  actionDeleteProfile,
};

const ProfileSettingsScreen = props => {
  const {NAME, LAST_NAME, SECOND_NAME, EMAIL, PHONE, BIRTHDATE} = props.profile;

  let emailData = [];
  let phoneData = [];
  let birthdate = null;

  if (typeof EMAIL === 'object' && EMAIL && EMAIL.length) {
    EMAIL.map((field, num) => {
      emailData[field.ID] = {
        id: field.ID,
        name: 'EMAIL',
        type: 'email',
        label: strings.Form.field.label.email,
        value: field.VALUE,
      };
    });
  } else {
    emailData = EMAIL;
  }
  if (typeof PHONE === 'object' && PHONE && PHONE.length) {
    PHONE.map((field, num) => {
      phoneData[field.ID] = {
        id: field.ID,
        name: 'PHONE',
        type: 'phone',
        label: strings.Form.field.label.phone,
        value: field.VALUE,
        country: field.COUNTRY,
        textStyle: {
          color: styleConst.color.greyText4,
        },
      };
    });
  } else {
    phoneData = PHONE;
  }

  if (typeof BIRTHDATE === 'string' && BIRTHDATE.length > 0) {
    birthdate = new Date(BIRTHDATE);
  } else if (typeof BIRTHDATE === 'object') {
    birthdate = BIRTHDATE;
  }

  const [email, setEmail] = useState(emailData || []);
  const [phone, setPhone] = useState(phoneData || []);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const FormConfig = {
    fields: {
      groups: [
        {
          name: strings.Form.group.main,
          fields: [
            {
              name: 'NAME',
              type: 'input',
              label: strings.Form.field.label.name,
              value: NAME || '',
              props: {
                required: true,
                textContentType: 'name',
              },
            },
            {
              name: 'SECOND_NAME',
              type: 'input',
              label: strings.Form.field.label.secondName,
              value: SECOND_NAME || '',
              props: {
                textContentType: 'middleName',
              },
            },
            {
              name: 'LAST_NAME',
              type: 'input',
              label: strings.Form.field.label.lastName,
              value: LAST_NAME || '',
              props: {
                textContentType: 'familyName',
              },
            },
          ],
        },
        {
          name: strings.Form.group.contacts,
          fields: [].concat(email, phone),
        },
        {
          name: strings.Form.group.social,
          fields: [
            {
              name: 'SocialAuth',
              type: 'component',
              label: strings.Form.field.label.social,
              value: (
                <SocialAuth
                  region={props.dealerSelected.region}
                  style={{
                    width: '80%',
                    marginHorizontal: '10%',
                    paddingVertical: 7,
                  }}
                />
              ),
            },
          ],
        },
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

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/edit');
  }, []);

  const _onPressSave = data => {
    setLoading(true);
    let emailValue = [];
    let phoneValue = [];
    let propsTmp = {};

    if (data.EMAIL) {
      for (let [key, item] of Object.entries(data.EMAIL)) {
        emailValue.push({
          ID: key,
          TYPE_ID: 'EMAIL',
          VALUE: item.value,
          VALUE_TYPE: 'HOME',
        });
      }
      propsTmp.EMAIL = emailValue;
    } else {
      propsTmp.EMAIL = null;
    }

    if (data.PHONE) {
      for (let [key, item] of Object.entries(data.PHONE)) {
        phoneValue.push({
          ID: key,
          TYPE_ID: 'PHONE',
          VALUE: item.value || null,
          VALUE_TYPE: 'MOBILE',
        });
      }
      propsTmp.PHONE = phoneValue;
    } else {
      propsTmp.PHONE = null;
    }

    propsTmp.SECOND_NAME = data.SECOND_NAME || '';
    propsTmp.NAME = data.NAME || '';
    propsTmp.LAST_NAME = data.LAST_NAME || '';
    propsTmp.BIRTHDATE = data.BIRTHDATE || null;

    if (!phoneValue && !emailValue) {
      setLoading(false);
      Alert.alert(
        strings.ProfileSettingsScreen.Notifications.error.emailPhone.title,
        strings.ProfileSettingsScreen.Notifications.error.emailPhone.text,
        [
          {
            text: 'ОК',
          },
        ],
      );
      return false;
    }

    const profileToSend = Object.assign({ID: props.profile.ID}, propsTmp);

    return props
      .actionSaveProfileToAPI(profileToSend)
      .then(response => {
        Alert.alert(
          strings.Notifications.success.title,
          strings.Notifications.success.textProfileUpdate,
          [
            {
              text: 'ОК',
              onPress: () => {
                navigation.navigate('LoginScreen');
              },
            },
          ],
        );
        setLoading(false);
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
        setLoading(false);
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
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key="ProfileSettingsScreenForm"
      fields={FormConfig.fields}
      barStyle={'light-content'}
      SubmitButton={{text: strings.ProfileSettingsScreen.save}}
      onSubmit={_onPressSave}>
      <Button
        variant="link"
        style={{borderRadius: 5, marginTop: -10, marginBottom: 30}}
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
    </Form>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSettingsScreen);
