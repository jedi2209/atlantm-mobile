/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, Platform} from 'react-native';
import {ScrollView, View} from 'native-base';
import Slider from '@react-native-community/slider';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {SubmitButton} from '../../core/components/Form/SubmitCustom';
import {
  AgreementCheckbox,
  GroupForm,
  InputCustom,
} from '../../core/components/Form/InputCustom';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import { CreditCardItem } from '../components/CreditCardItem';
// redux
import {connect} from 'react-redux';
import {actionOrderCreditCar, actionOrderCar} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import {get, isNil, trim, toString} from 'lodash';
import {showPrice, getAllDataPrice} from '../../utils/price';
import {declOfNum} from '../../utils/decl-of-num';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import {CATALOG_ORDER__SUCCESS, CATALOG_ORDER__FAIL, CREDIT_ORDER__SUCCESS, CREDIT_ORDER__FAIL} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

import {strings} from '../../core/lang/const';

const isAndroid = Platform.OS === 'android';

const settings = {
  percentPaymentDefault: 0.5,
};

const mapStateToProps = ({dealer, catalog, profile}) => {
  return {
    dealerSelected: dealer.selected,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    profile,
    comment: catalog.orderComment,
  };
};

const mapDispatchToProps = {
  actionOrderCreditCar,
  actionOrderCar,
  localUserDataUpdate,
};

const onCheckLimit = ({value, min, max}) => {
  const parsedQty = parseInt(toString(value).replace(/\s+/g, ''));
  if (isNaN(parsedQty)) {
    return min;
  } else if (parsedQty > max) {
    return max;
  } else {
    return value;
  }
};

const OrderCreditScreen = ({actionOrderCreditCar, actionOrderCar, localUserDataUpdate, navigation, route, ...props}) => {
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingFormStatus, setFormSendingStatus] = useState(null);
  const {isNewCar, dealerId, car, region, creditProduct, creditPrograms} = route.params;

  let summ = Number(get(route, 'params.car.price'));
  let months = 0;
  let prePayment = 0;
  if (get(creditProduct, 'calc')) {
    prePayment = get(creditProduct, 'calc.0.summ.payment');
    summ = get(creditProduct, 'calc.0.summ.leave') - get(creditProduct, 'calc.0.summ.payment');
    months = get(creditProduct, 'calc.length') - 2;
  }

  const isPriceShow = get(route, 'params.showPrice', false);

  const modelName = get(car, 'model.name', get(car, 'model'));
  const carName = [
    get(car, 'brand'),
    modelName,
    get(car, 'complectation'),
    !get(car, 'ordered') ? get(car, 'year') : null,
    get(car, 'ordered') ? 'или аналог' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const {
    control,
    handleSubmit,
    formState: {errors, isValidating, isValid},
  } = useForm({
    defaultValues: {
      NAME: get(props, 'firstName'),
      SECOND_NAME: get(props, 'secondName'),
      LAST_NAME: get(props, 'lastName'),
      EMAIL: get(props, 'email'),
      PHONE: get(props, 'phone'),
      CAR: carName,
      SUMM: parseInt(creditProduct ? summ : summ * settings.percentPaymentDefault),
    },
    mode: 'onBlur',
  });

  const watchSumm = useWatch({
    control,
    name: 'SUMM',
    defaultValue: parseInt(creditProduct ? summ : summ * settings.percentPaymentDefault),
  });

  const priceStep = Math.ceil(summ / 1000) * 100;

  const onPressOrder = async data => {

    setSendingForm(true);

    let comment = get(data, 'COMMENT', '');

    if (prePayment || summ || months || creditProduct) {
      comment += '\r\n';
    }

    if (creditProduct) {
      comment += '\r\n' + [
        '#' + get(creditProduct, 'data.id'),
        get(creditProduct, 'data.type.name', ''),
        '(' + get(creditProduct, 'data.paymentSchedule.name').toLowerCase() + ')',
        '-',
        '"' + get(creditProduct, 'data.name') + '"',
        'от',
        get(creditProduct, 'data.owner.name'),
      ].join(' ');
    }

    if (prePayment) {
      comment += '\r\nСумма аванса: ' + showPrice(prePayment);
    }

    if (summ) {
      comment += '\r\nСумма кредита: ' + showPrice(summ);
    }

    if (months) {
      comment += '\r\nСрок кредита: ' + declOfNum(months, ['месяц', 'месяца', 'месяцев']);
    }

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const dataToSend = {
      firstName: get(data, 'NAME'),
      secondName: get(data, 'SECOND_NAME'),
      lastName: get(data, 'LAST_NAME'),
      email: get(data, 'EMAIL'),
      phone: get(data, 'PHONE'),
      summ: get(data, 'SUMM', get(car, 'price')),
      dealerId,
      carId: get(car, 'id'),
      comment: trim(comment),
      credit: true,
      isNewCar,
    };

    let action = null;

    if (isNewCar) {
      action = await actionOrderCar(dataToSend);
    } else {
      action = await actionOrderCreditCar(dataToSend);
    }
    if (action && action.type) {
      switch (action.type) {
        case CREDIT_ORDER__SUCCESS:
        case CATALOG_ORDER__SUCCESS:
          setFormSendingStatus(true);
          const path = isNewCar ? 'newcar' : 'usedcar';
          Analytics.logEvent('order', `catalog/${path}`, {
            brand_name: get(car, 'brand'),
            model_name: modelName,
          });
          setTimeout(() => {
            setFormSendingStatus(null);
            setSendingForm(false);
            setTimeout(() => navigation.goBack(), 300);
          }, 500);
          break;
        case CREDIT_ORDER__FAIL:
        case CATALOG_ORDER__FAIL:
          setFormSendingStatus(false);
          setTimeout(() => {
            setFormSendingStatus(null);
            setSendingForm(false);
          }, 1000);
          break;
      }
    }
  };

  return (
    <ScrollView paddingX={4}>
      <KeyboardAvoidingView behavior={'padding'} enabled={!isAndroid}>
        <GroupForm title={strings.Form.group.main}>
          <Controller
            control={control}
            rules={{
              required: [
                strings.Form.status.fieldRequired1,
                strings.Form.status.fieldRequired2,
              ].join(' '),
            }}
            name="CAR"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                placeholder={isNewCar
                ? strings.Form.field.label.carNameComplectation
                : strings.Form.field.label.carNameYear}
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType={'name'}
                value={value}
                style={{backgroundColor: styleConst.color.bg}}
                readOnly={true}
                isValid={true}
              />
            )}
          />
          {!creditProduct && isPriceShow ? (
            <Controller
              control={control}
              rules={{
                required: [
                  strings.Form.status.fieldRequired1,
                  strings.Form.status.fieldRequired2,
                ].join(' '),
              }}
              name="SUMM"
              render={({field: {onChange, onBlur, value}}) => {
                const tmpVal = getAllDataPrice(parseInt(toString(value).replace(/\s+/g, '')));
                return (
                <View>
                  <InputCustom
                    placeholder={strings.Form.field.label.creditSumm}
                    onBlur={onBlur}
                    onChangeText={val => {
                      if (!val) {
                        return onChange(parseInt(toString(val).replace(/\s+/g, '')));
                      }
                      return onChange(
                        onCheckLimit({
                          value: parseInt(toString(val).replace(/\s+/g, '')),
                          min: parseInt(summ * 0.1),
                          max: parseInt(summ * 0.9),
                        }),
                      );
                    }}
                    textContentType={'none'}
                    keyboardType={'decimal-pad'}
                    autoComplete={'off'}
                    enablesReturnKeyAutomatically={'true'}
                    blurOnSubmit={true}
                    enterKeyHint={'done'}
                    affix={tmpVal?.symbol}
                    value={tmpVal?.value}
                    isValid={isNil(get(errors, 'SUMM'))}
                  />
                  <Slider
                    style={{height: 60, marginTop: -26}}
                    minimumValue={parseInt(summ * 0.1)}
                    maximumValue={parseInt(summ * 0.9)}
                    minimumTrackTintColor={styleConst.color.blue}
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={onBlur}
                    onValueChange={val => {
                      if (!val) {
                        return onChange(parseInt(toString(val).replace(/\s+/g, '')));
                      }
                      return onChange(
                        onCheckLimit({
                          value: parseInt(toString(val).replace(/\s+/g, '')),
                          min: parseInt(summ * 0.1),
                          max: parseInt(summ * 0.9),
                        }),
                      );
                    }}
                    value={watchSumm}
                    isValid={isNil(get(errors, 'SUMM'))}
                    step={priceStep}
                  />
                </View>
              )}}
            />
          ) : null}
          {creditProduct ? (
            <CreditCardItem
            item={creditProduct}
            hidePaymentsButton={true}
            index={1}
            creditPrograms={creditPrograms}
          />
          ) : null}
        </GroupForm>
        <GroupForm title={strings.Form.group.contacts}>
          <Controller
            control={control}
            rules={{
              minLength: {
                value: 3,
                message: [
                  strings.Form.status.fieldRequired1,
                  strings.Form.status.fieldRequired2,
                ].join(' '),
              },
            }}
            name="NAME"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                placeholder={strings.Form.field.label.name}
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType={'name'}
                value={value}
                isValid={isNil(get(errors, 'NAME'))}
              />
            )}
          />

          <Controller
            control={control}
            name="SECOND_NAME"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                placeholder={strings.Form.field.label.secondName}
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType={'middleName'}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="LAST_NAME"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                placeholder={strings.Form.field.label.lastName}
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType={'familyName'}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            rules={{
              minLength: {
                value: 12,
                message: [
                  strings.Form.status.fieldRequired1,
                  strings.Form.status.fieldRequired2,
                ].join(' '),
              },
            }}
            name="PHONE"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                type="phone"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                isValid={isNil(get(errors, 'PHONE'))}
              />
            )}
          />

          <Controller
            control={control}
            name="EMAIL"
            render={({field: {onChange, onBlur, value}}) => (
              <InputCustom
                type="email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </GroupForm>
        <GroupForm title={strings.Form.group.additional}>
          <Controller
              control={control}
              key="additional"
              name="COMMENT"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  placeholder={strings.Form.field.label.comment}
                  key="inputComments"
                  type="textarea"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
          />
        </GroupForm>
        <Controller
          control={control}
          rules={{
            required: [
              strings.Form.status.fieldRequired1,
              strings.Form.status.fieldRequired2,
            ].join(' '),
          }}
          name="agreementCheckbox"
          render={({field: {onChange, onBlur, value}}) => (
            <AgreementCheckbox
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              isValid={isNil(get(errors, 'agreementCheckbox'))}
            />
          )}
        />
        <SubmitButton
          title={strings.Form.button.send}
          onPress={handleSubmit(onPressOrder)}
          sendingStatus={sendingFormStatus}
          sending={sendingForm}>
        </SubmitButton>
      </KeyboardAvoidingView>
    </ScrollView>
  );

};

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreditScreen);
