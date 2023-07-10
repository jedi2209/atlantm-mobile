import React, {useEffect} from 'react';

import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreenInfo';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const mapStateToProps = ({profile}) => {
  return {profile};
};

const AuthContainer = props => {
  const navigation = useNavigation();

  useEffect(() => {}, [props?.profile?.login?.ID]);

  if (props.profile.login && props.profile.login.ID) {
    return <ProfileScreen navigation={navigation} />;
  }

  return <LoginScreen navigation={navigation} />;
};

export default connect(mapStateToProps)(AuthContainer);
