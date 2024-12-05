import React, {useState} from 'react';
import {StyleSheet, Platform} from 'react-native';

import * as NavigationService from '../../../navigation/NavigationService';

import {View, Box, Text, HStack, Pressable} from 'native-base';
import {TextInput, Checkbox} from 'react-native-paper';
import PhoneInput from 'react-native-phone-input';

import {APP_COUNTRY_SETTINGS, APP_COUNTRY_LIST, APP_REGION} from '../../../core/const';
import {strings} from '../../../core/lang/const';
import {get} from 'lodash';

import styleConst from '../../style-const';

const isAndroid = Platform.OS === 'android';

let countrySettings = [];
countrySettings = APP_COUNTRY_SETTINGS;
let countriesListStatic = APP_COUNTRY_LIST;
let countriesList = [];
let countriesCodes = {};
countriesListStatic.map(el => {
  if (countrySettings.includes(get(el, 'iso2'))) {
    countriesList.push(el);
    countriesCodes[get(el, 'iso2')] = el;
  }
});

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 4,
  },
  groupContainer: {
    marginBottom: 12,
  },
  container: {
    marginBottom: 3,
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

const InputProps = {
  mode: 'outlined',
  outlineColor: styleConst.color.systemGray,
};

const EmailField = props => {
  const {value, onPressIcon = () => {}, length = 0} = props;
  return (
    <TextInput
      placeholder={strings.Form.field.placeholder.email}
      label={strings.Form.field.label.email}
      autoComplete="email"
      inputMode="email"
      keyboardType="email-address"
      textContentType="emailAddress"
      right={
        value && length > 1 ? (
          <TextInput.Icon icon="minus-circle-outline" onPress={onPressIcon} />
        ) : null
      }
      {...props}
    />
  );
};

const PhoneField = props => {
  const {
    value = null,
    onPressIcon = () => {},
    onChangeText = () => {},
    length = 0,
    num,
    disabled = false,
  } = props;
  let valueTmp = value;
  if (!valueTmp) {
    switch (APP_REGION) {
      case 'by':
        valueTmp = '+375';
        break;

      case 'ru':
        valueTmp = '+7';
        break;

      default:
        break;
    }
  }
  return (
    <TextInput
      placeholder={strings.Form.field.placeholder.phone}
      label={strings.Form.field.label.phone}
      autoComplete="tel"
      inputMode="tel"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      style={{fontSize: 18}}
      render={propsRender => (
        <PhoneInput
          {...propsRender}
          countriesList={countriesList}
          offset={20}
          autoFormat={true}
          cancelText={strings.Base.cancel}
          confirmText={strings.Base.choose}
          initialValue={valueTmp}
          onChangePhoneNumber={onChangeText}
          textProps={{
            testID: 'Form.Phone.' + num,
            key: 'fieldInternal' + num,
            placeholderTextColor: '#afafaf',
            keyboardType: 'phone-pad',
            autoCompleteType: 'tel',
            selectionColor: '#afafaf',
            returnKeyType: 'done',
            textContentType: 'telephoneNumber',
            enablesReturnKeyAutomatically: true,
            editable: !disabled,
            style: [
              styles.PhoneTextInputComponent,
              {color: disabled ? styleConst.color.greyText5 : null},
            ],
          }}
        />
      )}
      right={
        value && length > 1 ? (
          <TextInput.Icon icon="minus-circle-outline" onPress={onPressIcon} />
        ) : null
      }
      {...props}
    />
  );
};

export const GroupForm = ({title, button, children}) => (
  <>
    <HStack justifyContent={'space-between'} alignItems={'center'}>
      {title ? (
        <Text mb="2" color={styleConst.color.darkBg}>
          {title}
        </Text>
      ) : null}
      {button ? button : null}
    </HStack>
    <Box style={styles.groupContainer}>{children}</Box>
  </>
);

export const InputCustom = props => {
  const {
    type = 'input',
    isValid = true,
    affix = false,
    placeholder,
    ...other
  } = props;
  const [checked, setChecked] = useState(get(props, 'defaultIsChecked', false));

  switch (type.toLowerCase()) {
    case 'email':
      return (
        <View style={styles.container}>
          <EmailField error={isValid !== true} {...InputProps} {...other} />
        </View>
      );

    case 'phone':
      return (
        <View style={styles.container}>
          <PhoneField error={isValid !== true} {...InputProps} {...other} />
        </View>
      );

    case 'textarea':
      return (
        <View style={styles.container}>
          <TextInput
            autoCorrect={false}
            error={isValid !== true}
            label={placeholder}
            multiline={true}
            enablesReturnKeyAutomatically={true}
            numberOfLines={4}
            {...InputProps}
            {...other}
          />
        </View>
      );

    case 'checkbox':
      return (
        <HStack
          mb={1}
          justifyContent={'flex-start'}
          paddingY={2}
          rounded={4}>
          <View width={isAndroid ? 9 : 8} height={10} borderRadius={1}>
            <Checkbox
              error={isValid !== true}
              isChecked={checked ? true : false}
              onPress={() => {
                setChecked(!checked);
                props?.onChange(!checked);
              }}
              status={checked ? 'checked' : 'unchecked'}
              defaultIsChecked={get(props, 'defaultIsChecked', false)}
              borderWidth={isAndroid ? 0 : 1}
              borderTopLeftRadius={styleConst.borderRadius - 6}
              borderTopRightRadius={styleConst.borderRadius - 6}
              borderBottomLeftRadius={styleConst.borderRadius - 6}
              borderBottomRightRadius={styleConst.borderRadius - 6}
              paddingTop={isAndroid ? 5 : 0}
              paddingBottom={2}
              paddingLeft={isAndroid ? 5 : 4}
              borderColor={
                isValid === true
                  ? styleConst.color.systemGray
                  : styleConst.color.red
              }
              {...InputProps}
              {...other} />
          </View>
          {get(props, 'textComponent') ?
          <Pressable onPress={() => {
            setChecked(!checked);
            props?.onChange(!checked);
          }}>
            {get(props, 'textComponent')}
          </Pressable> : (
            <Text
            style={[{marginLeft: 10, flex: 1}]}
            onPress={() => {
              setChecked(!checked);
              props?.onChange(!checked);
            }}>
            {get(props, 'aria-label')}
          </Text>
          )}
        </HStack>
      );

    case 'select':
      return (
        <View style={styles.container}>
          {'text select'}
        </View>
      );

    default:
      return (
        <View style={styles.container}>
          <TextInput
            error={isValid !== true}
            label={placeholder}
            right={affix ? <TextInput.Affix text={affix} /> : null}
            {...InputProps}
            {...other}
          />
        </View>
      );
  }
};

export const AgreementCheckbox = props => {
  const [checked, setChecked] = useState(false);
  const {onChange, isValid} = props;

  return (
    <InputCustom
      type="checkbox"
      isValid={isValid}
      aria-label={
        strings.Form.agreement.first +
        strings.Form.agreement.second +
        strings.Form.agreement.third
      }
      onChange={onChange}
      textComponent={(
        <Text
        style={[styles.userAgreementText, {marginLeft: 10, flex: 1}]}>
        {strings.Form.agreement.first}{' '}
        <Text
          style={[styles.userAgreementText, styles.userAgreementLink]}
          onPress={() => NavigationService.navigate('UserAgreementScreen')}>
          {strings.Form.agreement.second}
        </Text>{' '}
        {strings.Form.agreement.third}
      </Text>
      )}
    />
  );
};
