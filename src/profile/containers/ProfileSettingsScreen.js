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
import {dayMonthYear} from '../../utils/date';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
import SocialAuth from '../components/SocialAuth';

import {actionSaveProfileByUser} from '../actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';
import Amplitude from '../../utils/amplitude-analytics';
import styleConst from '@core/style-const';

class ProfileSettingsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerTitle: 'Редактирование профиля',
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
      car = this.props.profile.cars.find((value) => value.owner) || {
        number: '',
        brand: '',
        model: '',
      };
    }

    console.log('this.props.profile', this.props.profile);

    const {
      NAME,
      LAST_NAME,
      SECOND_NAME,
      EMAIL,
      PHONE,
      BIRTHDATE,
    } = this.props.profile;

    let emailData = [];
    let phoneData = [];
    let birthdate = '';

    if (typeof EMAIL === 'object' && EMAIL.length) {
      EMAIL.map((field, num) => {
        emailData[field.ID] = {
          id: field.ID,
          name: 'EMAIL',
          type: 'email',
          label: 'E-mail',
          value: field.VALUE,
        };
      });
    } else {
      emailData = EMAIL;
    }

    if (typeof PHONE === 'object' && PHONE.length) {
      PHONE.map((field, num) => {
        phoneData[field.ID] = {
          id: field.ID,
          name: 'PHONE',
          type: 'phone',
          label: 'Телефон',
          value: field.VALUE,
          country: field.COUNTRY,
        };
      });
    } else {
      phoneData = PHONE;
    }

    if (BIRTHDATE) {
      birthdate = dayMonthYear(new Date(BIRTHDATE));
    }

    this.state = {
      firstName: NAME || '',
      secondName: SECOND_NAME || '',
      lastName: LAST_NAME || '',
      birthdate: birthdate || '',
      email: emailData || [],
      phone: phoneData || [],
      car: car.brand && car.model ? `${car.brand} ${car.model}` : '',
      carNumber: car.number,
      success: false,
    };

    console.log('this.state', this.state);

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: 'Основное',
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: 'Имя',
                value: this.state.firstName,
                props: {
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: 'Отчество',
                value: this.state.secondName,
                props: {
                  textContentType: 'name',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: this.state.lastName,
                props: {
                  textContentType: 'name',
                },
              },
            ],
          },
          {
            name: 'Контактные данные',
            fields: [].concat(this.state.email, this.state.phone),
          },
          {
            name: 'Ваши соц.сети для быстрого входа',
            fields: [
              {
                name: 'SocialAuth',
                type: 'component',
                label: 'Привяжите соц.сети',
                value: (
                  <SocialAuth
                    region={this.props.dealerSelected.region}
                    style={{
                      width: '80%',
                      marginHorizontal: '10%',
                      paddingVertical: 7,
                    }}
                  />
                ),
              },
            ],
          },
          {
            name: 'Дополнительно',
            fields: [
              {
                name: 'BIRTHDATE',
                type: 'date',
                label: 'Когда у вас день рождения?',
                value: this.state.birthdate,
                props: {
                  placeholder: null,
                },
              },
            ],
          },
        ],
      },
    };
    console.log('this.FormConfig', this.FormConfig);
  }

  componentDidMount() {
    Amplitude.logEvent('screen', 'profile/edit');
  }

  onPressSave = (props) => {
    console.log('this.props222', props);
    return false;
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
        second_name: this.state.secondName,
        first_name: this.state.firstName,
        phone: phonelValue,
        name,
        carNumber: this.state.carNumber,
        car: this.state.car,
      })
      .then((data) => {
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

  onChangeProfileField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView style={{flex: 1, backgroundColor: '#eee'}}>
          <View style={styles.container}>
            <Form
              fields={this.FormConfig.fields}
              barStyle={'light-content'}
              defaultCountryCode={'by'}
              onSubmit={this.onPressSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile, dealer}) => {
  return {
    profile: profile.login,
    dealerSelected: dealer.selected,
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
    // backgroundColor: '#fff',
  },
});
