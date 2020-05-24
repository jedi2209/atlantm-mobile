import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

import {Text, StyleProvider, Icon, Button} from 'native-base';

// Form field types
import {TextInput} from '@core/components/TextInput';
import DatePicker from 'react-native-datepicker';
import PhoneInput from 'react-native-phone-input';
import TextInputMask from 'react-native-text-input-mask';

import getTheme from '../../../../native-base-theme/components';
import styleConst from '@core/style-const';

// redux
import {connect} from 'react-redux';

const mapStateToProps = ({dealer, profile, service, nav}) => {
  return {
    nav,
    date: service.date,
    car: profile.car,
    name: profile.login ? profile.login.name : '',
    phone: profile.login ? profile.login.phone : '',
    email: profile.login ? profile.login.email : '',
    dealerSelected: dealer.selected,
    profile,
  };
};

const mapDispatchToProps = {};

const styles = StyleSheet.create({
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
});

const datePickerStyles = {
  dateTouchBody: {
    width: styleConst.screen.width,
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 18,
    color: '#d8d8d8',
  },
  dateText: {
    fontSize: 18,
    color: '#222b45',
  },
  datePicker: {
    borderTopColor: 0,
  },
};

const phoneMask = {
  ru: '+7 (9[00]) [000]-[00]-[00]',
  by: '+375 ([00]) [000]-[00]-[00]',
  ua: '+380 ([00]) [000]-[00]-[00]',
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.defaultCountryCode = this.props.defaultCountryCode || 'by';
    this.state = {
      phoneMask: phoneMask[this.defaultCountryCode],
    };
    if (props.fields.groups) {
      props.fields.groups.map((group) => {
        group.fields.map((field) => {
          if (field.value) {
            this.setState({[field.name]: field.value});
          }
        });
      });
    } else {
      props.fields.map((field) => {
        if (field.value) {
          this.setState({[field.name]: field.value});
        }
      });
    }
  }

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  _groupRender = (group, num) => {
    return (
      <View style={styles.group} key={'group' + num}>
        <Text>{group.name}</Text>
        {group.fields.map((field, fieldNum) => {
          return this._fieldsRender[field.type](field, fieldNum);
        })}
      </View>
    );
  };

  _fieldsRender = {
    input: (data, num) => {
      const {label, name, value} = data;
      return (
        <View style={styles.field} key={'field' + num + name}>
          <TextInput
            autoCorrect={false}
            style={styles.textinput}
            label={label}
            name={name}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(name)}
            {...data.props}
          />
        </View>
      );
    },
    email: (data, num) => {
      const {label, name, value} = data;
      return (
        <View style={styles.field} key={'field' + num + name}>
          <TextInput
            keyboardType="email-address"
            textContentType={'emailAddress'}
            autoCorrect={false}
            style={styles.textinput}
            label={label}
            name={name}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(name)}
            {...data.props}
          />
        </View>
      );
    },
    date: (data, num) => {
      const {label, name, value} = data;
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (
        <View style={styles.field} key={'field' + num + name}>
          <DatePicker
            showIcon={false}
            mode="date"
            locale="ru-RU"
            minDate={tomorrow}
            placeholder="Выберите дату"
            format="DD MMMM YYYY"
            confirmBtnText="Выбрать"
            cancelBtnText="Отмена"
            customStyles={datePickerStyles}
            date={this.state[name] || ''}
            onDateChange={(_, date) => {
              this.onChangeField(name)(date);
            }}
            {...data.props}
          />
        </View>
      );
    },
    phone: (data, num) => {
      const {label, name, value} = data;
      return (
        <PhoneInput
          style={{
            justifyContent: 'center',
            flex: 1,
          }}
          ref={(ref) => {
            this.phoneInput = ref;
          }}
          key={'field' + num + name}
          initialCountry={this.defaultCountryCode}
          countriesList={require('@utils/countries.json')}
          autoFormat={true}
          offset={20}
          cancelText="Отмена"
          confirmText="Выбрать"
          onChangePhoneNumber={this.onInputPhone}
          onSelectCountry={(countryCode) => {
            this.setState({
              phoneMask: phoneMask[countryCode],
            });
          }}
          textComponent={() => {
            return (
              <TextInputMask
                refInput={(ref) => {
                  this.input = ref;
                }}
                key={'fieldInternal' + num + name}
                placeholderTextColor={'#afafaf'}
                placeholder={data.label}
                keyboardType={'phone-pad'}
                autoCompleteType={'tel'}
                selectionColor={'#afafaf'}
                returnKeyType={'go'}
                textContentType={'telephoneNumber'}
                enablesReturnKeyAutomatically={true}
                editable={true}
                onChangeText={(formatted, extracted) => {
                  //console.log('formatted', formatted); // +1 (123) 456-78-90
                  //console.log('extracted', extracted); // 1234567890
                }}
                mask={this.state.phoneMask}
                style={[
                  {
                    height: 40,
                    paddingHorizontal: 14,
                    fontSize: 18,
                    letterSpacing: 3,
                    borderColor: '#afafaf',
                    borderWidth: 0.45,
                    width: '100%',
                    borderRadius: 5,
                  },
                  {...data.textStyle},
                ]}
              />
            );
          }}
          {...data.props}
        />
      );
    },
  };

  render() {
    const res = (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <StatusBar
            barStyle={this.props.barStyle ? this.props.barStyle : 'default'}
          />
          <ScrollView contentContainerStyle={{paddingBottom: 24}}>
            {this.props.fields.groups
              ? this.props.fields.groups.map((group, num) => {
                  return this._groupRender(group, num);
                })
              : this.props.fields.map((field, num) => {
                  return this._fieldsRender[field.type](field, num);
                })}
          </ScrollView>
        </View>
      </StyleProvider>
    );
    return res;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
