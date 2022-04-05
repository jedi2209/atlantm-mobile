/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
// redux
import {connect} from 'react-redux';
import {get} from 'lodash';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../../contacts/actionTypes';
import * as NavigationService from '../../navigation/NavigationService';
import Analytics from '../../utils/amplitude-analytics';

import Form from '../../core/components/Form/Form';

import {localUserDataUpdate} from '../../profile/actions';
import {localDealerClear} from '../../dealer/actions';

import {ERROR_NETWORK} from '../../core/const';
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';

let callMe = require('../../contacts/actions').callMe;

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

let isInternet = null;
class CallMeBackScreen extends PureComponent {
  constructor(props) {
    super(props);

    let dealerCustom = null;

    if (this.props.route?.params && this.props.route.params?.dealerCustom) {
      dealerCustom = this.props.route?.params?.dealerCustom;
    }

    this.state = {
      loading: false,
      success: false,
      dealerSelectedLocal: dealerCustom
        ? dealerCustom
        : this.props.dealerSelected,
    };
    this.props.localDealerClear();

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
                  returnScreen: this.props.navigation.state?.routeName,
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
            ],
          },
        ],
      },
    };
  }

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

  onPressCallMe = async props => {
    if (isInternet == null) {
      isInternet = require('../../utils/internet').default;
    }
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    }

    let actionID = null;
    if (this.props.route?.params && this.props.route.params?.actionID) {
      actionID = this.props.route?.params?.actionID;
    }

    let carID = null;

    if (this.props.route?.params && this.props.route.params?.carId) {
      carID = this.props.route?.params?.carId;
    }

    this.setState({loading: true});

    const dealerID = this.state.dealerSelectedLocal.id;

    const action = await this.props.callMe({
      dealerID,
      name: props.NAME || '',
      actionID,
      carID,
      phone: get(props, 'PHONE', ''),
    });

    if (action.type === CALL_ME__SUCCESS) {
      const _this = this;
      Analytics.logEvent('order', 'contacts/callme');
      _this.props.localUserDataUpdate({
        NAME: props.NAME,
        PHONE: props.PHONE,
      });
      Alert.alert(
        strings.Notifications.success.title,
        strings.Notifications.success.textOrder,
        [
          {
            text: 'ОК',
            onPress: () => {
              if (this.props.route?.params && this.props.route.params?.goBack) {
                NavigationService.goBack();
              } else {
                NavigationService.reset();
              }
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
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styleConst.form.scrollView}>
          <View style={styles.wrapper}>
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
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 50,
    paddingHorizontal: 14,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CallMeBackScreen);
