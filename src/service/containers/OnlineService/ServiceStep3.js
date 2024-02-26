/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {get} from 'lodash';

import Form from '../../../core/components/Form/Form';
import {addDays, dayMonthYear} from '../../../utils/date';
import UserData from '../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {strings} from '../../../core/lang/const';
import Analytics from '../../../utils/amplitude-analytics';

const mapStateToProps = ({dealer, service, nav}) => {
  return {
    nav,
    date: service.date,
  };
};

const mapDispatchToProps = {
  orderService,
};

const ServiceStep3 = props => {
  const {route, region, navigation} = props;

  const orderData = get(route, 'params', {});
  const myTyresInStorage = get(orderData, 'myTyresInStorage', false);

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step3');
  }, []);

  const _onPressOrder = async pushProps => {
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
            label: strings.Form.field.label.date,
            props: {
              placeholder:
                strings.Form.field.placeholder.date +
                dayMonthYear(addDays(myTyresInStorage ? 3 : 1)),
              required: true,
              type: 'service',
              serviceID: get(orderData, 'SERVICE', null),
              minimumDate: new Date(addDays(myTyresInStorage ? 3 : 1)),
              maximumDate: new Date(addDays(62)),
              dealer: {
                id: get(orderData, 'DEALER'),
              },
              reqiredTime: get(orderData, 'SERVICESecondFull.total.time', null),
            },
          },
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
