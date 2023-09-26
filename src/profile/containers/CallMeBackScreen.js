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

import {get, isNil} from 'lodash';
import {localDealerClear} from '../../dealer/actions';

import {ERROR_NETWORK} from '../../core/const';
import {strings} from '../../core/lang/const';

let callMe = require('../../contacts/actions').callMe;

const mapStateToProps = ({dealer, profile, contacts, nav}) => {
  return {
    nav,
    dealerSelectedLocal: dealer.selectedLocal,
    allDealers: dealer.listDealers,
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
  dealerSelectedLocal,
  route,
  phone,
  firstName,
  callMe,
  localDealerClear,
  allDealers,
}) => {
  const dealer = get(route, 'params.dealerCustom', dealerSelectedLocal);
  const isDealerHide = get(route, 'params.dealerHide', isNil(dealer));

  let listDealers = [];
  if (dealer) {
    if (dealer.length) {
      dealer.map(el => {
        if (typeof el === 'string' || typeof el === 'number') {
          el = allDealers[el];
        }
        listDealers.push({
          label: el.name,
          value: el.id,
          key: el.id,
        });
      });
    } else {
      if (typeof dealer == 'object') {
        listDealers.push({
          label: dealer.name,
          value: dealer.id,
          key: dealer.id,
        });
      }
    }
  }

  useEffect(() => {
    return () => {
      localDealerClear();
    };
  }, [localDealerClear, route.params]);

  const _onPressCallMe = async dataFromForm => {
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

    const dataToSend = {
      dealerID: get(dataFromForm, 'DEALER', dealer?.id),
      name: get(dataFromForm, 'NAME', firstName),
      actionID,
      carID,
      phone: get(dataFromForm, 'PHONE', phone),
    };

    const action = await callMe(dataToSend);

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

  let dealerGroup = {};
  if (listDealers) {
    if (listDealers.length < 1) {
      dealerGroup = {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'dealerSelect',
            label: strings.Form.group.dealer,
            value: dealer,
            props: {
              required: true,
              goBack: true,
              isLocal: true,
              showBrands: false,
              readonly: isDealerHide,
            },
          },
        ],
      };
    }
    if (listDealers.length === 1) {
      dealerGroup = {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'dealerSelect',
            label: strings.Form.group.dealer,
            value: dealerSelectedLocal || allDealers[dealer] || dealer,
            props: {
              required: true,
              goBack: true,
              isLocal: true,
              showBrands: false,
              readonly: true,
            },
          },
        ],
      };
    }
    if (listDealers.length > 1) {
      dealerGroup = {
        name: strings.Form.group.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'select',
            label: strings.Form.field.label.dealer,
            value: null,
            props: {
              items: listDealers,
              required: true,
              placeholder: {
                label: strings.Form.field.placeholder.dealer,
                value: null,
                color: '#9EA0A4',
              },
            },
          },
        ],
      };
    }
  }

  const FormConfig = {
    fields: {
      groups: [
        dealerGroup,
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
