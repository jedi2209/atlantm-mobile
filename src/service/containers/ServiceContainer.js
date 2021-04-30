import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

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
  const route = useRoute();
  const {dealerSelected, loginID, cars} = props;
  if (dealerSelected.region === 'by') {
    if (loginID && cars && cars.length > 0) {
      return <ServiceScreenStep1 navigation={navigation} route={route} />;
    } else {
      return <ServiceNewNonAuth navigation={navigation} route={route} />;
    }
  }
  return <Service navigation={navigation} route={route} />;
};

export default connect(mapStateToProps)(ServiceContainer);
