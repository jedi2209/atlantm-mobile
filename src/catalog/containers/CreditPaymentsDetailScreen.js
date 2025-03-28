import React, {useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, VStack, HStack, Heading, Divider} from "native-base";
import moment from 'moment';

import {get} from 'lodash';
import {showPrice, getAllDataPrice} from '../../utils/price';
import styleConst from '../../core/style-const';


const CreditPaymentsDetailScreen = ({ route, creditPayments }) => {
  let years = [];

  if (!creditPayments) {
    creditPayments = get(route, 'params.creditPayments', {});
  }

  creditPayments.shift();

  return (
    <View style={{padding: 10}}>
      <HStack ml={12} h={12}>
        <Heading ellipsizeMode="clip">
          График платежей
        </Heading>
      </HStack>
      <ScrollView mb={8}>
        <VStack space={1} pb={12}>
          {creditPayments.map((item, index) => {
            let yearTmp = null;
            if (item.month === 'redemption') {
              return;
            }
            const month = moment().add(item.month, 'M');
            const year = month.format('YYYY');
            const monthName = month.format('MMMM');
            if (years.indexOf(year) === -1) {
              years.push(year);
              yearTmp = year;
            }
            if (typeof item.month !== 'number' && item.month === 'total') {
              return (
                <HStack mt={6} space={1} alignContent={'flex-start'} justifyContent={'space-between'} key={'monthPaymentHStackTotal' + year + item.month}>
                  <Text key={'monthPaymentNameTotal' + year + item.month} fontWeight={800}>
                    ИТОГО
                  </Text>
                  <Text key={'monthPaymentValueTotal' + year + item.month} fontWeight={800}>
                    {showPrice(item.summ.total)}
                  </Text>
                </HStack>
              );
            }
            if (!get(item, 'summ.total')) {
              return;
            }
            return (
              <View key={'row' + index}>
                {yearTmp ? (<><Heading size="md" mt={4} key={'yearPaymentText' + year} bold>{yearTmp}</Heading><Divider thickness={0.7} mb={2} bg={styleConst.color.blue} /></>) : null}
                <HStack space={1} alignContent={'flex-start'} justifyContent={'space-between'} key={'monthPaymentHStack' + year + monthName}>
                  <Text key={'monthPaymentName' + year + monthName} color={styleConst.color.greyText4}>
                    {month.format('MMMM')}
                  </Text>
                  <Text key={'monthPaymentValue' + year + monthName} color={styleConst.color.greyText}>
                    {showPrice(item.summ.total)}
                  </Text>
                </HStack>
              </View>
            );
          })}
        </VStack>
      </ScrollView>
  </View>
  );
};

export default CreditPaymentsDetailScreen;
