import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';

import Login from './ProfileScreen';
import Profile from './ProfileScreenInfo';
import {connect} from 'react-redux';

const LoginScreen = withNavigation(Login);
const ProfileScreen = withNavigation(Profile);

const mapStateToProps = ({profile}) => {
  return profile;
};

class AuthContnainer extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  render() {
    if (this.props.login.ID) {
      return <ProfileScreen />;
    }
    return <LoginScreen />;
  }
}

export default connect(mapStateToProps)(AuthContnainer);
