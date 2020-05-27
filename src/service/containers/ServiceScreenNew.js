/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {Icon, Picker} from 'native-base';
import {orderBy} from 'lodash';

import {CarCard} from '../../profile/components/CarCard';
import DealerItemList from '../../core/components/DealerItemList';
import ChooseDateTimeComponent from '../components/ChooseDateTimeComponent';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import API from '../../utils/api';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  //TODO: owner true должен быть показан первым
  const cars = orderBy(profile.login.cars, ['owner'], ['asc']);

  return {
    cars,
    nav,
    date: service.date,
    car: profile.car,
    name: profile.login ? profile.login.name : '',
    phone: profile.login ? profile.login.phone : '',
    email: profile.login ? profile.login.email : '',
    dealerSelected: dealer.selected,
    profile,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  carFill,
  dateFill,
  nameFill,
  phoneFill,
  emailFill,
  orderService,
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 36,
  },
});

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    const car = this.props.cars && this.props.cars.find((value) => value.owner);

    this.state = {
      car: car,
      service: '',
      services: [],
    };
  }

  onValueChange2(value) {
    this.setState({
      service: value,
    });
  }

  async _getServices() {
    console.log('start _getServices');
    const data = await API.getServiceAvailable({
      dealer: this.props.dealerSelected.id,
      vin: this.state.car.vin,
    });

    this.setState({
        services: data.data
    })
  }

  componentDidMount() {
    if(this.state.car && this.state.car.vin) {
        this._getServices();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.car.vin !== this.state.car.vin);
    if (prevState.car.vin !== this.state.car.vin) {
      this._getServices();
    }
  }

  render() {
    const {navigation, dealerSelected} = this.props;

    return (
      <>
        <View
          // Визуально выравниваем относительно остальных компонентов.
          style={[styles.group, {marginLeft: -14, marginRight: -14}]}>
          <DealerItemList
            goBack
            navigation={navigation}
            city={dealerSelected.city}
            name={dealerSelected.name}
            brands={dealerSelected.brands}
          />
        </View>
        <Text>Выберите автомобиль</Text>
        {this.props.cars.length > 0 ? (
          <View style={{height: 200}}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{height: 200}}
              contentContainerStyle={{
                paddingLeft: 12,
                paddingRight: 5,
                backgroundColor: 'red',
                height: 200,
              }}>
              {this.props.cars.map((item) => (
                <TouchableWithoutFeedback
                  key={item.vin}
                  onPress={() => {
                    this.setState({
                      car: item,
                    });
                  }}>
                  <View>
                    <CarCard
                      data={item}
                      type="check"
                      checked={Boolean(this.state.car.vin === item.vin)}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
        ) : null}
        <Text>Выберите доступную услугу</Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{width: undefined}}
          placeholder="Select your SIM"
          placeholderStyle={{color: '#bfc6ea'}}
          placeholderIconColor="#007aff"
          selectedValue={this.state.service}
          onValueChange={this.onValueChange2.bind(this)}>
          {this.state.services.map((item) => {
            return <Picker.Item label={item.name} value={item.id} />;
          })}
        </Picker>
        {!this.state.service ? (
          <ChooseDateTimeComponent
            dealer={dealerSelected}
            onChange={(data) => {
              console.log('=====> work', data);
            }}
          />
        ) : null}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
