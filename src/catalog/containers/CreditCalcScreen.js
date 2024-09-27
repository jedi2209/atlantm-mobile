import React, {useEffect, useState, useRef} from 'react';
import {Platform, Dimensions, ActivityIndicator} from 'react-native';
import {
  Text,
  View,
  Heading,
  VStack,
  FlatList,
} from 'native-base';
import {Controller, useForm, useWatch} from 'react-hook-form';
import { CreditCardItem } from '../../core/components/CreditCardItem';

import Slider from '@react-native-community/slider';

import Imager from '../../core/components/Imager';

import {get, parseInt, isNaN, isNil, toString} from 'lodash';
import {connect} from 'react-redux';
import {strings} from '../../core/lang/const';

import {actionFetchCarCreditPrograms, fetchProgramsCalcBatch} from '../actions';
import styleConst from '../../core/style-const';
import {InputCustom} from '../../core/components/Form/InputCustom';
import {getAllDataPrice} from '../../utils/price';

const settings = {
  timeoutQuery: 1000,
  percentPaymentDefault: 0.5,
  calc: {
    prepaid: 999999,
    period: {
      min: 1,
      max: 120,
    },
  },
};

const mapStateToProps = ({dealer}) => {
  return {
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  actionFetchCarCreditPrograms,
};

const {width: screenWidth} = Dimensions.get('window');

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

const HeaderComponent = ({
  carData,
  calcData,
  carID,
  setCreditPrograms,
  fetchPrograms,
  actionFetchProgramData,
}) => {
  const onSubmitTimeout = useRef(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setCreditPrograms({data: [], partners: {}, settings: {}});
    }
  }, [isLoading, setCreditPrograms]);

  const carPrice = get(carData, 'price.app.sale')
    ? get(carData, 'price.app.sale')
    : get(carData, 'price.app.standart');

  const {
    control,
    formState: {errors, isValidating, isValid},
  } = useForm({
    mode: 'onBlur',
  });

  const watchCurrentPeriod = useWatch({
    control,
    name: 'period',
    defaultValue: calcData.period.max,
  });

  const watchCurrentPrePayment = useWatch({
    control,
    name: 'prePayment',
    defaultValue: parseInt(carPrice * settings.percentPaymentDefault),
  });

  useEffect(() => {
    if ((isValid || (watchCurrentPeriod && watchCurrentPrePayment)) && !isValidating) {
      clearTimeout(onSubmitTimeout.current);
      onSubmitTimeout.current = setTimeout(() => {
        setLoading(true);
        fetchPrograms({
          prepaid: watchCurrentPrePayment,
          months: watchCurrentPeriod,
          car: carID,
          summ: carPrice,
        }).then(res => {
          setCreditPrograms({
            data: res.data,
            partners: res.partners,
            settings: {
              watchCurrentPeriod,
              watchCurrentPrePayment,
            },
          });
          setLoading(false);
        });
      }, settings.timeoutQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCurrentPeriod, watchCurrentPrePayment, isValid, isValidating]);

  useEffect(() => {
    fetchPrograms({
      prepaid: watchCurrentPrePayment,
      months: watchCurrentPeriod,
      car: carID,
      summ: carPrice,
    }).then(res => {
      setCreditPrograms({
        data: res.data,
        partners: res.partners,
        settings: {
          watchCurrentPeriod,
          watchCurrentPrePayment,
        },
      });
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <VStack mt={1}>
        <Heading
          ml={12}
          ellipsizeMode={'tail'}
          numberOfLines={1}
          lineHeight={'lg'}>
          {[
            get(carData, 'brand.name'),
            get(carData, 'model.name'),
            get(carData, 'complectation.name'),
          ].join(' ')}
        </Heading>
        <Text ml={12}>
          {[
            get(carData, 'engine.volume.full') + ' cm³',
            get(carData, 'gearbox.name'),
            get(carData, 'color.name.simple'),
            get(carData, 'year'),
          ].join(', ')}
        </Text>
        <View alignItems={'center'} w={'100%'}>
          <Imager
            source={{uri: get(carData, 'foto.thumb.0') + '1000x1000'}}
            style={{width: screenWidth * 0.9, height: 200}}
            resizeMode={'contain'}
          />
        </View>
      </VStack>
      <Controller
        control={control}
        rules={{
          required: [
            strings.Form.status.fieldRequired1,
            strings.Form.status.fieldRequired2,
          ].join(' '),
        }}
        name="prePayment"
        render={({field: {onChange, onBlur, value}}) => {
          const tmpVal = getAllDataPrice(parseInt(toString(watchCurrentPrePayment).replace(/\s+/g, '')));
          return (
          <View>
            <InputCustom
              placeholder={strings.Form.field.label.finance.prepayment}
              onBlur={onBlur}
              onChangeText={val => {
                if (!val) {
                  return onChange(parseInt(toString(val).replace(/\s+/g, '')));
                }
                return onChange(
                  onCheckLimit({
                    value: parseInt(toString(val).replace(/\s+/g, '')),
                    min: parseInt(carPrice * 0.1),
                    max: parseInt(carPrice * 0.9),
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
              isValid={isNil(get(errors, 'prePayment'))}
            />
            <Slider
              style={{height: 60, marginTop: -26}}
              minimumValue={parseInt(carPrice * 0.1)}
              maximumValue={parseInt(carPrice * 0.9)}
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
                    min: parseInt(carPrice * 0.1),
                    max: parseInt(carPrice * 0.9),
                  }),
                );
              }}
              value={parseInt(watchCurrentPrePayment)}
              isValid={isNil(get(errors, 'prePayment'))}
              step={100}
            />
          </View>
        )}
        }
      />
      <Controller
        control={control}
        rules={{
          required: [
            strings.Form.status.fieldRequired1,
            strings.Form.status.fieldRequired2,
          ].join(' '),
        }}
        name="period"
        max={calcData.period.max}
        min={1}
        render={({field: {onChange, onBlur, value}}) => {
          return (
            <View>
              <InputCustom
                placeholder={strings.Form.field.label.finance.period}
                // onBlur={onBlur}
                onEndEditing={onBlur}
                onChangeText={value => {
                  if (!value) {
                    return onChange(value);
                  }
                  return onChange(
                    onCheckLimit({
                      value: parseInt(value),
                      min: 1,
                      max: calcData.period.max,
                    }),
                  );
                }}
                textContentType={'none'}
                keyboardType={'number-pad'}
                autoComplete={'off'}
                enablesReturnKeyAutomatically={'true'}
                blurOnSubmit={true}
                inputMode={'numeric'}
                enterKeyHint={'done'}
                maxLength={3}
                affix={'мес.'}
                // editable={false}
                // value={toString(value)}
                value={toString(watchCurrentPeriod)}
                isValid={isNil(get(errors, 'period'))}
                // style={{width: 400}}
              />
              <Slider
                style={{height: 60, marginTop: -26}}
                minimumValue={calcData.period.min}
                maximumValue={calcData.period.max}
                minimumTrackTintColor={styleConst.color.blue}
                maximumTrackTintColor="#FFFFFF"
                onSlidingComplete={onBlur}
                onValueChange={value => {
                  if (!value) {
                    return onChange(value);
                  }
                  return onChange(
                    onCheckLimit({
                      value: parseInt(value),
                      min: 1,
                      max: calcData.period.max,
                    }),
                  );
                }}
                value={parseInt(watchCurrentPeriod)}
                isValid={isNil(get(errors, 'period'))}
                step={1}
              />
            </View>
          );
        }}
      />
    </>
  );
};

const CreditCardsItems = ({isNewCar, isLoading, carData, creditPrograms, listHeaderComponent, nav}) => {
  return (
    <FlatList
      ListEmptyComponent={
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      }
      ItemSeparatorComponent={
        Platform.OS !== 'android' &&
        (({highlighted}) => (
          <View
            style={[
              {
                height: 3,
              },
              highlighted && {marginLeft: 0},
            ]}
          />
        ))
      }
      renderItem={({item, index, separators}) => (
        <CreditCardItem
          item={item}
          index={index}
          separators={separators}
          creditPrograms={creditPrograms}
          onPressOrder={() => nav.navigate('OrderCreditScreen', {
              car: {
                id: get(carData, 'id.api'),
                brand: get(carData, 'brand.name', ''),
                model: get(carData, 'model', ''),
                complectation: get(carData, 'complectation.name'),
                year: get(carData, 'year'),
                price:
                  get(carData, 'price.app.standart') || get(carData, 'price.app'),
              },
              region: 'by',
              dealerId: get(carData, 'dealer.id', get(carData, 'dealer.0.id')),
              isNewCar,
              creditProduct: item,
              creditPrograms,
            })}
        />
      )}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={<View h={50} />}
      data={get(creditPrograms, 'data', [])}
    />
  );
};

const CreditCalcScreen = ({
  actionFetchCarCreditPrograms,
  route,
  navigation,
}) => {
  const carData = get(route, 'params.carData');
  const carID = get(route, 'params.carID');
  const isNewCar = get(route, 'params.isNewCar');

  const [creditPrograms, setCreditPrograms] = useState({
    data: [],
    partners: {},
    settings: {
      watchCurrentPeriod: settings.calc.period.max,
      watchCurrentPrePayment: parseInt(carData.price.app.sale),
    },
  });

  const [calcData, setCalcData] = useState({...settings.calc});

  useEffect(() => {
    actionFetchCarCreditPrograms({car: carID}).then(res => {
      if (get(res, 'type')) {
        switch (res.type) {
          case 'CAR_CREDIT_PROGRAMS__SUCCESS':
            // setCreditPrograms(res.payload);
            let calcDataTmp = calcData;
            get(res.payload, 'data', []).map(item => {
              if (
                item.percent.prepaid &&
                item.percent.prepaid < calcDataTmp.prepaid
              ) {
                calcDataTmp.prepaid = item.percent.prepaid;
              }
              if (item.period.max && item.period.max > calcDataTmp.period.max) {
                calcDataTmp.period.max = item.period.max;
              }
              if (
                item.period.min &&
                item.period.min > 0 &&
                item.period.min < calcDataTmp.period.min
              ) {
                calcDataTmp.period.min = item.period.min;
              }
            });
            if (calcDataTmp.period.min === 1200) {
              calcDataTmp.period.min = 1;
            }
            setCalcData(calcDataTmp);
            break;
          default:
            break;
        }
      }
    });
    return () => {
      setCreditPrograms({data: [], partners: {}, settings: {}});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFetchCarCreditPrograms, carID]);

  return (
    <View mx={2}>
      <CreditCardsItems
        carData={carData}
        carID={carID}
        creditPrograms={creditPrograms}
        nav={navigation}
        isNewCar={isNewCar}
        listHeaderComponent={
          <HeaderComponent
            carData={carData}
            calcData={calcData}
            carID={carID}
            setCreditPrograms={setCreditPrograms}
            fetchPrograms={fetchProgramsCalcBatch}
          />
        }
      />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCalcScreen);
