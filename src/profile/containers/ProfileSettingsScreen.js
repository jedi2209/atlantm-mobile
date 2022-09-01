/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Button, Text, View,} from 'native-base';

import {substractYears} from '../../utils/date';

import Form from '../../core/components/Form/Form';
import SocialAuth from '../components/SocialAuth';

import {actionSaveProfileToAPI, actionDeleteProfile} from '../actions';
import styleConst from '../../core/style-const';

import Analytics from '../../utils/amplitude-analytics';
import {strings} from '../../core/lang/const';

class ProfileSettingsScreen extends Component {
  constructor(props) {
    super(props);
    const {NAME, LAST_NAME, SECOND_NAME, EMAIL, PHONE, BIRTHDATE} =
      this.props.profile;

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

    this.state = {
      email: emailData || [],
      phone: phoneData || [],
      success: false,
      loading: false,
    };

    this.FormConfig = {
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
            fields: [].concat(this.state.email, this.state.phone),
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
                    region={this.props.dealerSelected.region}
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
  }

  componentDidMount() {
    Analytics.logEvent('screen', 'profile/edit');
  }

  onPressSave = props => {
    const nav = this.props.navigation;
    this.setState({loading: true});
    let emailValue = [];
    let phoneValue = [];
    let propsTmp = {};

    if (props.EMAIL) {
      for (let [key, item] of Object.entries(props.EMAIL)) {
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

    if (props.PHONE) {
      for (let [key, item] of Object.entries(props.PHONE)) {
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

    propsTmp.SECOND_NAME = props.SECOND_NAME || '';
    propsTmp.NAME = props.NAME || '';
    propsTmp.LAST_NAME = props.LAST_NAME || '';
    propsTmp.BIRTHDATE = props.BIRTHDATE || null;

    if (!phoneValue && !emailValue) {
      this.setState({loading: false});
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

    let profileToSend = Object.assign({}, this.props.profile, props, propsTmp);

    return this.props
      .actionSaveProfileToAPI(profileToSend)
      .then(data => {
        Alert.alert(
          strings.Notifications.success.title,
          strings.Notifications.success.textProfileUpdate,
          [
            {
              text: 'ОК',
              onPress: () => {
                nav.navigate('LoginScreen');
              },
            },
          ],
        );
        this.setState({loading: false});
        return data;
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
        this.setState({loading: false});
        return false;
      });
  };

  onPressDelete = () => {
    const nav = this.props.navigation;
    this.setState({loading: true});
    return this.props
      .actionDeleteProfile(this.props.profile)
      .then(data => {
        Alert.alert('', data.error.message, [
          {
            text: strings.Base.ok,
            style: 'default',
            onPress: () => {
              nav.goBack(null);
              nav.navigate('LoginScreen');
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
        this.setState({loading: false});
        return false;
      });
  };

  onChangeProfileField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      );
    }
    return (
      <>
        <Form
          contentContainerStyle={{
            paddingHorizontal: 14,
            marginTop: 20,
          }}
          key="ProfileSettingsScreenForm"
          fields={this.FormConfig.fields}
          barStyle={'light-content'}
          SubmitButton={{text: strings.ProfileSettingsScreen.save}}
          onSubmit={this.onPressSave}>
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
                      return this.onPressDelete();
                    },
                  },
                ],
              );
            }}>
            {strings.ProfileSettingsScreen.deleteAccount}
          </Button>
        </Form>
      </>
    );
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: styleConst.color.bg,
  },
});
