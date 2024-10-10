/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ImageBackground,
} from 'react-native';
import {
  Text,
  Icon,
  View,
} from 'native-base';

import RNBounceable from '@freakycoder/react-native-bounceable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
import { APP_REGION } from '../../core/const';

const CreditBanner = ({carDetails, onPress = () => {}, region = APP_REGION}) => {
  if (region !== 'by' || !get(carDetails, 'price.app.standart', get(carDetails, 'price.app'))) {
    return;
  }
  return (
    <RNBounceable
      onPress={onPress}>
      <View mx="2%" mt="1" width="96%">
        <ImageBackground
          source={require('../../../assets/credit-banner.jpg')}
          resizeMode="cover"
          imageStyle={{borderRadius: 5, opacity: 0.35}}
          style={{
            width: '100%',
            height: 160,
            flex: 1,
            // justifyContent: 'center',
            backgroundColor: styleConst.color.black,
            borderRadius: 5,
          }}>
          <View px={4} py={6}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: styleConst.font.medium,
                color: styleConst.color.white,
                width: '60%',
                marginBottom: 35,
              }}>
              Выгодный кредит
            </Text>
            <Text
              style={{
                fontFamily: styleConst.font.medium,
                color: styleConst.color.white,
                width: '75%',
              }}>
              Воспользуйтесь кредитом на выгодных условиях от наших
              партнеров
            </Text>
            <Icon
              as={MaterialCommunityIcons}
              name="sack-percent"
              color={styleConst.color.white}
              size="6xl"
              style={{
                position: 'absolute',
                right: 20,
                top: 30,
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </RNBounceable>
  );
};

export default CreditBanner;
