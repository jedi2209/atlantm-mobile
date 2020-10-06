import React, {Component} from 'react';
import PropTypes, {element} from 'prop-types';

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

import {Text, Button, Switch, Toast} from 'native-base';

import {connect} from 'react-redux';

// Form field types
import {TextInput} from '../TextInput';
import {DatePickerCustom} from '../DatePickerCustom';
import ChooseDateTimeComponent from '../../../service/components/ChooseDateTimeComponent';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import {Picker} from '@react-native-community/picker';
import PhoneInput from 'react-native-phone-input';
import TextInputMask from 'react-native-text-input-mask';
import DealerItemList from '../DealerItemList';

import styleConst from '../../style-const';

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
    paddingTop: 3,
    paddingBottom: 2,
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
    height: Platform.OS === 'ios' ? 55 : 'auto',
    color: '#222b45',
    fontSize: 16,
    paddingTop: 25,
    paddingBottom: 0,
  },
  select: {
    height: Platform.OS === 'ios' ? 61 : 55,
    paddingTop: Platform.OS === 'ios' ? 3 : 8,
    paddingLeft: Platform.OS === 'ios' ? 'auto' : 7,
  },
  selectLabel: {
    color: '#808080',
    fontSize: 14,
    position: 'absolute',
    paddingHorizontal: 15,
    paddingTop: 2,
  },
  textarea: {
    height: Platform.OS === 'ios' ? 140 : 'auto',
    color: '#222b45',
    fontSize: 16,
    paddingTop: 25,
    paddingBottom: 0,
    paddingHorizontal: 0,
    maxHeight: 150,
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

const mapStateToProps = ({dealer, profile, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    profile,
  };
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
    this.defaultCountryCode =
      this.props.defaultCountryCode || this.props.dealerSelected.region || 'by';
    this.state = {
      parentState: props.parentState,
      required: [],
      active: {},
    };
    this.inputRefs = [];
    this.inputRefsNav = [];
    let requredFields = [];
    if (props.fields.groups) {
      props.fields.groups.map((group) => {
        group.fields = group.fields.filter((field) => {
          return typeof field === 'object' && field.name && field.type;
        });
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
      let valid = true;
      this.state.required.map((val, index) => {
        valid = true;
        switch (val.type.toLowerCase()) {
          case 'email':
            valid = this._validateEmail(this.state[val.name]);
            break;
          case 'datetime':
            valid = this._validateDateTime(this.state[val.name]);
            break;
          case 'date':
            console.log('this.state[val.name]', this.state[val.name]);
            valid = this._validateDate(this.state[val.name]);
            break;
          default:
            if (
              typeof this.state[val.name] === 'undefined' ||
              this.state[val.name] === ''
            ) {
              valid = false;
            }
            break;
        }
        if (!valid) {
          requredLabels.push(val.label);
        }
      });
      if (requredLabels.length) {
        if (requredLabels.length > 1) {
          Toast.show({
            text:
              'Поля\r\n- ' +
              requredLabels.join('\r\n- ') +
              '\r\n\r\nобязательны для заполнения',
            position: 'bottom',
            duration: 3000,
            type: 'warning',
          });
        } else {
          Toast.show({
            text:
              'Поле "' +
              requredLabels.join(' ') +
              '" обязательно для заполнения',
            position: 'bottom',
            duration: 3000,
            type: 'warning',
          });
        }
        return false;
      }
    }
    return true;
  };

  //returns true if valid, false if not valid
  _validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Zа-яА-Я\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/;
    return re.test(email);
  };

  _validateDateTime = (dateTime) => {
    if (typeof dateTime === 'undefined') {
      return false;
    }
    return dateTime.date && dateTime.time;
  };

  _validateDate = (date) => {
    if (typeof date === 'undefined') {
      return false;
    }
    return true;
  };

  _setActive = (el) => {
    if (typeof el === 'undefined') {
      return false;
    }
    if (typeof el.current.focus === 'function') {
      el.current.focus();
    } else {
      if (typeof el.current.input.focus === 'function') {
        el.current.input.focus();
      }
    }
  };

  _nextInput = (groupNum, num) => {
    const currEl = this.inputRefs[`${groupNum}Input${num}`];
    const currIndex = this.inputRefsNav.indexOf(groupNum + '_' + num);
    const nextIndex = currIndex + 1;
    const nextEl =
      this.inputRefsNav[nextIndex] && this.inputRefsNav[nextIndex].split('_');
    if (typeof nextEl === 'object') {
      const targetElement = this.inputRefs[`${nextEl[0]}Input${nextEl[1]}`];
      this._setActive(targetElement);
    } else {
      this._setActive(currEl);
    }
  };

  _addToNav = (groupNum, num) => {
    const index = this.inputRefsNav.indexOf(`${groupNum}` + '_' + `${num}`);
    if (index === -1) {
      this.inputRefsNav.push(`${groupNum}` + '_' + `${num}`);
    }
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
    // setTimeout(() => {
    //   console.log('FORM onChangeField', this.state);
    // }, 1000);
  };

  _fieldsDivider = (key) => {
    return <View style={styles.divider} key={key} />;
  };

  _groupRender = (group, num) => {
    let totalFields = group.fields.length;

    return (
      <View style={styles.group} key={'group' + num}>
        <Text selectable={false} style={styles.groupName}>
          {group.name}
        </Text>
        <View style={styles.groupFields}>
          {group.fields.map((field, fieldNum, totalFields) => {
            if (typeof field === 'object' && field.type) {
              const returnField = this._fieldsRender[field.type](
                field,
                fieldNum,
                totalFields,
                num,
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
    input: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <TextInput
            autoCorrect={false}
            style={styles.textinput}
            label={label + (data.props && data.props.required ? '*' : '')}
            name={name}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this._nextInput(groupNum, num);
            }}
            blurOnSubmit={false}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    textarea: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
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
            label={label + (data.props && data.props.required ? '*' : '')}
            name={name}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            value={this.state[name] || ''}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    email: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;

      let value = '';

      if (id) {
        value = this.state[name][id].value;
      } else {
        value = this.state[name];
      }
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? this.state[name] && this._validateEmail(value)
                ? styles.fieldRequiredTrue
                : styles.fieldRequiredFalse
              : {},
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
            label={label + (data.props && data.props.required ? '*' : '')}
            name={name}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            value={value}
            onSubmitEditing={() => {
              this._nextInput(groupNum, num);
            }}
            enablesReturnKeyAutomatically={true}
            onChangeText={this.onChangeField(data)}
            {...data.props}
          />
        </View>
      );
    },
    date: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required && !this.state[name]
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <DatePickerCustom
            mode="date"
            ref={this.inputRefs[groupNum + 'Input' + num]}
            label={label + (data.props && data.props.required ? '*' : '')}
            locale="ru-RU"
            confirmBtnText="выбрать"
            value={this.state[name] || null}
            isActive={this.state.active[name] || false}
            onPressButton={() => {
              this.setState((prevState) => {
                let copyField = Object.assign({}, prevState.active);
                copyField[name] = true;
                return {active: copyField};
              });
            }}
            onHideModal={() => {
              if (!this.state[name]) {
                let currentDate = new Date();
                if (data.props.minimumDate) {
                  currentDate = data.props.minimumDate;
                }
                this.onChangeField(data)(currentDate);
              }
              this.setState((prevState) => {
                let copyField = Object.assign({}, prevState.active);
                copyField[name] = false;
                return {active: copyField};
              });
            }}
            onChange={(_, selectedDate) => {
              const currentDate = selectedDate || this.state[name];
              if (Platform.OS !== 'ios') {
                this.setState((prevState) => {
                  let copyField = Object.assign({}, prevState.active);
                  copyField[name] = false;
                  return {active: copyField};
                });
              }
              if (currentDate) {
                this.onChangeField(data)(currentDate);
              }
            }}
            {...data.props}
          />
        </View>
      );
    },
    dateTime: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required && !this.state[name]
              ? typeof this.state[name] === 'undefined'
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : !this.state[name].time
              ? styles.fieldRequiredFalse
              : styles.fieldRequiredTrue,
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <ChooseDateTimeComponent
            label={label + (data.props && data.props.required ? '*' : '')}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            // customStyles={datePickerStyles}
            onFinishedSelection={(returnData) => {
              this.onChangeField(data)(returnData);
            }}
            {...data.props}
          />
        </View>
      );
    },
    year: (data, num, totalFields, groupNum) => {
      const {name, label, id} = data;
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
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            styles.select,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            {
              marginVertical: 0,
            },
          ]}
          key={'field' + num + name}>
          <Text style={styles.selectLabel} selectable={false}>
            {label}
            {data.props && data.props.required ? '*' : null}
          </Text>
          <RNPickerSelect
            key={'rnYearPicker' + num + name}
            doneText="Выбрать"
            onDonePress={() => {
              this._nextInput(groupNum, num);
            }}
            onValueChange={(value) => {
              this.onChangeField(data)(value);
            }}
            ref={this.inputRefs[groupNum + 'Input' + num]}
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
    phone: (data, num, totalFields, groupNum) => {
      let {name, id} = data;
      let userPhoneValue;
      let userPhoneRegion;
      let countryCode = this.defaultCountryCode;
      if (data.country && data.country.code) {
        countryCode = data.country.code.toLowerCase();
      }

      if (typeof this.inputRefs.phones === 'undefined') {
        this.inputRefs.phones = [];
      }

      this.inputRefs[groupNum + 'InputWrapper' + num] = React.createRef();
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);

      if (id && typeof this.state[name][id].value !== 'undefined') {
        userPhoneValue = this.state[name][id].value;
      } else {
        userPhoneValue = this.state[name] || data.value;
      }
      if (userPhoneValue) {
        if (userPhoneValue.indexOf('+375') === 0) {
          userPhoneRegion = 'by';
        }
        if (userPhoneValue.indexOf('+7') === 0) {
          userPhoneRegion = 'ru';
        }
        if (userPhoneValue.indexOf('+380') === 0) {
          userPhoneRegion = 'ua';
        }
        if (userPhoneRegion && userPhoneRegion !== countryCode) {
          countryCode = userPhoneRegion;
        }
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

      let requiredStyle = {};

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
        <View
          style={[
            requiredStyle,
            {
              justifyContent: 'center',
              flex: 1,
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'view' + num + name}>
          <PhoneInput
            ref={this.inputRefs[groupNum + 'InputWrapper' + num]}
            key={'field' + num + name}
            initialCountry={countryCode}
            countriesList={require('../../../utils/countries.json')}
            offset={20}
            autoFormat={true}
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
              return (
                <TextInputMask
                  key={'fieldInternal' + name + num}
                  ref={this.inputRefs[groupNum + 'Input' + num]}
                  value={userPhoneValue}
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
                        let maskLength = copyField[id].mask.replace(
                          /[^0]/g,
                          '',
                        );
                        if (pureValue.length === maskLength.length) {
                          return {[name]: copyField};
                        }
                      });
                    } else {
                      let maskLength = this.state['mask_' + name + num].replace(
                        /[^0]/g,
                        '',
                      );
                      if (countryCode === 'ua') {
                        if (pureValue.length + 1 === maskLength.length) {
                          this.setState({
                            [name]: formatted.replace(/[^\d.+]/g, ''),
                          });
                          this._nextInput(groupNum, num);
                        }
                      } else {
                        if (pureValue.length === maskLength.length) {
                          this.setState({
                            [name]: formatted.replace(/[^\d.+]/g, ''),
                          });
                          this._nextInput(groupNum, num);
                        }
                      }
                    }
                  }}
                  mask={mask}
                  style={[
                    {
                      height: 45,
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
        </View>
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
    dealerSelect: (data, num, totalFields, groupNum) => {
      const {name, value} = data;
      return (
        <DealerItemList
          key={'field' + num + name}
          dealer={value}
          isLocal={true}
          style={[
            // styles.field,
            {
              paddingBottom: 5,
            },
          ]}
          {...data.props}
        />
      );
    },
    select: (data, num, totalFields, groupNum) => {
      const {name, label, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <View
          style={[
            styles.field,
            styles.select,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : styles.fieldRequiredTrue,
            {
              marginVertical: 0,
            },
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <Text selectable={false} style={styles.selectLabel}>
            {label}
            {data.props && data.props.required ? '*' : null}
          </Text>
          <RNPickerSelect
            key={'rnpicker' + num + name}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            doneText="Выбрать"
            onDonePress={() => {
              if (data.props.focusNextInput) {
                this._nextInput(groupNum, num);
              }
            }}
            onValueChange={(value) => {
              this.onChangeField(data)(value);
              if (data.props.onChange) {
                data.props.onChange(value);
              }
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
    switch: (data, num, totalFields, groupNum) => {
      const {name, value, label, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
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
            selectable={false}
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
            ref={this.inputRefs[groupNum + 'Input' + num]}
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
              block
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
                <Text selectable={false} style={styles.buttonText}>
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
    //console.log('this.inputRefs', this);
    return res;
  }
}

export default connect(mapStateToProps, {})(Form);
