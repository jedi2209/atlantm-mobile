import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {View} from 'react-native';

import stylesHeader from '../../core/components/Header/style';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import Service from './ServiceScreen';
import ServiceNew from './OnlineService/ServiceScreenNewStep1';
import ServiceNewNonAuth from './OnlineService/ServiceScreenNonAuth';
import {connect} from 'react-redux';
import {get} from 'lodash';

const ServiceOldScreen = withNavigation(Service);
const ServiceScreenStep1 = withNavigation(ServiceNew);
const ServiceScreenNonAuth = withNavigation(ServiceNewNonAuth);

const mapStateToProps = ({dealer, profile, navigation}) => {
  return {
    dealerSelected: dealer.selected,
    loginID: get(profile, 'login.ID', false),
  };
};

class ServiceContainer extends Component {
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerTitle: 'Запись на сервис',
      headerLeft: (
        <HeaderIconBack
          theme="blue"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  render() {
    const {dealerSelected, loginID} = this.props;
    if (dealerSelected.region === 'by') {
      if (loginID) {
        return <ServiceScreenStep1 />;
      } else {
        return <ServiceScreenNonAuth />;
      }
    }
    return <ServiceOldScreen />;
  }
}

export default connect(mapStateToProps)(ServiceContainer);
