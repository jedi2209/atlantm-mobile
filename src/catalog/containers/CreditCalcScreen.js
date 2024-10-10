import React, {useEffect, useState, useRef} from 'react';
import {Platform, Dimensions, ActivityIndicator, StyleSheet} from 'react-native';
import {
  Text,
  View,
  Heading,
  VStack,
  FlatList,
} from 'native-base';
import {Controller, useForm, useWatch} from 'react-hook-form';
import { CreditCardItem } from '../components/CreditCardItem';

import Slider from '@react-native-community/slider';

import Imager from '../../core/components/Imager';

import {get, parseInt, isNaN, isNil, compact, toString} from 'lodash';
import {connect} from 'react-redux';
import {strings} from '../../core/lang/const';

import {actionFetchCarCreditPrograms, fetchProgramsCalcBatch} from '../actions';
import styleConst from '../../core/style-const';
import {InputCustom} from '../../core/components/Form/InputCustom';
import {getAllDataPrice} from '../../utils/price';

const isAndroid = Platform.OS === 'android';
const {width: screenWidth} = Dimensions.get('window');

const styles = new StyleSheet.create({
  carImage: {
    new: {
      width: screenWidth * 0.9,
      height: 200,
    },
    used: {
      width: screenWidth,
      height: 300,
    },
  },
  sliderWrapper: {
    height: 18,
    marginTop: isAndroid ? -8 : -16,
    paddingBottom: 10,
  }
});

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

const onCheckLimit = ({value, min, max}) => {
  const parsedQty = parseInt(toString(value).replace(/\s+/g, ''));
  if (isNaN(parsedQty) || parsedQty < min) {
    return min;
  } else if (parsedQty > max) {
    return max;
  } else {
    return value;
  }
};

const getItemsTypes = items => {
  let creditTypes = [];
  items.map(item => {
    creditTypes.push(get(item, 'data.type'));
  });
  return creditTypes.filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );
};

const HeaderComponent = ({
  carData,
  calcData,
  carID,
  isNewCar,
  setCreditPrograms,
  fetchPrograms,
  actionFetchProgramData,
  setLoading,
  isLoading,
}) => {
  const onSubmitTimeout = useRef(null);
  const [creditProgramsTypes, setCreditProgramsTypes] = useState([]);

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
          if (get(res, 'data', []).length) {
            setCreditProgramsTypes(getItemsTypes(get(res, 'data', [])));
            setCreditPrograms({
              data: get(res, 'data', []),
              partners: get(res, 'partners'),
              settings: {
                watchCurrentPeriod,
                watchCurrentPrePayment,
              },
            });
          }
          setLoading(false);
        });
      }, settings.timeoutQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCurrentPeriod, watchCurrentPrePayment, isValid, isValidating]);

  useEffect(() => {
    setLoading(true);
    fetchPrograms({
      prepaid: watchCurrentPrePayment,
      months: watchCurrentPeriod,
      car: carID,
      summ: carPrice,
    }).then(res => {
      if (get(res, 'data', []).length) {
        setCreditPrograms({
          data: get(res, 'data', []),
          partners: get(res, 'partners'),
          settings: {
            watchCurrentPeriod,
            watchCurrentPrePayment,
          },
        });
        setCreditProgramsTypes(getItemsTypes(get(res, 'data', [])));
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <VStack mt={1} alignItems={'center'}>
        <Heading
          ellipsizeMode={'tail'}
          numberOfLines={1}
          lineHeight={'lg'}>
          {[
            get(carData, 'brand.name'),
            get(carData, 'model.name'),
            get(carData, 'complectation.name'),
          ].join(' ')}
        </Heading>
        <Text>
          {compact([
            !isNil(get(carData, 'engine.volume.full')) ? get(carData, 'engine.volume.full') + ' cm³' : null,
            get(carData, 'gearbox.name', '').toLowerCase(),
            get(carData, 'color.name.simple', '').toLowerCase(),
            !isNil(get(carData, 'year')) ? get(carData, 'year') + 'г.' : null,
          ]).join(', ')}
        </Text>
        <View alignItems={'center'} w={'100%'}>
          <Imager
            source={{uri: get(carData, 'foto.thumb.0', get(carData, 'img.thumb.0')) + '1000x1000'}}
            style={styles.carImage[isNewCar ? 'new' : 'used']}
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
              onChangeText={onChange}
              onEndEditing={() => {
                if (!get(tmpVal, 'value')) {
                  return onChange(parseInt(toString(parseInt(carPrice * 0.1)).replace(/\s+/g, '')));
                }
                return onChange(
                  onCheckLimit({
                    value: parseInt(toString(get(tmpVal, 'value')).replace(/\s+/g, '')),
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
              style={styles.sliderWrapper}
              minimumValue={parseInt(carPrice * 0.1)}
              maximumValue={parseInt(carPrice * 0.9)}
              lowerLimit={parseInt(carPrice * 0.1)}
              upperLimit={parseInt(carPrice * 0.9)}
              minimumTrackTintColor={styleConst.color.blue}
              maximumTrackTintColor={styleConst.color.bg}
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
                value={toString(watchCurrentPeriod)}
                isValid={isNil(get(errors, 'period'))}
              />
              <Slider
                style={styles.sliderWrapper}
                minimumValue={calcData.period.min}
                maximumValue={calcData.period.max}
                lowerLimit={calcData.period.min}
                upperLimit={calcData.period.max}
                minimumTrackTintColor={styleConst.color.blue}
                maximumTrackTintColor={styleConst.color.bg}
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
      {/* <Box h={10}>
        {creditProgramsTypes && get(creditProgramsTypes, 'length') ? (
          <HStack space={2}>
            <Text>{creditProgramsTypes[0].name}</Text>
            <Switch value={false} color={styleConst.color.blue} />
            <Text>{creditProgramsTypes[1].name}</Text>
          </HStack>
        ) : null}
      </Box> */}
    </>
  );
};

const CreditCardsItems = ({isNewCar, isLoading, carData, creditPrograms, listHeaderComponent, nav}) => {
  return (
    <FlatList
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styleConst.spinner}
          />
        ) : (
          <View justifyContent={'center'} alignContent={'center'} justifyItems={'center'} alignItems={'center'}>
            <Text fontFamily={styleConst.font.regular}>Ничего не найдено.{'\n'}Попробуйте изменить аванс или срок погашения.</Text>
          </View>
        )
      }
      ItemSeparatorComponent={({highlighted}) => (
          <View
            style={[
              {
                height: isAndroid ? 5 : 3,
              },
              highlighted && {marginLeft: 0},
            ]}
          />
        )
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
  const [isLoading, setLoading] = useState(true);
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
        isLoading={isLoading}
        creditPrograms={creditPrograms}
        nav={navigation}
        isNewCar={isNewCar}
        listHeaderComponent={
          <HeaderComponent
            carData={carData}
            calcData={calcData}
            isNewCar={isNewCar}
            carID={carID}
            isLoading={isLoading}
            setLoading={setLoading}
            setCreditPrograms={setCreditPrograms}
            fetchPrograms={fetchProgramsCalcBatch}
          />
        }
      />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCalcScreen);
