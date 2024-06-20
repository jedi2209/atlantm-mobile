/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {get} from 'lodash';

import {Text} from 'native-base';

import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {strings} from '../../../core/lang/const';
import Analytics from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';

const mapStateToProps = ({dealer, service, nav}) => {
  return {
    nav,
    date: service.date,
  };
};

const mapDispatchToProps = {
  orderService,
};

const minDate = {
  inStorage: 4,
  default: 1,
};

const ServiceStep3 = props => {
  const {route, region, navigation} = props;

  const [isLeadLocal, setLead] = useState(get(route, 'params.lead', false));

  const orderData = get(route, 'params', {});
  const myTyresInStorage = get(orderData, 'myTyresInStorage', false) === 1; // 1 - true, 2 - false

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step3');
  }, []);

  const _onPressOrder = async pushProps => {
    if (
      get(pushProps, 'DATETIME.noTimeAlways') === true ||
      !get(pushProps, 'DATETIME.time')
    ) {
      pushProps.lead = true;
    }
    navigation.navigate('ServiceStep4', {
      ...orderData,
      ...pushProps,
    });
  };

  const FormConfig = {
    groups: [
      {
        name: strings.Form.field.label.date,
        fields: [
          {
            name: 'DATETIME',
            type: get(orderData, 'lead', true) ? 'date' : 'dateTime',
            label: get(orderData, 'lead', true)
              ? strings.Form.field.label.date
              : strings.Form.field.label.datetime,
            props: {
              placeholder:
                strings.Form.field.placeholder.date +
                dayMonthYear(
                  addDays(
                    myTyresInStorage ? minDate.inStorage : minDate.default,
                  ),
                ),
              required: true,
              type: 'service',
              serviceID: get(orderData, 'SERVICE', null),
              minimumDate: new Date(
                addDays(myTyresInStorage ? minDate.inStorage : minDate.default),
              ),
              maximumDate: new Date(addDays(31)),
              dealer: {
                id: get(orderData, 'DEALER'),
              },
              maxTimeAttemps: 3,
              reqiredTime: get(orderData, 'SERVICESecondFull.total.time', null),
              onChange: res => {
                // console.info('onChange res', res);
                setLead(
                  get(res, 'noTimeAlways', get(res, 'lead', false), false),
                );
              },
            },
          },
          isLeadLocal
            ? {
                name: 'Text',
                type: 'component',
                value: (
                  <Text
                    style={{
                      color: styleConst.color.greyText3,
                      paddingVertical: 5,
                      fontStyle: 'italic',
                    }}>
                    {strings.ServiceScreenStep3.additionalInfo}
                  </Text>
                ),
              }
            : null,
        ],
      },
    ],
  };

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key="ServiceForm"
      fields={FormConfig}
      barStyle={'light-content'}
      defaultCountryCode={region}
      onSubmit={_onPressOrder}
      SubmitButton={{
        text: strings.Form.button.next,
        noAgreement: true,
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceStep3);
