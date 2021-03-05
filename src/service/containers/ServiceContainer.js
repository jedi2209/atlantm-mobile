import React from 'react';
import {useNavigation} from '@react-navigation/native';

import Service from './ServiceScreen';
import ServiceScreenStep1 from './OnlineService/ServiceScreenStep1';
import ServiceNewNonAuth from './OnlineService/ServiceScreenNonAuth';
import {connect} from 'react-redux';
import {get} from 'lodash';

const mapStateToProps = ({dealer, profile}) => {
  return {
    dealerSelected: dealer.selected,
    loginID: get(profile, 'login.ID', false),
    cars: get(profile, 'cars', false),
  };
};

const ServiceContainer = (props) => {
  const navigation = useNavigation();

  const {dealerSelected, loginID, cars} = props;
  if (dealerSelected.region === 'by') {
    if (loginID && cars && cars.length > 0) {
      return <ServiceScreenStep1 navigation={navigation} />;
    } else {
      return <ServiceNewNonAuth navigation={navigation} />;
    }
  }
  return <Service />;
};

export default connect(mapStateToProps)(ServiceContainer);
