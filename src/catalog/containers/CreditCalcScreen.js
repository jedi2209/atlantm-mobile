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

import {get, parseInt, isNaN, toString} from 'lodash';
import {connect} from 'react-redux';
import {strings} from '../../core/lang/const';

import {actionFetchCarCreditPrograms} from '../actions';
import styleConst from '../../core/style-const';
import Badge from '../../core/components/Badge';
import TransitionView from '../../core/components/TransitionView';
import {BadgeCorner} from '../../core/components/BadgeRibbon';
import {InputCustom} from '../../core/components/Form/InputCustom';
import {showPrice, getAllDataPrice} from '../../utils/price';

const settings = {
  timeoutQuery: 500,
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
  const parsedQty = parseInt(value);
  if (isNaN(parsedQty)) {
    return min;
  } else if (parsedQty > max) {
    return max;
  } else {
    return value;
  }
};

const CreditCardItem = ({item, index, separators, creditPrograms}) => {
  const partner = creditPrograms.partners[Number(item?.owner?.id)];

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
            text={[get(item, 'currency.name')].join(' ')}
            style={{
              backgroundColor: currencyColors[get(item, 'currency.id')],
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
                id={item.id + 'badgeType' + get(item, 'type.id')}
                index={0}
                name={get(item, 'type.name')}
                bgColor={
                  get(item, 'type.id') === 1
                    ? styleConst.color.blue
                    : styleConst.color.red
                }
                textColor={styleConst.color.bg}
              />
              {!get(item, 'kasko.required') ? (
                <Badge
                  id={item.id + 'badgeKasko'}
                  index={2}
                  name={'Без КАСКО'}
                  bgColor={styleConst.color.purple}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(item, 'collateralType.name') ? (
                <Badge
                  id={item.id + 'badgeCollateral' + item.collateralType.id}
                  index={3}
                  name={get(item, 'collateralType.name')}
                  bgColor={styleConst.color.darkBg}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(item, 'paymentSchedule.id') ? (
                <Badge
                  id={item.id + 'badgeSchedule' + item.paymentSchedule.id}
                  index={1}
                  name={item.paymentSchedule.name}
                  bgColor={
                    item.paymentSchedule.id === 1
                      ? styleConst.color.orange
                      : styleConst.color.green
                  }
                  textColor={styleConst.color.black}
                />
              ) : null}
            </HStack>
            <VStack space={1} mt={3}>
              <Text fontWeight="400">
                Срок:{' '}
                {get(item, 'period.light')
                  ? get(item, 'period.light') + ' мес. / '
                  : null}
                {get(item, 'period.max') + ' мес.'}
              </Text>
              {get(item, 'earlyRepaymentType.name') ? (
                <Text fontWeight="400">
                  Досрочное погашение: {get(item, 'earlyRepaymentType.name')}
                </Text>
              ) : null}
            </VStack>
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
  actionFetchPrograms,
}) => {
  const onSubmitTimeout = useRef(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setCreditPrograms({data: [], partners: {}});
    }
  }, [isLoading, setCreditPrograms]);

  const carPrice = get(carData, 'price.app.sale')
    ? get(carData, 'price.app.sale')
    : get(carData, 'price.app.standart');

  const {
    control,
    getValues,
    watch,
    handleSubmit,
    setValue,
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
    if (isValid && !isValidating) {
      clearTimeout(onSubmitTimeout.current);
      onSubmitTimeout.current = setTimeout(() => {
        console.log(
          '\t\tonSubmit => \t\t',
          getValues(),
          watchCurrentPeriod,
          watchCurrentPrePayment,
        );
        setLoading(true);
        actionFetchPrograms({
          prepaid: watchCurrentPrePayment,
          months: watchCurrentPeriod,
          car: carID,
        }).then(res => {
          if (get(res, 'type')) {
            console.info('res.type', res.type);
            switch (res.type) {
              case 'CAR_CREDIT_PROGRAMS__SUCCESS':
                setCreditPrograms(res.payload);
                break;
              case 'CAR_CREDIT_PROGRAMS__FAIL':
                setCreditPrograms({data: []});
                break;
              default:
                break;
            }
          }
          setLoading(false);
        });
      }, settings.timeoutQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCurrentPeriod, watchCurrentPrePayment, isValid, isValidating]);

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
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <InputCustom
              placeholder={strings.Form.field.label.finance.prepayment}
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType={'none'}
              keyboardType={'number-pad'}
              autoComplete={'off'}
              enablesReturnKeyAutomatically={'true'}
              blurOnSubmit={true}
              enterKeyHint={'done'}
              affix={getAllDataPrice(toString(watchCurrentPrePayment))?.symbol}
              value={getAllDataPrice(toString(watchCurrentPrePayment))?.value}
              isValid={get(errors, 'prePayment', true)}
            />
            <Slider
              style={{height: 60, marginTop: -26}}
              minimumValue={parseInt(carPrice * 0.1)}
              maximumValue={parseInt(carPrice * 0.9)}
              minimumTrackTintColor={styleConst.color.blue}
              maximumTrackTintColor="#FFFFFF"
              onSlidingComplete={onChange}
              value={parseInt(watchCurrentPrePayment)}
              isValid={get(errors, 'prePayment', true)}
              step={100}
            />
          </View>
        )}
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
                // isValid={get(errors, 'period', true)}
                // style={{width: 400}}
              />
              <Slider
                style={{height: 60, marginTop: -26}}
                minimumValue={calcData.period.min}
                maximumValue={calcData.period.max}
                minimumTrackTintColor={styleConst.color.blue}
                maximumTrackTintColor="#FFFFFF"
                onSlidingComplete={onChange}
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

const CreditCardsItems = ({isLoading, creditPrograms, listHeaderComponent}) => {
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
        />
      )}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={<View h={50} />}
      data={get(creditPrograms, 'data', [])}
    />
  );
};

const CreditCalcScreen = ({
  navigation,
  actionFetchCarCreditPrograms,
  route,
}) => {
  const carData = get(route, 'params.carData');
  const carID = get(route, 'params.carID');

  const [creditPrograms, setCreditPrograms] = useState({
    data: [],
    partners: {},
  });

  const [calcData, setCalcData] = useState({...settings.calc});

  useEffect(() => {
    actionFetchCarCreditPrograms({car: carID}).then(res => {
      if (get(res, 'type')) {
        switch (res.type) {
          case 'CAR_CREDIT_PROGRAMS__SUCCESS':
            setCreditPrograms(res.payload);
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
            // setValue('period', calcDataTmp.period.max);
            setCalcData(calcDataTmp);
            break;
          default:
            break;
        }
      }
    });
    return () => {
      setCreditPrograms({data: [], partners: {}});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFetchCarCreditPrograms, carID]);

  return (
    <View mx={2}>
      <CreditCardsItems
        carData={carData}
        carID={carID}
        creditPrograms={creditPrograms}
        actionFetchCarCreditPrograms={actionFetchCarCreditPrograms}
        listHeaderComponent={
          <HeaderComponent
            carData={carData}
            calcData={calcData}
            carID={carID}
            setCreditPrograms={setCreditPrograms}
            actionFetchPrograms={actionFetchCarCreditPrograms}
          />
        }
      />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCalcScreen);
