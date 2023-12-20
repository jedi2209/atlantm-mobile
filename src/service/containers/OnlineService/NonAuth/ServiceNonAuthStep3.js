/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {get} from 'lodash';

import Form from '../../../../core/components/Form/Form';
import {addDays, dayMonthYear} from '../../../../utils/date';
import UserData from '../../../../utils/user';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../../actions';
import {strings} from '../../../../core/lang/const';
import Analytics from '../../../../utils/amplitude-analytics';

const mapStateToProps = ({dealer, service, nav}) => {
  let carLocalBrand = '';
  let carLocalModel = '';
  let carLocalNumber = '';
  let carLocalVin = '';

  return {
    nav,
    date: service.date,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE'),
    email: UserData.get('EMAIL'),
    carBrand: UserData.get('CARBRAND')
      ? UserData.get('CARBRAND')
      : carLocalBrand,
    carModel: UserData.get('CARMODEL')
      ? UserData.get('CARMODEL')
      : carLocalModel,
    carNumber: UserData.get('CARNUMBER')
      ? UserData.get('CARNUMBER')
      : carLocalNumber,
    carVIN: UserData.get('CARVIN') ? UserData.get('CARVIN') : carLocalVin,
    dealerSelectedLocal: dealer.selectedLocal,
    region: dealer.region,
    listDealers: dealer.listDealers,
  };
};

const mapDispatchToProps = {
  orderService,
};

const ServiceNonAuthStep3 = props => {
  const {route, region, navigation} = props;

  const orderData = get(route, 'params', {});

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step3');
  }, []);

  const _onPressOrder = async pushProps => {
    navigation.navigate('ServiceNonAuthStep4', {
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
                strings.Form.field.placeholder.date + dayMonthYear(addDays(1)),
              required: true,
              type: 'service',
              serviceID: get(orderData, 'SERVICE', null),
              minimumDate: new Date(addDays(1)),
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
      key="ServiceNonAuthForm"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceNonAuthStep3);
