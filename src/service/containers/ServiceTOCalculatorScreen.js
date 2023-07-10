import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import ServiceScreenStep1 from './OnlineService/ServiceScreenStep1';
import {connect} from 'react-redux';
import {get} from 'lodash';

const mapStateToProps = ({dealer, profile}) => {
  return {
    dealerSelected: dealer.selected,
    loginID: get(profile, 'login.ID', false),
  };
};

const ServiceTOCalculatorScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const actionID = get(route, 'params.actionID', null);
  const {dealerSelected, loginID} = props;
  return <ServiceScreenStep1 navigation={navigation} route={route} />;
};

export default connect(mapStateToProps)(ServiceTOCalculatorScreen);
