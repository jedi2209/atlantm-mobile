import React, {Component} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';

import stylesHeader from '../../core/components/Header/style';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import Service from './ServiceScreen';
import ServiceNew from './OnlineService/ServiceScreenNewStep1';
import ServiceNewNonAuth from './OnlineService/ServiceScreenNonAuth';
import {connect} from 'react-redux';
import {get} from 'lodash';
import strings from '../../core/lang/const';

const mapStateToProps = ({dealer, profile}) => {
  return {
    dealerSelected: dealer.selected,
    loginID: get(profile, 'login.ID', false),
    cars: get(profile, 'cars', false),
  };
};

const ServiceContainer = (props) => {
  // static navigationOptions = ({navigation}) => {
  //   const returnScreen =
  //     navigation.state.params && navigation.state.params.returnScreen;

  //   let headerTitle = strings.ServiceScreen.title;

  //   return {
  //     headerStyle: stylesHeader.whiteHeader,
  //     headerTitleStyle: stylesHeader.whiteHeaderTitle,
  //     headerTitle: headerTitle,
  //     headerLeft: (
  //       <HeaderIconBack
  //         theme="blue"
  //         navigation={navigation}
  //         returnScreen={returnScreen}
  //       />
  //     ),
  //     headerRight: <View />,
  //   };
  // };

  const navigation = useNavigation();

  const {dealerSelected, loginID, cars} = this.props;
  if (dealerSelected.region === 'by') {
    if (loginID && cars && cars.length > 0) {
      return <ServiceNew navigation={navigation} />;
    } else {
      return <ServiceNewNonAuth navigation={navigation} />;
    }
  }
  return <Service />;
};

export default connect(mapStateToProps)(ServiceContainer);
