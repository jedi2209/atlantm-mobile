/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet} from 'react-native';
// redux
import {connect} from 'react-redux';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../../contacts/actionTypes';
import * as NavigationService from '../../navigation/NavigationService';
import Analytics from '../../utils/amplitude-analytics';

import Form from '../../core/components/Form/Form';

import {localDealerClear} from '../../dealer/actions';

import {ERROR_NETWORK} from '../../core/const';
import {strings} from '../../core/lang/const';

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
  localDealerClear,
  callMe,
};

let isInternet = null;

const CallMeBackScreen = ({
  dealerSelected,
  dealerSelectedLocal,
  route,
  phone,
  firstName,
  callMe,
  localDealerClear,
}) => {
  const [dealerSelectedLocalState, setDealerSelectedLocal] = useState(null);

  useEffect(() => {
    if (route?.params && route.params?.dealerCustom) {
      setDealerSelectedLocal(route?.params?.dealerCustom);
    }
    setDealerSelectedLocal(dealerSelected);
    return () => {
      localDealerClear();
    };
  }, []);

  useEffect(() => {
    setDealerSelectedLocal(dealerSelectedLocal);
  }, [dealerSelectedLocal]);

  const _onPressCallMe = async () => {
    if (isInternet == null) {
      isInternet = require('../../utils/internet').default;
    }
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    }

    let actionID = null;
    if (route?.params && route.params?.actionID) {
      actionID = route?.params?.actionID;
    }

    let carID = null;

    if (route?.params && route.params?.carId) {
      carID = route?.params?.carId;
    }

    let dealerID = dealerSelected.id;

    if (dealerSelectedLocalState) {
      dealerID = dealerSelectedLocalState.id;
    }

    const action = await callMe({
      dealerID,
      name: firstName || '',
      actionID,
      carID,
      phone: phone || '',
    });

    if (action.type === CALL_ME__SUCCESS) {
      Analytics.logEvent('order', 'contacts/callme');
      Alert.alert(
        strings.Notifications.success.title,
        strings.Notifications.success.textOrder,
        [
          {
            text: 'ОК',
            onPress: () => {
              if (route?.params && route.params?.goBack) {
                NavigationService.goBack();
              } else {
                NavigationService.reset();
              }
            },
          },
        ],
      );
    }

    if (action.type === CALL_ME__FAIL) {
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

  const FormConfig = {
    fields: {
      groups: [
        {
          name: strings.Form.group.dealer,
          fields: [
            {
              name: 'DEALER',
              type: 'dealerSelect',
              label: strings.Form.group.dealer,
              value: dealerSelectedLocalState || dealerSelected,
              props: {
                goBack: true,
                isLocal: true,
                showBrands: false,
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
              value: phone,
              props: {
                required: true,
              },
            },
            {
              name: 'NAME',
              type: 'input',
              label: strings.Form.field.label.name,
              value: firstName,
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

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      keyboardAvoidingViewProps={{
        enableAutomaticScroll: false,
      }}
      key="CallMeBackForm"
      fields={FormConfig.fields}
      barStyle={'light-content'}
      SubmitButton={{
        text: strings.CallMeBackScreen.button,
      }}
      onSubmit={_onPressCallMe}
    />
  );
};

// shouldComponentUpdate(nextProps, nextState) {
//   if (
//     this.props.dealerSelectedLocal &&
//     this.props.dealerSelectedLocal.id !== nextProps.dealerSelectedLocal.id
//   ) {
//     alert(1);
//     this.setState(
//       {
//         dealerSelectedLocal: nextProps.dealerSelectedLocal.id,
//       },
//       () => {
//         return true;
//       },
//     );
//   } else {
//     alert(2);
//     return false;
//   }
// }

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 50,
    paddingHorizontal: 14,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CallMeBackScreen);
