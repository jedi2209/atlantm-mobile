import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import Service from './ServiceScreen';
import ServiceStep1 from './OnlineService/ServiceStep1';
import {connect} from 'react-redux';
import {get} from 'lodash';

const mapStateToProps = ({dealer, profile}) => {
  return {
    region: dealer.region,
    loginID: get(profile, 'login.ID', false),
    cars: get(profile, 'cars', false),
  };
};

const ServiceContainer = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const actionID = get(route, 'params.actionID', null);
  const {region, loginID, cars} = props;
  if (!actionID && region === 'by') {
    // if (loginID && cars && cars.length > 0) {
    console.info('\t\tService Screen => ServiceStep1');
    return <ServiceStep1 navigation={navigation} route={route} />;
    // } else {
    //   console.info('\t\tService Screen => ServiceStep1NonAuth');
    //   return <ServiceStep1 navigation={navigation} route={route} />;
    // }
  }
  console.info('\t\tService Screen => Service');
  return <Service navigation={navigation} route={route} />;
};

export default connect(mapStateToProps)(ServiceContainer);
