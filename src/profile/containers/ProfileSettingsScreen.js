/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

import {actionSaveProfileByUser} from '../actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

class ProfileSettingsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerLeft: (
      <View
        style={{
          marginLeft: -16,
          marginTop: 2,
        }}>
        <HeaderIconBack theme="blue" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    const car = this.props.profile.cars.find(value => value.owner) || {
      number: '',
      brand: '',
      model: '',
    };

    const {first_name, last_name, email, phone} = this.props.profile;

    this.state = {
      firstName: first_name || '',
      lastName: last_name || '',
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      car: `${car.brand} ${car.model}`,
      carNumber: car.number,
      success: false,
    };
  }

  onPressSave = () => {
    this.setState({loading: true});
    const {id, token, avatar, name, email, phone, crm_id} = this.props.profile;
    let emailValue;
    let phonelValue;

    if (email) {
      email.value = this.state.email;
      emailValue = email;
    } else {
      emailValue = {
        value: this.state.email,
        type: 'home',
      };
    }

    if (phone) {
      phone.value = this.state.phone;
      phonelValue = phone;
    } else {
      phonelValue = {
        value: this.state.phone,
        type: 'home',
      };
    }

    this.props
      .actionSaveProfileByUser({
        crm_id,
        id,
        token,
        email: emailValue,
        last_name: this.state.lastName,
        first_name: this.state.firstName,
        phone: phonelValue,
        avatar,
        name,
        carNumber: this.state.carNumber,
        car: this.state.car,
        cars: this.props.profile.cars,
        bonus: this.props.profile.bonus,
        discounts: this.props.profile.discounts,
      })
      .then(data => {
        this.setState({success: true, loading: false});
      })
      .catch(() => {
        setTimeout(
          () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
          100,
        );
        this.setState({loading: false});
      });
  };

  onChangeProfileField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.heading}>Изменение данных</Text>
            </View>
            {this.state.success ? (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.group}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}>
                    Заявка успешно отправлена
                  </Text>
                </View>
                <View>
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate('ProfileScreenInfo')
                    }
                    style={styles.button}>
                    <Text style={styles.buttonText}>Назад</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <>
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
                  <Button
                    onPress={
                      this.state.loading ? undefined : () => this.onPressSave()
                    }
                    style={styles.button}>
                    {this.state.loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Сохранить</Text>
                    )}
                  </Button>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => {
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
