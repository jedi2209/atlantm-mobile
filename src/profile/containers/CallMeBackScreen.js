/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// redux
import {connect} from 'react-redux';
import {get} from 'lodash';
import {callMe} from '../../contacts/actions';
import {localUserDataUpdate} from '../../profile/actions';
import {localDealerClear} from '../../dealer/actions';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../../contacts/actionTypes';
import NavigationService from '../../navigation/NavigationService';
import Amplitude from '../../utils/amplitude-analytics';
import {
  Alert,
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';

import isInternet from '../../utils/internet';
import {ERROR_NETWORK} from '../../core/const';
import strings from '../../core/lang/const';

const mapStateToProps = ({dealer, profile, contacts, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    dealerSelectedLocal: dealer.selectedLocal,
    firstName: profile.login.NAME
      ? profile.login.NAME
      : profile.localUserData.NAME
      ? profile.localUserData.NAME
      : '',
    secondName: profile.login.SECOND_NAME
      ? profile.login.SECOND_NAME
      : profile.localUserData.SECOND_NAME
      ? profile.localUserData.SECOND_NAME
      : '',
    phone:
      profile.login.PHONE && profile.login.PHONE.length
        ? profile.login.PHONE[0].VALUE
        : profile.localUserData.PHONE
        ? profile.localUserData.PHONE
        : '',
    profile,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  localDealerClear,
  callMe,
};

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

class CallMeBackScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      success: false,
      dealerSelectedLocal: this.props.dealerSelected,
    };
    this.props.localDealerClear();
  }

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerTitle: strings.CallMeBackScreen.title,
      headerLeft: (
        <HeaderIconBack
          theme="blue"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.dealerSelectedLocal &&
      this.state.dealerSelectedLocal &&
      this.props.dealerSelectedLocal.id !== this.state.dealerSelectedLocal.id
    ) {
      this.setState(
        {
          dealerSelectedLocal: this.props.dealerSelectedLocal,
        },
        () => {
          return true;
        },
      );
    }
    return false;
  }

  onPressCallMe = async (props) => {
    const isInternetExist = await isInternet();
    let actionID = null;

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.actionID
    ) {
      actionID = this.props.navigation.state.params.actionID;
    }

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    }

    const name = [props.NAME, props.SECOND_NAME].filter(Boolean).join(' ');

    this.setState({loading: true});

    const dealerID = this.state.dealerSelectedLocal.id;

    const action = await this.props.callMe({
      dealerID,
      name: name || '',
      actionID,
      phone: get(props, 'PHONE', ''),
    });

    if (action.type === CALL_ME__SUCCESS) {
      const _this = this;
      Amplitude.logEvent('order', 'contacts/callme');
      _this.props.localUserDataUpdate({
        NAME: props.NAME,
        SECOND_NAME: props.SECOND_NAME,
        PHONE: props.PHONE,
      });
      Alert.alert(
        strings.Notifications.success.title,
        strings.Notifications.success.textOrder,
        [
          {
            text: 'ОК',
            onPress() {
              NavigationService.reset();
            },
          },
        ],
      );
      this.setState({success: true, loading: false});
    }

    if (action.type === CALL_ME__FAIL) {
      this.setState({loading: false});
      setTimeout(
        () =>
          Alert.alert(
            strings.Notifications.error.title,
            strings.Notifications.error.text,
          ),
        100,
      );
    }
  };

  render() {
    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.Form.group.dealer,
            fields: [
              {
                name: 'DEALER',
                type: 'dealerSelect',
                label: strings.Form.group.dealer,
                value: this.state.dealerSelectedLocal,
                props: {
                  goBack: false,
                  isLocal: true,
                  navigation: this.props.navigation,
                  returnScreen: this.props.navigation.state.routeName,
                },
              },
            ],
          },
          {
            name: strings.Form.group.contacts,
            fields: [
              {
                name: 'PHONE',
                type: 'phone',
                label: strings.Form.field.label.phone,
                value: this.props.phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'NAME',
                type: 'input',
                label: strings.Form.field.label.name,
                value: this.props.firstName,
                props: {
                  required: false,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: strings.Form.field.label.secondName,
                value: this.props.secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
            ],
          },
        ],
      },
    };
    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{flex: 1, backgroundColor: '#eee'}}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                marginBottom: 160,
                paddingHorizontal: 14,
              }}>
              <Form
                fields={this.FormConfig.fields}
                barStyle={'light-content'}
                SubmitButton={{
                  text: strings.CallMeBackScreen.button,
                }}
                onSubmit={this.onPressCallMe}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallMeBackScreen);
