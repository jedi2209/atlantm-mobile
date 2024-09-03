import React, {useEffect, useState, useRef} from 'react';
import {Platform, Dimensions, ActivityIndicator} from 'react-native';
import {
  Text,
  View,
  Stack,
  Heading,
  VStack,
  HStack,
  FlatList,
  Box,
} from 'native-base';
import {Controller, useForm, useWatch} from 'react-hook-form';

import Slider from '@react-native-community/slider';

import Imager from '../../core/components/Imager';

import {get, parseInt, isNaN, toString, ceil, floor} from 'lodash';
import {connect} from 'react-redux';
import {strings} from '../../core/lang/const';

import {actionFetchCarCreditPrograms, fetchProgramsCalcBatch} from '../actions';
import styleConst from '../../core/style-const';
import Badge from '../../core/components/Badge';
import TransitionView from '../../core/components/TransitionView';
import {BadgeCorner} from '../../core/components/BadgeRibbon';
import {InputCustom} from '../../core/components/Form/InputCustom';
import {showPrice, getAllDataPrice} from '../../utils/price';
import { Button } from 'react-native-paper';

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

const currencyColors = {
  1: styleConst.color.green,
  2: styleConst.color.red,
  3: styleConst.color.blue2,
  4: styleConst.color.greyBlue,
};

const currencySymbols = {
  1: '₽',
  2: '$',
  3: '€',
  4: '₽',
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

const CreditCardItem = ({item, index, separators, creditPrograms, nav}) => {
  const itemCalc = get(item, 'calc', []);
  const itemData = get(item, 'data', {});

  const partner = creditPrograms?.partners[Number(get(itemData, 'owner.id'))];
  const settingsFilters = get(creditPrograms, 'settings', {});

  const numericMonths = itemCalc.filter(item => typeof item.month === 'number');
  const totalValues = numericMonths.map(item => item.summ.total).slice(1);
  const filteredValues = totalValues.filter(value => value !== 0);

  const paymentData = {
    min: Math.min(...filteredValues),
    max: Math.max(...filteredValues),
    text: {
      monthly: '',
      period: '',
    },
  };

  if (paymentData.min === paymentData.max) {
    paymentData.text.monthly = showPrice(floor(paymentData.min));
  } else {
    paymentData.text.monthly = 'от ' + get(getAllDataPrice(ceil(paymentData.min)), 'value') + ' до ' + showPrice(floor(paymentData.max));
  }

  if (get(settingsFilters, 'watchCurrentPeriod')) {
    paymentData.text.period = [settingsFilters.watchCurrentPeriod, 'мес.'].join(' ');
  } else {
    paymentData.text.period = get(itemData, 'period.light') ? get(itemData, 'period.light') + ' мес. / ' : null + get(itemData, 'period.max') + ' мес.';
  }

  return (
    <TransitionView
      animation={styleConst.animation.zoomIn}
      duration={250}
      index={index}>
      <Box>
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={styleConst.color.white}
          p={2}
          minH={150}>
          <BadgeCorner
            text={[get(itemData, 'currency.name')].join(' ')}
            style={{
              backgroundColor: currencyColors[get(itemData, 'currency.id')],
              fontSize: 18,
              padding: 3,
            }}
          />
          {get(partner, 'logo') ? (
            <Box mb={2} w={'50%'}>
              <Imager
                source={{uri: partner?.logo}}
                resizeMode="contain"
                style={{height: 40}}
                alt={partner?.name}
              />
            </Box>
          ) : null}
          <Stack space={1}>
            {/* <Heading size="sm" fontFamily={styleConst.font.light} w={'90%'}>
              {item.name}
            </Heading> */}
            <HStack>
              <Badge
                id={itemData.id + 'badgeType' + get(itemData, 'type.id')}
                index={0}
                name={get(itemData, 'type.name')}
                bgColor={
                  get(itemData, 'type.id') === 1
                    ? styleConst.color.blue
                    : styleConst.color.red
                }
                textColor={styleConst.color.bg}
              />
              {!get(itemData, 'kasko.required') ? (
                <Badge
                  id={itemData.id + 'badgeKasko'}
                  index={2}
                  name={'Без КАСКО'}
                  bgColor={styleConst.color.purple}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(itemData, 'collateralType.name') ? (
                <Badge
                  id={itemData.id + 'badgeCollateral' + itemData.collateralType.id}
                  index={3}
                  name={get(itemData, 'collateralType.name')}
                  bgColor={styleConst.color.darkBg}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(itemData, 'paymentSchedule.id') ? (
                <Badge
                  id={itemData.id + 'badgeSchedule' + itemData.paymentSchedule.id}
                  index={1}
                  name={itemData.paymentSchedule.name}
                  bgColor={
                    itemData.paymentSchedule.id === 1
                      ? styleConst.color.orange
                      : styleConst.color.green
                  }
                  textColor={styleConst.color.black}
                />
              ) : null}
            </HStack>
            <HStack space={3} justifyContent={'space-between'} mt={3}>
              <VStack space={1} w={'1/2'}>
                <Text fontWeight="200">
                  срок
                </Text>
                <Text fontWeight="800">
                  {get(paymentData, 'text.period')}
                </Text>
              </VStack>
              <VStack space={1} w={'1/2'}>
                <Text fontWeight="200">
                  платеж
                </Text>
                <Text fontWeight="800">
                  {get(paymentData, 'text.monthly')}
                </Text>
              </VStack>
              {get(itemData, 'earlyRepaymentType.name') && false ? (
              <VStack space={1} w={'1/3'}>
                  <Text fontWeight="400">
                    досрочное погашение
                  </Text>
                  <Text fontWeight="400">
                    {get(itemData, 'earlyRepaymentType.name')}
                  </Text>
              </VStack>
            ) : null}
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Button icon="calendar-range-outline" mode="outlined" rippleColor={styleConst.color.blue} iconColor={styleConst.color.blue} onPress={() => nav.navigate('CreditPaymentsDetailScreen', {creditPayments: itemCalc})}>
                график платежей
              </Button>
              <Button mode="outlined" rippleColor={styleConst.color.blue} iconColor={styleConst.color.blue} onPress={() => console.log('Pressed')}>
                отправить заявку
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </TransitionView>
  );
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
    console.info("isValid && !isValidating", isValid, !isValidating);
    if (isValid && !isValidating) {
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
          const tmpVal = getAllDataPrice(parseInt(toString(value || watchCurrentPrePayment).replace(/\s+/g, '')));
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
              isValid={get(errors, 'prePayment', true)}
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
              isValid={get(errors, 'prePayment', true)}
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
                isValid={get(errors, 'period', true)}
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
                isValid={get(errors, 'period', true)}
                step={1}
              />
            </View>
          );
        }}
      />
    </>
  );
};

const CreditCardsItems = ({isLoading, creditPrograms, listHeaderComponent, nav}) => {
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
          nav={nav}
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
