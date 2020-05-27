import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';

import stylesHeader from '../../core/components/Header/style';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import Service from './ServiceScreen';
import ServiceNew from './ServiceScreenNew';
import {connect} from 'react-redux';

const ServiceScreen = withNavigation(Service);
const ServiceNewScreen = withNavigation(ServiceNew);

const mapStateToProps = ({dealer}) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class ServiceContnainer extends Component {
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
    };
  };

  render() {
    const {dealerSelected} = this.props;
    if (dealerSelected.region === 'by') {
      return <ServiceNewScreen />;
    }
    return <ServiceScreen />;
  }
}

export default connect(mapStateToProps)(ServiceContnainer);
