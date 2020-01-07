import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

import {actionSaveProfileByUser} from '../actions';

class ProfileSettingsScreen extends Component {
  constructor(props) {
    super(props);
    const car = this.props.profile.cars
      ? this.props.profile.cars.filter(value => {
          if (value.owner) {
            return value;
          }
        })
      : [{number: '', brand: '', model: ''}];

    this.state = {
      firstName: this.props.profile.first_name || '',
      lastName: this.props.profile.last_name || '',
      email: this.props.profile.email || '',
      phone: this.props.profile.phone || '',
      car: `${car[0].brand} ${car[0].model}`,
      carNumber: car[0].number,
    };
  }

  onPressSave = () => {
    const {id, token, avatar, name} = this.props.profile;

    this.props
      .actionSaveProfileByUser({
        id,
        token,
        email: this.state.email,
        last_name: this.state.lastName,
        first_name: this.state.firstName,
        phone: this.state.phone,
        avatar,
        name,
        carNumber: this.state.carNumber,
        car: this.state.car,
      })
      .then(data => {
        console.log(data);
      });
  };

  onChangeProfileField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.heading}>Изменение данных</Text>
            </View>
            <View style={styles.group}>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Имя"
                  value={this.state.firstName}
                  onChangeText={this.onChangeProfileField('firstName')}
                />
              </View>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Фамилия"
                  value={this.state.lastName}
                  onChangeText={this.onChangeProfileField('lastName')}
                />
              </View>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Email"
                  value={this.state.email}
                  onChangeText={this.onChangeProfileField('email')}
                />
              </View>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Телефон"
                  value={this.state.phone}
                  onChangeText={this.onChangeProfileField('phone')}
                />
              </View>
            </View>
            <View style={styles.group}>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Авто"
                  value={this.state.car}
                  onChangeText={this.onChangeProfileField('car')}
                />
              </View>
              <View style={styles.field}>
                <TextInput
                  style={styles.textinput}
                  label="Гос. номер"
                  value={this.state.carNumber}
                  onChangeText={this.onChangeProfileField('carNumber')}
                />
              </View>
            </View>
            <View style={styles.group}>
              <Button onPress={this.onPressSave} style={styles.button}>
                <Text style={styles.buttonText}>Сохранить</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => {
  console.log('profile >>>>>>>', profile.login);
  return {
    profile: profile.login,
  };
};

const mapDispatchToProps = {
  actionSaveProfileByUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 36,
  },
  textinput: {
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  button: {
    justifyContent: 'center',
    shadowColor: '#0f66b2',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});
