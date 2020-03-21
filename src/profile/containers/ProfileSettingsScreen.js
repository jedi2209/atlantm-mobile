/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

import {actionSaveProfileByUser} from '../actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';
import styleConst from '@core/style-const';

class ProfileSettingsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);

    let car = '';

    if (this.props.profile.car) {
      car = {
        number: this.props.profile.carNumber,
        brand: this.props.profile.car,
        model: '',
      };
    } else {
      car = this.props.profile.cars.find(value => value.owner) || {
        number: '',
        brand: '',
        model: '',
      };
    }

    const {first_name, last_name, email, phone} = this.props.profile;

    this.state = {
      firstName: first_name || '',
      lastName: last_name || '',
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      car: car.brand && car.model ? `${car.brand} ${car.model}` : '',
      carNumber: car.number,
      success: false,
    };
  }

  onPressSave = () => {
    this.setState({loading: true});
    const {name, email, phone, id} = this.props.profile;
    let emailValue;
    let phonelValue;

    if (email && email.value) {
      email.value = this.state.email;
      emailValue = email;
    } else {
      emailValue = {
        value: this.state.email,
        type: 'home',
      };
    }

    if (phone && phone.value) {
      phone.value = this.state.phone;
      phonelValue = phone;
    } else {
      phonelValue = {
        value: this.state.phone,
        type: 'home',
      };
    }

    if (!phonelValue && !emailValue) {
      this.setState({loading: false});
      Alert.alert(
        'Заполните телефон или Email',
        'Пожалуйста укажите хотя бы один контакт для возможности связи с Вами',
        [
          {
            text: 'ОК',
          },
        ],
      );
      return false;
    }

    this.props
      .actionSaveProfileByUser({
        id,
        email: emailValue,
        last_name: this.state.lastName,
        first_name: this.state.firstName,
        phone: phonelValue,
        name,
        carNumber: this.state.carNumber,
        car: this.state.car,
      })
      .then(data => {
        this.setState({success: true, loading: false});
        const _this = this;
        Alert.alert('Ваши данные успешно сохранены', '', [
          {
            text: 'ОК',
            onPress() {
              _this.props.navigation.navigate('ProfileScreenInfo');
            },
          },
        ]);
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
        <StatusBar barStyle="dark-content" />
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
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
              <Button
                onPress={
                  this.state.loading ? undefined : () => this.onPressSave()
                }
                style={[styleConst.shadow.default, styles.button]}>
                {this.state.loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Сохранить</Text>
                )}
              </Button>
            </View>
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
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});
