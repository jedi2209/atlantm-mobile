import React, {Component} from 'react';

import {
  Animated,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';

import {
  Text,
  Button,
  Switch,
  Toast,
  ToastRef,
  Checkbox,
  HStack,
  Icon,
} from 'native-base';
import ToastAlert from '../ToastAlert';
import {get} from 'lodash';
import {connect} from 'react-redux';
import * as NavigationService from '../../../navigation/NavigationService';
import {ActivityIndicator} from 'react-native-paper';

// Form field types
import {TextInput} from '../TextInput';
import {DatePickerCustom} from '../DatePickerCustom';
import ChooseDateTimeComponent from '../../../service/components/ChooseDateTimeComponent';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PhoneInput from 'react-native-phone-input';
import DealerItemList from '../DealerItemList';

import PhoneDetect from '../../../utils/phoneDetect';

import styleConst from '../../style-const';

import {
  APP_REGION,
  APP_LOCALE,
  APP_COUNTRY_SETTINGS,
  APP_COUNTRY_LIST,
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from '../../const';

import {strings} from '../../lang/const';
import {
  validateCheckbox,
  validateDate,
  validateDateTime,
  validateEmail,
} from './formValidate';

const platformStyle = {
  ios: {
    textinput: {
      height: 48,
    },
    select: {
      height: 50,
      paddingTop: 3,
      paddingLeft: 15,
    },
    textarea: {
      height: 80,
    },
    switch: {
      transform: {
        scale: 0.75,
      },
    },
  },
  android: {
    textinput: {
      height: 'auto',
    },
    select: {
      height: 55,
      paddingTop: 8,
      paddingLeft: 23,
    },
    textarea: {
      height: 'auto',
    },
    switch: {
      transform: {
        scale: 1.1,
      },
    },
  },
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 10,
  },
  groupName: {
    marginBottom: 10,
    fontSize: 14,
    color: styleConst.color.greyText,
  },
  groupFields: {
    borderRadius: 4,
    backgroundColor: styleConst.color.white,
  },
  field: {
    paddingRight: 15,
    paddingTop: 2,
    paddingBottom: 1,
  },
  fieldRequiredDefault: {
    borderLeftColor: styleConst.color.red,
    borderLeftWidth: 0.5,
  },
  fieldRequiredFalse: {
    borderLeftColor: styleConst.color.red,
    borderLeftWidth: 0.5,
  },
  fieldRequiredTrue: {
    borderLeftColor: styleConst.color.green,
    borderLeftWidth: 0.5,
  },
  labelRequiredFalse: {
    color: styleConst.color.red,
    textDecorationStyle: 'solid',
  },
  labelRequiredTrue: {
    color: styleConst.color.green,
  },
  labelRequiredDefault: {
    color: styleConst.color.black,
  },
  divider: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  textinput: {
    height: platformStyle[Platform.OS].textinput.height,
    color: '#222b45',
    fontSize: 16,
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 0,
  },
  component: {
    paddingBottom: 5,
    paddingLeft: 15,
  },
  dealerSelect: {
    shadowOpacity: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    elevation: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomWidth: 0,
    paddingLeft: 14,
  },
  dealerSelectReadonly: {
    opacity: 0.8,
  },
  select: {
    marginVertical: 0,
    height: platformStyle[Platform.OS].select.height,
    paddingTop: platformStyle[Platform.OS].select.paddingTop,
    paddingLeft: platformStyle[Platform.OS].select.paddingLeft,
  },
  selectLabel: {
    color: styleConst.color.greyText7,
    fontSize: 14,
    position: 'absolute',
    paddingHorizontal: 15,
    paddingTop: 2,
  },
  textarea: {
    height: platformStyle[Platform.OS].textarea.height,
    color: '#222b45',
    fontSize: 16,
    paddingTop: 25,
    paddingLeft: 15,
    paddingBottom: 0,
    paddingHorizontal: 0,
    maxHeight: 100,
  },
  switchWrapper: {
    marginBottom: 5,
  },
  checkboxWrapper: {
    marginVertical: 0,
  },
  switchText: {
    marginBottom: 10,
    color: styleConst.color.greyText7,
  },
  checkboxText: {
    color: styleConst.color.greyText7,
  },
  switch: {
    right: 10,
    top: 12,
    position: 'absolute',
    height: 31,
    width: 51,
    transform: [{scale: platformStyle[Platform.OS].switch.transform.scale}],
  },
  buttonText: {
    color: styleConst.color.white,
    fontSize: 16,
  },
  PhoneInputWrapper: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  PhoneTextInputComponent: {
    height: 45,
    paddingHorizontal: 14,
    fontSize: 16,
    letterSpacing: 2,
    width: '100%',
  },
  userAgreementText: {
    fontSize: 11,
  },
  userAgreementLink: {
    color: styleConst.color.lightBlue,
  },
});

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    dealerSelectedLocal: dealer.selectedLocal,
    region: dealer.region,
    profile,
    settings: core.settings,
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

const isAndroid = Platform.OS === 'android';

const MaskedPhone = {
  ru: '+7 (9[00]) [000]-[00]-[00]',
  by: '+375 ([00]) [000]-[00]-[00]',
  ua: '+380 ([00]) [000]-[00]-[00]',
};

const _Wrapper = props => {
  if (props.scrollViewWrapperAvailable) {
    return (
      <ScrollView
        style={props.formScrollViewStyle}
        testID={props.testID}
        key={props.key ? props.key : 'Form' + Math.round(new Date().getDate())}>
        {props.children}
      </ScrollView>
    );
  }
  return (
    <View
      style={props.formScrollViewStyle}
      testID={props.testID}
      key={props.key ? props.key : 'Form' + Math.round(new Date().getDate())}>
      {props.children}
    </View>
  );
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.defaultCountryCode =
      this.props.defaultCountryCode || this.props.region || APP_REGION;
    this.state = {
      parentState: props.parentState,
      required: [],
      active: {},
    };
    this.inputRefs = [];
    this.inputRefsNav = [];
    let requredFields = [];
    this.allFields = [];

    if (!this.props.SubmitButton.noAgreement && APP_REGION !== UKRAINE) {
      this.inputRefs['AgreementCheckbox'] = React.createRef();
      requredFields.push({
        name: 'AgreementCheckbox',
        type: 'checkbox',
        label: strings.Form.agreement.fieldName,
      });
      this.allFields.push({
        name: 'AgreementCheckbox',
        type: 'checkbox',
        label: strings.Form.agreement.fieldName,
      });
      this.state.AgreementCheckbox = false;
    }
    this.state.showSubmitButton = true;
    this._animated = {
      SubmitButton: new Animated.Value(1),
      duration: 250,
    };
    if (props.fields.groups) {
      props.fields.groups.map(group => {
        if (group && group?.fields) {
          group.fields = group.fields.filter(field => {
            return (
              typeof field === 'object' &&
              get(field, 'name', false) &&
              get(field, 'type', false)
            );
          });
          group.fields.map(field => {
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
                if (
                  field.value &&
                  field.type !== 'phone' &&
                  field.type !== 'checkbox'
                ) {
                  this.state[field.name + '_Picker'] = null;
                }
              }
            }
            this.allFields.push({
              name: field.name,
              type: field.type,
              label: field.label,
            });
            if (field.props && field.props.required === true) {
              requredFields.push({
                name: field.name,
                type: field.type,
                label: field.label,
              });
            }
          });
        }
      });
    } else {
      if (props.fields.length === 1) {
        this.state.showSubmitButton = false;
      }
      props.fields.map(field => {
        if (field.value && field.type !== 'component') {
          if (field.id) {
            this.state[field.name][field.id].value = field.value;
          } else {
            this.state[field.name] = field.value;
          }
        }
        this.allFields.push({
          name: field.name,
          type: field.type,
          label: field.label,
        });
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
    this.locale = APP_LOCALE[APP_REGION];
  }

  // componentWillUnmount() {
  //   this.state = {};
  //   this.inputRefs = [];
  //   this.inputRefsNav = [];
  //   let requredFields = [];
  //   this.allFields = [];
  // }

  _setFieldValue(field) {}

  _validate = () => {
    let requredLabels = [];
    let valid = true;
    if (this.state.required) {
      // проверка обязательных полей
      this.state.required.map((val, index) => {
        valid = true;
        switch (val.type.toLowerCase()) {
          case 'email':
            valid = validateEmail(this.state[val.name]);
            break;
          case 'datetime':
            valid = validateDateTime(this.state[val.name]);
            break;
          case 'date':
            valid = validateDate(this.state[val.name]);
            break;
          case 'checkbox':
            valid = validateCheckbox(this.state[val.name]);
            break;
          case 'component':
            valid = true;
            break;
          case 'dealerselect':
            valid = false;
            valid = get(this.props, 'dealerSelectedLocal', false);
            if (!valid) {
              valid = this.state[val.name] ? true : false;
            }
            if (
              get(
                this.props,
                'dealerSelectedLocal',
                this.state[val.name] ? true : false,
              )
            ) {
              valid = true;
            }
            break;
          default:
            if (
              typeof this.state[val.name] === 'undefined' ||
              this.state[val.name] === '' ||
              this.state[val.name] === null
            ) {
              valid = false;
            }
            break;
        }
        if (!valid) {
          requredLabels.push(val.label);
        }
      });
    }
    this.allFields.map((val, index) => {
      valid = true;
      if (
        this.state[val.name] &&
        this.state[val.name] !== null &&
        typeof this.state[val.name] !== 'undefined'
      ) {
        // проверка любых полей, если они заполнены
        switch (val.type.toLowerCase()) {
          case 'email':
            valid = validateEmail(this.state[val.name]);
            break;
          case 'datetime':
            //valid = validateDateTime(this.state[val.name]);
            break;
          case 'date':
            valid = validateDate(this.state[val.name]);
            break;
          case 'component':
          case 'dealerselect':
            valid = true;
            break;
          default:
            if (
              typeof this.state[val.name] === 'undefined' ||
              this.state[val.name] === '' ||
              this.state[val.name] === null
            ) {
              valid = false;
            }
            break;
        }
        if (!valid) {
          requredLabels.push(val.label);
        }
      }
    });
    if (requredLabels && requredLabels.length) {
      if (requredLabels.length > 1) {
        Toast.show({
          render: ({id}) => {
            return (
              <ToastAlert
                id={id}
                ref={React.createRef(ToastRef)}
                status="warning"
                duration={3000}
                description={
                  strings.Form.status.fieldsRequired1 +
                  '\r\n- ' +
                  requredLabels.join('\r\n- ') +
                  '\r\n\r\n' +
                  strings.Form.status.fieldsRequired2
                }
                title={strings.Form.status.fieldRequiredMiss}
              />
            );
          },
        });
      } else {
        Toast.show({
          render: ({id}) => {
            return (
              <ToastAlert
                id={id}
                ref={React.createRef(ToastRef)}
                status="warning"
                duration={3000}
                description={
                  strings.Form.status.fieldRequired1 +
                  ' "' +
                  requredLabels.join(' ') +
                  '" ' +
                  strings.Form.status.fieldRequired2
                }
                title={strings.Form.status.fieldRequiredMiss}
              />
            );
          },
        });
      }
      return false;
    }
    return true;
  };

  _validatePhone = ({value, id, name, data, groupNum, num, countriesCodes}) => {
    const countryCode = PhoneDetect.getCountryCodeByMask(value);
    if (id) {
      this.setState(prevState => {
        let copyField = Object.assign({}, prevState[name]); // creating copy of state variable jasper
        copyField[id].value = value.replace(/[^\d.+]/g, ''); // update the name property, assign a new value
        let maskLength = copyField[id].mask.replace(/[^0]/g, '');
        // if (pureValue.length === maskLength.length) {
        //   return {
        //     [name]: copyField,
        //     showSubmitButton: true,
        //   };
        // } else {
        //   if (this.state.showSubmitButton) {
        //     return {
        //       showSubmitButton: false,
        //     };
        //   }
        // }
      });
    } else {
      if (!countriesCodes[countryCode]) {
        var valueFull = null;
      } else {
        switch (countryCode) {
          case RUSSIA:
          case UKRAINE:
            var valueFull = 16;
            break;
          case BELARUSSIA:
            var valueFull = 17;
            break;
        }
      }
      if (value.length === valueFull) {
        this.setState(
          {
            [name]: value.replace(/[^\d.+]/g, ''),
            showSubmitButton: true,
          },
          () => {
            this._showHideSubmitButton(true);
            if (data.props.focusNextInput) {
              this._nextInput(groupNum, num);
            }
          },
        );
      } else {
        if (this.state.showSubmitButton && data.props && data.props.required) {
          this._showHideSubmitButton(false);
        }
      }
    }
  };

  _setActive = el => {
    if (typeof el === 'undefined') {
      return false;
    }
    if (typeof el.current?.focus === 'function') {
      return el.current.focus();
    } else {
      if (typeof el?.current?.input?.focus === 'function') {
        return el.current.input.focus();
      }
      return false;
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

  onChangeField = field => valueNew => {
    const {name, id} = field;
    if (field.id) {
      this.setState(prevState => {
        let copyField = Object.assign({}, prevState[name]);
        if (typeof valueNew === 'undefined') {
          valueNew = null;
        }
        copyField[id].value = valueNew;
        return {
          [name]: copyField,
          showSubmitButton: true,
        };
      });
    } else {
      this.setState({
        [name]: valueNew,
        showSubmitButton: true,
      });
    }
  };

  _fieldsDivider = key => {
    return <View style={styles.divider} key={key} />;
  };

  _groupRender = (group, num) => {
    if (!group) {
      return;
    }
    if (
      (group.fields && typeof group.fields === 'undefined') ||
      typeof group.fields !== 'object'
    ) {
      return;
    }
    let totalFields = group.fields.length;

    let groupStyle = [styles.groupFields, group?.style];

    if (
      typeof group.fields.find(e => e?.type === 'dealerSelect') !==
        'undefined' &&
      totalFields === 1
    ) {
      groupStyle = [group.style];
    }

    return (
      <View style={styles.group} key={'group' + num}>
        <Text selectable={false} style={styles.groupName}>
          {group.name}
        </Text>
        <View style={[groupStyle]}>
          {group.fields.map((field, fieldNum, totalFields) => {
            if (field && typeof field === 'object' && field.type) {
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

  _showHideSubmitButton(show) {
    if (show) {
      Animated.timing(this._animated.SubmitButton, {
        toValue: 1,
        duration: this._animated.duration,
        useNativeDriver: true,
      }).start(() => {
        this.showSubmitButton = true;
      });
    } else {
      Animated.timing(this._animated.SubmitButton, {
        toValue: 0,
        duration: this._animated.duration,
        useNativeDriver: true,
      }).start(() => {
        this.showSubmitButton = false;
      });
    }
  }

  _fieldsRender = {
    input: (data, num, totalFields, groupNum) => {
      const {label, name, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      let val = this.state[name] || '';
      switch (get(data, 'props.keyboardType', 'default')) {
        case 'number-pad':
          break;
        default:
          val = val.toString();
          break;
      }
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !val
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          testID={'Form.TextInputWrapper.' + name}
          key={'field' + num + name}>
          <TextInput
            testID={'Form.TextInput.' + name}
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
            value={val}
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
      let val = this.state[name] || data?.value || '';
      return (
        <View
          style={[
            styles.field,
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          testID={'Form.TextAreaWrapper.' + name}
          key={'field' + num + name}>
          <TextInput
            autoCorrect={false}
            testID={'Form.TextArea.' + name}
            style={styles.textarea}
            multiline={true}
            numberOfLines={2}
            label={label + (data.props && data.props.required ? '*' : '')}
            name={name}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            value={val}
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
        value = this.state[name][id]?.value;
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
              ? this.state[name] && validateEmail(value)
                ? styles.fieldRequiredTrue
                : styles.fieldRequiredFalse
              : {},
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          testID={'Form.EmailWrapper.' + name}
          key={'field' + num + name}>
          <TextInput
            keyboardType="email-address"
            textContentType={'emailAddress'}
            autoCorrect={false}
            testID={'Form.Email.' + name}
            autoCapitalize={'none'}
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
            data.props && data.props.required
              ? !this.state[name]
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : {},
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <DatePickerCustom
            ref={this.inputRefs[groupNum + 'Input' + num]}
            label={label + (data.props && data.props.required ? '*' : '')}
            locale={this.locale}
            styleContainer={{paddingLeft: 3}}
            confirmBtnText={strings.Base.choose}
            value={this.state[name] || null}
            isActive={this.state.active[name] || false}
            onPressButton={() => {
              this.setState(prevState => {
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
              this.setState(prevState => {
                let copyField = Object.assign({}, prevState.active);
                copyField[name] = false;
                return {active: copyField};
              });
            }}
            onDateChange={selectedDate => {
              const currentDate =
                (selectedDate && selectedDate.toUTCString()) ||
                this.state[name];
              if (Platform.OS !== 'ios') {
                this.setState(prevState => {
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
              ? typeof this.state[name] === 'undefined' ||
                this.state[name] === null
                ? styles.fieldRequiredFalse
                : styles.fieldRequiredTrue
              : this.state[name] === null ||
                (!this.state[name].time && !this.state[name].noTimeAlways)
              ? styles.fieldRequiredFalse
              : styles.fieldRequiredTrue,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'field' + num + name}>
          <ChooseDateTimeComponent
            label={label + (data.props && data.props.required ? '*' : '')}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            onFinishedSelection={returnData => {
              this.onChangeField(data)(returnData);
              if (data.props.onChange) {
                data.props.onChange(returnData);
              }
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
          ]}
          key={'field' + num + name}>
          <Text style={styles.selectLabel} selectable={false}>
            {label}
            {data.props && data.props.required ? '*' : null}
          </Text>
          <RNPickerSelect
            key={'rnYearPicker' + num + name}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            touchableWrapperProps={{testID: 'Form.YearSelectInput.' + name}}
            pickerProps={{testID: 'Form.YearPickerInput.' + name}}
            doneText={strings.Base.choose}
            onDonePress={() => {
              this._nextInput(groupNum, num);
            }}
            onValueChange={value => {
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

      if (!data.props || typeof data.props.focusNextInput === 'undefined') {
        if (!data.props) {
          data.props = {};
        }
        data.props.focusNextInput = true;
      }

      if (!groupNum) {
        groupNum = 1;
      }

      this.inputRefs[groupNum + 'InputWrapper' + num] = React.createRef();
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);

      if (id && typeof this.state[name][id]?.value !== 'undefined') {
        userPhoneValue = this.state[name][id]?.value;
      } else {
        userPhoneValue = this.state[name] || data.value;
      }
      if (userPhoneValue) {
        userPhoneRegion = PhoneDetect.getCountryCodeByMask(userPhoneValue);
        if (userPhoneRegion && userPhoneRegion !== countryCode) {
          countryCode = userPhoneRegion;
        }
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
          if (!this.state[name] || !this.state[name]?.length) {
            requiredStyle = styles.fieldRequiredDefault;
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
      }
      let countrySettings = [];
      if (data.props && data.props.countries) {
        countrySettings = data.props.countries;
      } else {
        countrySettings = APP_COUNTRY_SETTINGS;
      }
      let countriesListStatic = APP_COUNTRY_LIST;
      let countriesList = [];
      let countriesCodes = {};
      countriesListStatic.map(el => {
        if (countrySettings.includes(get(el, 'iso2'))) {
          countriesList.push(el);
          countriesCodes[get(el, 'iso2')] = el;
        }
      });

      if (userPhoneValue && this.state.showSubmitButton === false) {
        this.setState(
          {
            showSubmitButton: true,
          },
          () => {
            this._showHideSubmitButton(true);
            if (data.props.focusNextInput) {
              this._nextInput(groupNum, num);
            }
          },
        );
      }
      if (!countriesCodes[countryCode]) {
        return;
      }
      return (
        <View
          style={[
            requiredStyle,
            styles.PhoneInputWrapper,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          key={'view' + num + name}>
          <PhoneInput
            ref={ref => {
              this.inputRefs[groupNum + 'InputWrapper' + num] = ref;
            }}
            testID={'Form.PhoneWrapper.' + name}
            key={'field' + num + name}
            initialCountry={countryCode}
            countriesList={countriesList}
            offset={20}
            autoFormat={true}
            cancelText={strings.Base.cancel}
            confirmText={strings.Base.choose}
            initialValue={userPhoneValue}
            onChangePhoneNumber={number => {
              if (
                this.inputRefs[
                  groupNum + 'InputWrapper' + num
                ].isValidNumber() &&
                this.inputRefs[
                  groupNum + 'InputWrapper' + num
                ].getCountryCode() &&
                number.length &&
                number.length > 9
              ) {
                if (id) {
                  this.setState(
                    prevState => {
                      let copyField = Object.assign({}, prevState[name]); // creating copy of state variable jasper
                      copyField[id].value = number.replace(/[^\d.+]/g, ''); // update the name property, assign a new value
                      return {
                        [name]: copyField,
                        showSubmitButton: true,
                      };
                    },
                    () => {
                      this._showHideSubmitButton(true);
                      if (data.props.focusNextInput) {
                        this._nextInput(groupNum, num);
                      }
                    },
                  );
                } else {
                  this.setState(
                    {
                      [name]: number.replace(/[^\d.+]/g, ''),
                      showSubmitButton: true,
                    },
                    () => {
                      this._showHideSubmitButton(true);
                      if (data.props.focusNextInput) {
                        this._nextInput(groupNum, num);
                      }
                    },
                  );
                }
              } else {
                if (
                  this.state.showSubmitButton &&
                  data.props &&
                  data.props.required
                ) {
                  this._showHideSubmitButton(false);
                }
              }
            }}
            textProps={{
              testID: 'Form.Phone.' + name,
              key: 'fieldInternal' + name + num,
              placeholderTextColor: '#afafaf',
              keyboardType: 'phone-pad',
              autoCompleteType: 'tel',
              selectionColor: '#afafaf',
              returnKeyType: 'go',
              textContentType: 'telephoneNumber',
              enablesReturnKeyAutomatically: true,
              editable: true,
              style: [
                styles.PhoneTextInputComponent,
                {...data.textStyle},
                data.props && data.props.required
                  ? !this.state[name]
                    ? styles.labelRequiredFalse
                    : styles.labelRequiredTrue
                  : null,
              ],
            }}
            onSelectCountry={iso2 => {
              if (id) {
                this.setState(prevState => {
                  let copyField = Object.assign({}, prevState[name]);
                  copyField[id] = {
                    value: null,
                  };
                  return {[name]: copyField};
                });
              } else {
                this.setState({
                  [name]: null,
                });
              }
            }}
            {...data.props}
          />
        </View>
      );
    },
    component: (data, num) => {
      const {name, value} = data;
      if (!value || typeof value === 'undefined') {
        return <></>;
      }
      return (
        <View
          testID={'Form.ComponentWrapper.' + name}
          style={
            get(data, 'props.unstyle', false)
              ? null
              : [styles.field, styles.component]
          }
          key={'field' + num + name}>
          {value}
        </View>
      );
    },
    dealerSelect: (data, num, totalFields, groupNum) => {
      const {name, value} = data;
      this.state[name] = value?.id;
      let fieldStyle = [styles.dealerSelect];
      if (totalFields?.length === 1) {
        fieldStyle.push({
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        });
      }
      if (data.props?.readonly) {
        fieldStyle.push(styles.dealerSelectReadonly);
      }
      if (data.props?.required) {
        if (value) {
          fieldStyle.push(styles.fieldRequiredTrue);
        } else {
          fieldStyle.push(styles.fieldRequiredFalse);
        }
      }
      return (
        <DealerItemList
          key={'field' + num + name}
          dealer={value}
          style={fieldStyle}
          {...data.props}
        />
      );
    },
    loading: (data, num, totalFields, groupNum) => {
      return (
        <ActivityIndicator
          color={
            styleConst.color.blueNew
              ? styleConst.color.blueNew
              : styleConst.color.blue
          }
          style={{marginTop: isAndroid ? 15 : 10, marginBottom: 16}}
        />
      );
    },
    select: (data, num, totalFields, groupNum) => {
      const {name, label, id, value} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      if (typeof value !== 'undefined' && value !== null) {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          data.props.value = parseFloat(value);
          data.value = parseFloat(value);
        } else {
          data.props.value = value;
        }
      }
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
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderTopRightRadius: num === 0 ? 4 : 0,
              borderBottomRightRadius: totalFields.length === num + 1 ? 4 : 0,
            },
          ]}
          testID={'Form.SelectWrapper.' + name}
          key={'field' + num + name}>
          <Text selectable={false} numberOfLines={1} style={styles.selectLabel}>
            {label}
            {data.props && data.props.required ? '*' : null}
          </Text>
          <RNPickerSelect
            ref={this.inputRefs[groupNum + 'Input' + num]}
            touchableWrapperProps={{testID: 'Form.SelectInput.' + name}}
            pickerProps={{
              key: 'rnpicker' + num + name,
              testID: 'Form.PickerInput.' + name,
            }}
            doneText={strings.Base.choose}
            onDonePress={() => {
              if (data.props.onChange && Platform.OS === 'ios') {
                data.props.onChange(this.state[name]);
              }
              if (data.props.focusNextInput) {
                this._nextInput(groupNum, num);
              }
            }}
            onValueChange={value => {
              this.onChangeField(data)(value);
              if (
                (data.props.onChange && Platform.OS !== 'ios') ||
                data.props?.iOSselectFix
              ) {
                data.props.onChange(value);
              }
            }}
            onClose={() => {
              if (data.props.onChange && Platform.OS === 'ios') {
                data.props.onChange(this.state[name]);
              }
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 12,
              },
            }}
            {...data.props}
            Icon={() => {
              if (!isAndroid) {
                return (
                  <Icon
                    name="keyboard-arrow-down"
                    as={MaterialIcons}
                    size={6}
                    color={styleConst.color.darkBg}
                  />
                );
              }
            }}
          />
        </View>
      );
    },
    switch: (data, num, totalFields, groupNum) => {
      const {name, value, label, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
      <Pressable
          style={[styles.field, styles.textinput, styles.switchWrapper]}
          onPress={() => {
            this.onChangeField(data)(!this.state[name]);
            if (data?.props?.onChange) {
              data.props.onChange(!this.state[name]);
            }
          }}
          key={'field' + num + name}>
          <Text selectable={false} style={styles.switchText}>
            {label}
          </Text>
          <Switch
            style={[styles.switch]}
            ref={this.inputRefs[groupNum + 'Input' + num]}
            value={this.state[name] ? true : false}
            onToggle={val => {
              this.onChangeField(data)(val);
              if (data?.props?.onChange) {
                data.props.onChange(val);
              }
            }}
            {...data.props}
          />
        </Pressable>
      );
    },
    checkbox: (data, num, totalFields, groupNum) => {
      const {name, value, label, id} = data;
      this.inputRefs[groupNum + 'Input' + num] = React.createRef();
      this._addToNav(groupNum, num);
      return (
        <Pressable
          style={[styles.field, styles.textinput, styles.checkboxWrapper]}
          onPress={() => {
            this.onChangeField(data)(!this.state[name]);
            if (data?.props?.onSelect) {
              data.props.onSelect(!this.state[name]);
            }
          }}
          key={'field' + num + name}>
          <HStack
            justifyContent={!data?.props?.left ? 'space-between' : 'unset'}>
          {!data?.props?.left ? (
              <Text selectable={false} style={styles.checkboxText}>
                {label}
              </Text>
            ) : null}
            <Checkbox
              aria-label={label}
              onChange={val => {
                this.onChangeField(data)(!this.state[name]);
                if (data?.props?.onSelect) {
                  data.props.onSelect(val);
                }
              }}
              isChecked={this.state[name] ? true : false}
              defaultIsChecked={this.state[name] ? true : false}
              color={styleConst.color.blue}
              ref={this.inputRefs[groupNum + 'Input' + num]}
              {...data.props}
            />
            {data?.props?.left ? (
              <Text
                selectable={false}
                style={[
                  styles.checkboxText,
                  {marginLeft: data?.props?.left ? 10 : 0},
                ]}>
                {label}
              </Text>
            ) : null}
          </HStack>
        </Pressable>
      );
    },
  };

  render() {
    const res = (
      <_Wrapper {...this.props}>
        <KeyboardAvoidingView {...this.props.keyboardAvoidingViewProps}>
          <View style={[{paddingBottom: 20}, this.props.contentContainerStyle]}>
            {this.props.fields.groups ? (
              this.props.fields.groups.map((group, num) => {
                return this._groupRender(group, num);
              })
            ) : (
              <View style={styles.group} key={'group0'}>
                <View style={styles.groupFields}>
                  {this.props.fields.map((field, num) => {
                    if (field.type) {
                      return this._fieldsRender[field.type](
                        field,
                        num,
                        this.props.fields,
                        1,
                      );
                    }
                  })}
                </View>
              </View>
            )}
            {this.state.showSubmitButton ? (
              <Animated.View
                style={[
                  styles.group,
                  {
                    opacity: this._animated.SubmitButton,
                  },
                ]}>
                {!this.props.SubmitButton.noAgreement ? (
                  <HStack
                    mb={1}
                    justifyContent={'space-between'}
                    padding={2}
                    paddingLeft={4}
                    rounded={4}
                    backgroundColor={styleConst.color.white}>
                    {APP_REGION !== UKRAINE ? (
                      <Checkbox
                        aria-label={
                          strings.Form.agreement.first +
                          strings.Form.agreement.second +
                          strings.Form.agreement.third
                        }
                        onChange={isSelected => {
                          this.onChangeField({name: 'AgreementCheckbox'})(
                            isSelected,
                          );
                        }}
                        isChecked={
                          this.state['AgreementCheckbox'] ? true : false
                        }
                        defaultIsChecked={false}
                        color={styleConst.color.blue}
                        isDisabled={this.state.loading}
                        {...this.props.AgreementCheckbox}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.userAgreementText,
                        {marginLeft: 10, flex: 1},
                      ]}>
                      {strings.Form.agreement.first}{' '}
                      <Text
                        style={[
                          styles.userAgreementText,
                          styles.userAgreementLink,
                        ]}
                        onPress={() =>
                          NavigationService.navigate('UserAgreementScreen')
                        }>
                        {strings.Form.agreement.second}
                      </Text>{' '}
                      {strings.Form.agreement.third}
                    </Text>
                  </HStack>
                ) : null}
                <Button
                  rightIcon={
                    this.props.SubmitButton.rightIcon
                      ? this.props.SubmitButton.rightIcon
                      : null
                  }
                  leftIcon={
                    this.props.SubmitButton.leftIcon
                      ? this.props.SubmitButton.leftIcon
                      : null
                  }
                  onPress={async () => {
                    if (!this.state.loading) {
                      if (!this.props.onSubmit) {
                        console.error(
                          'Undefined required onSubmit prop for Form component',
                          this.props,
                          this.state,
                        );
                        return false;
                      }
                      if (this._validate()) {
                        this.setState({loading: true});
                        const formSendRequest = new Promise(
                          (resolve, reject) => {
                            return this.props
                              .onSubmit(this.state)
                              .then(data => {
                                resolve(data);
                              });
                          },
                        );
                        await formSendRequest
                          .then(data => {
                            this.setState({loading: false});
                            return data;
                          })
                          .catch(error => {
                            console.error(error);
                            this.setState({loading: false});
                          });
                      }
                    }
                  }}
                  color="blue.500"
                  style={[
                    this.props.SubmitButton && this.props.SubmitButton.style,
                  ]}
                  size="lg"
                  shadow={this.state.loading ? 1 : 4}
                  isDisabled={this.state.showSubmitButton ? false : true}
                  isLoading={this.state.loading}
                  spinnerPlacement="start"
                  isLoadingText={strings.Form.button.sending}
                  variant="solid"
                  testID="Form.ButtonSubmit"
                  accessibilityValue={{
                    text: this.state.showSubmitButton ? 'false' : 'true',
                  }}
                  _text={styles.buttonText}
                  {...this.props.SubmitButton.props}>
                  {this.props.SubmitButton.text}
                </Button>
              </Animated.View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
        {this.props.children}
      </_Wrapper>
    );
    return res;
  }

  static defaultProps = {
    SubmitButton: {
      text: strings.Form.button.send,
      props: {},
      region: APP_REGION,
      noAgreement: false,
    },
    scrollViewWrapperAvailable: true,
    region: APP_REGION,
    testID: 'Form',
    barStyle: 'light-content',
    contentContainerStyle: {},
    formScrollViewStyle: {
      flex: 1,
      backgroundColor: '#f2f2f2',
      paddingBottom: 0,
    },
    keyboardAvoidingViewProps: {},
  };
}

export default connect(mapStateToProps, {})(Form);
