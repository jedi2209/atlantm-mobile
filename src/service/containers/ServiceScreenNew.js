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
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  carContainer: {
    marginLeft: -14,
    marginRight: -14,
  },
  carContainerContent: {
    // Добавляем отрицательный оступ, для контейнера с карточками,
    // т.к. в карточках отступ снизу больше чем сверху из-за места использования.
    marginBottom: -10,
  },
  group: {
    marginBottom: 36,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: -2,
  },
  picker: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    height: 40,
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
      <ScrollView>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View
            // Визуально выравниваем относительно остальных компонентов.
            style={[styles.group, {marginLeft: -24, marginRight: -14}]}>
            <DealerItemList
              goBack
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Выберите автомобиль</Text>
            {/* TODO: Разобраться, почему есть вертикальный скролл внутри контейнера. */}
            {this.props.cars.length && (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.carContainer}
                contentContainerStyle={styles.carContainerContent}>
                {this.props.cars.map((item) => (
                  <TouchableWithoutFeedback
                    key={item.vin}
                    onPress={() => this.setState({car: item})}>
                    <View>
                      <CarCard
                        data={item}
                        type="check"
                        checked={this.state.car.vin === item.vin}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Выберите доступную услугу</Text>
            <Picker
              mode="dropdown"
              iosIcon={
                <Icon
                  name="arrow-down"
                  style={{color: '#c7c7c7', marginRight: 0}}
                />
              }
              style={styles.picker}
              // TODO: Переименовать на русский.
              placeholder="Select your SIM"
              placeholderStyle={{
                color: '#d8d8d8',
                fontSize: 18,
                paddingLeft: 0,
              }}
              textStyle={{
                paddingLeft: 0,
              }}
              selectedValue={this.state.service}
              onValueChange={this.onValueChange2.bind(this)}>
              {this.state.services.map((item) => (
                <Picker.Item label={item.name} value={item.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.field}>
            {!this.state.service && (
              <ChooseDateTimeComponent
                dealer={dealerSelected}
                onChange={(data) => {
                  console.log('=====> work', data);
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
