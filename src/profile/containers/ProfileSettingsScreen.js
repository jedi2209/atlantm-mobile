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
import {dayMonthYear, substractYears, yearMonthDay} from '../../utils/date';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
import SocialAuth from '../components/SocialAuth';

import {actionSaveProfileToAPI} from '../actions';

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

    if (typeof EMAIL === 'object' && EMAIL && EMAIL.length) {
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
    if (typeof PHONE === 'object' && PHONE && PHONE.length) {
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

    if (typeof BIRTHDATE === 'string') {
      birthdate = new Date(BIRTHDATE);
    } else if (typeof BIRTHDATE === 'object') {
      birthdate = BIRTHDATE;
    }

    console.log('birthdate', birthdate);

    this.state = {
      email: emailData || [],
      phone: phoneData || [],
      success: false,
      loading: false,
    };

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
                value: NAME || '',
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: 'Отчество',
                value: SECOND_NAME || '',
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: LAST_NAME || '',
                props: {
                  textContentType: 'familyName',
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
                value: birthdate || '',
                props: {
                  maxDate: new Date(substractYears(18)),
                  minDate: new Date(substractYears(100)),
                },
              },
            ],
          },
        ],
      },
    };
  }

  componentDidMount() {
    Amplitude.logEvent('screen', 'profile/edit');
  }

  onPressSave = (props) => {
    this.setState({loading: true});
    let emailValue = [];
    let phoneValue = [];
    let propsTmp = {};

    if (props.EMAIL) {
      for (let [key, item] of Object.entries(props.EMAIL)) {
        emailValue.push({
          ID: key,
          TYPE_ID: 'EMAIL',
          VALUE: item.value,
          VALUE_TYPE: 'HOME',
        });
      }
      propsTmp.EMAIL = emailValue;
    } else {
      propsTmp.EMAIL = null;
    }

    if (props.PHONE) {
      for (let [key, item] of Object.entries(props.PHONE)) {
        phoneValue.push({
          ID: key,
          TYPE_ID: 'PHONE',
          VALUE: item.value || null,
          VALUE_TYPE: 'MOBILE',
        });
      }
      propsTmp.PHONE = phoneValue;
    } else {
      propsTmp.PHONE = null;
    }

    propsTmp.SECOND_NAME = props.SECOND_NAME || '';
    propsTmp.NAME = props.NAME || '';
    propsTmp.LAST_NAME = props.LAST_NAME || '';
    propsTmp.BIRTHDATE = props.BIRTHDATE || '';

    if (!phoneValue && !emailValue) {
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

    let profileToSend = Object.assign({}, this.props.profile, props, propsTmp);

    return this.props
      .actionSaveProfileToAPI(profileToSend)
      .then((data) => {
        const _this = this;
        Alert.alert(
          'Отлично! Всё получилось!',
          'Ваши данные успешно обновлены',
          [
            {
              text: 'ОК',
              onPress() {
                _this.props.navigation.navigate('ProfileScreenInfo');
              },
            },
          ],
        );
        this.setState({loading: false});
        return data;
      })
      .catch(() => {
        setTimeout(
          () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
          100,
        );
        this.setState({loading: false});
        return false;
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
              SubmitButton={{text: 'Сохранить'}}
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
  actionSaveProfileToAPI,
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
  },
});
