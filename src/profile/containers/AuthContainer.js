import React from 'react';

import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreenInfo';
import {connect} from 'react-redux';
import {store} from '../../core/store';
import {useNavigation} from '@react-navigation/native';

const mapStateToProps = ({profile}) => {
  return {profile};
};

const AuthContainer = props => {
  const navigation = useNavigation();

  if (props.profile.login && props.profile.login.ID) {
    return <ProfileScreen navigation={navigation} />;
  }

  return <LoginScreen navigation={navigation} />;
};

export default connect(mapStateToProps)(AuthContainer);
