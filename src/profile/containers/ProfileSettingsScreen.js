import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

class ProfileSettingsScreen extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    car: '',
    carNumber: '',
  };

  onPressSave = () => {
    console.log('>>> this.state', this.state);
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

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {};

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
