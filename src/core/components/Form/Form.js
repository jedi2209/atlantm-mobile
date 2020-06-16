import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import {Text, Button, Switch} from 'native-base';

// Form field types
import {TextInput} from '@core/components/TextInput';
import {DatePickerCustom} from '@core/components/DatePickerCustom';
import ChooseDateTimeComponent from '../../../service/components/ChooseDateTimeComponent';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import PhoneInput from 'react-native-phone-input';
import TextInputMask from 'react-native-text-input-mask';
import DealerItemList from '@core/components/DealerItemList';

import styleConst from '@core/style-const';

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
  fieldRequiredFalse: {
    borderRightColor: 'red',
    borderRightWidth: 0.5,
  },
  fieldRequiredTrue: {
    borderRightColor: 'green',
    borderRightWidth: 0.5,
  },
  labelRequiredFalse: {
    color: 'red',
    textDecorationStyle: 'solid',
  },
  labelRequiredTrue: {
    color: 'green',
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
  select: {
    height: Platform.OS === 'ios' ? 61 : 'auto',
  },
  selectLabel: {
    color: '#808080',
    fontSize: 14,
    position: 'absolute',
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  textarea: {
    height: Platform.OS === 'ios' ? 140 : 'auto',
    color: '#222b45',
    fontSize: 16,
    paddingTop: 20,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 24,
    paddingLeft: 1,
    color: '#222b45',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 25,
    color: '#222b45',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const MaskedPhone = {
  ru: '+7 (9[00]) [000]-[00]-[00]',
  by: '+375 ([00]) [000]-[00]-[00]',
  ua: '+380 ([00]) [000]-[00]-[00]',
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.defaultCountryCode = this.props.defaultCountryCode || 'by';
    this.state = {
      parentState: props.parentState,
      required: [],
    };
    this.inputRefs = [];
    let requredFields = [];
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
          if (field.props && field.props.required === true) {
            requredFields.push({
              name: field.name,
              type: field.type,
              label: field.label,
            });
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
        if (field.props && field.props.required === true) {
          requredFields.push({
            name: field.name,
            type: field.type,
            label: field.label,
          });
        }
      });
    }
    this.state.required = requredFields;
  }

  static propTypes = {
    fields: PropTypes.exact({
      groups: PropTypes.array,
    }),
    barStyle: PropTypes.string,
    defaultCountryCode: PropTypes.string,
    SubmitButton: PropTypes.object,
    parentState: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  };

  _validate = () => {
    if (this.state.required) {
      let requredLabels = [];
      this.state.required.map((val, index) => {
        if (
          typeof this.state[val.name] === 'undefined' ||
          this.state[val.name] === ''
        ) {
          requredLabels.push(val.label);
        }
      });
      if (requredLabels.length) {
        if (requredLabels.length > 1) {
          Alert.alert(
            'Заполните пожалуйста обязательные поля',
            '\r\n Поля ' +
              requredLabels.join(', ') +
              ' обязательны для заполнения',
          );
        } else {
          Alert.alert(
            'Заполните пожалуйста обязательное поле',
            '\r\n Поле ' +
              requredLabels.join(', ') +
              ' обязательно для заполнения',
          );
        }
        return false;
      }
    }
    return true;
  };

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
    setTimeout(() => {
      console.log('FORM onChangeField', this.state);
    }, 1000);
  };

  _fieldsDivider = (key) => {
    return <View style={styles.divider} key={key} />;
  };

  _groupRender = (group, num) => {
    let totalFields = group.fields.length;
    let groupClean = [];

    group.fields.filter((element) => {
      if (element.type) {
        return groupClean.push(element);
      }
    });

    return (
      <View style={styles.group} key={'group' + num}>
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.groupFields}>
          {groupClean.map((field, fieldNum, totalFields) => {
            if (field.type) {
              const returnField = this._fieldsRender[field.type](
                field,
                fieldNum,
                totalFields,
              );
              if (fieldNum !== group.fields.length - 1) {
                return [
                  returnField,
                  this._fieldsDivider('divider' + field.name),
                ];
              }
              return returnField;
            }
          })}
        </View>
      </View>
    );
  };

  _fieldsRender = {
    input: (data, num, totalFields) => {
      const {label, name, value} = data;
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : null,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <TextInput
            autoCorrect={false}
            style={styles.textinput}
            label={label}
            name={name}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    textarea: (data, num, totalFields) => {
      const {label, name, value} = data;
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : null,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <TextInput
            autoCorrect={false}
            style={styles.textarea}
            multiline={true}
            numberOfLines={4}
            label={label}
            name={name}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    email: (data, num, totalFields) => {
      const {label, name, id} = data;

      let value = '';

      if (id) {
        value = this.state[name][id].value;
      } else {
        value = this.state[name];
      }
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : null,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <TextInput
            keyboardType="email-address"
            textContentType={'emailAddress'}
            autoCorrect={false}
            style={styles.textinput}
            label={label}
            name={name}
            value={value}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    date: (data, num, totalFields) => {
      const {label, name} = data;
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required && !this.state[name]
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : null,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
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
              this.onChangeField(data)(date);
            }}
            {...data.props}
          />
        </View>
      );
    },
    dateTime: (data, num, totalFields) => {
      const {label, name, value} = data;
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required && !this.state[name]
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : null,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <ChooseDateTimeComponent
            label={label}
            customStyles={datePickerStyles}
            onFinishedSelection={(returnData) => {
              console.log('returnData', returnData);
              this.onChangeField(data)(returnData);
            }}
            {...data.props}
          />
        </View>
      );
    },
    year: (data, num, totalFields) => {
      const {name, label} = data;
      let items = [];

      const minDate =
        data.props.minDate.getUTCFullYear() || new Date().getUTCFullYear();
      const maxDate =
        data.props.maxDate.getUTCFullYear() || new Date().getUTCFullYear();

      if (minDate && maxDate) {
        for (var i = minDate; i <= maxDate; i++) {
          items.push({
            label: i.toString(),
            value: i,
          });
        }
      }
      if (data.props.reverse === true) {
        items.reverse();
      }
      return (
        <View
          style={[
            styles.field,
            styles.select,
            {
              marginVertical: 0,
            },
          ]}
          key={'field' + num + name}>
          <Text style={styles.selectLabel}>{label}</Text>
          <RNPickerSelect
            key={'rnYearPicker' + num + name}
            doneText="Выбрать"
            onValueChange={(value) => {
              this.onChangeField(data)(value);
            }}
            InputAccessoryView={() => {
              return (
                <View style={defaultStyles.modalViewMiddle}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState(
                        {
                          [name]: this.state[name],
                        },
                        () => {
                          this.inputRefs[name].togglePicker(true);
                        },
                      );
                    }}
                    hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
                    <View testID="needed_for_touchable">
                      <Text
                        style={[
                          defaultStyles.done,
                          {fontWeight: 'normal', color: 'red'},
                        ]}>
                        Отмена
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <Text>Выберите год</Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.inputRefs[name].togglePicker(true);
                    }}
                    hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
                    <View testID="needed_for_touchable">
                      <Text style={defaultStyles.done}>Готово</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            }}
            ref={(ref) => {
              this.inputRefs[name] = ref;
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 5,
              },
            }}
            {...data.props}
            items={items}
          />
        </View>
      );
    },
    phone: (data, num, totalFields) => {
      let {name, id} = data;
      let countryCode = this.defaultCountryCode;
      if (data.country && data.country.code) {
        countryCode = data.country.code.toLowerCase();
      }
      let mask;

      if (id && !this.state[name][id].mask) {
        this.state[name][id].mask = MaskedPhone[countryCode];
      } else {
        if (!this.state['mask_' + name + num]) {
          this.state['mask_' + name + num] = MaskedPhone[countryCode];
        }
      }

      if (id && this.state[name][id].mask) {
        mask = this.state[name][id].mask;
      } else {
        mask = this.state['mask_' + name + num];
      }

      let requiredStyle = null;

      if (data.props && data.props.required) {
        requiredStyle = styles.fieldRequiredFalse;
        if (id) {
          if (
            this.state[name][id] &&
            typeof this.state[name][id] !== 'undefined' &&
            this.state[name][id].length
          ) {
            requiredStyle = styles.fieldRequiredTrue;
          } else {
            requiredStyle = styles.fieldRequiredFalse;
          }
        } else {
          if (
            this.state[name] &&
            typeof this.state[name] !== 'undefined' &&
            this.state[name].length
          ) {
            requiredStyle = styles.fieldRequiredTrue;
          } else {
            requiredStyle = styles.fieldRequiredFalse;
          }
        }
      }
      return (
        <PhoneInput
          style={[
            requiredStyle,
            {
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
            },
          ]}
          ref={(ref) => {
            this['phoneInputRef' + name + (id || num)] = ref;
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
            } else {
              this.setState({
                [name]: null,
                ['mask_' + name + num]: MaskedPhone[countryCode],
              });
            }
          }}
          textComponent={() => {
            let value;
            if (id && typeof this.state[name][id].value !== 'undefined') {
              value = this.state[name][id].value;
            } else {
              value = this.state[name] || data.value;
            }
            return (
              <TextInputMask
                key={'fieldInternal' + name + num}
                ref={(ref) => {
                  this['phoneInputRefInternal' + name + num] = ref;
                }}
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
                  if (id) {
                    this.setState((prevState) => {
                      let copyField = Object.assign({}, prevState[name]); // creating copy of state variable jasper
                      copyField[id].value = formatted.replace(/[^\d.+]/g, ''); // update the name property, assign a new value
                      let maskLength = copyField[id].mask.replace(/[^0]/g, '');
                      if (pureValue.length === maskLength.length) {
                        return {[name]: copyField};
                      }
                    });
                  } else {
                    let maskLength = this.state['mask_' + name + num].replace(
                      /[^0]/g,
                      '',
                    );
                    if (pureValue.length === maskLength.length) {
                      this.setState({
                        [name]: formatted.replace(/[^\d.+]/g, ''),
                      });
                    }
                  }
                }}
                mask={mask}
                style={[
                  {
                    height: 40,
                    paddingHorizontal: 14,
                    fontSize: 16,
                    letterSpacing: 2,
                    width: '100%',
                  },
                  {...data.textStyle},
                  data.props && data.props.required
                    ? !this.state[name]
                      ? styles.labelRequiredFalse
                      : styles.labelRequiredTrue
                    : null,
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
    dealerSelect: (data, num) => {
      const {name, value} = data;
      return (
        <DealerItemList
          key={'field' + num + name}
          dealer={value}
          style={[
            styles.field,
            {
              paddingBottom: 5,
            },
          ]}
          {...data.props}
        />
      );
    },
    select: (data, num) => {
      const {name, label} = data;
      return (
        <View
          style={[
            styles.field,
            styles.select,
            {
              marginVertical: 0,
            },
          ]}
          key={'field' + num + name}>
          <Text style={styles.selectLabel}>{label}</Text>
          <RNPickerSelect
            key={'rnpicker' + num + name}
            doneText="Выбрать"
            onValueChange={(value) => {
              this.onChangeField(data)(value);
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 5,
              },
            }}
            {...data.props}
          />
        </View>
      );
    },
    switch: (data, num, totalFields) => {
      const {name, value, label} = data;
      return (
        <View
          style={[
            styles.field,
            styles.textinput,
            {
              marginVertical: 10,
            },
          ]}
          key={'field' + num + name}>
          <Text
            style={{
              marginTop: 5,
              color: '#808080',
            }}>
            {label}
          </Text>
          <Switch
            style={[
              {
                right: 15,
                top: 10,
                position: 'absolute',
              },
            ]}
            value={value}
            {...data.props}
          />
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
                if (field.type) {
                  return this._fieldsRender[field.type](field, num);
                }
              })}
          <View style={styles.group}>
            <Button
              onPress={() => {
                if (!this.state.loading) {
                  if (!this.props.onSubmit) {
                    console.log(
                      'Undefined required onSubmit prop for Form component',
                    );
                    console.log('this.props', this.props);
                    console.log('onSubmit handler', this.state);
                  } else {
                    if (this._validate()) {
                      this.setState({loading: true});
                      const response = async () => {
                        return new Promise((resolve, reject) => {
                          const answer = this.props.onSubmit(this.state);
                          if (answer) {
                            resolve(answer);
                          }
                        });
                      };
                      response().then(() => {
                        this.setState({loading: false});
                      });
                    }
                  }
                }
              }}
              style={[styleConst.shadow.default, styles.button]}>
              {this.state.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {this.props.SubmitButton && this.props.SubmitButton.text
                    ? this.props.SubmitButton.text
                    : 'Отправить'}
                </Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
    return res;
  }
}

export default Form;
