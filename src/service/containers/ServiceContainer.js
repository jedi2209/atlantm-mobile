import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {View} from 'react-native';

import stylesHeader from '../../core/components/Header/style';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import Service from './ServiceScreen';
import ServiceNew from './ServiceScreenNew';
import {connect} from 'react-redux';

const ServiceScreen = withNavigation(Service);
const ServiceNewScreen = withNavigation(ServiceNew);

const mapStateToProps = ({dealer, navigation}) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class ServiceContnainer extends Component {
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
    // const {dealerSelected} = this.props;
    // if (dealerSelected.region === 'by') {
    //   return <ServiceNewScreen />;
    // }
    return <ServiceScreen />;
  }
}

export default connect(mapStateToProps)(ServiceContnainer);
