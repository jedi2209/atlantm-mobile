import React from 'react';
import {
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Box,
} from 'native-base';

import Imager from '../../core/components/Imager';

import {get, floor} from 'lodash';

import styleConst from '../../core/style-const';
import Badge from '../../core/components/Badge';
import TransitionView from '../../core/components/TransitionView';
import {BadgeCorner} from '../../core/components/BadgeRibbon';
import {showPrice, getAllDataPrice} from '../../utils/price';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

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

const styles = new StyleSheet.create({
  paymentsLabelStyle: {
    fontSize: 12,
  },
});

export const CreditCardItem = ({item, onPressOrder, index, separators, hidePaymentsButton = false, creditPrograms}) => {
  const navigation = useNavigation();
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
    paymentData.text.monthly = 'от ' + get(getAllDataPrice(floor(paymentData.min)), 'value') + ' до ' + showPrice(floor(paymentData.max));
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
      <Box
        rounded="sm"
        overflow="hidden"
        borderColor={styleConst.color.systemGray}
        borderWidth={1}
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
          <Heading size="sm" fontFamily={styleConst.font.light} w={'90%'}>
            {get(itemData, 'name')}
          </Heading>
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
            {!get(itemData, 'kasko.required') && false ? (
              <Badge
                id={itemData.id + 'badgeKasko'}
                index={2}
                name={'Без КАСКО'}
                bgColor={styleConst.color.purple}
                textColor={styleConst.color.white}
              />
            ) : null}
            {get(itemData, 'collateralType.name') && false ? (
              <Badge
                id={itemData.id + 'badgeCollateral' + itemData.collateralType.id}
                index={3}
                name={get(itemData, 'collateralType.name')}
                bgColor={styleConst.color.darkBg}
                textColor={styleConst.color.white}
              />
            ) : null}
            {get(itemData, 'paymentSchedule.id') && false ? (
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
          {get(itemData, 'additionalText') ? (
            <Text fontWeight="400">
              {get(itemData, 'additionalText')}
            </Text>
          ) : null}
          {!hidePaymentsButton || onPressOrder ? (
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              {!hidePaymentsButton ? (
                <Button
                  labelStyle={styles.paymentsLabelStyle}
                  icon="calendar-range-outline"
                  mode="text"
                  compact={true}
                  iconColor={styleConst.color.blue}
                  onPress={() => navigation.navigateDeprecated('CreditPaymentsDetailScreen', {creditPayments: itemCalc})}>
                  график платежей
                </Button>
              ) : null}
              {onPressOrder ? (
                <Button mode="outlined" iconColor={styleConst.color.blue} onPress={onPressOrder}>
                  отправить заявку
                </Button>
              ) : null}
            </HStack>
          ) : null}
        </Stack>
      </Box>
    </TransitionView>
  );
};
