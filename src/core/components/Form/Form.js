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
import {DatePickerCustom} from '@core/components/DatePickerCustom';
import PhoneInput from 'react-native-phone-input';
import TextInputMask from 'react-native-text-input-mask';

import getTheme from '../../../../native-base-theme/components';
import {yearMonthDay} from '../../../utils/date';
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
  group: {
    marginBottom: 16,
  },
  groupName: {
    marginBottom: 10,
    fontSize: 14,
    color: styleConst.color.greyText,
  },
  groupFields: {
    borderRadius: 4,
    backgroundColor: 'white',
  },
  field: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  divider: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 40 : 'auto',
    color: '#222b45',
    fontSize: 16,
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

const datePickerStyles = {
  dateTouchBody: {
    width: styleConst.screen.width,
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

const MaskedPhone = {
  ru: '+7 (9[00]) [000]-[00]-[00]',
  by: '+375 ([00]) [000]-[00]-[00]',
  ua: '+380 ([00]) [000]-[00]-[00]',
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.defaultCountryCode = this.props.defaultCountryCode || 'by';
    this.state = {};
    if (props.fields.groups) {
      props.fields.groups.map((group) => {
        group.fields.map((field) => {
          if (field.value && field.type !== 'component') {
            if (field.id) {
              this.state[field.name] = Object.assign(
                {},
                this.state[field.name],
                {
                  [field.id]: {
                    value: field.value,
                  },
                },
              );
            } else {
              this.state[field.name] = field.value;
            }
          }
        });
      });
    } else {
      props.fields.map((field) => {
        if (field.value && field.type !== 'component') {
          if (field.id) {
            this.state[field.name][field.id].value = field.value;
          } else {
            this.state[field.name] = field.value;
          }
        }
      });
    }
  }

  onChangeField = (field) => (valueNew) => {
    const {name, id} = field;
    if (field.id) {
      this.setState((prevState) => {
        let copyField = Object.assign({}, prevState[name]);
        copyField[id].value = valueNew;
        return {[name]: copyField};
      });
    } else {
      this.setState({[name]: valueNew});
    }
  };

  FieldsDivider = (key) => {
    return <View style={styles.divider} key={key} />;
  };

  _groupRender = (group, num) => {
    return (
      <View style={styles.group} key={'group' + num}>
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.groupFields}>
          {group.fields.map((field, fieldNum) => {
            const returnField = this._fieldsRender[field.type](field, fieldNum);
            if (fieldNum !== group.fields.length - 1) {
              return [returnField, this.FieldsDivider('divider' + field.name)];
            }
            return returnField;
          })}
        </View>
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
            value={this.state[name] || value || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    email: (data, num) => {
      const {label, name, id, value} = data;
      return (
        <View style={styles.field} key={'field' + num + name}>
          <TextInput
            keyboardType="email-address"
            textContentType={'emailAddress'}
            autoCorrect={false}
            style={styles.textinput}
            label={label}
            name={name}
            value={this.state[name][id].value || value || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    date: (data, num) => {
      const {label, name} = data;
      return (
        <View style={styles.field} key={'field' + num + name}>
          <DatePickerCustom
            showIcon={false}
            mode="date"
            label={label}
            locale="ru-RU"
            placeholder="Выберите дату"
            format="DD MMMM YYYY"
            confirmBtnText="Выбрать"
            cancelBtnText="Отмена"
            customStyles={datePickerStyles}
            date={this.state[name] || ''}
            onDateChange={(_, date) => {
              this.onChangeField(data)(yearMonthDay(date));
              console.log('state123', this.state);
            }}
            {...data.props}
          />
        </View>
      );
    },
    phone: (data, num) => {
      const {name, id} = data;
      let countryCode = this.defaultCountryCode;
      if (data.country.code) {
        countryCode = data.country.code.toLowerCase();
      }
      if (id && !this.state[name][id].mask) {
        this.state[name][id].mask = MaskedPhone[countryCode];
      }
      return (
        <PhoneInput
          style={{
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
          ref={(ref) => {
            this['phoneInputRef' + name + id] = ref;
          }}
          key={'field' + num + name}
          initialCountry={countryCode}
          countriesList={require('@utils/countries.json')}
          offset={20}
          cancelText="Отмена"
          confirmText="Выбрать"
          onSelectCountry={(countryCode) => {
            if (id) {
              this.setState((prevState) => {
                let copyField = Object.assign({}, prevState[name]);
                copyField[id] = {
                  value: null,
                  mask: MaskedPhone[countryCode],
                };
                return {[name]: copyField};
              });
            }
          }}
          textComponent={() => {
            let value;
            if (typeof this.state[name][id].value !== 'undefined') {
              value = this.state[name][id].value;
            } else {
              value = data.value;
            }
            return (
              <TextInputMask
                key={'fieldInternal' + num + name}
                value={value}
                placeholderTextColor={'#afafaf'}
                placeholder={data.label}
                keyboardType={'phone-pad'}
                autoCompleteType={'tel'}
                selectionColor={'#afafaf'}
                returnKeyType={'go'}
                textContentType={'telephoneNumber'}
                enablesReturnKeyAutomatically={true}
                editable={true}
                onChangeText={(formatted, pureValue) => {
                  if (data.id) {
                    this.setState((prevState) => {
                      let copyField = Object.assign({}, prevState[name]); // creating copy of state variable jasper
                      copyField[id].value = formatted.replace(/[^\d.+]/g, ''); // update the name property, assign a new value
                      let maskLength = copyField[id].mask.replace(/[^0]/g, '');

                      if (pureValue.length === maskLength.length) {
                        return {[name]: copyField};
                      }
                    });
                  }
                }}
                mask={this.state[name][id].mask}
                style={[
                  {
                    height: 40,
                    paddingHorizontal: 14,
                    fontSize: 16,
                    letterSpacing: 2,
                    width: '100%',
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
    component: (data, num) => {
      const {name} = data;
      return (
        <View
          style={[
            styles.field,
            {
              paddingBottom: 5,
            },
          ]}
          key={'field' + num + name}>
          {data.value}
        </View>
      );
    },
  };

  render() {
    const res = (
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
          <View style={styles.group}>
            <Button
              onPress={() => {
                if (!this.state.loading) {
                  if (!this.props.onSubmit) {
                    console.log('Undefined onSubmit prop for Form component');
                    console.log('onSubmit handler', this.state);
                  } else {
                    this.props.onSubmit(this.state);
                  }
                }
              }}
              style={[styleConst.shadow.default, styles.button]}>
              {this.state.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Сохранить</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
    return res;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
